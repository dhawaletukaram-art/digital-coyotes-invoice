import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
}

export const DigiCoyoteLogo: React.FC<LogoProps> = ({
  className = '',
  size = 36,
  showText = false,
  textColor = 'text-white'
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Exact geometric coyote head matching the user's uploaded image */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="coyoteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff782d" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
          <filter id="coyoteGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g stroke="url(#coyoteGradient)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Left Ear Tip to outer cheek */}
          <path d="M 70 30 L 48 85 L 56 122 L 98 178" />
          
          {/* Right Ear Tip to outer cheek */}
          <path d="M 130 30 L 152 85 L 144 122 L 102 178" />

          {/* Left Inner Ear & Forehead Facets */}
          <path d="M 70 30 L 90 85 L 100 115" />
          <path d="M 48 85 L 90 85" />
          <path d="M 48 85 L 75 105 L 100 115" />

          {/* Right Inner Ear & Forehead Facets */}
          <path d="M 130 30 L 110 85 L 100 115" />
          <path d="M 152 85 L 110 85" />
          <path d="M 152 85 L 125 105 L 100 115" />

          {/* Snout and Chin Lines */}
          <path d="M 100 115 L 100 178" />
          <path d="M 75 105 L 82 172" />
          <path d="M 125 105 L 118 172" />

          {/* Lower Jaw V-Shapes */}
          <path d="M 56 122 L 100 178 L 144 122" />
          <path d="M 75 105 L 100 148 L 125 105" />
        </g>

        {/* Central origami crystal accent */}
        <polygon
          points="100,105 108,118 100,132 92,118"
          fill="#ea580c"
          opacity="0.8"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`text-lg font-bold tracking-tight ${textColor} font-display`}>
              Digital Coyotes
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-500 font-mono">
              PRO
            </span>
          </div>
          <span className="text-[10px] tracking-wider uppercase text-slate-400 font-medium">
            Agency Suite & Portal
          </span>
        </div>
      )}
    </div>
  );
};
