"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { AnalyticsHeader } from "./AnalyticsHeader";
import { OdometerMetricsRow } from "./OdometerMetricsRow";
import { PremiumAreaChart } from "./PremiumAreaChart";

interface AnalyticsOverviewSectionProps {
  insights?: {
    totalFollowers: number;
    totalViews: number;
    avgEngagementRate: number;
    totalEarned: number;
  } | null;
  activeDealCount?: number;
  followerGrowth?: Array<{ date: string; followers: number }> | null;
  engagementHistory?: Array<{ date: string; engagementRate: number }> | null;
  timeRange?: "7d" | "30d" | "90d";
  onTimeRangeChange?: (range: "7d" | "30d" | "90d") => void;
}

export function AnalyticsOverviewSection({
  insights,
  activeDealCount,
  followerGrowth,
  engagementHistory,
  timeRange = "30d",
  onTimeRangeChange,
}: AnalyticsOverviewSectionProps) {
  const [currentTimeRange, setCurrentTimeRange] = useState<"7d" | "30d" | "90d">(timeRange);

  const handleTimeRangeChange = (range: "7d" | "30d" | "90d") => {
    setCurrentTimeRange(range);
    onTimeRangeChange?.(range);
  };

  const isLoading = insights === undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.2,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative w-full"
    >
      {/* Wrapper with GlowingEffect */}
      <div className="relative">
        {/* GlowingEffect border animation */}
        <GlowingEffect
          blur={8}
          spread={40}
          proximity={200}
          disabled={false}
          borderWidth={1}
          className="rounded-xl"
        />

        {/* Content container */}
        <div className="relative space-y-6 p-6 rounded-xl bg-gradient-to-b from-white/[0.01] to-transparent">
          {/* Header */}
          <AnalyticsHeader
            title="Overview"
            timeRange={currentTimeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />

          {/* Metrics Row */}
          <OdometerMetricsRow
            activeDealCount={activeDealCount}
            totalFollowers={insights?.totalFollowers}
            totalViews={insights?.totalViews}
            avgEngagementRate={insights?.avgEngagementRate}
            totalEarned={insights?.totalEarned}
            isLoading={isLoading}
          />

          {/* Premium Area Chart */}
          <PremiumAreaChart
            followerGrowth={followerGrowth}
            engagementHistory={engagementHistory}
            isLoading={isLoading}
          />
        </div>

        {/* Subtle gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/5 to-transparent pointer-events-none rounded-b-xl" />
      </div>
    </motion.div>
  );
}
