import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, TrendingUp, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CreatorCardProps {
  userId: string;
  username: string;
  platform: "instagram" | "tiktok";
  followerCount: number;
  medianViewRate: number;
  meanViewRate: number;
  videosCount?: number;
  totalViews?: number;
  avatarUrl?: string;
}

const platformConfig = {
  instagram: {
    label: "Instagram",
    className: "bg-purple-500/10 text-purple-500",
    icon: "📸",
  },
  tiktok: {
    label: "TikTok",
    className: "bg-cyan-500/10 text-cyan-500",
    icon: "🎵",
  },
};

export function CreatorCard({
  username,
  platform,
  followerCount,
  medianViewRate,
  meanViewRate,
  videosCount,
  totalViews,
  avatarUrl,
}: CreatorCardProps) {
  const platformStyle = platformConfig[platform];

  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a] hover:border-white/20 transition-all">
      <CardContent className="p-6 space-y-4">
        {/* Creator Header */}
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 border-2 border-white/10">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={username}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <AvatarFallback className="bg-white/5 text-white text-lg">
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              @{username}
            </h3>
            <Badge className={cn("text-xs mt-1", platformStyle.className)}>
              {platformStyle.label}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-3">
          {/* Followers */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/60">
              <Users className="h-4 w-4" />
              <span className="text-sm">Followers</span>
            </div>
            <span className="text-sm font-bold text-white font-mono">
              {followerCount >= 1000000
                ? `${(followerCount / 1000000).toFixed(1)}M`
                : followerCount >= 1000
                ? `${(followerCount / 1000).toFixed(1)}K`
                : followerCount}
            </span>
          </div>

          {/* View Rates */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/60">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Median View Rate</span>
            </div>
            <span className="text-sm font-bold text-green-500 font-mono">
              {(medianViewRate * 100).toFixed(2)}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/60">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Mean View Rate</span>
            </div>
            <span className="text-sm font-bold text-blue-500 font-mono">
              {(meanViewRate * 100).toFixed(2)}%
            </span>
          </div>

          {/* Campaign Stats (if provided) */}
          {videosCount !== undefined && (
            <>
              <div className="pt-3 border-t border-white/10" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60">
                  <Video className="h-4 w-4" />
                  <span className="text-sm">Videos</span>
                </div>
                <span className="text-sm font-bold text-white font-mono">
                  {videosCount}
                </span>
              </div>
            </>
          )}

          {totalViews !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Total Views</span>
              <span className="text-sm font-bold text-white font-mono">
                {totalViews >= 1000000
                  ? `${(totalViews / 1000000).toFixed(1)}M`
                  : totalViews >= 1000
                  ? `${(totalViews / 1000).toFixed(1)}K`
                  : totalViews}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
