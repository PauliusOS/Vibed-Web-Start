"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "motion/react";

const statsConfig = [
  {
    metricType: "creatorsOnline" as const,
    label: "Creators Online",
    formatter: (val: number) => val.toLocaleString(),
    isLive: true,
  },
  {
    metricType: "totalCreators" as const,
    label: "Active Creators",
    formatter: (val: number) => val.toLocaleString(),
  },
  {
    metricType: "activeCampaigns" as const,
    label: "Live Campaigns",
    formatter: (val: number) => val.toLocaleString(),
  },
  {
    metricType: "totalViews" as const,
    label: "Views (7d)",
    formatter: (val: number) => {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
      return val.toLocaleString();
    },
  },
];

export function AnimatedStatsSection() {
  const stats = useQuery(api.platformStats.getLatestStats);

  if (!stats) {
    return (
      <section id="metrics" className="py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 bg-white/[0.02] rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="metrics" className="py-16 md:py-24 px-6 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header - Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl md:text-3xl font-medium text-white/90 mb-3">
            Platform Activity
          </h2>
          <p className="text-[15px] text-white/40">
            Real-time metrics from our creator network
          </p>
        </motion.div>

        {/* Stats Grid - Clean */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {statsConfig.map((config, index) => {
            const value = stats[config.metricType] ?? 0;

            return (
              <motion.div
                key={config.metricType}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                {/* Stat Value */}
                <div className="text-3xl md:text-4xl font-medium text-white mb-2 flex items-center justify-center gap-2">
                  {config.formatter(value)}
                  {config.isLive && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/50 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400/70"></span>
                    </span>
                  )}
                </div>

                {/* Label */}
                <p className="text-[13px] text-white/40">
                  {config.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Subtle divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
        />
      </div>
    </section>
  );
}
