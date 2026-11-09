import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  FileSpreadsheet,
  Settings,
  Search,
  Filter,
  Download,
  Phone,
  MessageSquare,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  LogOut,
  ChevronDown,
  Printer,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Award,
  AlertTriangle,
  History,
  X,
  FileText,
  UserCheck,
} from 'lucide-react';
import {
  Registration,
  LeadStatus,
  AuditLog,
  WebsiteSettings,
} from '../../types';
import { StorageService } from '../../services/storage';
import {
  exportToCsv,
  buildWhatsAppLink,
  formatIndianPhone,
} from '../../utils/validation';
import { GoogleWorkspaceService } from '../../services/googleWorkspace';
import { googleSignIn, getAccessToken, logoutGoogle } from '../../services/firebaseAuth';
import { MAHARASHTRA_DISTRICTS } from '../../data/maharashtra';
import logoImg from '../../assets/logo.png';

interface AdminDashboardProps {
  adminEmail: string;
  adminToken?: string;
  onLogout: () => void;
  onViewWebsite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminEmail,
  adminToken,
  onLogout,
  onViewWebsite,
}) => {
  // Active Navigation Tab: 'leads' | 'appointments' | 'sheets' | 'analytics' | 'settings'
  const [activeTab, setActiveTab] = useState<'leads' | 'appointments' | 'sheets' | 'analytics' | 'settings'>('leads');

  // Registrations state
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Registration | null>(null);
  const [editingApplicant, setEditingApplicant] = useState<Registration | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('ALL');
  const [filterLeadStatus, setFilterLeadStatus] = useState('ALL');
  const [filterInterest, setFilterInterest] = useState('ALL');
  const [filterCourseStatus, setFilterCourseStatus] = useState('ALL');

  // Google Integration states
  const [googleToken, setGoogleToken] = useState<string | null>(adminToken || null);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [sheetSyncMessage, setSheetSyncMessage] = useState<{ text: string; url?: string; success: boolean } | null>(null);
  const [isSyncingCalendar, setIsSyncingCalendar] = useState<string | null>(null); // reg id

  // Appointment scheduling modal
  const [schedulingReg, setSchedulingReg] = useState<Registration | null>(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('11:00 AM');
  const [scheduleNotes, setScheduleNotes] = useState('');

  // Follow-up note input in modal
  const [newNoteText, setNewNoteText] = useState('');

  // Audit Logs & Settings
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>(StorageService.getSettings());
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const list = StorageService.getRegistrations();
    setRegistrations(list);
    setAuditLogs(StorageService.getAuditLogs());
    setSettings(StorageService.getSettings());
  };

  // Google OAuth connect if token is missing
  const ensureGoogleToken = async (): Promise<string | null> => {
    if (googleToken) return googleToken;
    try {
      const res = await googleSignIn();
      if (res?.accessToken) {
        setGoogleToken(res.accessToken);
        return res.accessToken;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  // Status Change Handler
  const handleStatusChange = (id: string, newStatus: LeadStatus) => {
    StorageService.updateRegistration(id, { leadStatus: newStatus }, adminEmail);
    loadData();
    if (selectedApplicant && selectedApplicant.id === id) {
      setSelectedApplicant((prev) => (prev ? { ...prev, leadStatus: newStatus } : null));
    }
  };

  // Add Note Handler
  const handleAddNote = (id: string) => {
    if (!newNoteText.trim()) return;
    StorageService.addRegistrationNote(id, newNoteText.trim(), adminEmail);
    setNewNoteText('');
    loadData();
    // Update active modal view
    const updated = StorageService.getRegistrations().find((r) => r.id === id);
    if (updated) setSelectedApplicant(updated);
  };

  // Delete Lead
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`खरोखरच ${name} (ID: ${id}) चा अर्ज हटवायचा आहे का?`)) {
      StorageService.deleteRegistration(id, adminEmail);
      if (selectedApplicant?.id === id) setSelectedApplicant(null);
      loadData();
    }
  };

  // Google Sheets Sync
  const handleSyncToGoogleSheets = async () => {
    setIsSyncingSheets(true);
    setSheetSyncMessage(null);
    try {
      const token = await ensureGoogleToken();
      if (!token) {
        setSheetSyncMessage({
          success: false,
          text: 'Google खात्याशी जोडणी आवश्यक आहे. कृपया Google ने लॉगिन करा.',
        });
        return;
      }

      const res = await GoogleWorkspaceService.syncToGoogleSheets(
        registrations,
        token,
        settings.googleSheetId
      );

      if (res.success && res.spreadsheetId) {
        // Save spreadsheet ID to settings
        StorageService.updateSettings({ googleSheetId: res.spreadsheetId }, adminEmail);
        setSettings((prev) => ({ ...prev, googleSheetId: res.spreadsheetId }));
        // Mark all as synced
        registrations.forEach((r) => {
          StorageService.updateRegistration(r.id, {
            googleSheetsSynced: true,
            googleSheetsSyncedAt: new Date().toISOString(),
          });
        });
        loadData();
        setSheetSyncMessage({
          success: true,
          text: res.message,
          url: res.spreadsheetUrl,
        });
      } else {
        setSheetSyncMessage({
          success: false,
          text: res.message || 'सिंक अयशस्वी झाले.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setSheetSyncMessage({ success: false, text: msg });
    } finally {
      setIsSyncingSheets(false);
    }
  };

  // Confirm Appointment & Google Calendar Sync
  const handleConfirmAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingReg) return;

    setIsSyncingCalendar(schedulingReg.id);
    try {
      // 1. Update in local database
      StorageService.updateRegistration(
        schedulingReg.id,
        {
          leadStatus: 'Appointment Confirmed',
          appointmentStatus: 'confirmed',
          confirmedAppointmentDate: scheduledDate,
          confirmedAppointmentTime: scheduledTime,
          appointmentNotes: scheduleNotes,
        },
        adminEmail
      );

      // 2. Sync with Google Calendar if connected
      const token = await getAccessToken();
      if (token) {
        const calRes = await GoogleWorkspaceService.createCalendarAppointment(
          schedulingReg,
          scheduledDate,
          scheduledTime,
          token
        );
        if (calRes.success) {
          StorageService.updateRegistration(schedulingReg.id, {
            googleCalendarSynced: true,
            googleCalendarEventId: calRes.eventId,
          });
          StorageService.addAuditLog(
            adminEmail,
            'Google Calendar Event Created',
            `Scheduled for ${schedulingReg.fullName} on ${scheduledDate} at ${scheduledTime}`
          );
        }
      }

      setSchedulingReg(null);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncingCalendar(null);
    }
  };

  // Export Filtered Leads to CSV
  const handleExportCsv = () => {
    const exportData = filteredRegistrations.map((r) => ({
      'Registration ID': r.id,
      'Full Name': r.fullName,
      'Mobile': r.mobile,
      'WhatsApp': r.whatsapp,
      'Village / City': r.villageCity,
      'Taluka': r.taluka,
      'District': r.district,
      'State': r.state,
      'PIN Code': r.pincode,
      'Course Completed': r.courseStatus,
      'Qualification': r.qualification || '',
      'Business Interest': r.businessInterest,
      'Premises Available': r.premisesAvailable,
      'Premises Size': r.premisesSize || '',
      'Appointment Requested': r.appointmentRequested ? 'Yes' : 'No',
      'Preferred Date': r.preferredDate || '',
      'Preferred Time': r.preferredTime || '',
      'Appointment Status': r.appointmentStatus || '',
      'Confirmed Date': r.confirmedAppointmentDate || '',
      'Lead Status': r.leadStatus,
      'Questions': r.questions || '',
      'Registered At': new Date(r.createdAt).toLocaleString('en-IN'),
    }));

    exportToCsv(exportData, `DPDC_SKILL_Leads_${new Date().toISOString().slice(0, 10)}`);
    StorageService.addAuditLog(adminEmail, 'Leads Exported to CSV', `Exported ${exportData.length} records`);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateSettings(settings, adminEmail);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
    loadData();
  };

  // Filter Logic
  const filteredRegistrations = registrations.filter((r) => {
    // Search
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      r.fullName.toLowerCase().includes(searchLower) ||
      r.mobile.includes(searchLower) ||
      r.villageCity.toLowerCase().includes(searchLower) ||
      r.taluka.toLowerCase().includes(searchLower) ||
      r.id.toLowerCase().includes(searchLower);

    // District
    const matchesDistrict = filterDistrict === 'ALL' || r.district === filterDistrict;

    // Status
    const matchesStatus = filterLeadStatus === 'ALL' || r.leadStatus === filterLeadStatus;

    // Interest
    const matchesInterest = filterInterest === 'ALL' || r.businessInterest === filterInterest;

    // Course
    const matchesCourse = filterCourseStatus === 'ALL' || r.courseStatus === filterCourseStatus;

    return matchesSearch && matchesDistrict && matchesStatus && matchesInterest && matchesCourse;
  });

  // KPI Calculations
  const totalRegistrations = registrations.length;
  const newLeads = registrations.filter((r) => r.leadStatus === 'New').length;
  const contactedLeads = registrations.filter((r) => r.leadStatus === 'Contacted').length;
  const franchiseApplicants = registrations.filter(
    (r) => r.businessInterest === 'centre' || r.businessInterest === 'both'
  ).length;
  const studentEnquiries = registrations.filter(
    (r) => r.businessInterest === 'student'
  ).length;
  const appointmentsRequested = registrations.filter((r) => r.appointmentRequested).length;
  const appointmentsConfirmed = registrations.filter(
    (r) => r.leadStatus === 'Appointment Confirmed' || r.appointmentStatus === 'confirmed'
  ).length;

  return (
    <div className="min-h-screen bg-[#070709] text-gray-200">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#0C0C0E]/95 backdrop-blur-md border-b border-[#D4AF37]/25 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#D4AF37]/50 overflow-hidden shadow-md bg-black flex-shrink-0">
            <img src={logoImg} alt="DPDC Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-white text-base sm:text-lg">
                DPDC <span className="gold-gradient-text">ADMIN</span>
              </span>
              <span className="text-[10px] bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5DE9E] px-2 py-0.5 rounded-full font-bold">
                PRO BUSINESS
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              लॉगिन: <span className="text-gray-300 font-mono">{adminEmail}</span>
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onViewWebsite}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141417] hover:bg-[#1E1E22] border border-neutral-700 text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>वेबसाइट पहा</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-xs font-semibold text-red-200 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">लॉगआउट</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-neutral-800 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'leads'
                ? 'gold-gradient-btn text-black'
                : 'bg-[#121215] text-gray-300 hover:text-white border border-neutral-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>नोंदणी व लीड्स ({totalRegistrations})</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'appointments'
                ? 'gold-gradient-btn text-black'
                : 'bg-[#121215] text-gray-300 hover:text-white border border-neutral-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>अपॉइंटमेंट्स ({appointmentsRequested})</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sheets'
                ? 'gold-gradient-btn text-black'
                : 'bg-[#121215] text-gray-300 hover:text-white border border-neutral-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Google Sheets सिंक</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'gold-gradient-btn text-black'
                : 'bg-[#121215] text-gray-300 hover:text-white border border-neutral-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>आकडेवारी व अहवाल</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'gold-gradient-btn text-black'
                : 'bg-[#121215] text-gray-300 hover:text-white border border-neutral-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>सेटिंग्ज व ऑडिट</span>
          </button>
        </div>

        {/* Live KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="p-4 rounded-2xl bg-[#121215] border border-neutral-800 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-gray-400">एकूण नोंदणी</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-white">{totalRegistrations}</span>
              <Users className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121215] border border-neutral-800 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-gray-400">नवीन लीड्स</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-[#F5DE9E]">{newLeads}</span>
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121215] border border-neutral-800 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-gray-400">संपर्क साधलेले</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-blue-400">{contactedLeads}</span>
              <Phone className="w-4 h-4 text-blue-400" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121215] border border-neutral-800 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-gray-400">फ्रँचायझी इच्छुक</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-amber-300">{franchiseApplicants}</span>
              <Award className="w-4 h-4 text-amber-300" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121215] border border-neutral-800 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-gray-400">विद्यार्थी चौकशी</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-purple-400">{studentEnquiries}</span>
              <UserCheck className="w-4 h-4 text-purple-400" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121215] border border-neutral-800 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-gray-400">निश्चित अपॉइंटमेंट</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-emerald-400">{appointmentsConfirmed}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* TAB 1: LEADS & REGISTRATIONS */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="p-4 rounded-2xl bg-[#121215] border border-neutral-800 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="नाव, फोन नंबर, गाव, तालुका किंवा आयडी द्वारे शोधा..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#18181C] border border-neutral-700 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* District Filter */}
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#18181C] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="ALL">सर्व जिल्हे (All Districts)</option>
                {Object.keys(MAHARASHTRA_DISTRICTS).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterLeadStatus}
                onChange={(e) => setFilterLeadStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#18181C] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="ALL">सर्व स्थिती (All Status)</option>
                <option value="New">नवीन (New)</option>
                <option value="Contacted">संपर्क साधलेले (Contacted)</option>
                <option value="Interested">इच्छुक (Interested)</option>
                <option value="Appointment Requested">अपॉइंटमेंट विनंती</option>
                <option value="Appointment Confirmed">अपॉइंटमेंट निश्चित</option>
                <option value="Follow-up Required">फॉलो-अप आवश्यक</option>
                <option value="Converted">कन्व्हर्टेड (Converted)</option>
                <option value="Not Interested">अनुत्सुक</option>
              </select>

              {/* Export Button */}
              <button
                onClick={handleExportCsv}
                className="px-4 py-2 rounded-xl bg-[#18181C] hover:bg-[#222228] border border-[#D4AF37]/30 text-[#F5DE9E] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV / Excel डाउनलोड</span>
              </button>
            </div>

            {/* Registrations Table */}
            <div className="rounded-2xl border border-neutral-800 overflow-hidden bg-[#101013] shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#16161A] text-gray-400 uppercase tracking-wider font-bold border-b border-neutral-800 text-[11px]">
                    <tr>
                      <th className="py-3 px-4">नोंदणी आयडी</th>
                      <th className="py-3 px-4">अर्जदाराचे नाव</th>
                      <th className="py-3 px-4">मोबाईल</th>
                      <th className="py-3 px-4">तालुका / जिल्हा</th>
                      <th className="py-3 px-4">आवड (Interest)</th>
                      <th className="py-3 px-4">स्थिती (Lead Status)</th>
                      <th className="py-3 px-4 text-center">कृती (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-500">
                          कोणतीही नोंदणी आढळली नाही.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((r) => (
                        <tr
                          key={r.id}
                          className="hover:bg-[#151519] transition-colors"
                        >
                          <td className="py-3 px-4 font-mono font-bold text-[#F5DE9E] whitespace-nowrap">
                            {r.id}
                          </td>
                          <td className="py-3 px-4 font-medium text-white">
                            <div>{r.fullName}</div>
                            <span className="text-[10px] text-gray-400">
                              {new Date(r.createdAt).toLocaleDateString('en-IN')}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-mono text-gray-300">{r.mobile}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            <div>{r.taluka}</div>
                            <div className="text-[10px] text-gray-400">{r.district}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1C1C20] border border-neutral-700 text-gray-300">
                              {r.businessInterest === 'centre'
                                ? 'Franchise'
                                : r.businessInterest === 'student'
                                ? 'Student'
                                : 'Both'}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <select
                              value={r.leadStatus}
                              onChange={(e) =>
                                handleStatusChange(r.id, e.target.value as LeadStatus)
                              }
                              className={`px-2 py-1 rounded text-[11px] font-bold border focus:outline-none ${
                                r.leadStatus === 'New'
                                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                                  : r.leadStatus === 'Appointment Confirmed'
                                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                                  : r.leadStatus === 'Contacted'
                                  ? 'bg-blue-950/40 border-blue-500/40 text-blue-300'
                                  : r.leadStatus === 'Interested'
                                  ? 'bg-purple-950/40 border-purple-500/40 text-purple-300'
                                  : 'bg-neutral-900 border-neutral-700 text-gray-300'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Interested">Interested</option>
                              <option value="Appointment Requested">Appointment Requested</option>
                              <option value="Appointment Confirmed">Appointment Confirmed</option>
                              <option value="Follow-up Required">Follow-up Required</option>
                              <option value="Converted">Converted</option>
                              <option value="Not Interested">Not Interested</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Direct Call */}
                              <a
                                href={`tel:${r.mobile}`}
                                className="p-1.5 rounded-lg bg-[#18181C] hover:bg-neutral-800 text-blue-400 border border-neutral-700"
                                title="कॉल करा"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>

                              {/* WhatsApp Chat */}
                              <a
                                href={buildWhatsAppLink(
                                  r.whatsapp || r.mobile,
                                  `नमस्कार ${r.fullName}, आम्ही DPDC SKILL PVT. LTD. मधून आपल्या ब्युटी पार्लर ट्रेनिंग सेंटरच्या नोंदणीबद्दल संपर्क करत आहोत.`
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-[#18181C] hover:bg-neutral-800 text-[#25D366] border border-neutral-700"
                                title="WhatsApp संदेश पाठवा"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>

                              {/* View Details */}
                              <button
                                onClick={() => setSelectedApplicant(r)}
                                className="p-1.5 rounded-lg bg-[#18181C] hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-neutral-700 cursor-pointer"
                                title="संपूर्ण माहिती पहा"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(r.id, r.fullName)}
                                className="p-1.5 rounded-lg bg-[#18181C] hover:bg-red-950/60 text-red-400 border border-neutral-700 cursor-pointer"
                                title="हटवा"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="text-lg font-bold text-white font-heading">
                  सल्लामसलत अपॉइंटमेंट व्यवस्थापन (Consultation Appointments)
                </h3>
                <p className="text-xs text-gray-400">
                  अर्जदारांच्या विनंतीनुसार अपॉइंटमेंट निश्चित करा आणि थेट Google Calendar मध्ये समाविष्ट करा
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {registrations
                .filter((r) => r.appointmentRequested)
                .map((r) => (
                  <div
                    key={r.id}
                    className="gold-card rounded-2xl p-5 flex flex-col justify-between border border-[#D4AF37]/30"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-bold text-[#F5DE9E]">
                          {r.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            r.appointmentStatus === 'confirmed'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {r.appointmentStatus === 'confirmed' ? 'निश्चित (Confirmed)' : 'प्रलंबित (Pending)'}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white mb-1">{r.fullName}</h4>
                      <p className="text-xs text-gray-300 mb-2">
                        {r.taluka}, {r.district} • {r.mobile}
                      </p>

                      <div className="p-3 rounded-xl bg-[#141417] border border-neutral-800 text-xs space-y-1 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">पसंतीची तारीख:</span>
                          <span className="font-semibold text-gray-200">{r.preferredDate || 'नमूद नाही'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">पसंतीची वेळ:</span>
                          <span className="font-semibold text-gray-200">{r.preferredTime}</span>
                        </div>
                        {r.confirmedAppointmentDate && (
                          <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-neutral-800">
                            <span>निश्चित वेळ:</span>
                            <span>{r.confirmedAppointmentDate} ({r.confirmedAppointmentTime})</span>
                          </div>
                        )}
                      </div>

                      {r.questions && (
                        <p className="text-[11px] text-gray-400 italic mb-4">
                          "{r.questions}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-neutral-800">
                      <button
                        onClick={() => {
                          setSchedulingReg(r);
                          setScheduledDate(r.preferredDate || new Date().toISOString().split('T')[0]);
                          setScheduledTime('11:00 AM');
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#F5DE9E] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>अपॉइंटमेंट निश्चित करा</span>
                      </button>

                      <a
                        href={`tel:${r.mobile}`}
                        className="p-2 rounded-xl bg-[#18181C] hover:bg-neutral-800 border border-neutral-700 text-blue-400"
                        title="कॉल करा"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: GOOGLE SHEETS SYNC */}
        {activeTab === 'sheets' && (
          <div className="max-w-3xl space-y-6">
            <div className="pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white font-heading">
                Google Sheets थेट एकत्रीकरण (Direct Integration)
              </h3>
              <p className="text-xs text-gray-400">
                सर्व नोंदणी व लीड डेटा तुमच्या Google Drive मधील Google Sheet मध्ये सुरक्षित सिंक करा
              </p>
            </div>

            <div className="gold-card rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Google Sheets लीड्स रिपोर्टर</h4>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    नोंदणी डेटा Google Sheet मध्ये त्वरित उपलब्ध होतो, जेणेकरून तुमची टीम कॉल सेंटर आणि फील्ड ऑपरेशनसाठी एकाच स्प्रेडशीटवरून थेट काम करू शकते.
                  </p>
                </div>
              </div>

              {sheetSyncMessage && (
                <div
                  className={`p-4 rounded-xl border text-xs ${
                    sheetSyncMessage.success
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                      : 'bg-red-950/50 border-red-500/40 text-red-200'
                  }`}
                >
                  <p className="font-semibold">{sheetSyncMessage.text}</p>
                  {sheetSyncMessage.url && (
                    <a
                      href={sheetSyncMessage.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-[#F5DE9E] underline font-bold"
                    >
                      <span>Google Sheet उघडा (Open Google Spreadsheet)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              <div className="p-4 rounded-2xl bg-[#141417] border border-neutral-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">एकूण लीड्स संख्या:</span>
                  <span className="font-bold text-white">{registrations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">सध्याचे Google Sheet ID:</span>
                  <span className="font-mono text-gray-300">{settings.googleSheetId || 'तयार झालेले नाही'}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSyncToGoogleSheets}
                  disabled={isSyncingSheets}
                  className="gold-gradient-btn px-6 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncingSheets ? 'animate-spin' : ''}`} />
                  <span>
                    {isSyncingSheets ? 'Google Sheets सिंक सुरू आहे...' : 'आताच Google Sheets मध्ये सिंक करा'}
                  </span>
                </button>

                {settings.googleSheetId && (
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${settings.googleSheetId}/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-[#1C1C20] hover:bg-neutral-800 border border-neutral-700 text-xs sm:text-sm font-semibold text-gray-200 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
                    <span>स्प्रेडशीट पहा</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS & REPORTS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white font-heading">
                व्यवसाय विश्लेषण व अहवाल (Business Analytics)
              </h3>
              <p className="text-xs text-gray-400">
                महाराष्ट्रभरातील जिल्ह्यानुसार व तालुक्यानुसार लीड्सचा विस्तार
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Interest Distribution */}
              <div className="gold-card rounded-2xl p-6 border border-neutral-800">
                <h4 className="text-sm font-bold text-white mb-4">स्वारस्य वर्गीकरण (Interest Breakdown)</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">फ्रँचायझी सेंटर सुरू करणे</span>
                      <span className="font-bold text-[#F5DE9E]">
                        {registrations.filter((r) => r.businessInterest === 'centre').length}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-[#D4AF37]"
                        style={{
                          width: `${(registrations.filter((r) => r.businessInterest === 'centre').length / Math.max(registrations.length, 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">दोन्ही (सेंटर व शिकणे)</span>
                      <span className="font-bold text-amber-300">
                        {registrations.filter((r) => r.businessInterest === 'both').length}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-400"
                        style={{
                          width: `${(registrations.filter((r) => r.businessInterest === 'both').length / Math.max(registrations.length, 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">विद्यार्थी प्रवेश (Student Admission)</span>
                      <span className="font-bold text-purple-400">
                        {registrations.filter((r) => r.businessInterest === 'student').length}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{
                          width: `${(registrations.filter((r) => r.businessInterest === 'student').length / Math.max(registrations.length, 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Premises Readiness */}
              <div className="gold-card rounded-2xl p-6 border border-neutral-800">
                <h4 className="text-sm font-bold text-white mb-4">जागेची उपलब्धता (Premises Availability)</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">जागा तयार उपलब्ध आहे (Ready Premises)</span>
                      <span className="font-bold text-emerald-400">
                        {registrations.filter((r) => r.premisesAvailable === 'yes').length}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{
                          width: `${(registrations.filter((r) => r.premisesAvailable === 'yes').length / Math.max(registrations.length, 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">जागेचे नियोजन सुरू आहे (Planning)</span>
                      <span className="font-bold text-blue-400">
                        {registrations.filter((r) => r.premisesAvailable === 'planning').length}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${(registrations.filter((r) => r.premisesAvailable === 'planning').length / Math.max(registrations.length, 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">जागा उपलब्ध नाही (No Premises)</span>
                      <span className="font-bold text-gray-400">
                        {registrations.filter((r) => r.premisesAvailable === 'no').length}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-gray-500"
                        style={{
                          width: `${(registrations.filter((r) => r.premisesAvailable === 'no').length / Math.max(registrations.length, 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS & AUDIT LOG */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Website & Company Settings */}
            <div className="gold-card rounded-2xl p-6 border border-neutral-800 space-y-4">
              <h4 className="text-base font-bold text-white font-heading pb-2 border-b border-neutral-800">
                कंपनी व संपर्क माहिती सेटिंग्ज
              </h4>

              {settingsSaved && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>सेटिंग्ज यशस्वीपणे जतन करण्यात आल्या!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">कंपनीचे नाव</label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#151518] border border-neutral-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">हेल्पलाइन फोन १</label>
                    <input
                      type="text"
                      value={settings.phone1}
                      onChange={(e) => setSettings({ ...settings, phone1: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#151518] border border-neutral-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">हेल्पलाइन फोन २</label>
                    <input
                      type="text"
                      value={settings.phone2}
                      onChange={(e) => setSettings({ ...settings, phone2: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#151518] border border-neutral-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">WhatsApp नंबर</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#151518] border border-neutral-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">कार्यालयीन पत्ता</label>
                  <textarea
                    rows={2}
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#151518] border border-neutral-700 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="gold-gradient-btn px-5 py-2.5 rounded-xl font-bold text-xs"
                >
                  सेटिंग्ज जतन करा
                </button>
              </form>
            </div>

            {/* Audit Logs */}
            <div className="gold-card rounded-2xl p-6 border border-neutral-800 space-y-4">
              <h4 className="text-base font-bold text-white font-heading pb-2 border-b border-neutral-800 flex items-center justify-between">
                <span>सुरक्षा व ऑडिट नोंदी (Audit Logs)</span>
                <span className="text-[11px] font-mono text-gray-400">{auditLogs.length} नोंदी</span>
              </h4>

              <div className="max-h-[420px] overflow-y-auto space-y-2 pr-1 text-xs">
                {auditLogs.length === 0 ? (
                  <p className="text-gray-500 py-6 text-center">कोणत्याही ऑडिट नोंदी नाहीत.</p>
                ) : (
                  auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-[#141417] border border-neutral-800 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#F5DE9E]">{log.action}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(log.timestamp).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300">{log.details}</p>
                      <div className="text-[10px] text-gray-400">कर्ते: {log.user}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Full Applicant Detail View */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#121215] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#F5DE9E] px-2 py-0.5 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/30">
                    {selectedApplicant.id}
                  </span>
                  <span className="text-xs text-gray-400">
                    नोंदणी तारीख: {new Date(selectedApplicant.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white font-heading">
                  {selectedApplicant.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="overflow-y-auto py-5 space-y-6 text-xs sm:text-sm pr-2">
              {/* Quick Contact & Location Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#16161A] border border-neutral-800">
                <div>
                  <span className="text-gray-400 block text-[11px]">मोबाईल:</span>
                  <a
                    href={`tel:${selectedApplicant.mobile}`}
                    className="font-bold text-[#F5DE9E] hover:underline"
                  >
                    {selectedApplicant.mobile}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">व्हॉट्सअ‍ॅप:</span>
                  <a
                    href={buildWhatsAppLink(selectedApplicant.whatsapp || selectedApplicant.mobile, '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#25D366] hover:underline"
                  >
                    {selectedApplicant.whatsapp || selectedApplicant.mobile}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">स्थान (तालुका / जिल्हा):</span>
                  <span className="font-semibold text-white">
                    {selectedApplicant.taluka}, {selectedApplicant.district}
                  </span>
                </div>
              </div>

              {/* Detailed Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#141417] border border-neutral-800 space-y-2">
                  <h4 className="font-bold text-[#D4AF37] pb-1 border-b border-neutral-800">
                    पत्ता व संपर्क माहिती
                  </h4>
                  <div className="flex justify-between">
                    <span className="text-gray-400">गाव / शहर:</span>
                    <span className="text-gray-200">{selectedApplicant.villageCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">पिन कोड:</span>
                    <span className="text-gray-200">{selectedApplicant.pincode}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-gray-400 block mb-0.5">संपूर्ण पत्ता:</span>
                    <p className="text-gray-300 italic">{selectedApplicant.completeAddress || 'नोंदवलेला नाही'}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#141417] border border-neutral-800 space-y-2">
                  <h4 className="font-bold text-[#D4AF37] pb-1 border-b border-neutral-800">
                    व्यवसाय व जागेचा तपशील
                  </h4>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ब्युटी कोर्स पूर्ण?:</span>
                    <span className="text-gray-200 font-semibold">{selectedApplicant.courseStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">शिक्षण (Qualification):</span>
                    <span className="text-gray-200">{selectedApplicant.qualification || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">रुची प्रकार:</span>
                    <span className="text-[#F5DE9E] font-bold">{selectedApplicant.businessInterest}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">जागा उपलब्ध?:</span>
                    <span className="text-gray-200 font-semibold">{selectedApplicant.premisesAvailable}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">जागेचे क्षेत्रफळ:</span>
                    <span className="text-gray-200">{selectedApplicant.premisesSize || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Consultation Details */}
              {selectedApplicant.appointmentRequested && (
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-600/30 space-y-2">
                  <h4 className="font-bold text-[#F5DE9E]">अपॉइंटमेंट विनंती तपशील</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 block">पसंतीची तारीख:</span>
                      <span className="font-semibold text-white">{selectedApplicant.preferredDate || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">पसंतीची वेळ:</span>
                      <span className="font-semibold text-white">{selectedApplicant.preferredTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">सद्य स्थिती:</span>
                      <span className="font-bold text-[#D4AF37]">{selectedApplicant.leadStatus}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Google Calendar:</span>
                      <span className="text-xs text-gray-300">
                        {selectedApplicant.googleCalendarSynced ? 'Synced' : 'Not Synced'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Questions/Notes from Applicant */}
              {selectedApplicant.questions && (
                <div className="p-4 rounded-2xl bg-[#141417] border border-neutral-800">
                  <span className="text-gray-400 block text-xs font-semibold mb-1">
                    अर्जदाराचे प्रश्न / संदेश:
                  </span>
                  <p className="text-gray-200 italic">"{selectedApplicant.questions}"</p>
                </div>
              )}

              {/* Internal Follow-up Notes Log */}
              <div className="space-y-3">
                <h4 className="font-bold text-white flex items-center justify-between">
                  <span>अंतर्गत फॉलो-अप नोट्स (Internal Notes)</span>
                  <span className="text-xs text-gray-400 font-normal">
                    {selectedApplicant.notes?.length || 0} नोट्स
                  </span>
                </h4>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedApplicant.notes && selectedApplicant.notes.length > 0 ? (
                    selectedApplicant.notes.map((n) => (
                      <div key={n.id} className="p-3 rounded-xl bg-[#16161A] border border-neutral-800 text-xs">
                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                          <span className="font-semibold text-[#F5DE9E]">{n.author}</span>
                          <span>{new Date(n.createdAt).toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-gray-200">{n.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic">अद्याप कोणतीही फॉलो-अप नोंद नाही.</p>
                  )}
                </div>

                {/* Add new note input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="फॉलो-अप संभाषण किंवा निर्णय नोंदवा..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#18181C] border border-neutral-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    onClick={() => handleAddNote(selectedApplicant.id)}
                    className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F5DE9E] text-black font-bold text-xs shrink-0 cursor-pointer"
                  >
                    नोंद जोडा
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#18181C] hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-gray-300 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>अर्ज प्रिंट करा</span>
              </button>

              <button
                onClick={() => setSelectedApplicant(null)}
                className="gold-gradient-btn px-6 py-2 rounded-xl text-xs font-bold"
              >
                बंद करा
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Schedule Consultation Appointment */}
      {schedulingReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#121215] border border-[#D4AF37]/50 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-white font-heading">
                अपॉइंटमेंट निश्चित करा (Confirm Appointment)
              </h3>
              <button
                onClick={() => setSchedulingReg(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300 mb-4">
              अर्जदार: <strong className="text-white">{schedulingReg.fullName}</strong> ({schedulingReg.taluka}, {schedulingReg.district})
            </p>

            <form onSubmit={handleConfirmAppointment} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  निश्चित तारीख (Appointment Date) *
                </label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#17171B] border border-neutral-700 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  निश्चित वेळ (Time Slot) *
                </label>
                <input
                  type="text"
                  required
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  placeholder="उदा. 11:00 AM किंवा 03:30 PM"
                  className="w-full px-3 py-2 rounded-xl bg-[#17171B] border border-neutral-700 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  अंतर्गत टीप (Meeting Notes)
                </label>
                <textarea
                  rows={2}
                  value={scheduleNotes}
                  onChange={(e) => setScheduleNotes(e.target.value)}
                  placeholder="सल्लामसलतीचे ठिकाण, फोन किंवा ऑफिस पत्ता..."
                  className="w-full px-3 py-2 rounded-xl bg-[#17171B] border border-neutral-700 text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#18181D] border border-[#D4AF37]/30 text-[11px] text-gray-300">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] inline mr-1" />
                Google खात्याशी जोडलेले असल्यास ही अपॉइंटमेंट थेट Google Calendar मध्ये समाविष्ट होईल.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSchedulingReg(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-gray-300 font-semibold"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="w-1/2 gold-gradient-btn py-2.5 rounded-xl font-bold"
                >
                  निश्चित करा व सेव्ह करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
