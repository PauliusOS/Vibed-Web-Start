"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  IconUserPlus,
  IconRocket,
  IconVideo,
  IconTrophy,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";

const activityTypeConfig = {
  creator_joined: {
    icon: IconUserPlus,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  campaign_launched: {
    icon: IconRocket,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  video_posted: {
    icon: IconVideo,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  milestone_reached: {
    icon: IconTrophy,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
};

interface ActivityFeedManagerProps {
  limit?: number;
  showTitle?: boolean;
  maxHeight?: string;
}

export function ActivityFeedManager({
  limit = 10,
  showTitle = true,
  maxHeight = "500px",
}: ActivityFeedManagerProps) {
  const activities = useQuery(api.platformActivity.getRecentActivities, { limit });

  if (!activities) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-card rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <IconVideo className="h-10 w-10 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium text-muted-foreground">No recent activity</p>
        <p className="text-sm text-muted-foreground mt-1">
          Check back soon for the latest updates
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Recent Activity
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      )}

      <ScrollArea style={{ maxHeight }}>
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {activities.map((activity, index) => {
              const config = activityTypeConfig[activity.activityType];
              const Icon = config.icon;

              return (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  layout
                >
                  <Card className="group hover:shadow-md transition-all duration-300 hover:border-primary/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`${config.bgColor} p-2.5 rounded-lg shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`h-5 w-5 ${config.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2 mb-1">
                            {activity.displayText}
                          </p>

                          {activity.creatorName && (
                            <p className="text-xs text-muted-foreground">
                              by {activity.creatorName}
                            </p>
                          )}

                          {activity.metadata && (
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              {activity.metadata.campaignName && (
                                <span className="inline-flex items-center gap-1">
                                  <IconRocket className="h-3 w-3" />
                                  {activity.metadata.campaignName}
                                </span>
                              )}
                              {activity.metadata.viewCount !== undefined && (
                                <span className="inline-flex items-center gap-1">
                                  <IconVideo className="h-3 w-3" />
                                  {activity.metadata.viewCount.toLocaleString()} views
                                </span>
                              )}
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                          </p>
                        </div>

                        {/* Subtle pulse indicator for recent activities (less than 5 min old) */}
                        {Date.now() - activity.timestamp < 5 * 60 * 1000 && (
                          <div className="shrink-0">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
