import React, { useState } from 'react';
import { Menu, X, ShieldCheck, PhoneCall, Sparkles, Globe } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import logoImg from '../assets/logo.png';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#080808]/90 backdrop-blur-md border-b border-[#D4AF37]/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Official Metallic Gold Logo Emblem */}
            <div className="relative w-12 h-12 rounded-full p-[1.5px] bg-gradient-to-br from-[#D4AF37] via-[#F5DE9E] to-[#AA820A] shadow-[0_0_20px_rgba(212,175,55,0.35)] flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden">
              <img
                src={logoImg}
                alt="DPDC SKILL PVT. LTD. Official Logo"
                className="w-full h-full object-cover rounded-full bg-black"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 font-heading">
                DPDC <span className="gold-gradient-text">SKILL</span>
                <span className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border border-[#D4AF37]/40 bg-[#D4AF37]/10 ml-1">
                  PVT. LTD.
                </span>
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#C5A059] font-semibold uppercase">
                BUILD • TRAIN • GROW
              </span>
            </div>
          </div>

          {/* Desktop Clean Tagline & Registration Focus */}
          <div className="hidden md:flex items-center gap-3 text-xs text-[#F5DE9E]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-semibold tracking-wide">
              {language === 'mr'
                ? 'अधिकृत ब्युटी पार्लर ट्रेनिंग व फ्रँचायझी नोंदणी'
                : language === 'hi'
                ? 'आधिकारिक ब्यूटी पार्लर ट्रेनिंग व फ्रेंचाइजी पंजीकरण'
                : 'Official Beauty Training & Franchise Registration'}
            </span>
          </div>

          {/* Right Action Bar: Language switch + Call/Register CTA + Admin portal */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center rounded-lg bg-[#141416] border border-[#D4AF37]/30 p-0.5 text-xs font-semibold text-gray-300">
              <Globe className="w-3.5 h-3.5 ml-2 mr-1 text-[#D4AF37]" />
              <button
                onClick={() => onLanguageChange('mr')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'mr'
                    ? 'bg-[#D4AF37] text-black font-bold shadow'
                    : 'hover:text-white'
                }`}
              >
                मराठी
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'hi'
                    ? 'bg-[#D4AF37] text-black font-bold shadow'
                    : 'hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'en'
                    ? 'bg-[#D4AF37] text-black font-bold shadow'
                    : 'hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Primary Registration CTA */}
            <button
              onClick={() => scrollToSection('registration-section')}
              className="gold-gradient-btn px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.hero.ctaRegister}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            {/* Mini Language Switch on Mobile */}
            <div className="flex items-center bg-[#141416] border border-[#D4AF37]/30 rounded p-0.5 text-[11px] font-bold">
              <button
                onClick={() => onLanguageChange(language === 'mr' ? 'hi' : language === 'hi' ? 'en' : 'mr')}
                className="px-1.5 py-0.5 text-[#F5DE9E]"
              >
                {language.toUpperCase()}
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-neutral-900 border border-neutral-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0A0A0C] border-b border-[#D4AF37]/30 px-5 pt-3 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top-4">
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#141416] rounded-lg border border-neutral-800 text-xs text-center font-bold">
            <button
              onClick={() => onLanguageChange('mr')}
              className={`py-1.5 rounded ${language === 'mr' ? 'bg-[#D4AF37] text-black' : 'text-gray-300'}`}
            >
              मराठी
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`py-1.5 rounded ${language === 'hi' ? 'bg-[#D4AF37] text-black' : 'text-gray-300'}`}
            >
              हिंदी
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`py-1.5 rounded ${language === 'en' ? 'bg-[#D4AF37] text-black' : 'text-gray-300'}`}
            >
              English
            </button>
          </div>

          <div className="flex flex-col space-y-3 text-base font-medium text-[#E5E0D8]">
            <button
              onClick={() => scrollToSection('registration-section')}
              className="text-left py-1.5 text-[#F5DE9E] font-bold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>मोफत नोंदणी फॉर्म (Registration Form)</span>
            </button>
          </div>

          <div className="pt-2 border-t border-neutral-800 flex flex-col gap-2">
            <button
              onClick={() => scrollToSection('registration-section')}
              className="w-full gold-gradient-btn py-3 rounded-lg text-center font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {t.hero.ctaRegister}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
