'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DashboardGraphic } from '@/components/landing/graphics';
import { MotionPreset } from '@/components/ui/motion-preset';

export function PlatformShowcase() {
  return (
    <section id="platform" className="relative py-20 sm:py-24 md:py-32 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div>
            <MotionPreset
              fade
              slide={{ direction: 'up', offset: 30 }}
              delay={0}
            >
              <h2 className="text-[#16101e] text-4xl sm:text-5xl font-bold mb-4 sm:mb-6">
                Track Every Campaign in Real-Time
              </h2>
            </MotionPreset>
            <MotionPreset
              fade
              slide={{ direction: 'up', offset: 20 }}
              delay={0.1}
            >
              <p className="text-[#16101e]/70 text-lg sm:text-xl mb-8 sm:mb-10">
                Our proprietary platform gives you complete transparency and control.
              </p>
            </MotionPreset>

            {/* Features for Brands */}
            <MotionPreset
              fade
              slide={{ direction: 'up', offset: 30 }}
              delay={0.2}
              className="mb-8"
            >
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
            </MotionPreset>

            {/* Features for Creators */}
            <MotionPreset
              fade
              slide={{ direction: 'up', offset: 30 }}
              delay={0.3}
              className="mb-8"
            >
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
            </MotionPreset>

            {/* CTA */}
            <MotionPreset
              fade
              slide={{ direction: 'up', offset: 20 }}
              delay={0.4}
            >
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
            </MotionPreset>
          </div>

          {/* Right: Platform Dashboard Mockup */}
          <MotionPreset
            fade
            slide={{ direction: 'right', offset: 50 }}
            delay={0.2}
            className="relative"
          >
            <div
              className="aspect-[4/3] rounded-[24px] overflow-hidden p-5"
              style={{
                background: 'linear-gradient(135deg, #f8f8f8 0%, #efefef 100%)',
                boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.05), inset 0 2px 8px rgba(255, 255, 255, 0.95)'
              }}
            >
              <DashboardGraphic />
            </div>
          </MotionPreset>
        </div>
      </div>
    </section>
  );
}
