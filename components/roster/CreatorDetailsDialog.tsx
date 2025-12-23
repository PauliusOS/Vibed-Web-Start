"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Instagram,
  Music,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  DollarSign,
  Calendar,
  X,
} from "lucide-react";

interface CreatorDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  creator: {
    userId: string;
    name: string;
    email?: string;
    platforms: string[];
    totalFollowers: number;
    totalVideos: number;
    totalViews: number;
    avgEngagementRate: number;
    activeCampaignsCount: number;
    rostersCount: number;
    joinedAt: number;
    lastActive: number;
    rosterIds?: string[];
  } | null;
  details?: {
    profiles: Array<{
      platform: string;
      username: string;
      followerCount: number;
      profileUrl: string;
    }>;
    totalViews: number;
    totalEngagement: number;
    payments: {
      totalEarned: number;
      pendingPayment: number;
    };
  } | null;
}

export function CreatorDetailsDialog({
  open,
  onClose,
  creator,
  details,
}: CreatorDetailsDialogProps) {
  if (!creator) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "tiktok":
        return <Music className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "tiktok":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-[#3a3a3a] text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border-2 border-[#3a3a3a]">
                <AvatarFallback className="bg-[#2a2a2a] text-white text-xl font-semibold">
                  {creator.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl text-white">
                  {creator.name}
                </DialogTitle>
                <p className="text-muted-foreground">{creator.email}</p>
                <div className="flex gap-2 mt-2">
                  {creator.platforms.map((platform) => (
                    <Badge
                      key={platform}
                      className={getPlatformColor(platform)}
                    >
                      {getPlatformIcon(platform)}
                      <span className="ml-1">{platform}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-[#2a2a2a]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-[#0A0A0A] border-[#3a3a3a]">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">
                  Followers
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  {formatNumber(creator.totalFollowers)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0A0A0A] border-[#3a3a3a]">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Videos</div>
                <div className="text-2xl font-bold font-mono text-white">
                  {creator.totalVideos}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0A0A0A] border-[#3a3a3a]">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Views</div>
                <div className="text-2xl font-bold font-mono text-white">
                  {formatNumber(creator.totalViews)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0A0A0A] border-[#3a3a3a]">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">
                  Engagement
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  {creator.avgEngagementRate.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Profiles */}
          {details?.profiles && details.profiles.length > 0 && (
            <Card className="bg-[#0A0A0A] border-[#3a3a3a]">
              <CardHeader>
                <CardTitle className="text-white">Platform Profiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {details.profiles.map((profile, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a1a] border border-[#3a3a3a]"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={getPlatformColor(profile.platform)}>
                        {getPlatformIcon(profile.platform)}
                      </Badge>
                      <div>
                        <div className="font-medium text-white">
                          @{profile.username}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatNumber(profile.followerCount)} followers
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(profile.profileUrl, "_blank")}
                      className="bg-transparent border-[#3a3a3a] text-white hover:bg-[#2a2a2a]"
                    >
                      View Profile
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Activity & Earnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-[#0A0A0A] border-[#3a3a3a]">
              <CardHeader>
                <CardTitle className="text-white">Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Campaigns</span>
                  <span className="font-mono font-semibold text-white">
                    {creator.activeCampaignsCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Roster Membership</span>
                  <span className="font-mono font-semibold text-white">
                    {creator.rostersCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="text-sm text-white">
                    {formatDate(creator.joinedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Active</span>
                  <span className="text-sm text-white">
                    {formatDate(creator.lastActive)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {details?.payments && (
              <Card className="bg-[#0A0A0A] border-[#3a3a3a]">
                <CardHeader>
                  <CardTitle className="text-white">Earnings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Earned</span>
                    <span className="font-mono font-semibold text-green-500">
                      ${details.payments.totalEarned.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-mono font-semibold text-yellow-500">
                      ${details.payments.pendingPayment.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

