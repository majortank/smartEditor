'use client';

import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 28, 
  className = '', 
  showText = false 
}) => {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Precision Geometric Monogram */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
      >
        <defs>
          <linearGradient id="marka-bg-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="marka-border-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="marka-core-grad" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <filter id="marka-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#38bdf8" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Squircle Tile */}
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="8.5"
          fill="url(#marka-bg-grad)"
          stroke="url(#marka-border-grad)"
          strokeWidth="1.25"
        />

        {/* Ambient Radial Core Blur */}
        <circle cx="16" cy="16" r="7" fill="#38bdf8" fillOpacity="0.15" />

        {/* Precision Geometric M Monogram */}
        <path
          d="M8.5 22V10C8.5 9.17 9.17 8.5 10 8.5C10.5 8.5 10.95 8.75 11.2 9.15L16 16.5L20.8 9.15C21.05 8.75 21.5 8.5 22 8.5C22.83 8.5 23.5 9.17 23.5 10V22"
          stroke="url(#marka-core-grad)"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#marka-glow)"
        />

        {/* Central Core Spark Node */}
        <circle cx="16" cy="16.5" r="1.5" fill="#ffffff" />
      </svg>

      {showText && (
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
            Marka
          </span>
          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            Studio
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
