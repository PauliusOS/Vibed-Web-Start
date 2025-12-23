'use client';

import { Layers, Users, Handshake, BarChart3 } from 'lucide-react';
import {
  StrategyGraphic,
  AnalyticsGraphic,
} from '@/components/landing/graphics';
import { MotionPreset } from '@/components/ui/motion-preset';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-24 md:py-32 bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Badge */}
        <MotionPreset
          fade
          slide={{ direction: 'up', offset: 20 }}
          delay={0}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#f4f4f4] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_2px_8px_rgba(255,255,255,0.95)]">
            <Layers className="w-4 h-4 text-[#6b6b6b]" />
            <span className="text-sm font-medium text-[#3a3a3a] uppercase tracking-wider">How It Works</span>
          </div>
        </MotionPreset>

        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <MotionPreset
            fade
            slide={{ direction: 'up', offset: 30 }}
            delay={0.1}
          >
            <h2 className="text-[#16101e] text-4xl sm:text-5xl md:text-6xl font-serif italic mb-4 sm:mb-6">
              All steps in 1 process
            </h2>
          </MotionPreset>
          <MotionPreset
            fade
            slide={{ direction: 'up', offset: 20 }}
            delay={0.2}
          >
            <p className="text-[#16101e]/70 text-lg sm:text-xl max-w-3xl mx-auto">
              From strategy to results, we handle everything so you can focus on your brand.
            </p>
          </MotionPreset>
        </div>

        {/* Cards Grid - First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Card 1 - Consultation & Strategy */}
          <MotionPreset
            fade
            slide={{ direction: 'up', offset: 40 }}
            delay={0.1}
          >
            <div className="bg-[#f4f4f4] rounded-[24px] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_4px_12px_rgba(255,255,255,0.95)] h-full">
              {/* Strategy Graphic */}
              <div className="w-full sm:w-1/2 aspect-[4/3] rounded-[16px] flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #f8f8f8 0%, #efefef 100%)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04), inset 0 2px 6px rgba(255, 255, 255, 0.9)'
                }}
              >
                <StrategyGraphic />
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
          </MotionPreset>

          {/* Card 2 - Perfect-Fit Influencer Matching */}
          <MotionPreset
            fade
            slide={{ direction: 'up', offset: 40 }}
            delay={0.2}
          >
            <div className="bg-[#f4f4f4] rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 items-start shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_4px_12px_rgba(255,255,255,0.95)] h-full">
              {/* Content */}
              <div className="flex-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center mb-4 shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[#16101e] text-xl font-semibold mb-3">Perfect-Fit Influencer Matching</h3>
                <p className="text-[#16101e]/70 text-sm sm:text-base leading-relaxed">
                  We hand-pick creators from our vetted network who align with your brand values and audience. No guesswork—just data-driven matches that deliver results.
                </p>
              </div>
            </div>
          </MotionPreset>
        </div>

        {/* Cards Grid - Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Card 3 - Negotiation & Campaign Launch */}
          <MotionPreset
            fade
            slide={{ direction: 'up', offset: 40 }}
            delay={0.1}
          >
            <div className="bg-[#f4f4f4] rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 items-start shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_4px_12px_rgba(255,255,255,0.95)] h-full">
              {/* Content */}
              <div className="flex-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center mb-4 shadow-lg">
                  <Handshake className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[#16101e] text-xl font-semibold mb-3">Negotiation & Campaign Launch</h3>
                <p className="text-[#16101e]/70 text-sm sm:text-base leading-relaxed">
                  We negotiate the best deals on your behalf, maximizing your budget. Once approved, we manage the entire campaign launch process seamlessly.
                </p>
              </div>
            </div>
          </MotionPreset>

          {/* Card 4 - Track & Optimize */}
          <MotionPreset
            fade
            slide={{ direction: 'up', offset: 40 }}
            delay={0.2}
          >
            <div className="bg-[#f4f4f4] rounded-[24px] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_4px_12px_rgba(255,255,255,0.95)] h-full">
              {/* Content */}
              <div className="flex-1 order-last sm:order-first">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center mb-4 shadow-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[#16101e] text-xl font-semibold mb-3">Track & Optimize in Real-Time</h3>
                <p className="text-[#16101e]/70 text-sm sm:text-base leading-relaxed">
                  Monitor campaign performance through our proprietary platform. Track metrics, engagement, and ROI—all in one transparent dashboard.
                </p>
              </div>
              {/* Analytics Graphic */}
              <div className="w-full sm:w-1/2 aspect-[4/3] rounded-[16px] flex items-center justify-center flex-shrink-0 order-first sm:order-last"
                style={{
                  background: 'linear-gradient(135deg, #f8f8f8 0%, #efefef 100%)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04), inset 0 2px 6px rgba(255, 255, 255, 0.9)'
                }}
              >
                <AnalyticsGraphic />
              </div>
            </div>
          </MotionPreset>
        </div>

      </div>
    </section>
  );
}
