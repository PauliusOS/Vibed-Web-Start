'use client';

import { motion } from 'motion/react';

export function StrategyGraphic() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Animated SVG */}
      <svg viewBox="0 0 240 180" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="strat-cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f9f9f9" />
          </linearGradient>
          <linearGradient id="strat-darkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>
          <filter id="strat-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
          </filter>
          <filter id="strat-smallShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Main Strategy Card */}
        <g filter="url(#strat-shadow)">
          <rect x="20" y="15" width="160" height="130" rx="14" fill="url(#strat-cardGrad)" />
          <rect x="20" y="15" width="160" height="130" rx="14" stroke="#ececec" strokeWidth="1" fill="none" />
        </g>

        {/* Card Header */}
        <text x="35" y="38" fill="#1a1a1a" fontSize="11" fontWeight="600" fontFamily="system-ui">Campaign Brief</text>

        {/* Form Fields */}
        <rect x="35" y="48" width="130" height="24" rx="6" fill="#f5f5f5" stroke="#e8e8e8" strokeWidth="1" />
        <text x="43" y="64" fill="#888" fontSize="8" fontFamily="system-ui">Brand: TechStart Inc</text>

        <rect x="35" y="78" width="130" height="24" rx="6" fill="#f5f5f5" stroke="#e8e8e8" strokeWidth="1" />
        <text x="43" y="94" fill="#888" fontSize="8" fontFamily="system-ui">Goal: 40% awareness boost</text>

        {/* Progress Indicator */}
        <rect x="35" y="112" width="90" height="5" rx="2.5" fill="#e8e8e8" />
        <rect x="35" y="112" width="63" height="5" rx="2.5" fill="#1a1a1a">
          <animate attributeName="width" values="0;63;63" dur="2s" repeatCount="indefinite" />
        </rect>
        <text x="132" y="118" fill="#1a1a1a" fontSize="8" fontWeight="600" fontFamily="system-ui">70%</text>

        {/* Floating Icon Badge - integrated inside */}
        <g filter="url(#strat-smallShadow)">
          <rect x="185" y="45" width="40" height="40" rx="12" fill="url(#strat-darkGrad)">
            <animate attributeName="y" values="45;50;45" dur="3s" repeatCount="indefinite" />
          </rect>
          {/* Clipboard Icon */}
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;0,5;0,0" dur="3s" repeatCount="indefinite" />
            <rect x="195" y="52" width="20" height="26" rx="3" stroke="white" strokeWidth="1.5" fill="none" />
            <rect x="199" y="49" width="12" height="6" rx="1.5" fill="white" />
            <line x1="199" y1="60" x2="211" y2="60" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
            <line x1="199" y1="65" x2="208" y2="65" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
            <line x1="199" y1="70" x2="209" y2="70" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
          </g>
        </g>

        {/* Budget Badge */}
        <g filter="url(#strat-smallShadow)">
          <rect x="185" y="100" width="40" height="28" rx="8" fill="url(#strat-darkGrad)">
            <animate attributeName="scale" values="1;1.05;1" dur="2s" repeatCount="indefinite" />
          </rect>
          <text x="205" y="117" textAnchor="middle" fill="white" fontSize="10" fontWeight="600" fontFamily="system-ui">$15K</text>
        </g>
      </svg>
    </div>
  );
}
