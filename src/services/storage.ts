import { Registration, AuditLog, WebsiteSettings, LeadStatus } from '../types';

const STORAGE_KEYS = {
  REGISTRATIONS: 'dpdc_registrations_v2',
  SETTINGS: 'dpdc_settings_v2',
  AUDIT_LOGS: 'dpdc_audit_logs_v2',
  ADMIN_AUTH: 'dpdc_admin_session_v2',
  ADMIN_PASSWORD_HASH: 'dpdc_admin_pwd_hash_v2',
  BANNER_IMAGE: 'dpdc_custom_banner_img_v2',
};

// Default seed registrations to provide realistic admin data on initial load
const SEED_REGISTRATIONS: Registration[] = [
  {
    id: 'DPDC-2026-10492',
    fullName: 'प्रिया सचिन शिंदे (Priya Shinde)',
    mobile: '9822145678',
    whatsapp: '9822145678',
    email: '',
    villageCity: 'बारामती (Baramati)',
    taluka: 'Baramati',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '413102',
    completeAddress: 'मु. पो. जळोची, तालुका बारामती, जि. पुणे',
    courseStatus: 'completed',
    qualification: 'Graduate (B.Com)',
    businessInterest: 'centre',
    premisesAvailable: 'yes',
    premisesSize: '350 sq.ft (Own Property)',
    appointmentRequested: true,
    preferredDate: '2026-11-12',
    preferredTime: 'morning',
    appointmentStatus: 'confirmed',
    confirmedAppointmentDate: '2026-11-12',
    confirmedAppointmentTime: '11:00 AM',
    appointmentNotes: 'Interested in premier setup for Baramati MIDC road location.',
    questions: 'फ्रँचायझी सेटअपसाठी किती दिवस लागतात? साहित्य कधी मिळेल?',
    consentContact: true,
    consentMarketing: true,
    leadStatus: 'Appointment Confirmed',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    googleSheetsSynced: true,
    googleSheetsSyncedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    googleCalendarSynced: true,
    notes: [
      {
        id: 'n1',
        text: 'Telephonic discussion done. Applicant has ready commercial space on main road.',
        author: 'Dhananjay Misal',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      }
    ],
    history: [
      {
        id: 'h1',
        fromStatus: 'New',
        toStatus: 'Contacted',
        changedBy: 'dhananjay@dpdc.admin',
        timestamp: new Date(Date.now() - 1.5 * 86400000).toISOString(),
      },
      {
        id: 'h2',
        fromStatus: 'Contacted',
        toStatus: 'Appointment Confirmed',
        changedBy: 'dhananjay@dpdc.admin',
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
        note: 'Confirmed appointment for 12th Nov 11:00 AM',
      }
    ]
  },
  {
    id: 'DPDC-2026-10518',
    fullName: 'स्नेहल राहुल पाटील (Snehal Patil)',
    mobile: '9421034567',
    whatsapp: '9421034567',
    email: '',
    villageCity: 'कराड (Karad)',
    taluka: 'Karad',
    district: 'Satara',
    state: 'Maharashtra',
    pincode: '415110',
    completeAddress: 'वारुंजी फाटा, कराड, सातारा',
    courseStatus: 'learning',
    qualification: '12th Pass',
    businessInterest: 'both',
    premisesAvailable: 'planning',
    premisesSize: '250 sq.ft rented shop finalized',
    appointmentRequested: true,
    preferredDate: '2026-11-15',
    preferredTime: 'afternoon',
    appointmentStatus: 'pending',
    questions: 'कोर्स फी आणि सेंटर फी याबद्दल संपूर्ण माहिती हवी आहे.',
    consentContact: true,
    consentMarketing: true,
    leadStatus: 'Appointment Requested',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    googleSheetsSynced: true,
    googleSheetsSyncedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    googleCalendarSynced: false,
    notes: [],
    history: [
      {
        id: 'h2_1',
        fromStatus: 'New',
        toStatus: 'Appointment Requested',
        changedBy: 'System',
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
      }
    ]
  },
  {
    id: 'DPDC-2026-10540',
    fullName: 'अश्विनी अमोल जाधव (Ashwini Jadhav)',
    mobile: '9765412390',
    whatsapp: '9765412390',
    villageCity: 'संगमनेर (Sangamner)',
    taluka: 'Sangamner',
    district: 'Ahmednagar',
    state: 'Maharashtra',
    pincode: '422605',
    completeAddress: 'नवीन नगर रोड, संगमनेर',
    courseStatus: 'completed',
    qualification: 'Diploma in Cosmetology',
    businessInterest: 'centre',
    premisesAvailable: 'yes',
    premisesSize: '400 sq.ft',
    appointmentRequested: false,
    consentContact: true,
    consentMarketing: true,
    leadStatus: 'Interested',
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    googleSheetsSynced: false,
    notes: [
      {
        id: 'n3',
        text: 'Sent franchise brochure and kit catalog on WhatsApp. Very promising candidate.',
        author: 'Dhananjay Misal',
        createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      }
    ],
    history: [
      {
        id: 'h3_1',
        fromStatus: 'New',
        toStatus: 'Contacted',
        changedBy: 'dhananjay@dpdc.admin',
        timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
      },
      {
        id: 'h3_2',
        fromStatus: 'Contacted',
        toStatus: 'Interested',
        changedBy: 'dhananjay@dpdc.admin',
        timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
      }
    ]
  },
  {
    id: 'DPDC-2026-10565',
    fullName: 'वैशाली गजानन देशमुख (Vaishali Deshmukh)',
    mobile: '9923871234',
    whatsapp: '9923871234',
    email: '',
    villageCity: 'गंगापूर (Gangapur)',
    taluka: 'Gangapur',
    district: 'Chhatrapati Sambhajinagar (Aurangabad)',
    state: 'Maharashtra',
    pincode: '431109',
    courseStatus: 'interested',
    qualification: 'Graduate',
    businessInterest: 'student',
    premisesAvailable: 'no',
    appointmentRequested: true,
    preferredDate: '2026-11-14',
    preferredTime: 'evening',
    appointmentStatus: 'pending',
    questions: 'ब्युटी पार्लरचा मास्टर डिप्लोमा कोर्स करायचा आहे. बॅचेस कधी सुरू होतात?',
    consentContact: true,
    consentMarketing: false,
    leadStatus: 'New',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    googleSheetsSynced: false,
    notes: [],
    history: []
  }
];

const DEFAULT_SETTINGS: WebsiteSettings = {
  companyName: 'DPDC SKILL PVT. LTD.',
  tagline: 'BUILD • TRAIN • GROW',
  phone1: '+91 98220 00000',
  phone2: '+91 94220 00000',
  whatsappNumber: '+91 98220 00000',
  address: 'DPDC SKILL Corporate Office, Maharashtra, India',
  operatingHours: 'सोमवार ते शनिवार: सकाळी ९:०० ते संध्याकाळी ७:००',
  franchiseOfferNoticeMarathi: 'कंपनीच्या अधिकृत अटी व नियमांनुसार प्रत्येक तालुक्यातील पहिल्या पात्र केंद्रासाठी विशेष सहकार्य!',
  googleSheetId: '',
};

export const StorageService = {
  getRegistrations(): Registration[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(SEED_REGISTRATIONS));
        return SEED_REGISTRATIONS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_REGISTRATIONS;
    }
  },

  saveRegistration(reg: Registration): boolean {
    try {
      const list = this.getRegistrations();
      // Check for duplicate by mobile number within same 24 hours
      const existingIndex = list.findIndex(r => r.mobile === reg.mobile);
      if (existingIndex >= 0) {
        // Update existing rather than creating duplicate
        list[existingIndex] = {
          ...list[existingIndex],
          ...reg,
          updatedAt: new Date().toISOString(),
        };
      } else {
        list.unshift(reg);
      }
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(list));
      this.addAuditLog('System / Public', 'New Registration Submitted', `ID: ${reg.id}, Name: ${reg.fullName}, Mobile: ${reg.mobile}`);
      return true;
    } catch (e) {
      console.error('Failed to save registration', e);
      return false;
    }
  },

  updateRegistration(id: string, updates: Partial<Registration>, adminUser: string = 'dhananjay@dpdc.admin'): boolean {
    try {
      const list = this.getRegistrations();
      const index = list.findIndex(r => r.id === id);
      if (index === -1) return false;

      const current = list[index];
      const updated: Registration = {
        ...current,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Record status change history if status changed
      if (updates.leadStatus && updates.leadStatus !== current.leadStatus) {
        updated.history = [
          ...(updated.history || []),
          {
            id: `h_${Date.now()}`,
            fromStatus: current.leadStatus,
            toStatus: updates.leadStatus,
            changedBy: adminUser,
            timestamp: new Date().toISOString(),
          }
        ];
        this.addAuditLog(adminUser, 'Lead Status Updated', `ID: ${id}, from ${current.leadStatus} to ${updates.leadStatus}`);
      }

      list[index] = updated;
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error('Failed to update registration', e);
      return false;
    }
  },

  addRegistrationNote(id: string, text: string, author: string): boolean {
    try {
      const list = this.getRegistrations();
      const index = list.findIndex(r => r.id === id);
      if (index === -1) return false;

      const newNote = {
        id: `note_${Date.now()}`,
        text,
        author,
        createdAt: new Date().toISOString(),
      };

      list[index].notes = [...(list[index].notes || []), newNote];
      list[index].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(list));
      this.addAuditLog(author, 'Follow-up Note Added', `ID: ${id}, Note: "${text.slice(0, 40)}..."`);
      return true;
    } catch (e) {
      console.error('Failed to add note', e);
      return false;
    }
  },

  deleteRegistration(id: string, adminUser: string = 'dhananjay@dpdc.admin'): boolean {
    try {
      const list = this.getRegistrations();
      const filtered = list.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(filtered));
      this.addAuditLog(adminUser, 'Registration Deleted', `ID: ${id}`);
      return true;
    } catch (e) {
      console.error('Failed to delete registration', e);
      return false;
    }
  },

  getSettings(): WebsiteSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  updateSettings(settings: Partial<WebsiteSettings>, adminUser: string = 'dhananjay@dpdc.admin'): boolean {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      this.addAuditLog(adminUser, 'Website Settings Updated', 'Updated contact or franchise notice settings');
      return true;
    } catch (e) {
      console.error('Failed to update settings', e);
      return false;
    }
  },

  getAuditLogs(): AuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  addAuditLog(user: string, action: string, details: string) {
    try {
      const logs = this.getAuditLogs();
      const newLog: AuditLog = {
        id: `audit_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        user,
        action,
        details,
      };
      logs.unshift(newLog);
      // Keep latest 200 logs
      if (logs.length > 200) logs.length = 200;
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to write audit log', e);
    }
  },

  getAdminSession(): { loggedIn: boolean; email: string; token?: string; timestamp?: number } | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      if (!raw) return null;
      const session = JSON.parse(raw);
      const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
      if (session.timestamp && Date.now() - session.timestamp > TWO_HOURS_MS) {
        this.clearAdminSession();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  setAdminSession(session: { loggedIn: boolean; email: string; token?: string }) {
    try {
      const sessionWithExpiry = {
        ...session,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(sessionWithExpiry));
      this.addAuditLog(session.email, 'Admin Logged In', 'Authenticated successfully to admin portal');
    } catch (e) {
      console.error(e);
    }
  },

  clearAdminSession() {
    try {
      const current = this.getAdminSession();
      if (current) {
        this.addAuditLog(current.email, 'Admin Logged Out', 'Admin session terminated');
      }
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    } catch (e) {
      console.error(e);
    }
  },

  getBannerImage(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.BANNER_IMAGE);
    } catch {
      return null;
    }
  },

  setBannerImage(imageUri: string) {
    try {
      localStorage.setItem(STORAGE_KEYS.BANNER_IMAGE, imageUri);
    } catch (e) {
      console.error('Failed to save banner image', e);
    }
  },

  removeBannerImage() {
    try {
      localStorage.removeItem(STORAGE_KEYS.BANNER_IMAGE);
    } catch (e) {
      console.error(e);
    }
  }
};
