"use client";

import { motion } from "motion/react";
import { FramerDualLineChart } from "@/components/admin/charts";

interface PremiumAreaChartProps {
  followerGrowth?: Array<{
    date: string;
    followers: number;
  }> | null;
  engagementHistory?: Array<{
    date: string;
    engagementRate: number;
  }> | null;
  isLoading?: boolean;
}

function ChartSkeleton() {
  return (
    <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-[24px]">
      <div className="h-[320px] w-full rounded bg-white/[0.06] animate-pulse" />
    </div>
  );
}

export function PremiumAreaChart({
  followerGrowth,
  engagementHistory,
  isLoading = false,
}: PremiumAreaChartProps) {
  if (isLoading || followerGrowth === undefined || engagementHistory === undefined) {
    return <ChartSkeleton />;
  }

  // Combine data for dual-line chart
  const chartData = followerGrowth?.length
    ? followerGrowth.map((fg, index) => ({
        date: fg.date,
        followers: fg.followers,
        engagementRate: engagementHistory?.[index]?.engagementRate || 0,
      }))
    : [];

  const hasChartData = chartData.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
    >
      {/* Glass container */}
      <div
        className={cn(
          "p-6 rounded-xl",
          "bg-white/[0.02] border border-white/[0.06]",
          "backdrop-blur-[24px]",
          "hover:bg-white/[0.03] hover:border-white/[0.08]",
          "transition-all duration-300"
        )}
      >
        {/* Top shine effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {!hasChartData ? (
          <div className="h-[320px] flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                <svg
                  className="h-6 w-6 text-blue-400/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-white/40">No chart data available yet</p>
              <p className="text-xs text-white/30 mt-1">Start posting to see your analytics</p>
            </div>
          </div>
        ) : (
          <FramerDualLineChart
            data={chartData}
            lines={[
              {
                dataKey: "followers",
                label: "Followers",
                color: "#38bdf8", // Cyan
              },
              {
                dataKey: "engagementRate",
                label: "Engagement %",
                color: "#3b82f6", // Blue
              },
            ]}
            height={320}
            formatXAxis={(date) => {
              const d = new Date(date);
              return d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
            formatValue={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
              return value.toLocaleString();
            }}
          />
        )}

        {/* Bottom glow effect */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}

// Import cn utility
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
