"use client";

import { motion } from "motion/react";
import { Users, Target } from "lucide-react";
import { FramerDualLineChart } from "@/components/admin/charts";

interface ChartsSectionProps {
  followerGrowth?: Array<{
    date: string;
    followers: number;
  }> | null;
  engagementHistory?: Array<{
    date: string;
    engagementRate: number;
  }> | null;
}

function ChartSkeleton() {
  return (
    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <div className="animate-pulse">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 rounded bg-white/[0.06]" />
          <div className="h-4 w-28 rounded bg-white/[0.06]" />
        </div>
        <div className="h-3 w-44 rounded bg-white/[0.06] mb-5" />
        <div className="h-[220px] w-full rounded bg-white/[0.06]" />
      </div>
    </div>
  );
}

export function ChartsSection({ followerGrowth, engagementHistory }: ChartsSectionProps) {
  if (followerGrowth === undefined || engagementHistory === undefined) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  // Combine data for dual-line chart
  const combinedData = followerGrowth?.map((fg, index) => ({
    date: fg.date,
    followers: fg.followers,
    engagementRate: engagementHistory?.[index]?.engagementRate || 0,
  })) || [];

  // Format for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const chartData = combinedData.map(d => ({
    ...d,
    displayDate: formatDate(d.date),
  }));

  const hasData = chartData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Follower Growth Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all"
      >
        <div className="mb-4">
          <div className="flex items-center gap-2 text-white mb-1">
            <Users className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-medium">Follower Growth</h3>
          </div>
          <p className="text-xs text-white/40">
            Your follower count over the last 30 days
          </p>
        </div>

        {!hasData ? (
          <div className="h-[220px] flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-blue-400/50" />
              </div>
              <p className="text-xs text-white/40">Not enough data yet</p>
            </div>
          </div>
        ) : (
          <FramerDualLineChart
            data={chartData}
            lines={[
              { dataKey: "followers", label: "Followers", color: "#38bdf8" },
              { dataKey: "engagementRate", label: "Engagement %", color: "#3b82f6" },
            ]}
            height={220}
            formatXAxis={(date) => {
              const d = new Date(date);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
            formatValue={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
              return value.toLocaleString();
            }}
          />
        )}
      </motion.div>

      {/* Engagement Rate Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all"
      >
        <div className="mb-4">
          <div className="flex items-center gap-2 text-white mb-1">
            <Target className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-medium">Performance Overview</h3>
          </div>
          <p className="text-xs text-white/40">
            Followers vs engagement rate trends
          </p>
        </div>

        {!hasData ? (
          <div className="h-[220px] flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto w-10 h-10 rounded-lg bg-sky-400/10 flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-sky-400/50" />
              </div>
              <p className="text-xs text-white/40">Not enough data yet</p>
            </div>
          </div>
        ) : (
          <FramerDualLineChart
            data={chartData}
            lines={[
              { dataKey: "engagementRate", label: "Engagement Rate", color: "#38bdf8" },
              { dataKey: "followers", label: "Followers", color: "#3b82f6" },
            ]}
            height={220}
            showYAxis={true}
            formatXAxis={(date) => {
              const d = new Date(date);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
            formatValue={(value) => {
              if (value < 100) return `${value.toFixed(1)}%`;
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
              return value.toLocaleString();
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
