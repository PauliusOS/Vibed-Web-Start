'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Target,
  PieChart,
  ArrowUpRight
} from 'lucide-react';

export function PlatformShowcaseV4Alt() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const stats = [
    { label: 'Total Views', value: '2.4M', change: '+24%', icon: Eye },
    { label: 'Audience Reach', value: '890K', change: '+18%', icon: Users },
    { label: 'Avg. ROI', value: '312%', change: '+42%', icon: TrendingUp },
    { label: 'Conversions', value: '12.4K', change: '+31%', icon: Target },
  ];

  const features = [
    {
      icon: BarChart3,
      title: 'Live Analytics & Insights',
      description: 'Monitor every metric as it happens. AI-powered recommendations help you optimize campaigns while they\'re still running.',
    },
    {
      icon: PieChart,
      title: 'ROI Tracking',
      description: 'Know exactly what you\'re getting for every dollar spent. Clear, transparent reporting.',
    },
  ];

  return (
    <section id="platform" className="relative py-20 sm:py-24 md:py-32 bg-[#0a0d14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#10131c] border border-white/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]">
            <BarChart3 className="w-4 h-4 text-[#0066FF]" />
            <span className="text-sm font-medium text-[#d5dbe6]/80 uppercase tracking-wider">Platform</span>
          </div>
        </motion.div>

        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6"
            style={{
              background: 'linear-gradient(135deg, #6b7280 0%, #d5dbe6 50%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Your Command Center
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#d5dbe6]/70 text-lg sm:text-xl max-w-2xl mx-auto"
          >
            One dashboard to track, analyze, and optimize every campaign. No guesswork, just data.
          </motion.p>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-[#10131c] rounded-2xl p-5 border border-white/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              <div className="flex items-center justify-between mb-3">
                <motion.div
                  whileHover={{
                    rotate: 5,
                    scale: 1.1,
                    color: '#0066FF'
                  }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <stat.icon className="w-5 h-5 text-[#d5dbe6]/50" />
                </motion.div>
                <span className="text-xs font-medium text-green-400 flex items-center gap-0.5">
                  {stat.change}
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#d5dbe6] mb-1">{stat.value}</div>
              <div className="text-sm text-[#d5dbe6]/50">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Main Dashboard Visual + Features */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Dashboard Visual - Takes up 3 columns */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div
              className="rounded-[24px] overflow-hidden p-6 border border-white/[0.07] h-full min-h-[400px]"
              style={{
                background: 'linear-gradient(135deg, #10131c 0%, #0a0d14 100%)',
                boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0066FF]/20 to-[#0066FF]/10 border border-[#0066FF]/30 flex items-center justify-center"
                    whileHover={{
                      rotate: 5,
                      boxShadow: '0 0 20px rgba(0,102,255,0.4)',
                      borderColor: 'rgba(0,102,255,0.5)'
                    }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <BarChart3 className="w-5 h-5 text-[#0066FF]" />
                  </motion.div>
                  <div>
                    <div className="text-sm font-semibold text-[#d5dbe6]">Campaign Overview</div>
                    <div className="text-xs text-[#d5dbe6]/50">Last 30 days</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-medium text-green-400">Live</span>
                </div>
              </div>

              {/* Chart Area */}
              <div className="bg-[#1a1f2e]/30 rounded-xl p-5 border border-white/[0.05] mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#d5dbe6]">Performance Trend</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0066FF]" />
                      <span className="text-xs text-[#d5dbe6]/60">Views</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#d5dbe6]/30" />
                      <span className="text-xs text-[#d5dbe6]/60">Engagement</span>
                    </div>
                  </div>
                </div>

                {/* Line Chart Visualization with cursor-following shine */}
                <div
                  className="relative h-32 rounded-lg overflow-hidden"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setMousePos({
                      x: ((e.clientX - rect.left) / rect.width) * 100,
                      y: ((e.clientY - rect.top) / rect.height) * 100
                    });
                  }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                    {/* Grid lines */}
                    <line x1="0" y1="25" x2="400" y2="25" stroke="rgba(255,255,255,0.05)" />
                    <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.05)" />
                    <line x1="0" y1="75" x2="400" y2="75" stroke="rgba(255,255,255,0.05)" />

                    <defs>
                      {/* Base gradient under line */}
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0066FF" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
                      </linearGradient>

                      {/* Cursor-following shine gradient for graph area - soft & rounded */}
                      <radialGradient
                        id="areaShineGradient"
                        cx={`${mousePos.x}%`}
                        cy={`${mousePos.y}%`}
                        r="50%"
                      >
                        <stop offset="0%" stopColor="#66AAFF" stopOpacity="0.25" />
                        <stop offset="30%" stopColor="#3388FF" stopOpacity="0.15" />
                        <stop offset="60%" stopColor="#0066FF" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
                      </radialGradient>

                      {/* Clip path for the graph area */}
                      <clipPath id="graphAreaClip">
                        <path d="M0,80 C50,70 80,60 120,50 C160,40 200,45 240,30 C280,15 320,20 360,10 L400,5 L400,100 L0,100 Z" />
                      </clipPath>
                    </defs>

                    {/* Gradient fill - render first (behind lines) */}
                    <motion.path
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 1 }}
                      d="M0,80 C50,70 80,60 120,50 C160,40 200,45 240,30 C280,15 320,20 360,10 L400,5 L400,100 L0,100 Z"
                      fill="url(#chartGradient)"
                    />

                    {/* Cursor-following glow clipped to graph area (fill + line) */}
                    <g clipPath="url(#graphAreaClip)" style={{ filter: 'blur(2px)' }}>
                      <rect
                        x="0"
                        y="0"
                        width="400"
                        height="100"
                        fill="url(#areaShineGradient)"
                        style={{
                          opacity: isHovering ? 1 : 0,
                          transition: 'opacity 0.4s ease-out'
                        }}
                      />
                    </g>

                    {/* Soft glow on the line itself */}
                    <path
                      d="M0,80 C50,70 80,60 120,50 C160,40 200,45 240,30 C280,15 320,20 360,10 L400,5"
                      fill="none"
                      stroke="url(#areaShineGradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      style={{
                        opacity: isHovering ? 0.8 : 0,
                        transition: 'opacity 0.4s ease-out',
                        filter: 'blur(6px)'
                      }}
                    />

                    {/* Main line - Views */}
                    <motion.path
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      d="M0,80 C50,70 80,60 120,50 C160,40 200,45 240,30 C280,15 320,20 360,10 L400,5"
                      fill="none"
                      stroke="#0066FF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Secondary line - Engagement */}
                    <motion.path
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.7 }}
                      d="M0,85 C50,80 80,75 120,70 C160,65 200,60 240,55 C280,50 320,45 360,40 L400,35"
                      fill="none"
                      stroke="rgba(213,219,230,0.3)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Bottom Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#1a1f2e]/30 rounded-xl p-4 border border-white/[0.05]">
                  <div className="text-xs text-[#d5dbe6]/50 mb-1">Active Campaigns</div>
                  <div className="text-xl font-bold text-[#d5dbe6]">12</div>
                </div>
                <div className="bg-[#1a1f2e]/30 rounded-xl p-4 border border-white/[0.05]">
                  <div className="text-xs text-[#d5dbe6]/50 mb-1">Total Creators</div>
                  <div className="text-xl font-bold text-[#d5dbe6]">47</div>
                </div>
                <div className="bg-[#1a1f2e]/30 rounded-xl p-4 border border-white/[0.05]">
                  <div className="text-xs text-[#d5dbe6]/50 mb-1">Avg. Engagement</div>
                  <div className="text-xl font-bold text-[#d5dbe6]">8.4%</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature Cards - Takes up 2 columns */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <div className="bg-[#10131c] rounded-[24px] p-6 border border-white/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] h-full">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0066FF]/20 to-[#0066FF]/10 border border-[#0066FF]/30 flex items-center justify-center mb-4 shadow-lg"
                    whileHover={{
                      rotate: 5,
                      boxShadow: '0 0 20px rgba(0,102,255,0.4), 0 4px 12px rgba(0,0,0,0.3)',
                      borderColor: 'rgba(0,102,255,0.5)'
                    }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <feature.icon className="w-5 h-5 text-[#0066FF]" />
                  </motion.div>
                  <h3 className="text-[#d5dbe6] text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-[#d5dbe6]/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link href="/4/contact">
            <Button
              className="h-auto py-3 px-8 text-base font-medium rounded-xl bg-[#0066FF] text-white transition-all duration-200 hover:bg-[#0055DD] cursor-pointer"
              style={{
                boxShadow: '0 4px 24px rgba(0, 102, 255, 0.3)'
              }}
            >
              See It In Action
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
