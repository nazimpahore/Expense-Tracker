import React from 'react';

export default function Logo({ className = "w-9 h-9 sm:w-10 sm:h-10" }) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 group select-none">
      {/* Geometric Apex Emblem */}
      <div className={`relative ${className} flex-shrink-0`}>
        {/* Glow backlight */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-teal-500/30 to-emerald-400/20 blur-md group-hover:blur-lg transition-all" />
        
        {/* Outer bezel */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-teal-500/30 group-hover:border-teal-400/60 p-1.5 sm:p-2 flex items-center justify-center shadow-md transition-colors">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_2px_8px_rgba(13,148,136,0.5)]"
          >
            <defs>
              <linearGradient id="apexGrad" x1="4" y1="28" x2="28" y2="4" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10B981" />
                <stop offset="0.5" stopColor="#0D9488" />
                <stop offset="1" stopColor="#2DD4BF" />
              </linearGradient>
              <linearGradient id="apexAccent" x1="10" y1="20" x2="22" y2="8" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6EE7B7" />
                <stop offset="1" stopColor="#38BDF8" />
              </linearGradient>
            </defs>
            {/* Architectural Apex Node */}
            <path
              d="M16 3L28 23H20L16 16L12 23H4L16 3Z"
              fill="url(#apexGrad)"
              fillOpacity="0.9"
            />
            {/* Internal Precision Inset Chevron */}
            <path
              d="M16 9L23 21H19L16 15.5L13 21H9L16 9Z"
              fill="#0F172A"
            />
            {/* Core Gem Delta */}
            <path
              d="M16 12.5L19.5 19H12.5L16 12.5Z"
              fill="url(#apexAccent)"
            />
            {/* Luminous Spark at the Apex Vertex */}
            <circle cx="16" cy="3.5" r="1.5" fill="#5EEAD4" />
          </svg>
        </div>
      </div>

      {/* Typography */}
      <div className="min-w-0">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Apex
          </span>
          <span className="text-lg sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400 bg-clip-text text-transparent font-sans">
            Ledger
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse ml-0.5" />
        </div>
        <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase truncate">
          <span className="hidden sm:inline">Financial Intelligence &bull; </span>Expense Suite
        </p>
      </div>
    </div>
  );
}
