'use client';

import { useState } from 'react';
import { Users, TrendingUp, BarChart3, Target, Handshake, Shield, Eye, DollarSign, Sparkles, Clock } from 'lucide-react';
import { motion } from 'motion/react';

// Simple graphic components using cursor-following shine animations
function NetworkGraphic() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="relative w-full h-48 flex items-center justify-center overflow-hidden rounded-2xl"
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
      {/* Cursor-following shine overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(0,102,255,0.15) 0%, rgba(0,102,255,0.05) 25%, transparent 50%)`,
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 0.3s ease-out'
        }}
      />

      {/* Central Icon */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          whileHover={{ rotate: 3, scale: 1.02 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="w-24 h-24 rounded-full flex items-center justify-center border border-white/10"
          style={{
            background: 'linear-gradient(145deg, #1a1f2e, #10131c)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
          }}
        >
          <motion.div
            whileHover={{ rotate: -5, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0066FF]/20 to-[#0066FF]/10 border border-[#0066FF]/30 flex items-center justify-center"
          >
            <Users className="w-7 h-7 text-[#0066FF]" />
          </motion.div>
        </motion.div>

        {/* Floating user icons around */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ rotate: 8, scale: 1.1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2 }}
          className="absolute -top-2 -right-8 w-10 h-10 rounded-full flex items-center justify-center border border-white/10"
          style={{
            background: 'linear-gradient(145deg, #1a1f2e, #10131c)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
          }}
        >
          <div className="w-6 h-6 rounded-full bg-[#0066FF]/15 border border-[#0066FF]/25 flex items-center justify-center">
            <Users className="w-3 h-3 text-[#0066FF]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ rotate: -8, scale: 1.1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2 }}
          className="absolute -bottom-2 -left-8 w-10 h-10 rounded-full flex items-center justify-center border border-white/10"
          style={{
            background: 'linear-gradient(145deg, #1a1f2e, #10131c)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
          }}
        >
          <div className="w-6 h-6 rounded-full bg-[#0066FF]/15 border border-[#0066FF]/25 flex items-center justify-center">
            <Users className="w-3 h-3 text-[#0066FF]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ rotate: 10, scale: 1.15 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2 }}
          className="absolute top-1/2 -translate-y-1/2 -right-14 w-8 h-8 rounded-full flex items-center justify-center border border-white/10"
          style={{
            background: 'linear-gradient(145deg, #1a1f2e, #10131c)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          <div className="w-5 h-5 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center justify-center">
            <Users className="w-2.5 h-2.5 text-[#0066FF]/80" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function MatchingGraphic() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="relative w-full h-48 flex items-center justify-center overflow-hidden rounded-2xl"
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
      {/* Cursor-following shine overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(0,102,255,0.15) 0%, rgba(0,102,255,0.05) 25%, transparent 50%)`,
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 0.3s ease-out'
        }}
      />

      {/* Bar chart representation */}
      <div className="flex items-end gap-3 h-32">
        {[40, 65, 50, 80, 95].map((height, i) => (
          <motion.div
            key={i}
            className="w-8 rounded-t-lg border border-white/10"
            initial={{ height: 0 }}
            whileInView={{ height: `${height}%` }}
            whileHover={{ scaleY: 1.05, scaleX: 1.08 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
            style={{
              background: i === 4 ? 'linear-gradient(to top, #0066FF, #3388FF)' : `linear-gradient(145deg, rgba(255,255,255,${0.05 + i * 0.03}), rgba(255,255,255,${0.02 + i * 0.02}))`,
              boxShadow: i === 4
                ? '0 4px 16px rgba(0,102,255,0.4)'
                : '0 4px 12px rgba(0,0,0,0.2)',
              transformOrigin: 'bottom'
            }}
          />
        ))}
      </div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ rotate: 3, scale: 1.05 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2 }}
        className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium text-[#d5dbe6] border border-white/10"
        style={{
          background: 'linear-gradient(145deg, #1a1f2e, #10131c)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        95% Match Rate
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ rotate: -3, scale: 1.05 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-8 left-4 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 text-[#0066FF] border border-[#0066FF]/30"
        style={{
          background: 'rgba(0,102,255,0.1)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        <Sparkles className="w-3 h-3" />
        AI-Powered
      </motion.div>
    </div>
  );
}

function TrackingGraphic() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="relative w-full h-48 flex items-center justify-center overflow-hidden rounded-2xl"
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
      {/* Cursor-following shine overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(0,102,255,0.15) 0%, rgba(0,102,255,0.05) 25%, transparent 50%)`,
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 0.3s ease-out'
        }}
      />

      {/* Clock/Dashboard representation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <motion.div
          whileHover={{ rotate: 5, scale: 1.03 }}
          transition={{ duration: 0.3 }}
          className="w-28 h-28 rounded-full flex items-center justify-center relative border border-white/10"
          style={{
            background: 'linear-gradient(145deg, #1a1f2e, #10131c)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
          }}
        >
          {/* Inner circle */}
          <motion.div
            whileHover={{ rotate: -8, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="w-20 h-20 rounded-full flex items-center justify-center border border-white/[0.07]"
            style={{
              background: 'linear-gradient(145deg, #10131c, #1a1f2e)',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            <BarChart3 className="w-8 h-8 text-[#0066FF]" />
          </motion.div>

          {/* Clock hands/indicators */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#d5dbe6]/30" />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#d5dbe6]/30" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#d5dbe6]/30" />
        </motion.div>
      </motion.div>

      {/* Live indicator */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        whileHover={{ rotate: 3, scale: 1.08 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2 }}
        className="absolute top-4 right-8 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 text-[#0066FF] border border-[#0066FF]/30"
        style={{
          background: 'rgba(0,102,255,0.1)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
        Live
      </motion.div>
    </div>
  );
}

export function WhyChooseUsV4() {
  const features = [
    {
      title: 'Vetted Creator Network',
      description: 'Hand-picked influencers verified for authenticity, engagement, and brand safety.',
      graphic: NetworkGraphic,
    },
    {
      title: 'Data-Driven Matching',
      description: 'AI-powered matching connects your brand with creators who deliver results.',
      graphic: MatchingGraphic,
    },
    {
      title: 'Real-Time Tracking',
      description: 'Monitor campaign performance 24/7 with our transparent analytics dashboard.',
      graphic: TrackingGraphic,
    },
  ];

  const benefits = [
    { icon: Target, label: 'Custom Strategy' },
    { icon: Handshake, label: 'Expert Negotiation' },
    { icon: Eye, label: 'Full Transparency' },
    { icon: DollarSign, label: 'ROI Focused' },
    { icon: Users, label: 'End-to-End Support' },
    { icon: Shield, label: 'Brand Safety' },
    { icon: TrendingUp, label: 'Proven Results' },
    { icon: Clock, label: 'Fast Turnaround' },
  ];

  // Duplicate benefits for seamless scroll
  const duplicatedBenefits = [...benefits, ...benefits, ...benefits, ...benefits];

  return (
    <section id="why-us" className="relative py-20 sm:py-24 md:py-32 border-t border-white/[0.07] overflow-hidden bg-[#04070d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10"
              style={{
                background: 'linear-gradient(145deg, #1a1f2e, #10131c)',
                boxShadow: '0 6px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
              }}
            >
              <Sparkles className="w-4 h-4 text-[#0066FF]" />
              <span className="text-sm font-medium text-[#d5dbe6] uppercase tracking-wider">Benefits</span>
            </div>
          </motion.div>

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
            Why Choose SylcRoad?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#d5dbe6]/70 text-lg sm:text-xl max-w-3xl mx-auto"
          >
            Partner with an agency that delivers real results through data-driven influencer marketing.
          </motion.p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
            >
              <div
                className="rounded-[24px] p-6 sm:p-8 h-full border border-white/[0.07]"
                style={{
                  background: 'linear-gradient(145deg, #10131c, #0a0d14)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
              >
                {/* Graphic */}
                <feature.graphic />

                {/* Content */}
                <h3 className="text-[#d5dbe6] text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#d5dbe6]/70 text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scrolling Benefits Ticker */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="relative mt-8">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-48 bg-gradient-to-r from-[#04070d] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-48 bg-gradient-to-l from-[#04070d] to-transparent z-10 pointer-events-none" />

          <div className="flex animate-scroll-benefits">
            {duplicatedBenefits.map((benefit, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-3"
              >
                <div
                  className="flex items-center gap-2.5 px-5 py-3 rounded-full border border-white/10"
                  style={{
                    background: 'linear-gradient(145deg, #1a1f2e, #10131c)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                  }}
                >
                  <benefit.icon className="w-4 h-4 text-[#0066FF]" />
                  <span className="text-sm font-medium text-[#d5dbe6] whitespace-nowrap">
                    {benefit.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes scroll-benefits {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .animate-scroll-benefits {
          display: flex;
          width: max-content;
          animation: scroll-benefits 30s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}
