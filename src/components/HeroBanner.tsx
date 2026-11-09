import React from 'react';
import { Sparkles, CheckCircle2, Award, Building2, TrendingUp, ArrowDown } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeroBannerProps {
  language: Language;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  const scrollToRegistration = () => {
    const el = document.getElementById('registration');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBenefits = () => {
    const el = document.getElementById('benefits');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative pt-6 pb-16 md:pt-10 md:pb-24 overflow-hidden">
      {/* Background radial gold glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#D4AF37]/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-[#F5DE9E]/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Announcement Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18181A] border border-[#D4AF37]/40 shadow-[0_2px_15px_rgba(212,175,55,0.15)] text-xs sm:text-sm font-semibold text-[#F5DE9E]">
            <Sparkles className="w-4 h-4 text-[#D4AF37] animate-spin" style={{ animationDuration: '6s' }} />
            <span>{t.hero.badge}</span>
          </div>
        </div>

        {/* 16:9 Styled Hero Banner Card */}
        <div className="relative rounded-2xl md:rounded-3xl border border-[#D4AF37]/35 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-gradient-to-b from-[#141416] via-[#0E0E10] to-[#080808]">
          {/* Subtle Golden Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)`,
              backgroundSize: '28px 28px',
            }}
          />

          {/* Top Gold Accent Line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

          <div className="p-6 sm:p-10 md:p-14 lg:p-16 flex flex-col items-center text-center">
            {/* Official Company Seal Badge */}
            <div className="flex items-center gap-2 mb-4 px-3.5 py-1 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-bold text-[#F5DE9E] uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>DPDC SKILL PVT. LTD. • अधिकृत नोंदणी पोर्टल</span>
            </div>

            {/* Main Marathi Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.2] max-w-4xl font-heading mb-6">
              {t.hero.headline.split('ब्युटी पार्लर ट्रेनिंग सेंटर').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="gold-gradient-text block sm:inline">
                      ब्युटी पार्लर ट्रेनिंग सेंटर
                    </span>
                  )}
                </React.Fragment>
              ))}
            </h1>

            {/* Supporting Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-[#D8D2C5] max-w-3xl leading-relaxed mb-8 font-normal">
              {t.hero.subheadline}
            </p>

            {/* 4 Feature Badges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl mb-10 text-left">
              <div className="p-3.5 rounded-xl bg-[#141417]/80 border border-[#D4AF37]/25 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-gray-200">
                  {t.hero.feature1}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#141417]/80 border border-[#D4AF37]/25 flex items-start gap-2.5">
                <TrendingUp className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-gray-200">
                  {t.hero.feature2}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#141417]/80 border border-[#D4AF37]/25 flex items-start gap-2.5">
                <Building2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-gray-200">
                  {t.hero.feature3}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#141417]/80 border border-[#D4AF37]/25 flex items-start gap-2.5">
                <Award className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-gray-200">
                  {t.hero.feature4}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={scrollToRegistration}
                className="w-full sm:w-auto gold-gradient-btn px-8 py-4 rounded-xl text-base sm:text-lg font-black flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-5 h-5" />
                <span>{t.hero.ctaRegister}</span>
              </button>

              <button
                onClick={scrollToBenefits}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#17171A] hover:bg-[#222226] border border-[#D4AF37]/40 text-sm sm:text-base font-semibold text-[#F5DE9E] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.hero.ctaExplore}</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="gold-card rounded-2xl p-5 text-center">
            <div className="text-2xl sm:text-3xl font-black text-[#F5DE9E] font-heading">
              {t.stats.stat1Value}
            </div>
            <div className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
              {t.stats.stat1Label}
            </div>
          </div>
          <div className="gold-card rounded-2xl p-5 text-center">
            <div className="text-2xl sm:text-3xl font-black text-[#F5DE9E] font-heading">
              {t.stats.stat2Value}
            </div>
            <div className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
              {t.stats.stat2Label}
            </div>
          </div>
          <div className="gold-card rounded-2xl p-5 text-center">
            <div className="text-2xl sm:text-3xl font-black text-[#F5DE9E] font-heading">
              {t.stats.stat3Value}
            </div>
            <div className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
              {t.stats.stat3Label}
            </div>
          </div>
          <div className="gold-card rounded-2xl p-5 text-center">
            <div className="text-2xl sm:text-3xl font-black text-[#F5DE9E] font-heading">
              {t.stats.stat4Value}
            </div>
            <div className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
              {t.stats.stat4Label}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
