'use client';

import { motion } from 'motion/react';

export function AnalyticsGraphic() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Animated SVG */}
      <svg viewBox="0 0 240 180" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="ana-cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f9f9f9" />
          </linearGradient>
          <linearGradient id="ana-darkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>
          <filter id="ana-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
          </filter>
          <filter id="ana-smallShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Main Analytics Card */}
        <g filter="url(#ana-shadow)">
          <rect x="15" y="15" width="170" height="145" rx="14" fill="url(#ana-cardGrad)" />
          <rect x="15" y="15" width="170" height="145" rx="14" stroke="#ececec" strokeWidth="1" fill="none" />
        </g>

        {/* Card Header */}
        <text x="28" y="38" fill="#1a1a1a" fontSize="10" fontWeight="600" fontFamily="system-ui">Campaign Analytics</text>

        {/* Metric Cards Row */}
        <g filter="url(#ana-smallShadow)">
          <rect x="28" y="48" width="68" height="38" rx="8" fill="white" stroke="#e8e8e8" strokeWidth="1" />
          <text x="62" y="66" textAnchor="middle" fill="#1a1a1a" fontSize="14" fontWeight="700" fontFamily="system-ui">2.4M</text>
          <text x="62" y="78" textAnchor="middle" fill="#888" fontSize="7" fontFamily="system-ui">Total Views</text>
        </g>

        <g filter="url(#ana-smallShadow)">
          <rect x="104" y="48" width="68" height="38" rx="8" fill="white" stroke="#e8e8e8" strokeWidth="1" />
          <text x="138" y="66" textAnchor="middle" fill="#1a1a1a" fontSize="14" fontWeight="700" fontFamily="system-ui">8.2%</text>
          <text x="138" y="78" textAnchor="middle" fill="#888" fontSize="7" fontFamily="system-ui">Engagement</text>
        </g>

        {/* Mini Chart Area */}
        <rect x="28" y="95" width="144" height="55" rx="8" fill="#f8f8f8" stroke="#e8e8e8" strokeWidth="1" />

        {/* Animated Chart Bars */}
        <rect x="38" y="128" width="12" height="16" rx="2" fill="#1a1a1a" opacity="0.2">
          <animate attributeName="height" values="10;16;10" dur="2s" repeatCount="indefinite" />
          <animate attributeName="y" values="134;128;134" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="55" y="122" width="12" height="22" rx="2" fill="#1a1a1a" opacity="0.35">
          <animate attributeName="height" values="16;22;16" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="y" values="128;122;128" dur="2.2s" repeatCount="indefinite" />
        </rect>
        <rect x="72" y="118" width="12" height="26" rx="2" fill="#1a1a1a" opacity="0.5">
          <animate attributeName="height" values="20;26;20" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="y" values="124;118;124" dur="2.4s" repeatCount="indefinite" />
        </rect>
        <rect x="89" y="120" width="12" height="24" rx="2" fill="#1a1a1a" opacity="0.65">
          <animate attributeName="height" values="18;24;18" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="y" values="126;120;126" dur="2.6s" repeatCount="indefinite" />
        </rect>
        <rect x="106" y="114" width="12" height="30" rx="2" fill="#1a1a1a" opacity="0.8">
          <animate attributeName="height" values="24;30;24" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="y" values="120;114;120" dur="2.8s" repeatCount="indefinite" />
        </rect>
        <rect x="123" y="116" width="12" height="28" rx="2" fill="#1a1a1a" opacity="0.65">
          <animate attributeName="height" values="22;28;22" dur="3s" repeatCount="indefinite" />
          <animate attributeName="y" values="122;116;122" dur="3s" repeatCount="indefinite" />
        </rect>
        <rect x="140" y="108" width="12" height="36" rx="2" fill="#1a1a1a">
          <animate attributeName="height" values="30;36;30" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="y" values="114;108;114" dur="3.2s" repeatCount="indefinite" />
        </rect>

        {/* Floating Icon Badge - Trending Up */}
        <g filter="url(#ana-smallShadow)">
          <rect x="190" y="35" width="40" height="40" rx="12" fill="url(#ana-darkGrad)">
            <animate attributeName="y" values="35;40;35" dur="3s" repeatCount="indefinite" />
          </rect>
          {/* Trending Up Icon */}
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;0,5;0,0" dur="3s" repeatCount="indefinite" />
            <path d="M198 65L206 55L212 61L222 51" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M216 51H222V57" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>

        {/* Growth Badge */}
        <g filter="url(#ana-smallShadow)">
          <rect x="190" y="85" width="40" height="34" rx="10" fill="white" stroke="#e8e8e8" strokeWidth="1">
            <animate attributeName="y" values="85;88;85" dur="2.5s" repeatCount="indefinite" />
          </rect>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;0,3;0,0" dur="2.5s" repeatCount="indefinite" />
            <text x="210" y="102" textAnchor="middle" fill="#1a1a1a" fontSize="11" fontWeight="700" fontFamily="system-ui">+127%</text>
            <text x="210" y="113" textAnchor="middle" fill="#888" fontSize="7" fontFamily="system-ui">Growth</text>
          </g>
        </g>

        {/* Live Indicator */}
        <g filter="url(#ana-smallShadow)">
          <rect x="190" y="128" width="40" height="22" rx="11" fill="url(#ana-darkGrad)">
            <animate attributeName="opacity" values="1;0.7;1" dur="1.5s" repeatCount="indefinite" />
          </rect>
          <circle cx="200" cy="139" r="3" fill="#22c55e">
            <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
          </circle>
          <text x="218" y="143" textAnchor="middle" fill="white" fontSize="8" fontWeight="600" fontFamily="system-ui">Live</text>
        </g>
      </svg>
    </div>
  );
}
