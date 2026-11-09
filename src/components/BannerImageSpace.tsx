import React from 'react';
import { Language } from '../types';
import bannerImg from '../assets/banner.png';

interface BannerImageSpaceProps {
  language: Language;
}

export const BannerImageSpace: React.FC<BannerImageSpaceProps> = () => {
  const scrollToForm = () => {
    const el = document.getElementById('registration-section');
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 mb-8 sm:mb-12">
      {/* Pristine, High-Resolution 16:9 Official Poster Showcase */}
      <div
        onClick={scrollToForm}
        className="group relative w-full rounded-2xl md:rounded-3xl border border-[#D4AF37]/45 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] bg-[#0C0C0E] cursor-pointer transition-all duration-300 hover:border-[#D4AF37] hover:shadow-[0_25px_70px_rgba(212,175,55,0.2)]"
        title="नोंदणी फॉर्मवर जाण्यासाठी क्लिक करा (Click to Register)"
      >
        {/* Subtle top gold accent glow line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Clean Image Container preserving full 1672x941 poster without cropping text */}
        <div className="relative w-full aspect-[1672/941] bg-[#070709] flex items-center justify-center overflow-hidden">
          <img
            src={bannerImg}
            alt="DPDC SKILL PVT. LTD. - अधिकृत ब्युटी पार्लर ट्रेनिंग सेंटर पोस्टर"
            className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.01]"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    </div>
  );
};
