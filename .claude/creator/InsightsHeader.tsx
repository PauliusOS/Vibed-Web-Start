"use client";

import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface InsightsHeaderProps {
  userName?: string;
}

export function InsightsHeader({ userName }: InsightsHeaderProps) {
  const today = format(new Date(), "EEEE, MMMM d");
  const greeting = getGreeting();

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6"
    >
      {/* Date line first - always visible */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-base text-white/50 mb-3"
      >
        {today} · Your performance insights
      </motion.p>

      {/* Header with icon */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <TrendingUp className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-xl lg:text-2xl font-medium text-white/60 tracking-tight"
          >
            {greeting}
            {userName && (
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                , {userName}
              </span>
            )}
          </motion.h1>
        </div>
      </div>
    </motion.div>
  );
}
