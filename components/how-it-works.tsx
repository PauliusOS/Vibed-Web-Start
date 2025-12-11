'use client';

import { Layers, Users, Handshake, BarChart3 } from 'lucide-react';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-24 md:py-32 bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#f4f4f4] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_2px_8px_rgba(255,255,255,0.95)]">
            <Layers className="w-4 h-4 text-[#6b6b6b]" />
            <span className="text-sm font-medium text-[#3a3a3a] uppercase tracking-wider">How It Works</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-[#16101e] text-4xl sm:text-5xl md:text-6xl font-serif italic mb-4 sm:mb-6">
            All steps in 1 process
          </h2>
          <p className="text-[#16101e]/70 text-lg sm:text-xl max-w-3xl mx-auto">
            From strategy to results, we handle everything so you can focus on your brand.
          </p>
        </div>

        {/* Cards Grid - First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Card 1 - With Image */}
          <div className="bg-[#f4f4f4] rounded-[24px] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_4px_12px_rgba(255,255,255,0.95)]">
            {/* Strategy Illustration */}
            <div className="w-full sm:w-1/2 aspect-[4/3] rounded-[16px] overflow-hidden flex items-center justify-center flex-shrink-0 p-5"
              style={{
                background: 'linear-gradient(135deg, #f8f8f8 0%, #efefef 100%)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04), inset 0 2px 6px rgba(255, 255, 255, 0.9)'
              }}
            >
              <svg viewBox="0 0 200 150" className="w-full h-full" fill="none">
                <defs>
                  <linearGradient id="cardGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f8f8f8"/>
                    <stop offset="100%" stopColor="#e8e8e8"/>
                  </linearGradient>
                  <linearGradient id="blueGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#09f"/>
                    <stop offset="100%" stopColor="#0077cc"/>
                  </linearGradient>
                  <linearGradient id="shineGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.8"/>
                    <stop offset="50%" stopColor="white" stopOpacity="0"/>
                  </linearGradient>
                  <filter id="softShadow1" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
                  </filter>
                  <filter id="innerGlow1">
                    <feGaussianBlur stdDeviation="2" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                  </filter>
                </defs>

                {/* Document Card */}
                <g filter="url(#softShadow1)">
                  <rect x="30" y="20" width="80" height="105" rx="12" fill="url(#cardGrad1)"/>
                  <rect x="30" y="20" width="80" height="35" rx="12" fill="url(#shineGrad1)"/>
                </g>
                {/* Document header accent */}
                <rect x="40" y="32" width="40" height="6" rx="3" fill="url(#blueGrad1)"/>
                {/* Document lines */}
                <rect x="40" y="50" width="55" height="5" rx="2.5" fill="#e0e0e0"/>
                <rect x="40" y="62" width="45" height="5" rx="2.5" fill="#e0e0e0"/>
                <rect x="40" y="74" width="50" height="5" rx="2.5" fill="#e0e0e0"/>
                {/* Checkmark items */}
                <circle cx="47" y="95" r="8" cy="95" fill="url(#blueGrad1)" opacity="0.15"/>
                <path d="M43 95 L46 98 L52 91" stroke="#09f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="60" y="92" width="35" height="5" rx="2.5" fill="#d5d5d5"/>
                <circle cx="47" cy="112" r="8" fill="url(#blueGrad1)" opacity="0.15"/>
                <path d="M43 112 L46 115 L52 108" stroke="#09f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="60" y="109" width="30" height="5" rx="2.5" fill="#d5d5d5"/>

                {/* Floating Badge */}
                <g filter="url(#softShadow1)">
                  <rect x="125" y="15" width="60" height="35" rx="10" fill="url(#cardGrad1)"/>
                  <rect x="125" y="15" width="60" height="12" rx="10" fill="url(#shineGrad1)"/>
                </g>
                <circle cx="155" cy="32" r="10" fill="url(#blueGrad1)"/>
                <path d="M150 32 L154 36 L161 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

                {/* Lightbulb Element */}
                <g filter="url(#softShadow1)">
                  <circle cx="155" cy="85" r="28" fill="url(#cardGrad1)"/>
                  <circle cx="155" cy="85" r="28" fill="url(#shineGrad1)" opacity="0.5"/>
                </g>
                <circle cx="155" cy="82" r="15" fill="url(#blueGrad1)" opacity="0.2"/>
                <path d="M155 70 C148 70 143 76 143 83 C143 87 145 90 148 92 L148 97 L162 97 L162 92 C165 90 167 87 167 83 C167 76 162 70 155 70" fill="url(#blueGrad1)"/>
                <rect x="150" y="99" width="10" height="4" rx="2" fill="#09f" opacity="0.8"/>
                <rect x="151" y="105" width="8" height="3" rx="1.5" fill="#09f" opacity="0.6"/>
                {/* Light rays */}
                <line x1="155" y1="55" x2="155" y2="60" stroke="#09f" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                <line x1="175" y1="65" x2="171" y2="68" stroke="#09f" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                <line x1="135" y1="65" x2="139" y2="68" stroke="#09f" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>

                {/* Target Element */}
                <g filter="url(#softShadow1)">
                  <circle cx="155" cy="130" r="15" fill="url(#cardGrad1)"/>
                </g>
                <circle cx="155" cy="130" r="10" stroke="#09f" strokeWidth="2" fill="none" opacity="0.4"/>
                <circle cx="155" cy="130" r="5" fill="url(#blueGrad1)"/>
              </svg>
            </div>
            {/* Content */}
            <div className="flex-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center mb-4 shadow-lg">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[#16101e] text-xl font-semibold mb-3">Consultation & Strategy</h3>
              <p className="text-[#16101e]/70 text-sm sm:text-base leading-relaxed">
                We start with a deep dive into your brand, goals, and budget. Our team crafts a custom influencer strategy tailored to your unique narrative.
              </p>
            </div>
          </div>

          {/* Card 2 - Icon Only */}
          <div className="bg-[#f4f4f4] rounded-[24px] p-6 sm:p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_4px_12px_rgba(255,255,255,0.95)]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center mb-4 shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-[#16101e] text-xl font-semibold mb-3">Perfect-Fit Influencer Matching</h3>
            <p className="text-[#16101e]/70 text-sm sm:text-base leading-relaxed">
              We hand-pick creators from our vetted network who align with your brand values and audience. No guesswork—just data-driven matches that deliver results.
            </p>
          </div>
        </div>

        {/* Cards Grid - Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Card 3 - Icon Only */}
          <div className="bg-[#f4f4f4] rounded-[24px] p-6 sm:p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_4px_12px_rgba(255,255,255,0.95)]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center mb-4 shadow-lg">
              <Handshake className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-[#16101e] text-xl font-semibold mb-3">Negotiation & Campaign Launch</h3>
            <p className="text-[#16101e]/70 text-sm sm:text-base leading-relaxed">
              We negotiate the best deals on your behalf, maximizing your budget. Once approved, we manage the entire campaign launch process seamlessly.
            </p>
          </div>

          {/* Card 4 - With Image */}
          <div className="bg-[#f4f4f4] rounded-[24px] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_4px_12px_rgba(255,255,255,0.95)]">
            {/* Analytics Illustration */}
            <div className="w-full sm:w-1/2 aspect-[4/3] rounded-[16px] overflow-hidden flex items-center justify-center flex-shrink-0 order-first sm:order-none p-5"
              style={{
                background: 'linear-gradient(135deg, #f8f8f8 0%, #efefef 100%)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04), inset 0 2px 6px rgba(255, 255, 255, 0.9)'
              }}
            >
              <svg viewBox="0 0 200 150" className="w-full h-full" fill="none">
                <defs>
                  <linearGradient id="cardGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f8f8f8"/>
                    <stop offset="100%" stopColor="#e8e8e8"/>
                  </linearGradient>
                  <linearGradient id="blueGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#09f"/>
                    <stop offset="100%" stopColor="#0077cc"/>
                  </linearGradient>
                  <linearGradient id="blueGradVert" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#0077cc"/>
                    <stop offset="100%" stopColor="#09f"/>
                  </linearGradient>
                  <linearGradient id="shineGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.8"/>
                    <stop offset="50%" stopColor="white" stopOpacity="0"/>
                  </linearGradient>
                  <filter id="softShadow4" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
                  </filter>
                  <filter id="barGlow">
                    <feGaussianBlur stdDeviation="1" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                  </filter>
                </defs>

                {/* Main Chart Card */}
                <g filter="url(#softShadow4)">
                  <rect x="15" y="25" width="130" height="110" rx="14" fill="url(#cardGrad4)"/>
                  <rect x="15" y="25" width="130" height="35" rx="14" fill="url(#shineGrad4)"/>
                </g>

                {/* Chart header */}
                <rect x="25" y="35" width="50" height="6" rx="3" fill="#d5d5d5"/>
                <rect x="25" y="45" width="30" height="4" rx="2" fill="#e5e5e5"/>

                {/* Bar chart with gradient */}
                <rect x="30" y="100" width="14" height="25" rx="4" fill="url(#blueGradVert)" opacity="0.35"/>
                <rect x="50" y="90" width="14" height="35" rx="4" fill="url(#blueGradVert)" opacity="0.5"/>
                <rect x="70" y="78" width="14" height="47" rx="4" fill="url(#blueGradVert)" opacity="0.65"/>
                <rect x="90" y="65" width="14" height="60" rx="4" fill="url(#blueGradVert)" opacity="0.8"/>
                <rect x="110" y="55" width="14" height="70" rx="4" fill="url(#blueGradVert)"/>

                {/* Shine on bars */}
                <rect x="30" y="100" width="7" height="25" rx="4" fill="white" opacity="0.3"/>
                <rect x="50" y="90" width="7" height="35" rx="4" fill="white" opacity="0.3"/>
                <rect x="70" y="78" width="7" height="47" rx="4" fill="white" opacity="0.3"/>
                <rect x="90" y="65" width="7" height="60" rx="4" fill="white" opacity="0.3"/>
                <rect x="110" y="55" width="7" height="70" rx="4" fill="white" opacity="0.3"/>

                {/* Stats Card - Top Right */}
                <g filter="url(#softShadow4)">
                  <rect x="150" y="15" width="45" height="55" rx="10" fill="url(#cardGrad4)"/>
                  <rect x="150" y="15" width="45" height="18" rx="10" fill="url(#shineGrad4)"/>
                </g>
                <text x="172" y="42" textAnchor="middle" fill="url(#blueGrad4)" fontSize="14" fontWeight="bold">+127%</text>
                <path d="M165 52 L172 45 L179 52" stroke="#09f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

                {/* Floating metric card */}
                <g filter="url(#softShadow4)">
                  <rect x="150" y="80" width="45" height="55" rx="10" fill="url(#cardGrad4)"/>
                  <rect x="150" y="80" width="45" height="18" rx="10" fill="url(#shineGrad4)"/>
                </g>
                <circle cx="172" cy="100" r="12" fill="url(#blueGrad4)" opacity="0.15"/>
                <circle cx="172" cy="100" r="8" stroke="#09f" strokeWidth="2" fill="none"/>
                <circle cx="172" cy="100" r="3" fill="url(#blueGrad4)"/>
                <rect x="158" y="118" width="28" height="5" rx="2.5" fill="#d5d5d5"/>
              </svg>
            </div>
            {/* Content */}
            <div className="flex-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center mb-4 shadow-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[#16101e] text-xl font-semibold mb-3">Track & Optimize in Real-Time</h3>
              <p className="text-[#16101e]/70 text-sm sm:text-base leading-relaxed">
                Monitor campaign performance through our proprietary platform. Track metrics, engagement, and ROI—all in one transparent dashboard.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
