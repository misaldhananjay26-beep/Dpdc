import { Registration } from '../types';

/**
 * Service to interact with Google Sheets API and Google Calendar API
 * using OAuth tokens acquired via Firebase Auth.
 */

export interface GoogleSyncResult {
  success: boolean;
  message: string;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  updatedRows?: number;
}

export const GoogleWorkspaceService = {
  /**
   * Syncs registrations to Google Sheets.
   * If a spreadsheetId is provided, appends or updates.
   * Otherwise, creates a new spreadsheet named "DPDC SKILL PVT LTD - Leads & Registrations".
   */
  async syncToGoogleSheets(
    registrations: Registration[],
    accessToken: string,
    existingSpreadsheetId?: string
  ): Promise<GoogleSyncResult> {
    try {
      let spreadsheetId = existingSpreadsheetId;
      let isNew = false;

      // 1. If no existing spreadsheet, create one
      if (!spreadsheetId) {
        const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            properties: {
              title: 'DPDC SKILL PVT LTD - Franchise & Student Leads',
            },
            sheets: [
              {
                properties: {
                  title: 'All Leads',
                  gridProperties: {
                    frozenRowCount: 1,
                  },
                },
              },
            ],
          }),
        });

        if (!createRes.ok) {
          const errData = await createRes.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `Failed to create spreadsheet (HTTP ${createRes.status})`);
        }

        const createData = await createRes.json();
        spreadsheetId = createData.spreadsheetId;
        isNew = true;
      }

      // 2. Prepare rows
      const headers = [
        'Registration ID',
        'Full Name',
        'Mobile Number',
        'WhatsApp Number',
        'Village / City',
        'Taluka',
        'District',
        'State',
        'Pincode',
        'Course Status',
        'Qualification',
        'Business Interest',
        'Premises Available',
        'Premises Size',
        'Appointment Requested',
        'Preferred Date',
        'Preferred Time',
        'Lead Status',
        'Questions',
        'Created At',
      ];

      const rows = registrations.map((r) => [
        r.id,
        r.fullName,
        r.mobile,
        r.whatsapp || r.mobile,
        r.villageCity,
        r.taluka,
        r.district,
        r.state,
        r.pincode,
        r.courseStatus,
        r.qualification || '',
        r.businessInterest,
        r.premisesAvailable,
        r.premisesSize || '',
        r.appointmentRequested ? 'Yes' : 'No',
        r.preferredDate || '',
        r.preferredTime || '',
        r.leadStatus,
        r.questions || '',
        new Date(r.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      ]);

      const values = isNew ? [headers, ...rows] : rows;

      // 3. Append or insert values
      const range = isNew ? 'All Leads!A1' : 'All Leads!A1';
      const updateMethod = isNew ? 'PUT' : 'POST';
      const endpoint = isNew
        ? `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`
        : `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/All Leads!A:A:append?valueInputOption=USER_ENTERED`;

      const appendRes = await fetch(endpoint, {
        method: updateMethod,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range,
          majorDimension: 'ROWS',
          values,
        }),
      });

      if (!appendRes.ok) {
        const errData = await appendRes.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Failed to write to Google Sheets (HTTP ${appendRes.status})`);
      }

      const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

      return {
        success: true,
        message: `Successfully synchronized ${registrations.length} leads with Google Sheets.`,
        spreadsheetId,
        spreadsheetUrl,
        updatedRows: registrations.length,
      };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error syncing to Google Sheets';
      console.error('Google Sheets sync error:', error);
      return {
        success: false,
        message: msg,
      };
    }
  },

  /**
   * Schedules a confirmed consultation appointment on Google Calendar
   */
  async createCalendarAppointment(
    reg: Registration,
    dateStr: string, // YYYY-MM-DD
    timeStr: string, // e.g., '11:00 AM'
    accessToken: string
  ): Promise<{ success: boolean; eventId?: string; htmlLink?: string; message: string }> {
    try {
      // Parse date and time into ISO string
      let startHour = 10;
      let startMinute = 0;

      if (timeStr.includes('PM') && !timeStr.startsWith('12')) {
        const parts = timeStr.replace('PM', '').trim().split(':');
        startHour = parseInt(parts[0], 10) + 12;
        if (parts[1]) startMinute = parseInt(parts[1], 10);
      } else if (timeStr.includes('AM')) {
        const parts = timeStr.replace('AM', '').trim().split(':');
        startHour = parseInt(parts[0], 10);
        if (parts[1]) startMinute = parseInt(parts[1], 10);
      }

      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      const startDateTime = `${dateStr}T${pad(startHour)}:${pad(startMinute)}:00+05:30`;
      const endDateTime = `${dateStr}T${pad(startHour + 1)}:${pad(startMinute)}:00+05:30`;

      const summary = `DPDC SKILL Consultation: ${reg.fullName} (${reg.taluka}, ${reg.district})`;
      const description = `DPDC SKILL PVT. LTD. Consultation Appointment
Registration ID: ${reg.id}
Applicant: ${reg.fullName}
Mobile: ${reg.mobile}
WhatsApp: ${reg.whatsapp || reg.mobile}
Taluka: ${reg.taluka}, District: ${reg.district}
Business Interest: ${reg.businessInterest}
Premises: ${reg.premisesAvailable} (${reg.premisesSize || 'N/A'})
Applicant Notes: ${reg.questions || 'None'}
Status: Confirmed by DPDC Administrator`;

      const eventBody = {
        summary,
        description,
        location: `${reg.villageCity}, Taluka ${reg.taluka}, Maharashtra`,
        start: {
          dateTime: startDateTime,
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'Asia/Kolkata',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 30 },
            { method: 'email', minutes: 120 },
          ],
        },
      };

      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventBody),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Failed to create calendar event (HTTP ${res.status})`);
      }

      const eventData = await res.json();

      return {
        success: true,
        eventId: eventData.id,
        htmlLink: eventData.htmlLink,
        message: 'Appointment scheduled on Google Calendar successfully.',
      };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown calendar error';
      console.error('Google Calendar error:', error);
      return {
        success: false,
        message: msg,
      };
    }
  },
};
