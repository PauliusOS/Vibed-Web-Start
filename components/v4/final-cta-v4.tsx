'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

export function FinalCTAV4() {
  return (
    <section className="relative py-24 sm:py-28 md:py-32 border-t border-white/[0.07] z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold mb-6 sm:mb-8"
          style={{
            background: 'linear-gradient(135deg, #6b7280 0%, #d5dbe6 50%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Ready to Scale Your Brand with Influencer Marketing?
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[#d5dbe6]/70 text-lg sm:text-xl max-w-3xl mx-auto mb-10 sm:mb-12"
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
          <Link href="/4/contact">
            <Button
              className="h-auto py-3 px-6 text-base font-medium rounded-xl bg-[#0066FF] text-white transition-all duration-200 hover:bg-[#0055DD] cursor-pointer"
              style={{
                boxShadow: '0 4px 24px rgba(0, 102, 255, 0.3)'
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
