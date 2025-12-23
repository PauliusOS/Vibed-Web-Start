"use client";

import { motion } from "motion/react";
import { Clock, Video, CheckCircle, XCircle, DollarSign, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  type: "video_submitted" | "video_approved" | "video_rejected" | "payment_received";
  timestamp: number;
  message: string;
  metadata?: Record<string, unknown>;
}

interface RecentActivitySectionProps {
  activities?: Activity[] | null;
}

// Blue-only theme with semantic green/red for approved/rejected
const activityConfig = {
  video_submitted: { icon: Video, color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/20" },
  video_approved: { icon: CheckCircle, color: "text-emerald-400", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/20" }, // Keep semantic green
  video_rejected: { icon: XCircle, color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/20" }, // Keep semantic red
  payment_received: { icon: DollarSign, color: "text-sky-400", bgColor: "bg-sky-400/10", borderColor: "border-sky-400/20" }, // Changed from amber to sky blue
};

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

function ActivitySkeleton() {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-white/[0.04] last:border-0">
      <div className="h-10 w-10 rounded-lg bg-white/[0.06] animate-pulse" />
      <div className="flex-1">
        <div className="h-4 w-3/4 rounded bg-white/[0.06] animate-pulse mb-2" />
        <div className="h-3 w-24 rounded bg-white/[0.06] animate-pulse" />
      </div>
    </div>
  );
}

export function RecentActivitySection({ activities }: RecentActivitySectionProps) {
  if (activities === undefined) {
    return (
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 text-white">
            <Clock className="h-5 w-5 text-white/50" />
            <h2 className="font-semibold">Recent Activity</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <ActivitySkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 text-white">
            <Clock className="h-5 w-5 text-white/50" />
            <h2 className="font-semibold">Recent Activity</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mb-3">
              <Sparkles className="h-6 w-6 text-white/30" />
            </div>
            <p className="text-sm text-white/50">No recent activity</p>
            <p className="text-xs text-white/30 mt-1">
              Your activity will appear here as you submit videos and receive payments
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all"
    >
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Clock className="h-5 w-5 text-white/50" />
            <h2 className="font-semibold">Recent Activity</h2>
          </div>
          <span className="text-xs text-white/40">
            Last {activities.length} activities
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex items-start gap-3 pb-4 last:pb-0 border-b border-white/[0.04] last:border-0"
              >
                {/* Icon */}
                <div className={cn("p-2.5 rounded-lg border", config.bgColor, config.borderColor)}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white leading-relaxed">
                    {activity.message}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
