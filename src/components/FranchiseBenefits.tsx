import React from 'react';
import {
  FileCheck2,
  Sparkles,
  Megaphone,
  Briefcase,
  GraduationCap,
  Store,
  AlertCircle,
  KeyRound,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FranchiseBenefitsProps {
  language: Language;
}

export const FranchiseBenefits: React.FC<FranchiseBenefitsProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  return (
    <section id="benefits" className="py-16 md:py-24 bg-[#0B0B0D] relative border-t border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-bold text-[#F5DE9E] uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>DPDC SKILL FRANCHISE ADVANTAGES</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-heading tracking-tight mb-4">
            {t.benefits.title}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {t.benefits.subtitle}
          </p>
        </div>

        {/* 6 Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {/* Card 1: Official Financial & Franchise Terms */}
          <div className="gold-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#202024] to-[#121214] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-5 shadow-lg">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-heading">
                {t.benefits.card1Title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t.benefits.card1Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4" />
              <span>१००% पारदर्शक व कायदेशीर करार</span>
            </div>
          </div>

          {/* Card 2: Centre Setup & Materials */}
          <div className="gold-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#202024] to-[#121214] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-5 shadow-lg">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-heading">
                {t.benefits.card2Title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t.benefits.card2Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
              <KeyRound className="w-4 h-4" />
              <span>रेडी-टू-स्टार्ट सेंटर डिझाइन</span>
            </div>
          </div>

          {/* Card 3: 40-50% Marketing Support */}
          <div className="gold-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#202024] to-[#121214] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-5 shadow-lg">
                <Megaphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-heading">
                {t.benefits.card3Title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t.benefits.card3Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
              <span>स्थानिक विद्यार्थी प्रवेश वाढीसाठी विशेष प्रचार</span>
            </div>
          </div>

          {/* Card 4: Student Kits */}
          <div className="gold-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#202024] to-[#121214] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-5 shadow-lg">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-heading">
                {t.benefits.card4Title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t.benefits.card4Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4" />
              <span>प्रमाणित कॉस्मेटिक्स आणि प्रॅक्टिकल टूल्स</span>
            </div>
          </div>

          {/* Card 5: Recognized Certificates */}
          <div className="gold-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#202024] to-[#121214] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-5 shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-heading">
                {t.benefits.card5Title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t.benefits.card5Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
              <FileCheck2 className="w-4 h-4" />
              <span>अधिकृत सरकारी व संस्थात्मक मान्यता</span>
            </div>
          </div>

          {/* Card 6: Operations & Guidance */}
          <div className="gold-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#202024] to-[#121214] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-5 shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-heading">
                {t.benefits.card6Title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t.benefits.card6Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
              <span>सतत ट्रेनर मार्गदर्शन आणि बिझनेस ग्रोथ</span>
            </div>
          </div>
        </div>

        {/* Partner Responsibilities Section */}
        <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#161619] via-[#101012] to-[#0A0A0C] border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 blur-[80px] pointer-events-none rounded-full" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-neutral-800">
              <div>
                <h3 className="text-xl sm:text-3xl font-black text-white font-heading">
                  {t.benefits.partnerTitle}
                </h3>
                <p className="text-sm sm:text-base text-gray-300 mt-1">
                  {t.benefits.partnerSubtitle}
                </p>
              </div>
              <div className="shrink-0 px-4 py-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-xs sm:text-sm font-bold text-[#F5DE9E]">
                स्पष्ट व पारदर्शक नियमावली
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#0F0F12] border border-neutral-800 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-sm shrink-0">
                  १
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">योग्य व्यावसायिक जागा</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {t.benefits.partnerResp1}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F0F12] border border-neutral-800 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-sm shrink-0">
                  २
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">मासिक भाडे व व्यवस्थापन खर्च</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {t.benefits.partnerResp2}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F0F12] border border-neutral-800 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-sm shrink-0">
                  ३
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">दैनंदिन केंद्र संचालन</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {t.benefits.partnerResp3}
                  </p>
                </div>
              </div>
            </div>

            {/* Compliance Disclaimer Box */}
            <div className="mt-8 p-4 rounded-xl bg-[#1A1A1E]/80 border border-amber-600/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#F5DE9E] shrink-0 mt-0.5" />
              <p className="text-xs text-gray-300 leading-relaxed">
                {t.benefits.complianceNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
