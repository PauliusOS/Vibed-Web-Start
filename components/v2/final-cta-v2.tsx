'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

export function FinalCTAV2() {
  return (
    <section className="relative py-24 sm:py-28 md:py-32 border-t border-black/5 bg-[#f4f4f4] rounded-b-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[#16101e] text-4xl sm:text-5xl font-bold mb-6 sm:mb-8"
        >
          Ready to Scale Your Brand with Influencer Marketing?
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[#16101e]/70 text-lg sm:text-xl max-w-3xl mx-auto mb-10 sm:mb-12"
        >
          Leverage the experience from 20+ brands managed by our team. Let's build your custom strategy today.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/2/contact">
            <Button
              className="h-auto py-3 px-6 text-base font-medium rounded-xl bg-black text-white transition-shadow duration-200 hover:shadow-lg hover:bg-black cursor-pointer"
              style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              Get Started
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
