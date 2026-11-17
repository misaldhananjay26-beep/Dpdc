import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from './firebase';
import {
  Registration,
  AuditLog,
  WebsiteSettings,
  RegistrationNote,
} from '../types';
import {
  buildFirestoreRegistrationPayload,
  mapDocToRegistration,
  RegistrationPayloadInput,
} from './registrationPayload';
import { sanitizeText } from '../utils/validation';

export interface AdminUserRecord {
  uid: string;
  email: string;
  role: 'admin';
  createdAt?: string;
}

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings = {
  companyName: 'DPDC SKILL PVT. LTD.',
  tagline: 'BUILD • TRAIN • GROW',
  phone1: '+91 98220 00000',
  phone2: '+91 94220 00000',
  whatsappNumber: '+91 98220 00000',
  address: 'DPDC SKILL Corporate Office, Maharashtra, India',
  operatingHours: 'सोमवार ते शनिवार: सकाळी ९:०० ते संध्याकाळी ७:००',
  franchiseOfferNoticeMarathi:
    'कंपनीच्या अधिकृत अटी व नियमांनुसार प्रत्येक तालुक्यातील पहिल्या पात्र केंद्रासाठी विशेष सहकार्य!',
  googleSheetId: '',
};

const REGISTRATIONS_COLLECTION = 'registrations';
const SETTINGS_COLLECTION = 'settings';
const PUBLIC_SETTINGS_DOC_ID = 'public';
const AUDIT_LOGS_COLLECTION = 'auditLogs';
const ADMINS_COLLECTION = 'admins';

export const FirestoreService = {
  /**
   * Creates a new registration in Firestore and awaits server confirmation.
   * Only returns once Firestore has durably persisted the record.
   */
  async createRegistration(input: RegistrationPayloadInput): Promise<Registration> {
    const docPath = `${REGISTRATIONS_COLLECTION}/${input.id}`;
    const payload = buildFirestoreRegistrationPayload(input, serverTimestamp());

    try {
      await setDoc(doc(db, REGISTRATIONS_COLLECTION, input.id), payload);
      return mapDocToRegistration(input.id, {
        ...payload,
        timestamp: payload.createdAt,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, docPath);
    }
  },

  /**
   * Real-time Firestore listener for all registrations sorted newest first.
   * Requires authenticated admin user.
   */
  subscribeToRegistrations(
    onData: (registrations: Registration[]) => void,
    onError: (err: Error) => void
  ): Unsubscribe {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) =>
          mapDocToRegistration(docSnap.id, docSnap.data() as Record<string, unknown>)
        );
        onData(list);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, REGISTRATIONS_COLLECTION);
        } catch (wrapped) {
          onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
        }
      }
    );
  },

  /**
   * Updates registration fields (lead status, appointments, Google sync flags).
   */
  async updateRegistration(
    id: string,
    updates: Partial<Registration>,
    currentReg: Registration | undefined,
    adminEmail: string
  ): Promise<void> {
    const docPath = `${REGISTRATIONS_COLLECTION}/${id}`;
    const nowIso = new Date().toISOString();

    const updatePayload: Record<string, unknown> = {
      updatedAt: nowIso,
    };

    if (updates.leadStatus !== undefined) updatePayload.leadStatus = updates.leadStatus;
    if (updates.appointmentStatus !== undefined) updatePayload.appointmentStatus = updates.appointmentStatus;
    if (updates.confirmedAppointmentDate !== undefined) {
      updatePayload.confirmedAppointmentDate = sanitizeText(updates.confirmedAppointmentDate, 30);
    }
    if (updates.confirmedAppointmentTime !== undefined) {
      updatePayload.confirmedAppointmentTime = sanitizeText(updates.confirmedAppointmentTime, 30);
    }
    if (updates.appointmentNotes !== undefined) {
      updatePayload.appointmentNotes = sanitizeText(updates.appointmentNotes, 500);
    }
    if (updates.googleSheetsSynced !== undefined) updatePayload.googleSheetsSynced = updates.googleSheetsSynced;
    if (updates.googleSheetsSyncedAt !== undefined) updatePayload.googleSheetsSyncedAt = updates.googleSheetsSyncedAt;
    if (updates.googleCalendarSynced !== undefined) updatePayload.googleCalendarSynced = updates.googleCalendarSynced;
    if (updates.googleCalendarEventId !== undefined) {
      updatePayload.googleCalendarEventId = sanitizeText(updates.googleCalendarEventId, 120);
    }

    if (
      updates.leadStatus &&
      currentReg &&
      updates.leadStatus !== currentReg.leadStatus
    ) {
      const nextHistory = [
        ...(currentReg.history || []),
        {
          id: `h_${Date.now()}`,
          fromStatus: currentReg.leadStatus,
          toStatus: updates.leadStatus,
          changedBy: sanitizeText(adminEmail, 120),
          timestamp: nowIso,
        },
      ].slice(-100);
      updatePayload.history = nextHistory;
    }

    try {
      await updateDoc(doc(db, REGISTRATIONS_COLLECTION, id), updatePayload);
      if (updates.leadStatus && currentReg && updates.leadStatus !== currentReg.leadStatus) {
        await this.addAuditLog(
          adminEmail,
          'Lead Status Updated',
          `ID: ${id}, from ${currentReg.leadStatus} to ${updates.leadStatus}`
        );
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }
  },

  /**
   * Appends an internal follow-up note to a registration document.
   */
  async addRegistrationNote(
    id: string,
    text: string,
    author: string,
    currentNotes: RegistrationNote[]
  ): Promise<void> {
    const docPath = `${REGISTRATIONS_COLLECTION}/${id}`;
    const nowIso = new Date().toISOString();
    const newNote: RegistrationNote = {
      id: `note_${Date.now()}`,
      text: sanitizeText(text, 500),
      author: sanitizeText(author, 120),
      createdAt: nowIso,
    };
    const nextNotes = [...(currentNotes || []), newNote].slice(-100);

    try {
      await updateDoc(doc(db, REGISTRATIONS_COLLECTION, id), {
        notes: nextNotes,
        updatedAt: nowIso,
      });
      await this.addAuditLog(
        author,
        'Follow-up Note Added',
        `ID: ${id}, Note: "${newNote.text.slice(0, 40)}"`
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }
  },

  /**
   * Deletes a registration document from Firestore.
   */
  async deleteRegistration(id: string, adminEmail: string): Promise<void> {
    const docPath = `${REGISTRATIONS_COLLECTION}/${id}`;
    try {
      await deleteDoc(doc(db, REGISTRATIONS_COLLECTION, id));
      await this.addAuditLog(adminEmail, 'Registration Deleted', `ID: ${id}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  /**
   * Fetches public website settings (helpline numbers, WhatsApp, company notice).
   */
  async getPublicSettings(): Promise<WebsiteSettings> {
    const docPath = `${SETTINGS_COLLECTION}/${PUBLIC_SETTINGS_DOC_ID}`;
    try {
      const snap = await getDoc(doc(db, SETTINGS_COLLECTION, PUBLIC_SETTINGS_DOC_ID));
      if (!snap.exists()) {
        return DEFAULT_WEBSITE_SETTINGS;
      }
      return {
        ...DEFAULT_WEBSITE_SETTINGS,
        ...(snap.data() as Partial<WebsiteSettings>),
      };
    } catch (error) {
      console.warn('Could not fetch public settings, using defaults:', error);
      return DEFAULT_WEBSITE_SETTINGS;
    }
  },

  /**
   * Real-time listener for public website settings.
   */
  subscribeToSettings(onData: (settings: WebsiteSettings) => void): Unsubscribe {
    return onSnapshot(
      doc(db, SETTINGS_COLLECTION, PUBLIC_SETTINGS_DOC_ID),
      (snap) => {
        if (snap.exists()) {
          onData({
            ...DEFAULT_WEBSITE_SETTINGS,
            ...(snap.data() as Partial<WebsiteSettings>),
          });
        } else {
          onData(DEFAULT_WEBSITE_SETTINGS);
        }
      },
      () => {
        onData(DEFAULT_WEBSITE_SETTINGS);
      }
    );
  },

  /**
   * Updates public website settings (Admin only).
   */
  async updateSettings(
    updates: Partial<WebsiteSettings>,
    adminEmail: string
  ): Promise<void> {
    const docPath = `${SETTINGS_COLLECTION}/${PUBLIC_SETTINGS_DOC_ID}`;
    const merged: WebsiteSettings = {
      ...DEFAULT_WEBSITE_SETTINGS,
      ...updates,
    };

    const payload = {
      companyName: sanitizeText(merged.companyName, 120),
      tagline: sanitizeText(merged.tagline, 120),
      phone1: sanitizeText(merged.phone1, 24),
      phone2: sanitizeText(merged.phone2, 24),
      whatsappNumber: sanitizeText(merged.whatsappNumber, 24),
      address: sanitizeText(merged.address, 300),
      operatingHours: sanitizeText(merged.operatingHours, 120),
      franchiseOfferNoticeMarathi: sanitizeText(merged.franchiseOfferNoticeMarathi, 400),
      googleSheetId: sanitizeText(merged.googleSheetId, 120),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, SETTINGS_COLLECTION, PUBLIC_SETTINGS_DOC_ID), payload);
      await this.addAuditLog(
        adminEmail,
        'Website Settings Updated',
        'Updated contact or franchise notice settings'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  },

  /**
   * Writes an audit log entry in Firestore (Admin only).
   */
  async addAuditLog(user: string, action: string, details: string): Promise<void> {
    const id = `audit_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const docPath = `${AUDIT_LOGS_COLLECTION}/${id}`;
    try {
      await setDoc(doc(db, AUDIT_LOGS_COLLECTION, id), {
        id,
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp(),
        user: sanitizeText(user, 120) || 'Admin',
        action: sanitizeText(action, 120),
        details: sanitizeText(details, 500),
      });
    } catch (error) {
      // Do not crash primary operation if secondary audit log fails, but log context
      console.warn('Audit log write failed:', docPath, error);
    }
  },

  /**
   * Real-time listener for audit logs (Admin only).
   */
  subscribeToAuditLogs(
    onData: (logs: AuditLog[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    const q = query(
      collection(db, AUDIT_LOGS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(100)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const logs = snapshot.docs.map((d) => d.data() as AuditLog);
        onData(logs);
      },
      (error) => {
        if (onError) {
          try {
            handleFirestoreError(error, OperationType.LIST, AUDIT_LOGS_COLLECTION);
          } catch (wrapped) {
            onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
          }
        }
      }
    );
  },

  /**
   * Real-time listener for authorized admin UIDs.
   */
  subscribeToAdmins(
    onData: (admins: AdminUserRecord[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    return onSnapshot(
      collection(db, ADMINS_COLLECTION),
      (snapshot) => {
        const list = snapshot.docs.map((d) => d.data() as AdminUserRecord);
        onData(list);
      },
      (error) => {
        if (onError) {
          onError(error instanceof Error ? error : new Error(String(error)));
        }
      }
    );
  },

  async addAuthorizedAdmin(uid: string, email: string, currentAdminEmail: string): Promise<void> {
    const cleanUid = sanitizeText(uid, 128);
    const docPath = `${ADMINS_COLLECTION}/${cleanUid}`;
    try {
      await setDoc(doc(db, ADMINS_COLLECTION, cleanUid), {
        uid: cleanUid,
        email: sanitizeText(email, 120),
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
      await this.addAuditLog(currentAdminEmail, 'Admin Authorized', `Granted admin access to ${email}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  },

  async removeAuthorizedAdmin(uid: string, currentAdminEmail: string): Promise<void> {
    const docPath = `${ADMINS_COLLECTION}/${uid}`;
    try {
      await deleteDoc(doc(db, ADMINS_COLLECTION, uid));
      await this.addAuditLog(currentAdminEmail, 'Admin Removed', `Revoked admin access for UID ${uid}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },
};
