"use client";

import { FramerCard } from "@/components/framer-analytics";
import {
  FolderKanban,
  Video,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  DollarSign,
  FileText,
  Send,
  Edit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export interface ActivityItem {
  id: string;
  type:
    | "campaign_created"
    | "campaign_status_changed"
    | "creator_added"
    | "video_submitted"
    | "video_approved"
    | "video_rejected"
    | "task_completed"
    | "task_created"
    | "payment_sent"
    | "brief_created"
    | "brief_sent"
    | "comment_added";
  title: string;
  description?: string;
  timestamp: number;
  metadata?: {
    campaignName?: string;
    creatorName?: string;
    amount?: number;
  };
}

const iconMap = {
  campaign_created: FolderKanban,
  campaign_status_changed: Edit,
  creator_added: Users,
  video_submitted: Video,
  video_approved: CheckCircle,
  video_rejected: AlertCircle,
  task_completed: CheckCircle,
  task_created: FileText,
  payment_sent: DollarSign,
  brief_created: FileText,
  brief_sent: Send,
  comment_added: MessageSquare,
};

const colorMap = {
  campaign_created: "text-cyan-400 bg-cyan-500/10",
  campaign_status_changed: "text-blue-400 bg-blue-500/10",
  creator_added: "text-purple-400 bg-purple-500/10",
  video_submitted: "text-amber-400 bg-amber-500/10",
  video_approved: "text-emerald-400 bg-emerald-500/10",
  video_rejected: "text-red-400 bg-red-500/10",
  task_completed: "text-emerald-400 bg-emerald-500/10",
  task_created: "text-blue-400 bg-blue-500/10",
  payment_sent: "text-emerald-400 bg-emerald-500/10",
  brief_created: "text-cyan-400 bg-cyan-500/10",
  brief_sent: "text-cyan-400 bg-cyan-500/10",
  comment_added: "text-white/60 bg-white/10",
};

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
  title?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export function ActivityFeed({
  activities,
  maxItems = 8,
  title = "Recent Activity",
  showViewAll = true,
  onViewAll
}: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <FramerCard padding="none" className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        {showViewAll && activities.length > maxItems && (
          <button
            onClick={onViewAll}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View all
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {displayedActivities.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-white/40 text-sm">
            No recent activity
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {displayedActivities.map((activity) => {
              const Icon = iconMap[activity.type];
              const colors = colorMap[activity.type];

              return (
                <div
                  key={activity.id}
                  className="px-6 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("p-1.5 rounded-lg", colors)}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-white/90 leading-snug">
                        {activity.title}
                      </p>
                      {activity.description && (
                        <p className="text-[12px] text-white/40 mt-0.5 truncate">
                          {activity.description}
                        </p>
                      )}
                      <p className="text-[11px] text-white/30 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </FramerCard>
  );
}

export default ActivityFeed;
