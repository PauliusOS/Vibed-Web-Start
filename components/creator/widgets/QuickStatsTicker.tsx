"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, TrendingDown, Eye, Heart, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stat {
  id: string;
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface QuickStatsTickerProps {
  stats: {
    views?: number;
    viewsChange?: number;
    likes?: number;
    likesChange?: number;
    followers?: number;
    followersChange?: number;
  };
  updateInterval?: number;
}

export function QuickStatsTicker({
  stats,
  updateInterval = 5000
}: QuickStatsTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const allStats: Stat[] = [
    {
      id: "views",
      label: "Total Views",
      value: stats.views || 0,
      change: stats.viewsChange || 0,
      icon: <Eye className="h-4 w-4" />,
      color: "blue",
    },
    {
      id: "likes",
      label: "Total Likes",
      value: stats.likes || 0,
      change: stats.likesChange || 0,
      icon: <Heart className="h-4 w-4" />,
      color: "pink",
    },
    {
      id: "followers",
      label: "Followers",
      value: stats.followers || 0,
      change: stats.followersChange || 0,
      icon: <Users className="h-4 w-4" />,
      color: "cyan",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allStats.length);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [allStats.length, updateInterval]);

  const currentStat = allStats[currentIndex];
  const isPositive = currentStat.change >= 0;

  const colorClasses = {
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
    },
    pink: {
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
      text: "text-pink-400",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      text: "text-cyan-400",
    },
  };

  const colors = colorClasses[currentStat.color as keyof typeof colorClasses];

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/[0.02] border border-white/[0.06] p-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

      {/* Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            {/* Icon and Label */}
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                colors.bg,
                colors.border,
                "border"
              )}>
                <div className={colors.text}>
                  {currentStat.icon}
                </div>
              </div>
              <span className="text-sm text-white/50 font-medium">
                {currentStat.label}
              </span>
            </div>

            {/* Value and Change */}
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <motion.p
                  className="text-3xl font-bold text-white/90 font-mono"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  {currentStat.value.toLocaleString()}
                </motion.p>
              </div>

              {/* Change Indicator */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                  isPositive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>
                  {isPositive ? "+" : ""}
                  {currentStat.change.toFixed(1)}%
                </span>
              </motion.div>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5 pt-2">
              {allStats.map((stat, index) => (
                <div
                  key={stat.id}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    index === currentIndex
                      ? "w-6 bg-white/40"
                      : "w-1.5 bg-white/10"
                  )}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
