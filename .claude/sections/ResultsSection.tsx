"use client";

import React from "react";
import { motion } from "motion/react";
import { TrendingUp, Users, Target, Award } from "lucide-react";

export function ResultsSection() {
  const growthItems = [
    {
      id: 1,
      title: "500+ Campaigns Launched",
      description: "Successful influencer campaigns across every major industry with proven results and measurable ROI.",
      icon: Target,
      content: (
        <div className="flex flex-col justify-center items-center h-full p-6">
          <div className="text-6xl md:text-7xl font-bold gradient-text-blue mb-4">
            500+
          </div>
          <div className="w-full max-w-xs space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">E-Commerce</span>
              <span className="text-white font-medium">35%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: "35%" }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">SaaS</span>
              <span className="text-white font-medium">28%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: "28%" }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Health & Wellness</span>
              <span className="text-white font-medium">22%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: "22%" }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Other</span>
              <span className="text-white font-medium">15%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500" style={{ width: "15%" }} />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "4.2x Average ROI",
      description: "Average return on investment for our clients' campaigns with continuous optimization and data-driven adjustments.",
      icon: TrendingUp,
      content: (
        <div className="flex flex-col justify-center items-center h-full p-6">
          <div className="text-6xl md:text-7xl font-bold gradient-text-cyan mb-4">
            4.2x
          </div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">6.8x</div>
              <div className="text-xs text-white/60">Top Performer</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">3.1x</div>
              <div className="text-xs text-white/60">Minimum</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10 col-span-2">
              <div className="text-2xl font-bold text-white mb-1">87%</div>
              <div className="text-xs text-white/60">Success Rate</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "10K+ Creators in Network",
      description: "Vetted creators across all categories and niches with proven track records and authentic engagement.",
      icon: Users,
      content: (
        <div className="flex flex-col justify-center items-center h-full p-6">
          <div className="text-6xl md:text-7xl font-bold gradient-text-purple mb-4">
            10K+
          </div>
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-white/70">Niche Leaders: 1.2K</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-white/70">Sub-Niche: 2.8K</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-white/70">Entertainers: 3.5K</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-white/70">Generic: 2.5K</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "87% Success Rate",
      description: "Campaigns that meet or exceed performance targets through our systematic 4-week approach.",
      icon: Award,
      content: (
        <div className="flex flex-col justify-center items-center h-full p-6">
          <div className="text-6xl md:text-7xl font-bold gradient-text-blue mb-4">
            87%
          </div>
          <div className="space-y-3 w-full max-w-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white mb-1">Exceeded Targets</div>
                <div className="text-xs text-white/60">43% of campaigns</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white mb-1">Met Targets</div>
                <div className="text-xs text-white/60">44% of campaigns</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      id="results"
      className="flex flex-col items-center justify-center w-full relative px-5 md:px-10 py-12 md:py-20 bg-tech-black"
    >
      <div className="border-x mx-5 md:mx-10 relative max-w-7xl">
        {/* Decorative borders */}
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
            Results That Speak
          </h2>
          <p className="text-white/70 text-lg font-medium max-w-2xl mx-auto">
            Data-driven campaigns deliver measurable outcomes
          </p>
        </motion.div>

        {/* Growth Grid - 2x2 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-x md:divide-y-0">
          {growthItems.map((item, index) => {
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
                className="flex flex-col items-start justify-end gap-2 p-6 min-h-[400px] md:min-h-[450px] bg-tech-black hover:bg-white/5 transition-colors duration-300"
              >
                {/* Visual Content */}
                <div className="w-full flex-1 flex items-center justify-center">
                  {item.content}
                </div>

                {/* Text Area */}
                <div className="w-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
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
