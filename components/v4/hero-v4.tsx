'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

export function HeroV4() {
  return (
    <div className="relative overflow-hidden bg-[#04070d]">
      {/* Big Blue Gradient - Sandra AI style horizon glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 140% 90% at 50% 100%, rgba(0, 102, 255, 0.6) 0%, rgba(0, 102, 255, 0.35) 20%, rgba(0, 80, 220, 0.2) 40%, rgba(0, 60, 180, 0.08) 60%, transparent 80%),
            radial-gradient(ellipse 100% 60% at 50% 110%, rgba(0, 150, 255, 0.7) 0%, rgba(0, 120, 255, 0.3) 30%, transparent 60%),
            radial-gradient(ellipse 80% 50% at 30% 105%, rgba(0, 100, 230, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 70% 105%, rgba(0, 100, 230, 0.25) 0%, transparent 50%)
          `
        }}
      />
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#04070d]/70 backdrop-blur-xl border-b border-white/[0.07]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/4" className="flex items-center z-10">
              <div
                className="relative h-8 w-[140px]"
                style={{
                  background: 'linear-gradient(to top right, #6b7280 0%, #b0b5bd 20%, #ffffff 50%)',
                  WebkitMaskImage: 'url(/logos/sylcroad-logo.png)',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'left center',
                  maskImage: 'url(/logos/sylcroad-logo.png)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'left center',
                }}
                aria-label="SylcRoad"
              />
            </Link>

            {/* Navigation Links - Absolutely centered */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              <button
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-sm text-[#d5dbe6] hover:text-white transition-colors cursor-pointer"
              >
                How it Works
              </button>
              <button
                onClick={() => {
                  document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-sm text-[#d5dbe6] hover:text-white transition-colors cursor-pointer"
              >
                Platform
              </button>
              <button
                onClick={() => {
                  document.getElementById('why-us')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-sm text-[#d5dbe6] hover:text-white transition-colors cursor-pointer"
              >
                Why Us
              </button>
              <button
                onClick={() => {
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-sm text-[#d5dbe6] hover:text-white transition-colors cursor-pointer"
              >
                Creators
              </button>
              <Link
                href="/4/contact"
                className="text-sm text-[#d5dbe6] hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Log in Button */}
            <div className="flex items-center z-10">
              <Button
                className="h-auto py-2 px-4 text-sm font-medium rounded-lg bg-[#0066FF] text-white transition-all duration-200 hover:bg-[#0055DD] cursor-pointer"
                style={{
                  boxShadow: '0 4px 20px rgba(0, 102, 255, 0.25)'
                }}
              >
                Log in
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-40 pb-20 sm:pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto text-center w-full">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-bold text-[#d5dbe6] leading-tight tracking-tight text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-5"
          >
            Influencer Campaigns<br />
            <span
              style={{
                background: 'linear-gradient(to top right, #6b7280 0%, #b0b5bd 20%, #ffffff 50%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Engineered for Performance.
            </span>
          </motion.h1>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-32 sm:mb-44"
          >
            {/* Left Stat */}
            <div className="text-[#d5dbe6]">
              <span className="text-sm font-medium">20+ Clients</span>
            </div>

            {/* Overlapping Company Logos */}
            <div className="flex items-center -space-x-3">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#1a1f2e] to-[#10131c] border-2 border-white/10 overflow-hidden z-10 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                <Image
                  src="/logos/circle-overcomer.png"
                  alt="Overcomer"
                  fill
                  className="object-cover brightness-0 invert opacity-90"
                />
              </div>
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#1a1f2e] to-[#10131c] border-2 border-white/10 overflow-hidden z-20 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                <Image
                  src="/logos/circle-roman.png"
                  alt="Romans Road"
                  fill
                  className="object-cover brightness-0 invert opacity-90"
                />
              </div>
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#1a1f2e] to-[#10131c] border-2 border-white/10 overflow-hidden z-30 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                <Image
                  src="/logos/circle-stealth.png"
                  alt="Stealth GBT"
                  fill
                  className="object-cover brightness-0 invert opacity-90"
                />
              </div>
            </div>

            {/* Right Stat */}
            <div className="text-[#d5dbe6]">
              <span className="text-sm font-medium">100M+ Views Generated</span>
            </div>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[#d5dbe6]/70 text-lg sm:text-xl max-w-4xl mx-auto mb-6 sm:mb-8"
          >
            We connect brands with hand-picked creators, deliver custom strategies,
            and maximize your influencer marketing ROI—all through one transparent platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
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
            <Button
              variant="outline"
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group h-auto py-3 px-6 text-base font-medium rounded-xl border border-white/20 text-[#d5dbe6] hover:text-white hover:border-white/40 transition-all duration-300 cursor-pointer bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-sm"
            >
              <span className="flex items-center gap-2">
                See How It Works
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
