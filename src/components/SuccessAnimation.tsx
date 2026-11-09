import React from 'react';

interface SuccessAnimationProps {
  className?: string;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* 1. Subtle Outer Expanding Pulse Rings */}
      <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-[#D4AF37]/30 animate-ping opacity-25 pointer-events-none" />
      <div
        className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-radial from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent blur-md pointer-events-none animate-pulse"
        style={{ animationDuration: '3s' }}
      />

      {/* 2. Floating Golden Micro-Sparkles */}
      <div className="absolute -top-1 -right-1 text-[#F5DE9E] animate-sparkle-1 pointer-events-none">
        <svg className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(245,222,158,0.8)]" viewBox="0 0 24 24">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5z" />
        </svg>
      </div>
      <div className="absolute -bottom-1 -left-1 text-[#D4AF37] animate-sparkle-2 pointer-events-none">
        <svg className="w-3.5 h-3.5 fill-current drop-shadow-[0_0_6px_rgba(212,175,55,0.8)]" viewBox="0 0 24 24">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5z" />
        </svg>
      </div>
      <div className="absolute top-2 -left-3 text-[#FFE082] animate-sparkle-3 pointer-events-none">
        <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5z" />
        </svg>
      </div>

      {/* 3. Main Circular SVG Checkmark Animation */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-[#1E1A10] to-[#0E0D0A] border border-[#D4AF37]/40 flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.35)] animate-badge-pop">
        <svg
          className="w-14 h-14 sm:w-16 sm:h-16"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle background track */}
          <circle
            cx="26"
            cy="26"
            r="23"
            stroke="#D4AF37"
            strokeOpacity="0.2"
            strokeWidth="2.5"
          />

          {/* Animated Gold Circular Stroke */}
          <circle
            className="animate-circle-draw"
            cx="26"
            cy="26"
            r="23"
            stroke="url(#goldGradientStroke)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Animated Golden Checkmark Path */}
          <path
            className="animate-check-stroke"
            d="M15 26.5L22.5 34L37 19"
            stroke="url(#goldGradientStroke)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Metallic Gold Gradient Definition */}
          <defs>
            <linearGradient id="goldGradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2C6" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#AA820A" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
