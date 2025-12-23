'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MotionPreset } from '@/components/ui/motion-preset';

export function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-28 md:py-32 border-t border-black/5 bg-[#f4f4f4] rounded-b-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <MotionPreset
          fade
          slide={{ direction: 'up', offset: 30 }}
          delay={0}
        >
          <h2 className="text-[#16101e] text-4xl sm:text-5xl font-bold mb-6 sm:mb-8">
            Ready to Scale Your Brand with Influencer Marketing?
          </h2>
        </MotionPreset>

        {/* Subheadline */}
        <MotionPreset
          fade
          slide={{ direction: 'up', offset: 20 }}
          delay={0.1}
        >
          <p className="text-[#16101e]/70 text-lg sm:text-xl max-w-3xl mx-auto mb-10 sm:mb-12">
            Leverage the experience from 20+ brands managed by our team. Let's build your custom strategy today.
          </p>
        </MotionPreset>

        {/* CTA Button */}
        <MotionPreset
          fade
          slide={{ direction: 'up', offset: 20 }}
          delay={0.2}
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
    </section>
  );
}
