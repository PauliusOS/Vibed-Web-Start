"use client";

import React from "react";
import { motion } from "motion/react";
import { Target, TrendingUp, Trophy } from "lucide-react";

export function StrategySection() {
  const strategyItems = [
    {
      id: 1,
      title: "Week 1-2: The Attention Game",
      description: "Cast a wide net with Generic & Entertainer creators. Test messaging, identify winning formats, and build initial awareness at scale.",
      icon: Target,
      color: "from-blue-500/10 to-blue-600/10",
      content: (
        <div className="flex flex-col justify-end h-full p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>Test messaging angles</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>Build brand awareness</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>Generate engagement data</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Week 3: Warming Up",
      description: "Shift to Sub-Niche creators for conversion-focused content. Retarget engaged audiences and build trust.",
      icon: TrendingUp,
      color: "from-cyan-500/10 to-cyan-600/10",
      content: (
        <div className="flex flex-col justify-end h-full p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Conversion messaging</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Retarget audiences</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Build authority</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Week 4: The Closer",
      description: "Deploy Niche Leaders for maximum credibility. Drive conversions through trusted recommendations at scale.",
      icon: Trophy,
      color: "from-purple-500/10 to-purple-600/10",
      content: (
        <div className="flex flex-col justify-end h-full p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>Maximum credibility</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>Drive conversions</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>Maximize ROI</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Continuous Optimization",
      description: "Weekly A/B tests across all creator categories. Performance-based budget allocation and real-time pivots.",
      icon: TrendingUp,
      color: "from-blue-500/10 to-purple-600/10",
      content: (
        <div className="flex flex-col justify-end h-full p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>Weekly A/B testing</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>Budget optimization</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>Real-time adjustments</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      id="strategy"
      className="flex flex-col items-center justify-center w-full relative px-5 md:px-10 py-12 md:py-20 bg-tech-black"
    >
      <div className="border-x mx-5 md:mx-10 relative max-w-7xl">
        {/* Decorative borders - Magic UI style */}
        <div className="absolute top-0 -left-4 md:-left-14 h-full w-4 md:w-14 text-white/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
        <div className="absolute top-0 -right-4 md:-right-14 h-full w-4 md:w-14 text-white/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="text-center mb-12 px-6"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-4">
            Our 4-Week Winning Formula
          </h2>
          <p className="text-white/70 text-lg font-medium max-w-2xl mx-auto">
            A systematic approach that progressively builds awareness, trust, and conversions
          </p>
        </motion.div>

        {/* Bento Grid - 2x2 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {strategyItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                viewport={{ once: true }}
                className="flex flex-col items-start justify-end min-h-[350px] md:min-h-[400px] p-0.5 relative before:absolute before:-left-[0.5px] before:top-0 before:z-10 before:h-full before:w-px before:bg-white/10 before:content-[''] after:absolute after:-top-[0.5px] after:left-0 after:z-10 after:h-px after:w-full after:bg-white/10 after:content-[''] group cursor-pointer hover:bg-white/5 transition-all duration-300"
              >
                {/* Content area with gradient background */}
                <div className={`relative flex size-full items-center justify-center h-full overflow-hidden bg-gradient-to-br ${item.color}`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                    <Icon className="w-32 h-32 text-white" />
                  </div>
                  {item.content}
                </div>

                {/* Text area */}
                <div className="flex-1 flex-col gap-2 p-6 bg-tech-black">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl tracking-tight font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
