import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  User,
  MapPin,
  GraduationCap,
  Store,
  AlertCircle,
  Share2,
  Printer,
  RotateCcw,
  Check,
} from 'lucide-react';
import {
  Language,
  Registration,
  CourseStatus,
  BusinessInterest,
  PremisesStatus,
} from '../types';
import { TRANSLATIONS } from '../data/translations';
import { MAHARASHTRA_DISTRICTS } from '../data/maharashtra';
import {
  isValidIndianMobile,
  isValidPincode,
  generateRegistrationId,
  buildWhatsAppLink,
} from '../utils/validation';
import { StorageService } from '../services/storage';
import { SuccessAnimation } from './SuccessAnimation';

interface RegistrationFormProps {
  language: Language;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  language,
  onOpenPrivacy,
}) => {
  const t = TRANSLATIONS[language];

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRegistration, setSubmittedRegistration] = useState<Registration | null>(null);

  // Clean, focused form state without email or extraneous text boxes
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    sameAsMobile: true,
    whatsapp: '',
    villageCity: '',
    district: 'Pune',
    taluka: 'Baramati',
    state: 'Maharashtra',
    pincode: '',
    courseStatus: 'completed' as CourseStatus,
    businessInterest: 'centre' as BusinessInterest,
    premisesAvailable: 'yes' as PremisesStatus,
    consentContact: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDistrictChange = (dist: string) => {
    const talukas = MAHARASHTRA_DISTRICTS[dist] || [];
    setFormData((prev) => ({
      ...prev,
      district: dist,
      taluka: talukas[0] || '',
    }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      errs.fullName = language === 'mr' ? 'कृपया आपले पूर्ण नाव प्रविष्ट करा.' : 'Please enter your full name.';
    }

    if (!isValidIndianMobile(formData.mobile)) {
      errs.mobile = language === 'mr' ? 'कृपया वैध १० अंकी मोबाईल नंबर प्रविष्ट करा.' : 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.sameAsMobile && formData.whatsapp && !isValidIndianMobile(formData.whatsapp)) {
      errs.whatsapp = language === 'mr' ? 'कृपया वैध १० अंकी व्हॉट्सअ‍ॅप नंबर प्रविष्ट करा.' : 'Please enter a valid WhatsApp number.';
    }

    if (!formData.villageCity.trim()) {
      errs.villageCity = language === 'mr' ? 'गाव किंवा शहराचे नाव आवश्यक आहे.' : 'Village or city is required.';
    }

    if (!formData.taluka.trim()) {
      errs.taluka = language === 'mr' ? 'तालुका निवडणे आवश्यक आहे.' : 'Taluka is required.';
    }

    if (!isValidPincode(formData.pincode)) {
      errs.pincode = language === 'mr' ? 'कृपया वैध ६ अंकी पिन कोड प्रविष्ट करा.' : 'Please enter a valid 6-digit PIN code.';
    }

    if (!formData.consentContact) {
      errs.consentContact = language === 'mr' ? 'नोंदणीसाठी कृपया संमती चेकबॉक्स निवडा.' : 'Please agree to the consent checkbox to register.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const regId = generateRegistrationId();
      const cleanMobile = formData.mobile.replace(/\D/g, '');
      const cleanWhatsApp = formData.sameAsMobile
        ? cleanMobile
        : formData.whatsapp.replace(/\D/g, '') || cleanMobile;

      const newRegistration: Registration = {
        id: regId,
        fullName: formData.fullName.trim(),
        mobile: cleanMobile,
        whatsapp: cleanWhatsApp,
        villageCity: formData.villageCity.trim(),
        taluka: formData.taluka.trim(),
        district: formData.district,
        state: formData.state,
        pincode: formData.pincode.trim(),
        courseStatus: formData.courseStatus,
        businessInterest: formData.businessInterest,
        premisesAvailable: formData.premisesAvailable,
        appointmentRequested: true,
        consentContact: formData.consentContact,
        consentMarketing: true,
        leadStatus: 'New',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        googleSheetsSynced: false,
        notes: [],
        history: [
          {
            id: `h_${Date.now()}`,
            fromStatus: 'New',
            toStatus: 'New',
            changedBy: 'Registration Form',
            timestamp: new Date().toISOString(),
            note: 'Lead submitted via direct form.',
          },
        ],
      };

      StorageService.saveRegistration(newRegistration);

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F5DE9E', '#E6C665', '#ffffff'],
      });

      setSubmittedRegistration(newRegistration);

      setTimeout(() => {
        const el = document.getElementById('registration-section');
        if (el) {
          const yOffset = -110;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error('Registration submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedRegistration(null);
    setFormData({
      fullName: '',
      mobile: '',
      sameAsMobile: true,
      whatsapp: '',
      villageCity: '',
      district: 'Pune',
      taluka: 'Baramati',
      state: 'Maharashtra',
      pincode: '',
      courseStatus: 'completed',
      businessInterest: 'centre',
      premisesAvailable: 'yes',
      consentContact: false,
    });
    setErrors({});
  };

  const availableTalukas = MAHARASHTRA_DISTRICTS[formData.district] || [];

  return (
    <section id="registration-section" className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-16 scroll-mt-28">
      {/* If Submitted: Beautiful Confirmation Card */}
      {submittedRegistration ? (
        <div className="gold-card rounded-3xl p-6 sm:p-10 pt-10 sm:pt-12 text-center relative overflow-hidden shadow-2xl border border-[#D4AF37]/50 animate-in zoom-in-95 duration-300">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#F5DE9E] to-[#D4AF37]" />

          <SuccessAnimation className="mb-6 py-2" />

          <h3 className="text-2xl sm:text-3xl font-black text-white font-heading mb-2">
            {t.form.successTitle}
          </h3>

          <p className="text-gray-200 text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
            {t.form.successMessage}
          </p>

          <div className="max-w-md mx-auto p-5 rounded-2xl bg-[#141417] border border-[#D4AF37]/40 mb-8 text-left">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {t.form.regIdLabel}
              </span>
              <span className="font-mono text-base sm:text-lg font-black text-[#F5DE9E] tracking-wider">
                {submittedRegistration.id}
              </span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">नाव:</span>
                <span className="font-bold text-white text-right">{submittedRegistration.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">मोबाईल:</span>
                <span className="font-medium text-gray-200">{submittedRegistration.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">गाव / तालुका:</span>
                <span className="font-medium text-gray-200 text-right">
                  {submittedRegistration.villageCity}, {submittedRegistration.taluka} ({submittedRegistration.district})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">आवड:</span>
                <span className="font-bold text-[#F5DE9E] text-right">
                  {submittedRegistration.businessInterest === 'centre'
                    ? 'DPDC Training Centre'
                    : submittedRegistration.businessInterest === 'student'
                    ? 'Student Admission'
                    : 'Centre & Learning'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 no-print">
            <a
              href={buildWhatsAppLink(
                submittedRegistration.mobile,
                `नमस्कार, मी DPDC SKILL PVT. LTD. नोंदणी पूर्ण केली आहे. माझा नोंदणी क्रमांक ${submittedRegistration.id} आहे.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <Share2 className="w-4 h-4" />
              <span>{t.form.shareWhatsApp}</span>
            </a>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1C1C20] hover:bg-[#282830] border border-[#D4AF37]/40 text-[#F5DE9E] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t.form.printSlip}</span>
            </button>

            <button
              onClick={handleResetForm}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-transparent hover:bg-neutral-900 border border-neutral-700 text-gray-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.form.newRegistration}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Clean, Clear, Streamlined Registration Form */
        <div className="gold-card rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl border border-[#D4AF37]/35">
          {/* Header */}
          <div className="text-center mb-8 pb-4 border-b border-neutral-800">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-xs font-bold text-[#F5DE9E] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>DPDC SKILL • मोफत नोंदणी फॉर्म</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white font-heading tracking-tight">
              ब्युटी पार्लर ट्रेनिंग सेंटर व प्रवेश नोंदणी
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              खालील आवश्यक माहिती भरा. आमची टीम आपल्याशी २४ तासांत संपर्क करेल.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* 1. Full Name */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#D4AF37]" />
                <span>पूर्ण नाव (Full Name) *</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="उदा. अनिता सचिन शिंदे"
                className={`w-full px-4 py-3 rounded-xl bg-[#131316] border ${
                  errors.fullName ? 'border-red-500' : 'border-[#D4AF37]/30'
                } text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] text-sm`}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* 2. Mobile & WhatsApp Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mobile */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1.5">
                  मोबाईल नंबर (Mobile Number) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-xs text-gray-400 font-bold">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mobile: e.target.value.replace(/\D/g, '').slice(0, 10),
                      })
                    }
                    placeholder="१० अंकी मोबाईल नंबर"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-[#131316] border ${
                      errors.mobile ? 'border-red-500' : 'border-[#D4AF37]/30'
                    } text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] text-sm`}
                  />
                </div>
                {errors.mobile && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.mobile}
                  </p>
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-gray-200">
                    व्हॉट्सअ‍ॅप नंबर (WhatsApp)
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sameAsMobile}
                      onChange={(e) =>
                        setFormData({ ...formData, sameAsMobile: e.target.checked })
                      }
                      className="rounded border-neutral-700 text-[#D4AF37] focus:ring-0"
                    />
                    <span>हाच व्हॉट्सअ‍ॅप नंबर आहे</span>
                  </label>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-xs text-gray-400 font-bold">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    disabled={formData.sameAsMobile}
                    value={formData.sameAsMobile ? formData.mobile : formData.whatsapp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whatsapp: e.target.value.replace(/\D/g, '').slice(0, 10),
                      })
                    }
                    placeholder="व्हॉट्सअ‍ॅप नंबर"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-[#131316] border ${
                      errors.whatsapp ? 'border-red-500' : 'border-[#D4AF37]/30'
                    } text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] text-sm disabled:opacity-60 disabled:cursor-not-allowed`}
                  />
                </div>
                {errors.whatsapp && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.whatsapp}
                  </p>
                )}
              </div>
            </div>

            {/* 3. District, Taluka & Village */}
            <div className="p-4 rounded-2xl bg-[#121215] border border-neutral-800 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#F5DE9E]">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>पत्ता व ठिकाण (Location) *</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* District */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    जिल्हा (District) *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#D4AF37]/30 text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    {Object.keys(MAHARASHTRA_DISTRICTS).map((d) => (
                      <option key={d} value={d} className="bg-[#141416] text-white">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Taluka */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    तालुका (Taluka) *
                  </label>
                  <select
                    value={formData.taluka}
                    onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#D4AF37]/30 text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    {availableTalukas.map((t) => (
                      <option key={t} value={t} className="bg-[#141416] text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.taluka && (
                    <p className="mt-1 text-xs text-red-400">{errors.taluka}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Village / City */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    गाव किंवा शहर (Village / City) *
                  </label>
                  <input
                    type="text"
                    value={formData.villageCity}
                    onChange={(e) => setFormData({ ...formData, villageCity: e.target.value })}
                    placeholder="आपल्या गावाचे / शहराचे नाव"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border ${
                      errors.villageCity ? 'border-red-500' : 'border-[#D4AF37]/30'
                    } text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37]`}
                  />
                  {errors.villageCity && (
                    <p className="mt-1 text-xs text-red-400">{errors.villageCity}</p>
                  )}
                </div>

                {/* PIN Code */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    पिन कोड (PIN Code) *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pincode: e.target.value.replace(/\D/g, '').slice(0, 6),
                      })
                    }
                    placeholder="६ अंकी पिन कोड"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border ${
                      errors.pincode ? 'border-red-500' : 'border-[#D4AF37]/30'
                    } text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37]`}
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-xs text-red-400">{errors.pincode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Course Status Radio Options */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
                <span>आपण यापूर्वी ब्युटी पार्लर कोर्स केला आहे का? *</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'completed', label: 'होय, केला आहे' },
                  { id: 'learning', label: 'सध्या शिकत आहे' },
                  { id: 'not_completed', label: 'केलेला नाही' },
                  { id: 'interested', label: 'शिकण्याची इच्छा' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                      formData.courseStatus === item.id
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white font-bold'
                        : 'bg-[#131316] border-neutral-800 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="courseStatus"
                      value={item.id}
                      checked={formData.courseStatus === item.id}
                      onChange={() =>
                        setFormData({ ...formData, courseStatus: item.id as CourseStatus })
                      }
                      className="text-[#D4AF37] focus:ring-0"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 5. Business Interest Options */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-2 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-[#D4AF37]" />
                <span>आपण कशामध्ये उत्सुक आहात? *</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'centre', label: 'DPDC ट्रेनिंग सेंटर सुरू करणे' },
                  { id: 'student', label: 'विद्यार्थी म्हणून शिकणे' },
                  { id: 'both', label: 'दोन्ही (सेंटर व शिकणे)' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                      formData.businessInterest === item.id
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white font-bold'
                        : 'bg-[#131316] border-neutral-800 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="businessInterest"
                      value={item.id}
                      checked={formData.businessInterest === item.id}
                      onChange={() =>
                        setFormData({ ...formData, businessInterest: item.id as BusinessInterest })
                      }
                      className="text-[#D4AF37] focus:ring-0"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 6. Premises Status */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-2">
                सेंटरसाठी जागा उपलब्ध आहे का? *
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'yes', label: 'होय, जागा आहे' },
                  { id: 'planning', label: 'शोधत आहोत' },
                  { id: 'no', label: 'नाही' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      formData.premisesAvailable === item.id
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white font-bold'
                        : 'bg-[#131316] border-neutral-800 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="premisesAvailable"
                      value={item.id}
                      checked={formData.premisesAvailable === item.id}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          premisesAvailable: item.id as PremisesStatus,
                        })
                      }
                      className="text-[#D4AF37] focus:ring-0"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 7. DPDP Consent Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#121215] border border-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentContact}
                  onChange={(e) =>
                    setFormData({ ...formData, consentContact: e.target.checked })
                  }
                  className="mt-0.5 rounded border-neutral-700 text-[#D4AF37] focus:ring-0"
                />
                <span className="text-xs text-gray-300 leading-relaxed">
                  मी दिलेली माहिती DPDC SKILL PVT. LTD. कडून माझ्याशी संपर्क साधण्यासाठी व नोंदणी प्रक्रियेसाठी वापरण्यास संमती देतो / देते.{' '}
                  <button
                    type="button"
                    onClick={onOpenPrivacy}
                    className="text-[#F5DE9E] underline hover:text-white"
                  >
                    (गोपनीयता धोरण)
                  </button>
                </span>
              </label>
              {errors.consentContact && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.consentContact}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full gold-gradient-btn py-3.5 rounded-xl text-sm sm:text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-xl transition-all"
              >
                {isSubmitting ? (
                  <span>प्रक्रिया सुरू आहे...</span>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>आजच मोफत नोंदणी करा (Submit Registration)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};
