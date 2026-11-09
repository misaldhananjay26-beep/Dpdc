import React from 'react';
import { Sparkles, BookOpen, Clock, Award, Scissors, Palette, HeartHandshake } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface CourseCurriculumProps {
  language: Language;
}

export const CourseCurriculum: React.FC<CourseCurriculumProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  return (
    <section id="courses" className="py-16 md:py-24 bg-[#080808] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-bold text-[#F5DE9E] uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>DPDC SKILL ACADEMY COURSES</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-heading tracking-tight mb-4">
            {t.courses.title}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {t.courses.subtitle}
          </p>
        </div>

        {/* 3 Main Courses */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {/* Course 1 */}
          <div className="gold-card rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:border-[#D4AF37]/60 group">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-bold text-[#F5DE9E]">
                  {t.courses.course1Tag}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> ३ ते ६ महिने
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#1C1C20] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-105 transition-transform">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-heading">
                {t.courses.course1Title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                {t.courses.course1Desc}
              </p>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> मूलभूत व अॅडव्हान्स स्किन केअर
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> हेअर स्पा, स्टायलिंग व कटिंग
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> सलोन स्वच्छता व क्लायंट हॅन्डलींग
                </li>
              </ul>
            </div>
            <div className="p-4 bg-[#111114] border-t border-neutral-800 flex items-center justify-between text-xs font-bold text-[#F5DE9E]">
              <span>व्यावसायिक किट समाविष्ट</span>
              <Award className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>

          {/* Course 2 */}
          <div className="gold-card rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:border-[#D4AF37]/60 group border-[#D4AF37]/40">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-[#D4AF37] text-black text-xs font-bold shadow">
                  {t.courses.course2Tag}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> २ महिने
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#1C1C20] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-105 transition-transform">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-heading">
                {t.courses.course2Title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                {t.courses.course2Desc}
              </p>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> एचडी व सिलिकॉन ब्रायडल मेकअप
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> महाराष्ट्रीयन, वेस्टर्न व रिसेप्शन लूक
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> साडी ड्रेपिंग व हेअर डिझायनिंग
                </li>
              </ul>
            </div>
            <div className="p-4 bg-[#111114] border-t border-neutral-800 flex items-center justify-between text-xs font-bold text-[#F5DE9E]">
              <span>हाय-स्पीड करिअर संधी</span>
              <Award className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>

          {/* Course 3 */}
          <div className="gold-card rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:border-[#D4AF37]/60 group">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-bold text-[#F5DE9E]">
                  {t.courses.course3Tag}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> १ ते २ महिने
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#1C1C20] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-heading">
                {t.courses.course3Title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                {t.courses.course3Desc}
              </p>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> केराटिन, स्मूदनिंग व रिबॉन्डिंग
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> हेअर बोटोक्स व प्रोटीन ट्रीटमेंट
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> रासायनिक उत्पादनांची अचूक हाताळणी
                </li>
              </ul>
            </div>
            <div className="p-4 bg-[#111114] border-t border-neutral-800 flex items-center justify-between text-xs font-bold text-[#F5DE9E]">
              <span>प्रगत क्लिनिकल सलोन स्तर</span>
              <Award className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
