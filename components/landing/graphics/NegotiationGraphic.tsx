'use client';

import { motion } from 'motion/react';

export function NegotiationGraphic() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Animated SVG */}
      <svg viewBox="0 0 280 210" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="neg-cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f9f9f9" />
          </linearGradient>
          <filter id="neg-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.12" />
          </filter>
          <filter id="neg-smallShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Main Card */}
        <g filter="url(#neg-shadow)">
          <rect x="15" y="15" width="200" height="165" rx="16" fill="url(#neg-cardGrad)" />
          <rect x="15" y="15" width="200" height="165" rx="16" stroke="#ececec" strokeWidth="1" fill="none" />
        </g>

        {/* Header */}
        <text x="30" y="42" fill="#1a1a1a" fontSize="11" fontWeight="600" fontFamily="system-ui">Deal Contract</text>

        {/* Status Badge */}
        <rect x="140" y="28" width="60" height="20" rx="10" fill="#22c55e" opacity="0.15" />
        <circle cx="152" cy="38" r="4" fill="#22c55e">
          <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <text x="162" y="42" fill="#22c55e" fontSize="8" fontWeight="600" fontFamily="system-ui">Active</text>

        {/* Recipient Row */}
        <rect x="30" y="55" width="170" height="32" rx="10" fill="#f5f5f5" stroke="#e8e8e8" strokeWidth="1" />
        <text x="40" y="76" fill="#999" fontSize="8" fontFamily="system-ui">To:</text>

        {/* Recipient Tags */}
        <rect x="58" y="62" width="55" height="18" rx="9" fill="#1a1a1a" opacity="0.08" />
        <circle cx="70" cy="71" r="5" fill="#1a1a1a" opacity="0.3" />
        <rect x="78" y="68" width="28" height="5" rx="2.5" fill="#1a1a1a" opacity="0.5" />

        <rect x="118" y="62" width="50" height="18" rx="9" fill="#1a1a1a" opacity="0.08" />
        <circle cx="130" cy="71" r="5" fill="#1a1a1a" opacity="0.3" />
        <rect x="138" y="68" width="24" height="5" rx="2.5" fill="#1a1a1a" opacity="0.5" />

        <text x="175" y="75" fill="#999" fontSize="8" fontFamily="system-ui">+2</text>

        {/* Deal Terms Card */}
        <g filter="url(#neg-smallShadow)">
          <rect x="30" y="98" width="170" height="70" rx="12" fill="white" stroke="#e8e8e8" strokeWidth="1" />
        </g>

        {/* Terms Content */}
        <rect x="42" y="110" width="80" height="6" rx="3" fill="#1a1a1a" opacity="0.6" />
        <rect x="42" y="122" width="60" height="5" rx="2.5" fill="#e0e0e0" />
        <rect x="42" y="132" width="70" height="5" rx="2.5" fill="#e0e0e0" />

        {/* Amount */}
        <text x="42" y="155" fill="#1a1a1a" fontSize="14" fontWeight="700" fontFamily="system-ui">$2,500</text>
        <text x="95" y="155" fill="#999" fontSize="9" fontFamily="system-ui">/post</text>

        {/* Checkmark */}
        <circle cx="175" cy="133" r="16" fill="#22c55e" opacity="0.1" />
        <circle cx="175" cy="133" r="10" fill="#22c55e" />
        <path d="M170 133 L173 136 L180 129" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <animate attributeName="stroke-dasharray" values="0 20;20 0" dur="1s" fill="freeze" />
        </path>
      </svg>

      {/* Floating Animated Icon Badge - Handshake */}
      <motion.div
        className="absolute -right-3 top-1/2 -translate-y-1/2"
        animate={{
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 3.5,
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
          {/* Handshake Icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M7 11L9 9L11 11L13 9L15 11L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 15C5 15 7 13 12 13C17 13 19 15 19 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </motion.div>

      {/* Send Button Badge */}
      <motion.div
        className="absolute bottom-8 right-4"
        animate={{
          scale: [1, 1.08, 1],
          x: [0, 2, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
          style={{
            background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.25)'
          }}
        >
          <span className="text-[10px] font-semibold text-white">Send</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </motion.div>

      {/* Top Badge */}
      <motion.div
        className="absolute top-2 left-4"
        animate={{
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div
          className="px-2.5 py-1 rounded-full text-[9px] font-semibold"
          style={{
            background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            color: '#1a1a1a'
          }}
        >
          Step 3/4
        </div>
      </motion.div>
    </div>
  );
}
