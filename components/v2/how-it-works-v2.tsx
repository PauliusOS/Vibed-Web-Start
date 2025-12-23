'use client';

import { Layers, Users, Handshake, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

export function HowItWorksV2() {
  const cards = [
    {
      icon: Layers,
      title: 'Consultation & Strategy',
      description: 'We start with a deep dive into your brand, goals, and budget. Our team crafts a custom influencer strategy tailored to your unique narrative.',
      delay: 0.1,
    },
    {
      icon: Users,
      title: 'Perfect-Fit Influencer Matching',
      description: 'We hand-pick creators from our vetted network who align with your brand values and audience. No guesswork—just data-driven matches that deliver results.',
      delay: 0.2,
    },
    {
      icon: Handshake,
      title: 'Negotiation & Campaign Launch',
      description: 'We negotiate the best deals on your behalf, maximizing your budget. Once approved, we manage the entire campaign launch process seamlessly.',
      delay: 0.1,
    },
    {
      icon: BarChart3,
      title: 'Track & Optimize in Real-Time',
      description: 'Monitor campaign performance through our proprietary platform. Track metrics, engagement, and ROI—all in one transparent dashboard.',
      delay: 0.2,
    },
  ];

  return (
    <section id="how-it-works" className="relative py-20 sm:py-24 md:py-32 bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#f4f4f4] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_2px_8px_rgba(255,255,255,0.95)]">
            <Layers className="w-4 h-4 text-[#6b6b6b]" />
            <span className="text-sm font-medium text-[#3a3a3a] uppercase tracking-wider">How It Works</span>
          </div>
        </motion.div>

        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[#16101e] text-4xl sm:text-5xl md:text-6xl font-serif italic mb-4 sm:mb-6"
          >
            All steps in 1 process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#16101e]/70 text-lg sm:text-xl max-w-3xl mx-auto"
          >
            From strategy to results, we handle everything so you can focus on your brand.
          </motion.p>
        </div>

        {/* Cards Grid - First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {cards.slice(0, 2).map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: card.delay }}
            >
              <div className="bg-[#f4f4f4] rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 items-start shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_4px_12px_rgba(255,255,255,0.95)] h-full">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center mb-4 shadow-lg">
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[#16101e] text-xl font-semibold mb-3">{card.title}</h3>
                  <p className="text-[#16101e]/70 text-sm sm:text-base leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cards Grid - Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {cards.slice(2, 4).map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: card.delay }}
            >
              <div className="bg-[#f4f4f4] rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 items-start shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_4px_12px_rgba(255,255,255,0.95)] h-full">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center mb-4 shadow-lg">
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[#16101e] text-xl font-semibold mb-3">{card.title}</h3>
                  <p className="text-[#16101e]/70 text-sm sm:text-base leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
