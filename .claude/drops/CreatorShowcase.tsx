"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Star, Instagram, Music } from "lucide-react";
import { cn } from "@/lib/utils";

interface Creator {
  userId: string;
  username: string;
  platform: "instagram" | "tiktok";
  followerCount?: number;
  verified?: boolean;
  profileImage?: string;
}

interface CreatorShowcaseProps {
  creators?: Creator[];
  title?: string;
  description?: string;
  className?: string;
}

function formatFollowers(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toLocaleString();
}

function getPlatformIcon(platform: "instagram" | "tiktok") {
  switch (platform) {
    case "instagram":
      return Instagram;
    case "tiktok":
      return Music;
    default:
      return Users;
  }
}

function getPlatformColor(platform: "instagram" | "tiktok") {
  switch (platform) {
    case "instagram":
      return "text-pink-600 dark:text-pink-400";
    case "tiktok":
      return "text-black dark:text-white";
    default:
      return "text-muted-foreground";
  }
}

export function CreatorShowcase({
  creators,
  title = "Featured Creators",
  description = "Work with talented creators in this campaign",
  className,
}: CreatorShowcaseProps) {
  if (!creators || creators.length === 0) {
    return null;
  }

  return (
    <Card className={cn("bg-card border-border shadow-lg", className)}>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-5 w-5 text-primary" />
          <CardTitle className="text-2xl">{title}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creators.map((creator) => {
            const PlatformIcon = getPlatformIcon(creator.platform);
            const platformColor = getPlatformColor(creator.platform);

            return (
              <div
                key={creator.userId}
                className="group relative p-4 rounded-xl border border-border bg-gradient-to-br from-card via-card to-muted/20 hover:shadow-md transition-all duration-200"
              >
                {/* Creator Avatar */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative">
                    {creator.profileImage ? (
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20">
                        <img
                          src={creator.profileImage}
                          alt={creator.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20">
                        <Users className="h-7 w-7 text-primary" />
                      </div>
                    )}
                    {creator.verified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center border-2 border-card">
                        <Star className="h-3 w-3 text-white fill-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground truncate">
                        {creator.username}
                      </h4>
                    </div>
                    {creator.followerCount && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatFollowers(creator.followerCount)} followers
                      </p>
                    )}
                  </div>
                </div>

                {/* Platform Badge */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs bg-muted/50 border-border"
                  >
                    <PlatformIcon className={cn("h-3 w-3 mr-1", platformColor)} />
                    {creator.platform === "instagram" ? "Instagram" : "TikTok"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Reach Summary */}
        {creators.some((c) => c.followerCount) && (
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-card border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Combined Reach
                </span>
              </div>
              <span className="text-2xl font-bold text-primary">
                {formatFollowers(
                  creators.reduce((sum, c) => sum + (c.followerCount || 0), 0)
                )}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total followers across all featured creators
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
