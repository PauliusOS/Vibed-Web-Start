import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ActivityItem {
  id: string;
  type: "video_submitted" | "video_approved" | "video_rejected" | "campaign_created" | "payment_made" | "feedback_submitted";
  actor: {
    name: string;
    avatar?: string;
  };
  message: string;
  timestamp: number;
  metadata?: {
    campaignName?: string;
    videoUrl?: string;
    amount?: number;
  };
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
}

const activityConfig = {
  video_submitted: { icon: "📹", color: "text-blue-500" },
  video_approved: { icon: "✅", color: "text-green-500" },
  video_rejected: { icon: "❌", color: "text-red-500" },
  campaign_created: { icon: "🎯", color: "text-purple-500" },
  payment_made: { icon: "💰", color: "text-yellow-500" },
  feedback_submitted: { icon: "💬", color: "text-cyan-500" },
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

export function ActivityFeed({ activities, maxItems = 10 }: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);

  if (activities.length === 0) {
    return (
      <Card className="bg-[#1a1a1a] border-[#3a3a3a]">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-white/60">
            No recent activity to show
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a]">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedActivities.map((activity) => {
            const config = activityConfig[activity.type];
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-4 last:pb-0 border-b border-white/10 last:border-0"
              >
                {/* Avatar */}
                <Avatar className="h-8 w-8 border border-white/10">
                  {activity.actor.avatar ? (
                    <Image
                      src={activity.actor.avatar}
                      alt={activity.actor.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="bg-white/5 text-white text-xs">
                      {activity.actor.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm text-white/80">
                    <span className="font-medium text-white">
                      {activity.actor.name}
                    </span>{" "}
                    {activity.message}
                  </p>
                  {activity.metadata?.campaignName && (
                    <Badge className="bg-white/5 text-white/60 text-xs">
                      {activity.metadata.campaignName}
                    </Badge>
                  )}
                  <p className="text-xs text-white/40">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>

                {/* Activity Icon */}
                <div className={cn("text-lg", config.color)}>
                  {config.icon}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function ActivityFeedSkeleton() {
  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a]">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 pb-4 border-b border-white/10 last:border-0"
            >
              <div className="h-8 w-8 rounded-full bg-white/5 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-white/5 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
