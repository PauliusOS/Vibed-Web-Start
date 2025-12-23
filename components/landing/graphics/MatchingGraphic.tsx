'use client';

import { motion } from 'motion/react';

export function MatchingGraphic() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Animated SVG */}
      <svg viewBox="0 0 280 210" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="match-cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f9f9f9" />
          </linearGradient>
          <filter id="match-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.12" />
          </filter>
          <filter id="match-smallShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Main Card */}
        <g filter="url(#match-shadow)">
          <rect x="15" y="15" width="195" height="165" rx="16" fill="url(#match-cardGrad)" />
          <rect x="15" y="15" width="195" height="165" rx="16" stroke="#ececec" strokeWidth="1" fill="none" />
        </g>

        {/* Header */}
        <text x="30" y="42" fill="#1a1a1a" fontSize="11" fontWeight="600" fontFamily="system-ui">Creator Discovery</text>

        {/* Search Bar */}
        <rect x="30" y="52" width="165" height="28" rx="8" fill="#f5f5f5" stroke="#e8e8e8" strokeWidth="1" />
        <circle cx="44" cy="66" r="6" stroke="#999" strokeWidth="1.5" fill="none" />
        <line x1="48" y1="70" x2="52" y2="74" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
        <text x="58" y="70" fill="#999" fontSize="9" fontFamily="system-ui">Find creators...</text>

        {/* Creator Cards */}
        <g filter="url(#match-smallShadow)">
          {/* Creator 1 */}
          <rect x="30" y="90" width="50" height="65" rx="10" fill="white" stroke="#e8e8e8" strokeWidth="1" />
          <circle cx="55" cy="108" r="12" fill="#e8e8e8" />
          <rect x="42" y="125" width="26" height="5" rx="2.5" fill="#1a1a1a" opacity="0.8" />
          <rect x="45" y="133" width="20" height="4" rx="2" fill="#e0e0e0" />
          <rect x="37" y="145" width="36" height="6" rx="3" fill="#22c55e" opacity="0.2" />
          <text x="55" y="151" textAnchor="middle" fill="#22c55e" fontSize="7" fontWeight="600">92%</text>
        </g>

        <g filter="url(#match-smallShadow)">
          {/* Creator 2 - Highlighted */}
          <rect x="88" y="90" width="50" height="65" rx="10" fill="white" stroke="#1a1a1a" strokeWidth="2" />
          <circle cx="113" cy="108" r="12" fill="#d4d4d4" />
          <rect x="100" y="125" width="26" height="5" rx="2.5" fill="#1a1a1a" opacity="0.8" />
          <rect x="103" y="133" width="20" height="4" rx="2" fill="#e0e0e0" />
          <rect x="95" y="145" width="36" height="6" rx="3" fill="#22c55e" opacity="0.3" />
          <text x="113" y="151" textAnchor="middle" fill="#22c55e" fontSize="7" fontWeight="700">98%</text>
          {/* Pulse ring animation */}
          <circle cx="113" cy="108" r="14" stroke="#1a1a1a" strokeWidth="2" fill="none" opacity="0.3">
            <animate attributeName="r" values="14;18;14" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>

        <g filter="url(#match-smallShadow)">
          {/* Creator 3 */}
          <rect x="146" y="90" width="50" height="65" rx="10" fill="white" stroke="#e8e8e8" strokeWidth="1" />
          <circle cx="171" cy="108" r="12" fill="#e8e8e8" />
          <rect x="158" y="125" width="26" height="5" rx="2.5" fill="#1a1a1a" opacity="0.8" />
          <rect x="161" y="133" width="20" height="4" rx="2" fill="#e0e0e0" />
          <rect x="153" y="145" width="36" height="6" rx="3" fill="#fbbf24" opacity="0.2" />
          <text x="171" y="151" textAnchor="middle" fill="#d97706" fontSize="7" fontWeight="600">85%</text>
        </g>
      </svg>

      {/* Floating Animated Icon Badge - Users */}
      <motion.div
        className="absolute -right-2 top-1/3"
        animate={{
          y: [-6, 6, -6],
          rotate: [0, 3, 0, -3, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
          }}
        >
          {/* Users Icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="9" cy="8" r="3.5" stroke="white" strokeWidth="2" />
            <path d="M3 19c0-3 3-5 6-5s6 2 6 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="17" cy="9" r="2.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
            <path d="M17 14c2 0 4 1.5 4 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          </svg>
        </div>
      </motion.div>

      {/* AI Sparkle Badge */}
      <motion.div
        className="absolute top-3 right-4"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-full"
          style={{
            background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" fill="white" />
          </svg>
          <span className="text-[9px] font-semibold text-white">AI</span>
        </div>
      </motion.div>

      {/* Bottom Match Badge */}
      <motion.div
        className="absolute bottom-6 left-6"
        animate={{
          x: [-2, 2, -2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div
          className="px-3 py-1.5 rounded-lg text-[10px] font-semibold"
          style={{
            background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            color: '#1a1a1a'
          }}
        >
          3 matches found
        </div>
      </motion.div>
    </div>
  );
}
