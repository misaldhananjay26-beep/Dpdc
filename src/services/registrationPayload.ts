import { Registration } from '../types';
import { sanitizeText } from '../utils/validation';

/**
 * Pure helper functions for preparing, sanitizing, mapping, and filtering registration records.
 * Volumetric limits strictly match firebase-blueprint.json & firestore.rules.
 */

export interface RegistrationPayloadInput {
  id: string;
  fullName: string;
  mobile: string;
  whatsapp?: string;
  email?: string;
  villageCity: string;
  taluka: string;
  district: string;
  state: string;
  pincode: string;
  completeAddress?: string;
  courseStatus: Registration['courseStatus'];
  qualification?: string;
  businessInterest: Registration['businessInterest'];
  premisesAvailable: Registration['premisesAvailable'];
  premisesSize?: string;
  appointmentRequested?: boolean;
  preferredDate?: string;
  preferredTime?: Registration['preferredTime'];
  questions?: string;
  consentContact: boolean;
  consentMarketing?: boolean;
  nowIso?: string;
}

export function buildFirestoreRegistrationPayload(
  input: RegistrationPayloadInput,
  serverTimestampValue: unknown
): Record<string, unknown> {
  const cleanId = sanitizeText(input.id, 32);
  const cleanMobile = input.mobile.replace(/\D/g, '').slice(0, 15);
  const cleanWhatsapp = (input.whatsapp || cleanMobile).replace(/\D/g, '').slice(0, 15);
  const nowIso = input.nowIso || new Date().toISOString();

  const payload: Record<string, unknown> = {
    id: cleanId,
    registrationId: cleanId,
    fullName: sanitizeText(input.fullName, 120),
    mobile: cleanMobile,
    phoneNumber: cleanMobile,
    whatsapp: cleanWhatsapp,
    villageCity: sanitizeText(input.villageCity, 120),
    taluka: sanitizeText(input.taluka, 100),
    district: sanitizeText(input.district, 100),
    state: sanitizeText(input.state || 'Maharashtra', 60),
    pincode: input.pincode.replace(/\D/g, '').slice(0, 6),
    courseStatus: input.courseStatus,
    businessInterest: input.businessInterest,
    premisesAvailable: input.premisesAvailable,
    appointmentRequested: input.appointmentRequested ?? true,
    consentContact: Boolean(input.consentContact),
    consentMarketing: input.consentMarketing ?? true,
    leadStatus: 'New',
    timestamp: serverTimestampValue,
    createdAt: nowIso.slice(0, 40),
    updatedAt: nowIso.slice(0, 40),
    notes: [],
    history: [
      {
        id: `h_${Date.now()}`,
        fromStatus: 'New',
        toStatus: 'New',
        changedBy: 'Registration Form',
        timestamp: nowIso.slice(0, 40),
        note: 'Submitted via DPDC SKILL portal.',
      },
    ],
  };

  const cleanEmail = sanitizeText(input.email, 120);
  if (cleanEmail) payload.email = cleanEmail;

  const cleanAddress = sanitizeText(input.completeAddress, 300);
  if (cleanAddress) payload.completeAddress = cleanAddress;

  const cleanQual = sanitizeText(input.qualification, 100);
  if (cleanQual) payload.qualification = cleanQual;

  const cleanPremisesSize = sanitizeText(input.premisesSize, 100);
  if (cleanPremisesSize) payload.premisesSize = cleanPremisesSize;

  const cleanPreferredDate = sanitizeText(input.preferredDate, 30);
  if (cleanPreferredDate) payload.preferredDate = cleanPreferredDate;

  if (input.preferredTime) payload.preferredTime = input.preferredTime;

  const cleanQuestions = sanitizeText(input.questions, 1000);
  if (cleanQuestions) payload.questions = cleanQuestions;

  return payload;
}

export function extractIsoTimestamp(rawTimestamp: unknown, fallbackIso?: string): string {
  if (
    rawTimestamp &&
    typeof rawTimestamp === 'object' &&
    'toDate' in rawTimestamp &&
    typeof (rawTimestamp as { toDate: () => Date }).toDate === 'function'
  ) {
    return (rawTimestamp as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof rawTimestamp === 'string' && rawTimestamp.trim()) {
    return rawTimestamp;
  }
  if (typeof fallbackIso === 'string' && fallbackIso.trim()) {
    return fallbackIso;
  }
  return new Date().toISOString();
}

export function mapDocToRegistration(docId: string, data: Record<string, unknown>): Registration {
  const id = String(data.registrationId || data.id || docId);
  const mobile = String(data.phoneNumber || data.mobile || '');
  const createdAt = extractIsoTimestamp(data.timestamp, typeof data.createdAt === 'string' ? data.createdAt : undefined);

  return {
    id,
    registrationId: id,
    fullName: String(data.fullName || ''),
    mobile,
    phoneNumber: mobile,
    whatsapp: String(data.whatsapp || mobile),
    email: typeof data.email === 'string' ? data.email : undefined,
    villageCity: String(data.villageCity || ''),
    taluka: String(data.taluka || ''),
    district: String(data.district || ''),
    state: String(data.state || 'Maharashtra'),
    pincode: String(data.pincode || ''),
    completeAddress: typeof data.completeAddress === 'string' ? data.completeAddress : undefined,
    courseStatus: (data.courseStatus as Registration['courseStatus']) || 'completed',
    qualification: typeof data.qualification === 'string' ? data.qualification : undefined,
    businessInterest: (data.businessInterest as Registration['businessInterest']) || 'centre',
    premisesAvailable: (data.premisesAvailable as Registration['premisesAvailable']) || 'yes',
    premisesSize: typeof data.premisesSize === 'string' ? data.premisesSize : undefined,
    appointmentRequested: Boolean(data.appointmentRequested ?? true),
    preferredDate: typeof data.preferredDate === 'string' ? data.preferredDate : undefined,
    preferredTime: data.preferredTime as Registration['preferredTime'],
    appointmentStatus: data.appointmentStatus as Registration['appointmentStatus'],
    confirmedAppointmentDate:
      typeof data.confirmedAppointmentDate === 'string' ? data.confirmedAppointmentDate : undefined,
    confirmedAppointmentTime:
      typeof data.confirmedAppointmentTime === 'string' ? data.confirmedAppointmentTime : undefined,
    appointmentNotes: typeof data.appointmentNotes === 'string' ? data.appointmentNotes : undefined,
    questions: typeof data.questions === 'string' ? data.questions : undefined,
    consentContact: Boolean(data.consentContact ?? true),
    consentMarketing: Boolean(data.consentMarketing ?? true),
    leadStatus: (data.leadStatus as Registration['leadStatus']) || 'New',
    timestamp: data.timestamp,
    createdAt,
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : createdAt,
    googleSheetsSynced: Boolean(data.googleSheetsSynced),
    googleSheetsSyncedAt:
      typeof data.googleSheetsSyncedAt === 'string' ? data.googleSheetsSyncedAt : undefined,
    googleCalendarSynced: Boolean(data.googleCalendarSynced),
    googleCalendarEventId:
      typeof data.googleCalendarEventId === 'string' ? data.googleCalendarEventId : undefined,
    notes: Array.isArray(data.notes) ? data.notes : [],
    history: Array.isArray(data.history) ? data.history : [],
  };
}

export function filterRegistrations(
  registrations: Registration[],
  filters: {
    searchTerm: string;
    district: string;
    leadStatus: string;
    interest?: string;
    courseStatus?: string;
  }
): Registration[] {
  const searchLower = filters.searchTerm.trim().toLowerCase();

  return registrations.filter((r) => {
    const matchesSearch =
      !searchLower ||
      r.fullName.toLowerCase().includes(searchLower) ||
      r.mobile.includes(searchLower) ||
      (r.phoneNumber && r.phoneNumber.includes(searchLower)) ||
      r.villageCity.toLowerCase().includes(searchLower) ||
      r.taluka.toLowerCase().includes(searchLower) ||
      r.id.toLowerCase().includes(searchLower) ||
      (r.registrationId && r.registrationId.toLowerCase().includes(searchLower));

    const matchesDistrict = filters.district === 'ALL' || r.district === filters.district;
    const matchesStatus = filters.leadStatus === 'ALL' || r.leadStatus === filters.leadStatus;
    const matchesInterest = !filters.interest || filters.interest === 'ALL' || r.businessInterest === filters.interest;
    const matchesCourse = !filters.courseStatus || filters.courseStatus === 'ALL' || r.courseStatus === filters.courseStatus;

    return matchesSearch && matchesDistrict && matchesStatus && matchesInterest && matchesCourse;
  });
}
