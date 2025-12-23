"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Bell,
  Megaphone,
  Video,
  CheckCircle,
  XCircle,
  UserPlus,
  DollarSign,
} from "lucide-react";

interface RecentActivityFeedProps {
  organizationId: Id<"organizations">;
}

type ActivityType =
  | "campaign_created"
  | "video_submitted"
  | "video_approved"
  | "video_rejected"
  | "creator_joined"
  | "payment_processed";

const activityConfig: Record<
  ActivityType,
  {
    icon: typeof Bell;
    iconColor: string;
    bgColor: string;
  }
> = {
  campaign_created: {
    icon: Megaphone,
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  video_submitted: {
    icon: Video,
    iconColor: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  video_approved: {
    icon: CheckCircle,
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  video_rejected: {
    icon: XCircle,
    iconColor: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  creator_joined: {
    icon: UserPlus,
    iconColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  payment_processed: {
    icon: DollarSign,
    iconColor: "text-green-400",
    bgColor: "bg-green-500/10",
  },
};

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
  if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }
  return "Just now";
}

function getActivityLink(
  type: ActivityType,
  metadata?: {
    campaignId?: string;
    videoId?: string;
  }
): string | null {
  if (type === "campaign_created" && metadata?.campaignId) {
    return `/admin2/campaigns/${metadata.campaignId}`;
  }
  if (
    (type === "video_submitted" ||
      type === "video_approved" ||
      type === "video_rejected") &&
    metadata?.campaignId
  ) {
    return `/admin2/campaigns/${metadata.campaignId}/videos`;
  }
  if (type === "creator_joined" && metadata?.campaignId) {
    return `/admin2/campaigns/${metadata.campaignId}/creators`;
  }
  if (type === "payment_processed") {
    return "/admin2/finance/payments";
  }
  return null;
}

export function RecentActivityFeed({
  organizationId,
}: RecentActivityFeedProps) {
  const activities = useQuery(api.analytics.getRecentActivity, {
    organizationId,
    limit: 8,
  });

  // Loading skeleton
  if (activities === undefined) {
    return <ActivitySkeleton />;
  }

  // Empty state
  if (activities.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-white/40 border border-white/5 rounded-lg bg-white/[0.01]">
        <Bell className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm">No recent activity</p>
        <p className="text-xs mt-1">Activity will appear as events occur</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((activity, index) => {
        const config = activityConfig[activity.type];
        const Icon = config.icon;
        const link = getActivityLink(activity.type, activity.metadata);

        const content = (
          <div
            className={cn(
              "group flex items-start gap-3 p-3 rounded-lg transition-all",
              link
                ? "hover:bg-white/[0.04] cursor-pointer"
                : "bg-transparent"
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center",
                config.bgColor
              )}
            >
              <Icon className={cn("w-4 h-4", config.iconColor)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/90 leading-tight">
                {activity.description}
              </p>
              <p className="text-xs text-white/40 mt-1">
                {formatRelativeTime(activity.timestamp)}
              </p>
            </div>

            {/* Link indicator */}
            {link && (
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  className="w-4 h-4 text-white/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            )}
          </div>
        );

        return link ? (
          <Link href={link} key={activity.id}>
            {content}
          </Link>
        ) : (
          <div key={activity.id}>{content}</div>
        );
      })}

      {/* View all link */}
      <div className="pt-2 border-t border-white/5">
        <Link
          href="/admin2/notifications"
          className="flex items-center justify-center gap-2 py-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
        >
          View all activity
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="space-y-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3">
          <Skeleton className="w-9 h-9 rounded-lg bg-white/5" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-3 w-20 bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
