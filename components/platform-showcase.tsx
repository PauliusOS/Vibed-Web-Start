'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function PlatformShowcase() {
  return (
    <section id="platform" className="relative py-20 sm:py-24 md:py-32 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div>
            <h2 className="text-[#16101e] text-4xl sm:text-5xl font-bold mb-4 sm:mb-6">
              Track Every Campaign in Real-Time
            </h2>
            <p className="text-[#16101e]/70 text-lg sm:text-xl mb-8 sm:mb-10">
              Our proprietary platform gives you complete transparency and control.
            </p>

            {/* Features for Brands */}
            <div className="mb-8">
              <h3 className="text-[#16101e] text-lg sm:text-xl font-semibold mb-4">
                For Brands:
              </h3>
              <ul className="space-y-3">
                {[
                  'Real-time campaign performance tracking',
                  'Detailed analytics and ROI metrics',
                  'Direct communication with creators',
                  'Budget and spend monitoring',
                  'Content approval workflows',
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-[#09f] flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-[#16101e]/80 text-base sm:text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features for Creators */}
            <div className="mb-8">
              <h3 className="text-[#16101e] text-lg sm:text-xl font-semibold mb-4">
                For Creators:
              </h3>
              <ul className="space-y-3">
                {[
                  'View available campaigns matched to your profile',
                  'Accept new opportunities that fit your brand',
                  'Track your earnings and performance',
                  'Seamless collaboration tools',
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-[#09f] flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-[#16101e]/80 text-base sm:text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <Link href="/contact">
              <Button
                className="h-auto py-3 px-6 text-base font-medium rounded-xl bg-black text-white transition-shadow duration-200 hover:shadow-lg hover:bg-black"
                style={{
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Right: Platform Dashboard Mockup */}
          <div className="relative">
            <div
              className="aspect-[4/3] rounded-[24px] overflow-hidden p-5"
              style={{
                background: 'linear-gradient(135deg, #f8f8f8 0%, #efefef 100%)',
                boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.05), inset 0 2px 8px rgba(255, 255, 255, 0.95)'
              }}
            >
              <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
                <defs>
                  <linearGradient id="dashCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff"/>
                    <stop offset="100%" stopColor="#f5f5f5"/>
                  </linearGradient>
                  <linearGradient id="dashBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#09f"/>
                    <stop offset="100%" stopColor="#0077cc"/>
                  </linearGradient>
                  <linearGradient id="dashBlueGradVert" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#0077cc"/>
                    <stop offset="100%" stopColor="#09f"/>
                  </linearGradient>
                  <linearGradient id="dashShineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.9"/>
                    <stop offset="40%" stopColor="white" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a1a1a"/>
                    <stop offset="100%" stopColor="#0d0d0d"/>
                  </linearGradient>
                  <filter id="dashShadow" x="-10%" y="-10%" width="120%" height="130%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.1"/>
                  </filter>
                  <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%">
                    <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.08"/>
                  </filter>
                </defs>

                {/* Dashboard Container */}
                <g filter="url(#dashShadow)">
                  <rect x="10" y="10" width="380" height="280" rx="16" fill="url(#dashCardGrad)"/>
                  <rect x="10" y="10" width="380" height="60" rx="16" fill="url(#dashShineGrad)" opacity="0.5"/>
                </g>

                {/* Header */}
                <rect x="10" y="10" width="380" height="45" rx="16" fill="url(#headerGrad)"/>
                <rect x="10" y="40" width="380" height="15" fill="url(#headerGrad)"/>
                {/* Logo */}
                <circle cx="38" cy="32" r="12" fill="url(#dashBlueGrad)"/>
                <rect x="32" y="28" width="12" height="8" rx="2" fill="white" opacity="0.9"/>
                {/* Nav items */}
                <rect x="60" y="27" width="50" height="10" rx="5" fill="white" opacity="0.15"/>
                <rect x="120" y="27" width="40" height="10" rx="5" fill="white" opacity="0.1"/>
                {/* Profile */}
                <circle cx="360" cy="32" r="14" fill="white" opacity="0.1"/>
                <circle cx="360" cy="32" r="10" fill="url(#dashBlueGrad)" opacity="0.5"/>

                {/* Sidebar */}
                <rect x="10" y="55" width="75" height="235" rx="0" fill="#fafafa"/>
                <rect x="10" y="275" width="75" height="15" rx="16" fill="#fafafa"/>
                {/* Active menu item */}
                <rect x="15" y="70" width="60" height="28" rx="8" fill="url(#dashBlueGrad)" opacity="0.1"/>
                <rect x="22" y="80" width="8" height="8" rx="2" fill="url(#dashBlueGrad)"/>
                <rect x="35" y="80" width="32" height="8" rx="4" fill="url(#dashBlueGrad)" opacity="0.7"/>
                {/* Other menu items */}
                <rect x="22" y="115" width="8" height="8" rx="2" fill="#d0d0d0"/>
                <rect x="35" y="115" width="28" height="8" rx="4" fill="#e0e0e0"/>
                <rect x="22" y="140" width="8" height="8" rx="2" fill="#d0d0d0"/>
                <rect x="35" y="140" width="35" height="8" rx="4" fill="#e0e0e0"/>
                <rect x="22" y="165" width="8" height="8" rx="2" fill="#d0d0d0"/>
                <rect x="35" y="165" width="25" height="8" rx="4" fill="#e0e0e0"/>

                {/* Stats Cards Row */}
                <g filter="url(#cardShadow)">
                  <rect x="95" y="65" width="90" height="60" rx="12" fill="url(#dashCardGrad)"/>
                  <rect x="95" y="65" width="90" height="20" rx="12" fill="url(#dashShineGrad)" opacity="0.6"/>
                </g>
                <rect x="105" y="78" width="35" height="6" rx="3" fill="#e0e0e0"/>
                <text x="105" y="108" fill="#16101e" fontSize="18" fontWeight="bold">12.4K</text>
                <rect x="105" y="113" width="50" height="5" rx="2.5" fill="url(#dashBlueGrad)" opacity="0.3"/>
                <rect x="105" y="113" width="35" height="5" rx="2.5" fill="url(#dashBlueGrad)"/>

                <g filter="url(#cardShadow)">
                  <rect x="195" y="65" width="90" height="60" rx="12" fill="url(#dashCardGrad)"/>
                  <rect x="195" y="65" width="90" height="20" rx="12" fill="url(#dashShineGrad)" opacity="0.6"/>
                </g>
                <rect x="205" y="78" width="45" height="6" rx="3" fill="#e0e0e0"/>
                <text x="205" y="108" fill="#16101e" fontSize="18" fontWeight="bold">8.2%</text>
                <rect x="205" y="113" width="50" height="5" rx="2.5" fill="url(#dashBlueGrad)" opacity="0.3"/>
                <rect x="205" y="113" width="25" height="5" rx="2.5" fill="url(#dashBlueGrad)"/>

                <g filter="url(#cardShadow)">
                  <rect x="295" y="65" width="85" height="60" rx="12" fill="url(#dashCardGrad)"/>
                  <rect x="295" y="65" width="85" height="20" rx="12" fill="url(#dashShineGrad)" opacity="0.6"/>
                </g>
                <rect x="305" y="78" width="30" height="6" rx="3" fill="#e0e0e0"/>
                <text x="305" y="108" fill="url(#dashBlueGrad)" fontSize="18" fontWeight="bold">+247%</text>
                <path d="M360 100 L367 93 L374 100" stroke="#09f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

                {/* Chart Card */}
                <g filter="url(#cardShadow)">
                  <rect x="95" y="135" width="190" height="95" rx="12" fill="url(#dashCardGrad)"/>
                  <rect x="95" y="135" width="190" height="30" rx="12" fill="url(#dashShineGrad)" opacity="0.5"/>
                </g>
                <rect x="108" y="148" width="55" height="7" rx="3.5" fill="#e0e0e0"/>
                <rect x="108" y="160" width="35" height="5" rx="2.5" fill="#ebebeb"/>
                {/* Bar chart with gradients */}
                <rect x="110" y="200" width="18" height="22" rx="4" fill="url(#dashBlueGradVert)" opacity="0.35"/>
                <rect x="110" y="200" width="9" height="22" rx="4" fill="white" opacity="0.3"/>
                <rect x="135" y="188" width="18" height="34" rx="4" fill="url(#dashBlueGradVert)" opacity="0.5"/>
                <rect x="135" y="188" width="9" height="34" rx="4" fill="white" opacity="0.3"/>
                <rect x="160" y="178" width="18" height="44" rx="4" fill="url(#dashBlueGradVert)" opacity="0.65"/>
                <rect x="160" y="178" width="9" height="44" rx="4" fill="white" opacity="0.3"/>
                <rect x="185" y="168" width="18" height="54" rx="4" fill="url(#dashBlueGradVert)" opacity="0.8"/>
                <rect x="185" y="168" width="9" height="54" rx="4" fill="white" opacity="0.3"/>
                <rect x="210" y="158" width="18" height="64" rx="4" fill="url(#dashBlueGradVert)"/>
                <rect x="210" y="158" width="9" height="64" rx="4" fill="white" opacity="0.3"/>
                <rect x="235" y="165" width="18" height="57" rx="4" fill="url(#dashBlueGradVert)" opacity="0.9"/>
                <rect x="235" y="165" width="9" height="57" rx="4" fill="white" opacity="0.3"/>
                <rect x="260" y="175" width="18" height="47" rx="4" fill="url(#dashBlueGradVert)" opacity="0.7"/>
                <rect x="260" y="175" width="9" height="47" rx="4" fill="white" opacity="0.3"/>

                {/* Campaign List Card */}
                <g filter="url(#cardShadow)">
                  <rect x="295" y="135" width="85" height="95" rx="12" fill="url(#dashCardGrad)"/>
                  <rect x="295" y="135" width="85" height="25" rx="12" fill="url(#dashShineGrad)" opacity="0.5"/>
                </g>
                <rect x="305" y="148" width="45" height="6" rx="3" fill="#e0e0e0"/>
                {/* Campaign items */}
                <circle cx="315" cy="175" r="10" fill="url(#dashBlueGrad)" opacity="0.2"/>
                <circle cx="315" cy="175" r="6" fill="url(#dashBlueGrad)" opacity="0.5"/>
                <rect x="330" y="172" width="40" height="6" rx="3" fill="#e5e5e5"/>
                <circle cx="315" cy="198" r="10" fill="url(#dashBlueGrad)" opacity="0.3"/>
                <circle cx="315" cy="198" r="6" fill="url(#dashBlueGrad)" opacity="0.7"/>
                <rect x="330" y="195" width="35" height="6" rx="3" fill="#e5e5e5"/>
                <circle cx="315" cy="221" r="10" fill="url(#dashBlueGrad)" opacity="0.4"/>
                <circle cx="315" cy="221" r="6" fill="url(#dashBlueGrad)" opacity="0.9"/>
                <rect x="330" y="218" width="30" height="6" rx="3" fill="#e5e5e5"/>

                {/* Creators Panel */}
                <g filter="url(#cardShadow)">
                  <rect x="95" y="240" width="285" height="45" rx="12" fill="url(#dashCardGrad)"/>
                  <rect x="95" y="240" width="285" height="15" rx="12" fill="url(#dashShineGrad)" opacity="0.5"/>
                </g>
                <rect x="108" y="250" width="60" height="6" rx="3" fill="#e0e0e0"/>
                {/* Creator avatars with shine */}
                <circle cx="120" cy="272" r="10" fill="url(#dashBlueGrad)" opacity="0.3"/>
                <ellipse cx="117" cy="269" rx="4" ry="3" fill="white" opacity="0.4"/>
                <circle cx="145" cy="272" r="10" fill="url(#dashBlueGrad)" opacity="0.45"/>
                <ellipse cx="142" cy="269" rx="4" ry="3" fill="white" opacity="0.4"/>
                <circle cx="170" cy="272" r="10" fill="url(#dashBlueGrad)" opacity="0.6"/>
                <ellipse cx="167" cy="269" rx="4" ry="3" fill="white" opacity="0.4"/>
                <circle cx="195" cy="272" r="10" fill="url(#dashBlueGrad)" opacity="0.75"/>
                <ellipse cx="192" cy="269" rx="4" ry="3" fill="white" opacity="0.4"/>
                <circle cx="220" cy="272" r="10" fill="url(#dashBlueGrad)" opacity="0.9"/>
                <ellipse cx="217" cy="269" rx="4" ry="3" fill="white" opacity="0.4"/>
                {/* More badge */}
                <rect x="240" y="265" width="55" height="14" rx="7" fill="url(#dashBlueGrad)" opacity="0.15"/>
                <text x="267" y="275" textAnchor="middle" fill="#09f" fontSize="9" fontWeight="600">+12 more</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
