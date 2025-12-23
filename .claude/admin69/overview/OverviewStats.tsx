"use client";

import { FramerCard } from "@/components/framer-analytics";
import { FolderKanban, CheckSquare, Users, Video, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  accentColor?: string;
}

function StatCard({ label, value, icon, trend, accentColor = "cyan" }: StatCardProps) {
  return (
    <FramerCard padding="md" className="group hover:border-cyan-500/30 transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-wider text-white/40 font-medium">
            {label}
          </p>
          <p className="text-3xl font-semibold text-white tracking-tight">{value}</p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-[12px]",
              trend.positive ? "text-emerald-400" : "text-red-400"
            )}>
              {trend.positive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-2.5 rounded-lg transition-all",
          accentColor === "cyan" && "bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20",
          accentColor === "blue" && "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20",
          accentColor === "purple" && "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20",
          accentColor === "emerald" && "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20"
        )}>
          {icon}
        </div>
      </div>
    </FramerCard>
  );
}

interface OverviewStatsProps {
  activeCampaigns: number;
  pendingTasks: number;
  totalCreators: number;
  totalVideos: number;
  campaignTrend?: { value: string; positive: boolean };
  taskTrend?: { value: string; positive: boolean };
  creatorTrend?: { value: string; positive: boolean };
  videoTrend?: { value: string; positive: boolean };
}

export function OverviewStats({
  activeCampaigns,
  pendingTasks,
  totalCreators,
  totalVideos,
  campaignTrend,
  taskTrend,
  creatorTrend,
  videoTrend,
}: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Active Campaigns"
        value={activeCampaigns}
        icon={<FolderKanban className="w-5 h-5" />}
        trend={campaignTrend}
        accentColor="cyan"
      />
      <StatCard
        label="Pending Tasks"
        value={pendingTasks}
        icon={<CheckSquare className="w-5 h-5" />}
        trend={taskTrend}
        accentColor="blue"
      />
      <StatCard
        label="Total Creators"
        value={totalCreators}
        icon={<Users className="w-5 h-5" />}
        trend={creatorTrend}
        accentColor="purple"
      />
      <StatCard
        label="Total Videos"
        value={totalVideos}
        icon={<Video className="w-5 h-5" />}
        trend={videoTrend}
        accentColor="emerald"
      />
    </div>
  );
}

export default OverviewStats;
