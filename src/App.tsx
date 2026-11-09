import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { Navbar } from './components/Navbar';
import { BannerImageSpace } from './components/BannerImageSpace';
import { RegistrationForm } from './components/RegistrationForm';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { PrivacyPolicyModal } from './components/Modals/PrivacyPolicyModal';
import { TermsConditionsModal } from './components/Modals/TermsConditionsModal';
import { StorageService } from './services/storage';
import { initAuth } from './services/firebaseAuth';
import { MessageSquare, Phone } from 'lucide-react';
import { buildWhatsAppLink } from './utils/validation';

export default function App() {
  const [language, setLanguage] = useState<Language>('mr');
  const [view, setView] = useState<'website' | 'admin_login' | 'admin_dashboard'>('website');

  // Modals
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  // Admin Session
  const [adminEmail, setAdminEmail] = useState<string>('dhananjay@dpdc.admin');
  const [adminToken, setAdminToken] = useState<string | undefined>(undefined);

  // Check URL query parameters and existing admin session on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const existingSession = StorageService.getAdminSession();
    const isAdminRequested =
      urlParams.get('admin') === '1' ||
      urlParams.get('admin') === 'dpdc' ||
      urlParams.get('portal') === 'admin' ||
      window.location.pathname.startsWith('/admin');

    if (existingSession?.loggedIn) {
      setAdminEmail(existingSession.email);
      setAdminToken(existingSession.token);
      if (isAdminRequested) {
        setView('admin_dashboard');
      }
    } else if (isAdminRequested) {
      setView('admin_login');
    }

    initAuth(
      (user, token) => {
        setAdminToken(token);
        if (user.email) {
          setAdminEmail(user.email);
        }
      },
      () => {
        // Unauthenticated
      }
    );

    // Secure owner keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleOpenAdmin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenAdmin = () => {
    const session = StorageService.getAdminSession();
    if (session?.loggedIn) {
      setAdminEmail(session.email);
      setAdminToken(session.token);
      setView('admin_dashboard');
    } else {
      setView('admin_login');
    }
  };

  const handleAdminLoginSuccess = (session: { email: string; token?: string }) => {
    setAdminEmail(session.email);
    setAdminToken(session.token);
    setView('admin_dashboard');
  };

  const handleAdminLogout = () => {
    StorageService.clearAdminSession();
    setAdminToken(undefined);
    setView('website');
  };

  const settings = StorageService.getSettings();

  return (
    <div className="min-h-screen bg-[#080808] text-[#FDFBF7] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#F5DE9E]">
      {view === 'admin_dashboard' ? (
        <AdminDashboard
          adminEmail={adminEmail}
          adminToken={adminToken}
          onLogout={handleAdminLogout}
          onViewWebsite={() => setView('website')}
        />
      ) : view === 'admin_login' ? (
        <AdminLogin
          onSuccess={handleAdminLoginSuccess}
          onBackToHome={() => setView('website')}
        />
      ) : (
        /* Public Facing Clean Form & Image Space View */
        <div className="flex-1 flex flex-col">
          <Navbar
            language={language}
            onLanguageChange={setLanguage}
            onOpenAdmin={handleOpenAdmin}
          />

          <main className="flex-1 pt-6 sm:pt-8">
            {/* 1. Dedicated Image Space (User's Photo / Poster) */}
            <BannerImageSpace language={language} />

            {/* 2. Clean & Clear Registration Form (No Email, No Fluff Text) */}
            <RegistrationForm
              language={language}
              onOpenPrivacy={() => setPrivacyOpen(true)}
              onOpenTerms={() => setTermsOpen(true)}
            />
          </main>

          <Footer
            language={language}
            onOpenPrivacy={() => setPrivacyOpen(true)}
            onOpenTerms={() => setTermsOpen(true)}
            onOpenAdmin={handleOpenAdmin}
          />

          {/* Floating WhatsApp and Call Action Bubble on Mobile */}
          <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5 sm:hidden no-print">
            <a
              href={buildWhatsAppLink(
                settings.whatsappNumber,
                'नमस्कार, मला DPDC SKILL ब्युटी पार्लर ट्रेनिंग सेंटर सुरू करण्याबाबत माहिती हवी आहे.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl border-2 border-white/20 active:scale-95 transition-transform"
              aria-label="Chat on WhatsApp"
            >
              <MessageSquare className="w-6 h-6" />
            </a>
            <a
              href={`tel:${settings.phone1}`}
              className="w-12 h-12 rounded-full gold-gradient-btn flex items-center justify-center shadow-2xl border-2 border-black/20 active:scale-95 transition-transform"
              aria-label="Call Helpline"
            >
              <Phone className="w-5 h-5 text-black" />
            </a>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsConditionsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  );
}
