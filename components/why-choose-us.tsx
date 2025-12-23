'use client';

import { Users, TrendingUp, BarChart3, Target, Handshake, Shield, Eye, DollarSign, Sparkles, Clock } from 'lucide-react';
import { MotionPreset } from '@/components/ui/motion-preset';
import { motion } from 'motion/react';

// Custom SVG Graphics matching Orbai neumorphic style with animations
function NetworkGraphic() {
  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      {/* Central Icon */}
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
            boxShadow: '8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff'
          }}
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#000] flex items-center justify-center">
            <Users className="w-7 h-7 text-white" />
          </div>
        </motion.div>

        {/* Floating user icons around */}
        <motion.div
          className="absolute -top-2 -right-8 w-10 h-10 rounded-full flex items-center justify-center"
          animate={{
            y: [-3, 3, -3],
            x: [0, 2, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
            boxShadow: '4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff'
          }}
        >
          <div className="w-6 h-6 rounded-full bg-[#1a1a1a] flex items-center justify-center">
            <Users className="w-3 h-3 text-white" />
          </div>
        </motion.div>

        <motion.div
          className="absolute -bottom-2 -left-8 w-10 h-10 rounded-full flex items-center justify-center"
          animate={{
            y: [3, -3, 3],
            x: [0, -2, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
            boxShadow: '4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff'
          }}
        >
          <div className="w-6 h-6 rounded-full bg-[#1a1a1a] flex items-center justify-center">
            <Users className="w-3 h-3 text-white" />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -right-14 w-8 h-8 rounded-full flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
            boxShadow: '3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff'
          }}
        >
          <div className="w-5 h-5 rounded-full bg-[#1a1a1a]/80 flex items-center justify-center">
            <Users className="w-2.5 h-2.5 text-white" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function MatchingGraphic() {
  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      {/* Bar chart representation */}
      <div className="flex items-end gap-3 h-32">
        {[40, 65, 50, 80, 95].map((height, i) => (
          <motion.div
            key={i}
            className="w-8 rounded-t-lg"
            initial={{ height: 0 }}
            whileInView={{ height: `${height}%` }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: i * 0.15,
              ease: "easeOut"
            }}
            style={{
              background: i === 4 ? 'linear-gradient(to top, #1a1a1a, #3a3a3a)' : 'linear-gradient(145deg, #ffffff, #e6e6e6)',
              boxShadow: i === 4
                ? '4px 4px 8px #d1d1d1, -2px -2px 6px #ffffff'
                : '4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff'
            }}
          />
        ))}
      </div>

      {/* Floating badges */}
      <motion.div
        className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
          boxShadow: '3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff'
        }}
      >
        95% Match Rate
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-4 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
        animate={{
          y: [-2, 2, -2],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
          boxShadow: '3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff'
        }}
      >
        <Sparkles className="w-3 h-3" />
        AI-Powered
      </motion.div>
    </div>
  );
}

function TrackingGraphic() {
  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      {/* Clock/Dashboard representation */}
      <motion.div
        className="w-28 h-28 rounded-full flex items-center justify-center relative"
        animate={{
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
          boxShadow: '10px 10px 20px #d1d1d1, -10px -10px 20px #ffffff'
        }}
      >
        {/* Inner circle */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #e6e6e6, #ffffff)',
            boxShadow: 'inset 4px 4px 8px #d1d1d1, inset -4px -4px 8px #ffffff'
          }}
        >
          <BarChart3 className="w-8 h-8 text-[#1a1a1a]" />
        </div>

        {/* Clock hands/indicators */}
        <motion.div
          className="absolute top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#1a1a1a]"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#1a1a1a]/40" />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#1a1a1a]/40" />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#1a1a1a]/40" />
      </motion.div>

      {/* Live indicator */}
      <motion.div
        className="absolute top-4 right-8 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5"
        animate={{
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
          boxShadow: '3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff'
        }}
      >
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Live
      </motion.div>
    </div>
  );
}

export function WhyChooseUs() {
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
    <section id="why-us" className="relative py-20 sm:py-24 md:py-32 border-t border-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          {/* Badge */}
          <MotionPreset
            fade
            slide={{ direction: 'up', offset: 20 }}
            delay={0}
            className="flex justify-center mb-6"
          >
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full"
              style={{
                background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
                boxShadow: '6px 6px 12px #d1d1d1, -6px -6px 12px #ffffff'
              }}
            >
              <Sparkles className="w-4 h-4 text-[#1a1a1a]" />
              <span className="text-sm font-medium text-[#1a1a1a] uppercase tracking-wider">Benefits</span>
            </div>
          </MotionPreset>

          <MotionPreset
            fade
            slide={{ direction: 'up', offset: 30 }}
            delay={0.1}
          >
            <h2 className="text-[#16101e] text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              Why Choose SylcRoad?
            </h2>
          </MotionPreset>

          <MotionPreset
            fade
            slide={{ direction: 'up', offset: 20 }}
            delay={0.2}
          >
            <p className="text-[#16101e]/70 text-lg sm:text-xl max-w-3xl mx-auto">
              Partner with an agency that delivers real results through data-driven influencer marketing.
            </p>
          </MotionPreset>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <MotionPreset
              key={feature.title}
              fade
              slide={{ direction: 'up', offset: 40 }}
              delay={0.1 * (index + 1)}
            >
              <div
                className="rounded-[24px] p-6 sm:p-8 h-full"
                style={{
                  background: 'linear-gradient(145deg, #f8f8f8, #e8e8e8)',
                  boxShadow: '10px 10px 20px #d1d1d1, -10px -10px 20px #ffffff'
                }}
              >
                {/* Graphic */}
                <feature.graphic />

                {/* Content */}
                <h3 className="text-[#16101e] text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#16101e]/70 text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </MotionPreset>
          ))}
        </div>
      </div>

      {/* Scrolling Benefits Ticker */}
      <MotionPreset
        fade
        slide={{ direction: 'up', offset: 30 }}
        delay={0.4}
      >
        <div className="relative mt-8">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-48 bg-gradient-to-r from-[#f4f4f4] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-48 bg-gradient-to-l from-[#f4f4f4] to-transparent z-10 pointer-events-none" />

          <div className="flex animate-scroll-benefits">
            {duplicatedBenefits.map((benefit, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-3"
              >
                <div
                  className="flex items-center gap-2.5 px-5 py-3 rounded-full"
                  style={{
                    background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
                    boxShadow: '4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff'
                  }}
                >
                  <benefit.icon className="w-4 h-4 text-[#1a1a1a]" />
                  <span className="text-sm font-medium text-[#1a1a1a] whitespace-nowrap">
                    {benefit.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MotionPreset>

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
