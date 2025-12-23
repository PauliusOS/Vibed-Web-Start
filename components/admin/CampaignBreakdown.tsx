"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Target, Pause, CheckCircle, Clock } from "lucide-react";

interface CampaignStatusData {
  status: "active" | "paused" | "completed" | "draft";
  count: number;
  percentage: number;
}

interface CampaignBreakdownProps {
  campaigns: CampaignStatusData[];
  className?: string;
}

const statusConfig = {
  active: { icon: Target, label: "Active" },
  paused: { icon: Pause, label: "Paused" },
  completed: { icon: CheckCircle, label: "Completed" },
  draft: { icon: Clock, label: "Draft" },
};

/**
 * CampaignBreakdown - Shows campaign status breakdown with progress bars
 * Follows Framer Analytics style (similar to DeviceBreakdown)
 */
export function CampaignBreakdown({ campaigns, className }: CampaignBreakdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className={cn(
        "p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]",
        className
      )}
    >
      <h3 className="text-sm font-medium text-white/80 mb-4">Campaigns</h3>
      <div className="space-y-3">
        {campaigns.length === 0 ? (
          <p className="text-sm text-white/40">No campaign data available</p>
        ) : (
          campaigns.map((campaign, index) => {
            const config = statusConfig[campaign.status];
            const Icon = config.icon;

            return (
              <motion.div
                key={campaign.status}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.45 + index * 0.05 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-white/50" />
                  <span className="text-sm text-white/70 capitalize">
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/60">
                    {campaign.count}
                  </span>
                  <div className="w-20">
                    <ProgressBar percentage={campaign.percentage} color="blue" />
                  </div>
                  <span className="text-xs text-white/40 w-10 text-right">
                    {campaign.percentage}%
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

/**
 * ProgressBar - Minimal progress bar
 */
interface ProgressBarProps {
  percentage: number;
  color?: "cyan" | "blue";
}

function ProgressBar({ percentage, color = "blue" }: ProgressBarProps) {
  const colors = {
    cyan: "bg-cyan-400",
    blue: "bg-blue-500",
  };

  return (
    <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className={cn("h-full rounded-full", colors[color])}
      />
    </div>
  );
}
