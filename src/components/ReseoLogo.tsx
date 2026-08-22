import React from 'react';

interface ReseoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  lightBackground?: boolean;
}

export const ReseoLogo: React.FC<ReseoLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  lightBackground = false,
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size];

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* High-definition SVG recreating the exact RESEO logo uploaded */}
      <div className={`relative flex items-center justify-center ${iconDimensions} transition-transform hover:scale-105 duration-300`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_2px_12px_rgba(59,130,246,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main 'R' Silhouette */}
          <path
            d="M25 25 H125 C158 25 180 45 180 80 C180 106 163 124 138 131 L185 185 H138 L98 135 H65 V185 H25 V25 Z"
            fill={lightBackground ? '#0F172A' : '#FFFFFF'}
          />
          {/* Internal negative space of the upper R loop */}
          <path
            d="M65 55 H120 C138 55 148 65 148 80 C148 95 138 105 120 105 H65 V55 Z"
            fill={lightBackground ? '#F8FAFC' : '#0B0F17'}
          />
          {/* Sharp embedded star inside the R */}
          <polygon
            points="70,110 82,76 112,76 88,96 97,130 70,110"
            fill={lightBackground ? '#F8FAFC' : '#0B0F17'}
          />
          {/* Dynamic Sky-Blue Arrow cutting diagonally up-right */}
          <path
            d="M85 115 L175 35 M175 35 H145 M175 35 V65"
            stroke="#3B82F6"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Star highlight anchor */}
          <polygon
            points="68,105 78,75 106,75 83,92 92,122 68,105"
            fill="#FFFFFF"
            className="hidden"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col tracking-tight">
          <div className="flex items-center gap-1.5 font-extrabold tracking-wider leading-none">
            <span className={lightBackground ? 'text-slate-900 font-black' : 'text-white font-black' + ' ' + textSizes}>
              RESEO
            </span>
            <span className="text-blue-500 font-black tracking-widest text-xs uppercase px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
              STUDIO
            </span>
          </div>
          <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 mt-0.5">
            Google Maps Velocity & NFC
          </span>
        </div>
      )}
    </div>
  );
};
