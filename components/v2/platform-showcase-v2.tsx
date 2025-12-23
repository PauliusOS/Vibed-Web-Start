'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Users, DollarSign, CheckCircle2, MessageSquare, FileCheck } from 'lucide-react';

export function PlatformShowcaseV2() {
  const brandFeatures = [
    'Real-time campaign performance tracking',
    'Detailed analytics and ROI metrics',
    'Direct communication with creators',
    'Budget and spend monitoring',
    'Content approval workflows',
  ];

  const creatorFeatures = [
    'View available campaigns matched to your profile',
    'Accept new opportunities that fit your brand',
    'Track your earnings and performance',
    'Seamless collaboration tools',
  ];

  return (
    <section id="platform" className="relative py-20 sm:py-24 md:py-32 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-[#16101e] text-4xl sm:text-5xl font-bold mb-4 sm:mb-6"
            >
              Track Every Campaign in Real-Time
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[#16101e]/70 text-lg sm:text-xl mb-8 sm:mb-10"
            >
              Our proprietary platform gives you complete transparency and control.
            </motion.p>

            {/* Features for Brands */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h3 className="text-[#16101e] text-lg sm:text-xl font-semibold mb-4">
                For Brands:
              </h3>
              <ul className="space-y-3">
                {brandFeatures.map((feature, index) => (
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
            </motion.div>

            {/* Features for Creators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <h3 className="text-[#16101e] text-lg sm:text-xl font-semibold mb-4">
                For Creators:
              </h3>
              <ul className="space-y-3">
                {creatorFeatures.map((feature, index) => (
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
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
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

          {/* Right: Platform Dashboard Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div
              className="aspect-[4/3] rounded-[24px] overflow-hidden p-6"
              style={{
                background: 'linear-gradient(135deg, #f8f8f8 0%, #efefef 100%)',
                boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.05), inset 0 2px 8px rgba(255, 255, 255, 0.95)'
              }}
            >
              {/* Dashboard Mock UI */}
              <div className="h-full flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-[#16101e]">Dashboard</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-green-700">Live</span>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-xl p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-[#1a1a1a]" />
                      <span className="text-[10px] text-[#666]">Views</span>
                    </div>
                    <span className="text-base font-bold text-[#16101e]">2.4M</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white rounded-xl p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users className="w-3.5 h-3.5 text-[#1a1a1a]" />
                      <span className="text-[10px] text-[#666]">Reach</span>
                    </div>
                    <span className="text-base font-bold text-[#16101e]">890K</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-white rounded-xl p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#1a1a1a]" />
                      <span className="text-[10px] text-[#666]">ROI</span>
                    </div>
                    <span className="text-base font-bold text-[#16101e]">312%</span>
                  </motion.div>
                </div>

                {/* Chart Area */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex-1 bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-[#16101e]">Campaign Performance</span>
                    <span className="text-[10px] text-green-600 font-medium">+127%</span>
                  </div>
                  {/* Simple bar chart representation */}
                  <div className="flex items-end gap-2 h-20">
                    {[40, 55, 45, 70, 60, 85, 95].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                        className="flex-1 rounded-t-sm"
                        style={{
                          background: i === 6
                            ? 'linear-gradient(to top, #1a1a1a, #3a3a3a)'
                            : `rgba(26, 26, 26, ${0.15 + i * 0.08})`
                        }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Bottom Row */}
                <div className="flex gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="flex-1 bg-white rounded-xl p-3 shadow-sm flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-[#16101e]">12 Active</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex-1 bg-white rounded-xl p-3 shadow-sm flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-[#1a1a1a]" />
                    <span className="text-xs text-[#16101e]">3 Messages</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
