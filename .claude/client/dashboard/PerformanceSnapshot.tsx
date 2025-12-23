"use client";

import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformanceSnapshotProps {
  trend: "up" | "down" | "stable";
  trendPercentage?: number;
  children?: React.ReactNode;
}

export function PerformanceSnapshot({
  trend,
  trendPercentage,
  children,
}: PerformanceSnapshotProps) {
  const trendConfig = {
    up: { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "trending up" },
    down: { icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10", label: "trending down" },
    stable: { icon: Minus, color: "text-white/60", bg: "bg-white/[0.06]", label: "stable" },
  };

  const config = trendConfig[trend];
  const TrendIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">Performance Snapshot</h2>

        {/* Trend Indicator */}
        <div className="flex items-center gap-2">
          <div className={cn("p-2 rounded-lg", config.bg)}>
            <TrendIcon className={cn("h-4 w-4", config.color)} />
          </div>
          <div>
            <p className="text-sm text-white/70">
              Performance {config.label}
              {trendPercentage !== undefined && (
                <span className={cn("ml-1 font-semibold", config.color)}>
                  {trend === "up" ? "+" : trend === "down" ? "-" : ""}{trendPercentage.toFixed(1)}%
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Additional content can be passed as children */}
      {children}
    </motion.div>
  );
}
