export type Language = 'mr' | 'hi' | 'en';

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Interested'
  | 'Appointment Requested'
  | 'Appointment Confirmed'
  | 'Follow-up Required'
  | 'Converted'
  | 'Not Interested';

export type CourseStatus = 'completed' | 'learning' | 'not_completed' | 'interested';

export type BusinessInterest = 'centre' | 'student' | 'both' | 'exploring';

export type PremisesStatus = 'yes' | 'no' | 'planning';

export type AppointmentTimeSlot = 'morning' | 'afternoon' | 'evening' | 'flexible';

export interface RegistrationNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface StatusHistoryItem {
  id: string;
  fromStatus: LeadStatus;
  toStatus: LeadStatus;
  changedBy: string;
  timestamp: string;
  note?: string;
}

export interface Registration {
  id: string; // e.g., DPDC-2026-78421
  fullName: string;
  mobile: string;
  whatsapp: string;
  email?: string;
  villageCity: string;
  taluka: string;
  district: string;
  state: string;
  pincode: string;
  completeAddress?: string;
  courseStatus: CourseStatus;
  qualification?: string;
  businessInterest: BusinessInterest;
  premisesAvailable: PremisesStatus;
  premisesSize?: string;
  appointmentRequested: boolean;
  preferredDate?: string;
  preferredTime?: AppointmentTimeSlot;
  appointmentStatus?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  confirmedAppointmentDate?: string;
  confirmedAppointmentTime?: string;
  appointmentNotes?: string;
  questions?: string;
  consentContact: boolean;
  consentMarketing: boolean;
  leadStatus: LeadStatus;
  createdAt: string;
  updatedAt: string;
  googleSheetsSynced?: boolean;
  googleSheetsSyncedAt?: string;
  googleCalendarSynced?: boolean;
  googleCalendarEventId?: string;
  notes: RegistrationNote[];
  history: StatusHistoryItem[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface WebsiteSettings {
  companyName: string;
  tagline: string;
  phone1: string;
  phone2: string;
  whatsappNumber: string;
  email?: string;
  address: string;
  operatingHours: string;
  franchiseOfferNoticeMarathi: string;
  googleSheetId?: string;
}
