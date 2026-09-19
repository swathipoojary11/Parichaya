'use client';

export default function ParichayaLogo({ size = 'normal', showText = true, variant = 'dark', className = '' }) {
  const iconSizes = {
    small: 'w-8 h-8',
    normal: 'w-10 h-10',
    large: 'w-14 h-14'
  };

  const textSizes = {
    small: 'text-base',
    normal: 'text-xl',
    large: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Unique Cyber-P Shield Lightning Logo Emblem */}
      <div 
        className={`${iconSizes[size] || iconSizes.normal} rounded-2xl bg-gradient-to-br from-[#F95721] to-[#FF7A00] p-1.5 shadow-md shadow-orange-500/30 flex items-center justify-center transition-all duration-300 hover:scale-105 shrink-0 relative group overflow-hidden`}
      >
        <svg className="w-full h-full z-10 text-white drop-shadow-sm" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shield Base */}
          <path 
            d="M 50 12 L 82 24 V 52 C 82 72 50 88 50 88 C 50 88 18 72 18 52 V 24 L 50 12 Z" 
            fill="rgba(255,255,255,0.15)" 
            stroke="currentColor" 
            strokeWidth="5" 
            strokeLinejoin="round"
          />

          {/* Electric Lightning Spark Burst */}
          <path 
            d="M 64 22 L 38 48 H 52 L 34 76 L 62 44 H 46 L 64 22 Z" 
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-none text-left">
          <span 
            className={`font-black uppercase tracking-tight font-['Outfit'] ${textSizes[size] || textSizes.normal}`}
            style={{ color: variant === 'light' ? '#ffffff' : '#0F172A' }}
          >
            PARICHAYA
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#F95721] mt-0.5 flex items-center gap-1">
            <span>AURA</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] text-emerald-600">2.0</span>
          </span>
        </div>
      )}
    </div>
  );
}
