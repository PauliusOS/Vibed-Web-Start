'use client';

import { Layers, Users, Handshake, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

export function HowItWorksV4() {
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
    <section id="how-it-works" className="relative py-20 sm:py-24 md:py-32 bg-[#0a0d14]">
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
            <Layers className="w-4 h-4 text-[#0066FF]" />
            <span className="text-sm font-medium text-[#d5dbe6]/80 uppercase tracking-wider">How It Works</span>
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
            All steps in 1 process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#d5dbe6]/70 text-lg sm:text-xl max-w-3xl mx-auto"
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
              <div className="bg-[#10131c] rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 items-start border border-white/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] h-full">
                <div className="flex-1">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0066FF]/20 to-[#0066FF]/10 border border-[#0066FF]/30 flex items-center justify-center mb-4 shadow-lg"
                    whileHover={{
                      rotate: 5,
                      boxShadow: '0 0 20px rgba(0,102,255,0.4), 0 4px 12px rgba(0,0,0,0.3)',
                      borderColor: 'rgba(0,102,255,0.5)'
                    }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <card.icon className="w-5 h-5 text-[#0066FF]" />
                  </motion.div>
                  <h3 className="text-[#d5dbe6] text-xl font-semibold mb-3">{card.title}</h3>
                  <p className="text-[#d5dbe6]/70 text-sm sm:text-base leading-relaxed">
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
              <div className="bg-[#10131c] rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 items-start border border-white/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] h-full">
                <div className="flex-1">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0066FF]/20 to-[#0066FF]/10 border border-[#0066FF]/30 flex items-center justify-center mb-4 shadow-lg"
                    whileHover={{
                      rotate: 5,
                      boxShadow: '0 0 20px rgba(0,102,255,0.4), 0 4px 12px rgba(0,0,0,0.3)',
                      borderColor: 'rgba(0,102,255,0.5)'
                    }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <card.icon className="w-5 h-5 text-[#0066FF]" />
                  </motion.div>
                  <h3 className="text-[#d5dbe6] text-xl font-semibold mb-3">{card.title}</h3>
                  <p className="text-[#d5dbe6]/70 text-sm sm:text-base leading-relaxed">
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
