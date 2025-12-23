"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  TrendingUp,
  Users,
  Eye,
  Heart,
  DollarSign,
  Instagram,
  Music,
  Star,
  UserPlus,
  ExternalLink,
} from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface CreatorCardProps {
  creator: Doc<"creatorProfiles">;
  onAddToRoster?: (creator: Doc<"creatorProfiles">) => void;
  onViewDetails?: (creator: Doc<"creatorProfiles">) => void;
  onAnalyze?: (creator: Doc<"creatorProfiles">) => void;
  showActions?: boolean;
}

export function CreatorCard({
  creator,
  onAddToRoster,
  onViewDetails,
  onAnalyze,
  showActions = true,
}: CreatorCardProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      case "tiktok":
        return <Music className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "bg-gradient-to-br from-purple-500 to-pink-500";
      case "tiktok":
        return "bg-black";
      default:
        return "bg-primary";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatRate = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  // Mock rating and reliability - replace with real data
  const rating = 4.5;
  const reliabilityRate = 92;
  const totalEarned = 12500;

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50">
      <div className="p-6 space-y-4">
        {/* Header with Avatar */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Platform Badge as Avatar */}
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white",
                getPlatformColor(creator.platform)
              )}
            >
              {getPlatformIcon(creator.platform)}
            </div>

            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                @{creator.username}
              </h3>
              <Badge variant="secondary" className="text-xs capitalize">
                {creator.platform}
              </Badge>
            </div>
          </div>

          {/* Actions Menu */}
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onAddToRoster && (
                  <DropdownMenuItem onClick={() => onAddToRoster(creator)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add to Roster
                  </DropdownMenuItem>
                )}
                {onViewDetails && (
                  <DropdownMenuItem onClick={() => onViewDetails(creator)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                )}
                {onAnalyze && (
                  <DropdownMenuItem onClick={() => onAnalyze(creator)}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analyze
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => window.open(creator.profileUrl, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Followers */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="w-3 h-3" />
              Followers
            </div>
            <div className="text-lg font-bold">
              {formatNumber(creator.followerCount)}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Star className="w-3 h-3" />
              Rating
            </div>
            <div className="text-lg font-bold flex items-center gap-1">
              {rating}
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            </div>
          </div>

          {/* Median View Rate */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Median Views
            </div>
            <div className="text-lg font-bold text-primary">
              {formatRate(creator.medianViewRate)}
            </div>
          </div>

          {/* Mean View Rate */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Mean Views
            </div>
            <div className="text-lg font-bold text-primary">
              {formatRate(creator.meanViewRate)}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="pt-3 border-t flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Heart className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">{reliabilityRate}%</span>
            <span>reliability</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">${formatNumber(totalEarned)}</span>
            <span>earned</span>
          </div>
        </div>

        {/* Most Viewed Video */}
        {creator.mostViewedVideoUrl && (
          <div className="pt-3 border-t">
            <div className="text-xs text-muted-foreground mb-1">Most Viewed Video</div>
            <a
              href={creator.mostViewedVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              {formatNumber(creator.mostViewedVideoViews)} views
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </Card>
  );
}
