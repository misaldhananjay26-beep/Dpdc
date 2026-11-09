import React from 'react';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import logoImg from '../assets/logo.png';

interface FooterProps {
  language: Language;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAdmin,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <footer className="bg-[#050506] border-t border-[#D4AF37]/20 py-12 text-gray-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-800">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={logoImg}
                alt="DPDC SKILL Logo"
                className="w-10 h-10 rounded-full border border-[#D4AF37]/50 shadow-[0_0_12px_rgba(212,175,55,0.3)] object-cover bg-black"
              />
              <div className="flex flex-col text-left">
                <span className="font-heading font-black text-white text-base sm:text-lg tracking-tight">
                  DPDC <span className="gold-gradient-text">SKILL</span> PVT. LTD.
                </span>
                <span className="text-[10px] text-[#D4AF37] font-semibold tracking-widest uppercase">
                  BUILD • TRAIN • GROW
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 max-w-sm">
              Professional Beauty Education & Skill Development for Maharashtra
            </p>
          </div>

          {/* Quick links & Policies */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-300">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-[#F5DE9E] underline underline-offset-4 transition-colors cursor-pointer"
            >
              {t.footer.privacy}
            </button>
            <button
              onClick={onOpenTerms}
              className="hover:text-[#F5DE9E] underline underline-offset-4 transition-colors cursor-pointer"
            >
              {t.footer.terms}
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} DPDC SKILL PVT. LTD. {t.footer.rights}</p>
          <p className="flex items-center gap-1 text-[11px]">
            कौशल्य विकास आणि महिला सक्षमीकरणासाठी कटिबद्ध
          </p>
        </div>
      </div>
    </footer>
  );
};
