"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  FramerMetricsRow,
  CountryBreakdown,
  DeviceBreakdown,
  sampleCountryData,
  sampleDeviceData,
} from "@/components/admin/charts";
import { formatCurrency } from "@/hooks/useCountAnimation";
import { FilteredPerformanceChart } from "./FilteredPerformanceChart";

interface KeyMetricsGridProps {
  insights?: {
    totalFollowers: number;
    followerGrowth: number;
    followerGrowthPercentage: number;
    totalVideos: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    avgEngagementRate: number;
    totalEarned: number;
    pendingPayment: number;
  } | null;
  followerGrowth?: Array<{
    date: string;
    followers: number;
  }> | null;
  engagementHistory?: Array<{
    date: string;
    engagementRate: number;
  }> | null;
}

function MetricsRowSkeleton() {
  return (
    <div className="flex items-center gap-8 lg:gap-12 py-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-1 min-w-fit">
          <div className="h-3 w-16 rounded bg-white/[0.06] animate-pulse" />
          <div className="h-8 w-20 rounded bg-white/[0.06] animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-[320px] w-full rounded bg-white/[0.06] animate-pulse" />
  );
}

function BreakdownSkeleton() {
  return (
    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <div className="h-4 w-20 rounded bg-white/[0.06] animate-pulse mb-4" />
      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-6 w-full rounded bg-white/[0.06] animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function KeyMetricsGrid({ insights, followerGrowth, engagementHistory }: KeyMetricsGridProps) {

  // Loading state
  if (insights === undefined) {
    return (
      <div className="w-full space-y-6">
        <MetricsRowSkeleton />
        <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <ChartSkeleton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BreakdownSkeleton />
          <BreakdownSkeleton />
        </div>
      </div>
    );
  }

  // Mock data for demo (use real data if available)
  const data = insights || {
    totalFollowers: 56929,
    followerGrowth: 1245,
    followerGrowthPercentage: 12.4,
    totalVideos: 24,
    totalViews: 39690,
    avgEngagementRate: 4.2,
    totalEarned: 12450,
    pendingPayment: 2340,
  };

  // Generate mock chart data if no real data available
  const generateMockChartData = () => {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const baseFollowers = 50000 + Math.sin(i / 3) * 5000;
      const baseViews = 30000 + Math.sin(i / 4) * 8000;
      const baseEarnings = 300 + Math.sin(i / 5) * 150;
      const views = Math.round(baseViews + Math.random() * 5000);
      const earnings = Math.round(baseEarnings + Math.random() * 100);
      data.push({
        date: date.toISOString().split("T")[0],
        followers: Math.round(baseFollowers + Math.random() * 3000),
        engagementRate: 2 + Math.random() * 4,
        views,
        earnings,
        rpm: views > 0 ? (earnings / views) * 1000 : 0, // Revenue per 1000 views
      });
    }
    return data;
  };

  // Combine data for filtered chart (use mock if no real data)
  const chartData = followerGrowth?.length
    ? followerGrowth.map((fg, index) => {
        const views = Math.round(fg.followers * 0.7 + Math.random() * 1000); // Mock views based on followers
        const earnings = Math.round(fg.followers * 0.005 + Math.random() * 50); // Mock earnings based on followers
        return {
          date: fg.date,
          followers: fg.followers,
          engagementRate: engagementHistory?.[index]?.engagementRate || 0,
          views,
          earnings,
          rpm: views > 0 ? (earnings / views) * 1000 : 0, // Revenue per 1000 views
        };
      })
    : generateMockChartData();

  const hasChartData = chartData.length > 0;

  return (
    <div className="w-full space-y-8">
      {/* 1. Metrics Row with Glow Effects */}
      <FramerMetricsRow
        variant="glow"
        glowIntensity="medium"
        animateValues={true}
        metrics={[
          {
            label: "Total Followers",
            value: data.totalFollowers,
            glowColor: "blue"
          },
          {
            label: "Avg Engagement",
            value: `${data.avgEngagementRate.toFixed(1)}%`,
            glowColor: "cyan"
          },
          {
            label: "Total Reach",
            value: data.totalViews,
            glowColor: "purple",
            isLive: true
          },
          {
            label: "Total Earned",
            value: formatCurrency(data.totalEarned),
            glowColor: "green"
          },
        ]}
      />

      {/* 2. Chart Section - Pure Black Card with Radial Glow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative p-8 rounded-xl bg-black border border-white/[0.04]"
      >
        {/* Radial glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent rounded-xl pointer-events-none" />

        <div className="relative">
          {followerGrowth === undefined || engagementHistory === undefined ? (
            <ChartSkeleton />
          ) : !hasChartData ? (
            <div className="h-[360px] flex items-center justify-center">
              <p className="text-sm text-white/40">No chart data available yet</p>
            </div>
          ) : (
            <FilteredPerformanceChart
              data={chartData}
              height={360}
              defaultMetrics={["followers", "engagementRate", "rpm"]}
            />
          )}
        </div>
      </motion.div>

      {/* 3. Country & Device Breakdown - 2 COLUMN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CountryBreakdown countries={sampleCountryData} />
        <DeviceBreakdown devices={sampleDeviceData} />
      </div>
    </div>
  );
}
