'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

export function HeroV2() {
  return (
    <div className="relative overflow-hidden bg-[#f4f4f4]">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#f4f4f4]/70 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/2" className="flex items-center">
              <Image
                src="/logos/sylcroad-logo.png"
                alt="SylcRoad"
                width={140}
                height={32}
                className="h-8 w-auto"
              />
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#how-it-works"
                className="text-sm text-[#16101e] hover:text-[#16101e]/70 transition-colors"
              >
                How it Works
              </Link>
              <Link
                href="#platform"
                className="text-sm text-[#16101e] hover:text-[#16101e]/70 transition-colors"
              >
                Platform
              </Link>
              <Link
                href="#why-us"
                className="text-sm text-[#16101e] hover:text-[#16101e]/70 transition-colors"
              >
                Why Us
              </Link>
              <Link
                href="#testimonials"
                className="text-sm text-[#16101e] hover:text-[#16101e]/70 transition-colors"
              >
                Creators
              </Link>
              <Link
                href="/contact"
                className="text-sm text-[#16101e] hover:text-[#16101e]/70 transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Log in Button */}
            <div className="flex items-center">
              <Button
                className="h-auto py-3 px-6 text-base font-medium rounded-xl bg-black text-white transition-shadow duration-200 hover:shadow-lg hover:bg-black cursor-pointer"
                style={{
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
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
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-bold text-[#16101e] leading-tight tracking-tight text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-5"
          >
            Influencer Campaigns<br />
            Engineered for Performance.
          </motion.h1>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-32 sm:mb-44"
          >
            {/* Left Stat */}
            <div className="text-[#16101e]">
              <span className="text-sm font-medium">20+ Clients</span>
            </div>

            {/* Overlapping Company Logos */}
            <div className="flex items-center -space-x-3">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-100 border-2 border-white overflow-hidden z-10 shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                <Image
                  src="/logos/circle-overcomer.png"
                  alt="Overcomer"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-100 border-2 border-white overflow-hidden z-20 shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                <Image
                  src="/logos/circle-roman.png"
                  alt="Romans Road"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-100 border-2 border-white overflow-hidden z-30 shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                <Image
                  src="/logos/circle-stealth.png"
                  alt="Stealth GBT"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right Stat */}
            <div className="text-[#16101e]">
              <span className="text-sm font-medium">100M+ Views Generated</span>
            </div>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[#16101e]/70 text-lg sm:text-xl max-w-4xl mx-auto mb-6 sm:mb-8"
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
            <Link href="#how-it-works">
              <Button
                variant="outline"
                className="h-auto py-3 px-6 text-base font-medium rounded-xl border-0 text-[#16101e] hover:text-[#16101e] hover:bg-black/5 transition-shadow duration-200 hover:shadow-lg cursor-pointer"
                style={{
                  backgroundColor: '#f4f4f4',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 2px 8px rgba(255, 255, 255, 0.95)'
                }}
              >
                See How It Works
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
