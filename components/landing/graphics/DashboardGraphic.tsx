'use client';

import { motion } from 'motion/react';

export function DashboardGraphic() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Animated SVG */}
      <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="dash-cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f9f9f9" />
          </linearGradient>
          <filter id="dash-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
          </filter>
          <filter id="dash-smallShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Main Dashboard Card */}
        <g filter="url(#dash-shadow)">
          <rect x="50" y="35" width="240" height="210" rx="18" fill="url(#dash-cardGrad)" />
          <rect x="50" y="35" width="240" height="210" rx="18" stroke="#e8e8e8" strokeWidth="1" fill="none" />
        </g>

        {/* Dashboard Header Bar */}
        <rect x="50" y="35" width="240" height="45" rx="18" fill="#fafafa" />
        <rect x="50" y="65" width="240" height="15" fill="#fafafa" />
        <rect x="50" y="79" width="240" height="1" fill="#e8e8e8" />

        {/* Header Content */}
        <text x="72" y="62" fill="#1a1a1a" fontSize="13" fontWeight="600" fontFamily="system-ui">Dashboard</text>
        <circle cx="265" cy="57" r="12" fill="#f0f0f0" />
        <circle cx="265" cy="57" r="8" fill="#e0e0e0" />

        {/* Metrics Row */}
        <g filter="url(#dash-smallShadow)">
          <rect x="68" y="95" width="95" height="55" rx="12" fill="white" stroke="#e8e8e8" strokeWidth="1" />
          <text x="115" y="125" textAnchor="middle" fill="#1a1a1a" fontSize="18" fontWeight="700" fontFamily="system-ui">1.2M</text>
          <text x="115" y="140" textAnchor="middle" fill="#888" fontSize="9" fontFamily="system-ui">Total Views</text>
        </g>

        <g filter="url(#dash-smallShadow)">
          <rect x="175" y="95" width="95" height="55" rx="12" fill="white" stroke="#e8e8e8" strokeWidth="1" />
          <text x="222" y="125" textAnchor="middle" fill="#1a1a1a" fontSize="18" fontWeight="700" fontFamily="system-ui">5.8%</text>
          <text x="222" y="140" textAnchor="middle" fill="#888" fontSize="9" fontFamily="system-ui">Engagement</text>
        </g>

        {/* Chart Section */}
        <rect x="68" y="165" width="202" height="65" rx="10" fill="#f8f8f8" stroke="#e8e8e8" strokeWidth="1" />

        {/* Animated Chart Bars */}
        <rect x="82" y="200" width="16" height="22" rx="3" fill="#1a1a1a" opacity="0.2">
          <animate attributeName="height" values="16;22;16" dur="2s" repeatCount="indefinite" />
          <animate attributeName="y" values="206;200;206" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="106" y="188" width="16" height="34" rx="3" fill="#1a1a1a" opacity="0.35">
          <animate attributeName="height" values="28;34;28" dur="2.3s" repeatCount="indefinite" />
          <animate attributeName="y" values="194;188;194" dur="2.3s" repeatCount="indefinite" />
        </rect>
        <rect x="130" y="180" width="16" height="42" rx="3" fill="#1a1a1a" opacity="0.5">
          <animate attributeName="height" values="36;42;36" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="y" values="186;180;186" dur="2.6s" repeatCount="indefinite" />
        </rect>
        <rect x="154" y="185" width="16" height="37" rx="3" fill="#1a1a1a" opacity="0.65">
          <animate attributeName="height" values="31;37;31" dur="2.9s" repeatCount="indefinite" />
          <animate attributeName="y" values="191;185;191" dur="2.9s" repeatCount="indefinite" />
        </rect>
        <rect x="178" y="175" width="16" height="47" rx="3" fill="#1a1a1a" opacity="0.8">
          <animate attributeName="height" values="41;47;41" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="y" values="181;175;181" dur="3.2s" repeatCount="indefinite" />
        </rect>
        <rect x="202" y="182" width="16" height="40" rx="3" fill="#1a1a1a" opacity="0.65">
          <animate attributeName="height" values="34;40;34" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="y" values="188;182;188" dur="3.5s" repeatCount="indefinite" />
        </rect>
        <rect x="226" y="172" width="16" height="50" rx="3" fill="#1a1a1a">
          <animate attributeName="height" values="44;50;44" dur="3.8s" repeatCount="indefinite" />
          <animate attributeName="y" values="178;172;178" dur="3.8s" repeatCount="indefinite" />
        </rect>
      </svg>

      {/* Floating Animated Icon Badge - Top Left (Grid/Dashboard) */}
      <motion.div
        className="absolute top-2 left-2"
        animate={{
          y: [-4, 4, -4],
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
          {/* Grid Icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="2" fill="white" />
            <rect x="14" y="3" width="7" height="7" rx="2" fill="white" opacity="0.7" />
            <rect x="3" y="14" width="7" height="7" rx="2" fill="white" opacity="0.7" />
            <rect x="14" y="14" width="7" height="7" rx="2" fill="white" opacity="0.5" />
          </svg>
        </div>
      </motion.div>

      {/* Floating Animated Icon Badge - Bottom Right (Users) */}
      <motion.div
        className="absolute bottom-4 right-4"
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
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.25)'
          }}
        >
          {/* Users Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="9" cy="8" r="3" stroke="white" strokeWidth="2" />
            <path d="M4 18c0-2.5 2.5-4 5-4s5 1.5 5 4" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="9" r="2" stroke="white" strokeWidth="1.5" opacity="0.6" />
            <path d="M16 13c1.5 0 3 1 3 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>
      </motion.div>

      {/* Growth Badge - Top Right */}
      <motion.div
        className="absolute top-6 right-2"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div
          className="px-3 py-2 rounded-xl"
          style={{
            background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <div className="text-sm font-bold text-[#1a1a1a]">+247%</div>
          <div className="text-[8px] text-[#888] text-center">Growth Rate</div>
        </div>
      </motion.div>

      {/* Live Badge - Left Side */}
      <motion.div
        className="absolute left-2 top-1/2 -translate-y-1/2"
        animate={{
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div
          className="px-3 py-1.5 rounded-lg"
          style={{
            background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          <span className="text-[9px] font-semibold text-white">Live</span>
        </div>
      </motion.div>

      {/* Checkmark Badge */}
      <motion.div
        className="absolute right-8 top-1/2"
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
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <div className="w-6 h-6 rounded-full bg-[#1a1a1a] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
