"use client";

import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShowcaseCard } from "@/components/ui/showcase-card";
import { Eye, TrendingUp, Video, Users, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { framerCardVariants } from "@/lib/animations";

interface Creator {
  _id: string;
  userId: string;
  username: string;
  displayName?: string;
  profilePictureUrl?: string;
  coverImageUrl?: string; // Custom uploaded cover image
  platform: "tiktok" | "instagram";
  followerCount: number;
  medianViews7d?: number;
  engagementRate?: number;
  videoCount?: number;
}

interface CreatorShowcaseCardProps {
  creator: Creator;
  isSelected?: boolean;
  onToggleSelect?: (creatorId: string) => void;
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  onViewProfile?: (creator: Creator) => void;
  onMessage?: (creator: Creator) => void;
  className?: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function CreatorShowcaseCard({
  creator,
  isSelected = false,
  onToggleSelect,
  isExpanded,
  onExpandChange,
  onViewProfile,
  onMessage,
  className,
}: CreatorShowcaseCardProps) {
  const stats = [
    {
      label: 'Followers',
      value: formatNumber(creator.followerCount),
      icon: Users
    },
    {
      label: 'Median Views',
      value: formatNumber(creator.medianViews7d || 0),
      icon: Eye
    },
    {
      label: 'Engagement',
      value: `${creator.engagementRate?.toFixed(1) || 0}%`,
      icon: TrendingUp
    },
    {
      label: 'Videos',
      value: creator.videoCount || 0,
      icon: Video
    }
  ];

  // Image fallback gradient
  const imageFallback = (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600">
      <span className="text-white text-5xl font-semibold">
        {creator.displayName?.[0] || creator.username[0]}
      </span>
    </div>
  );

  // Corner avatar overlay with profile pic + follower count
  const avatarOverlay = (
    <div className="flex items-center gap-2">
      <Avatar className="w-9 h-9 border-2 border-white/30">
        <AvatarImage src={creator.profilePictureUrl} />
        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs">
          {creator.displayName?.[0] || creator.username[0]}
        </AvatarFallback>
      </Avatar>
      <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
        {formatNumber(creator.followerCount)}
      </span>
    </div>
  );

  // Use coverImageUrl if available, otherwise fall back to profilePictureUrl
  const mainImageUrl = creator.coverImageUrl || creator.profilePictureUrl;

  return (
    <div className={cn("relative group", className)}>
      <ShowcaseCard
        title={creator.displayName || creator.username}
        subtitle={`@${creator.username} · ${creator.platform}`}
        imageUrl={mainImageUrl}
        imageFallback={imageFallback}
        imageAlt={`${creator.displayName || creator.username}'s cover`}
        avatarOverlay={avatarOverlay}
        isExpanded={isExpanded}
        onExpandChange={onExpandChange}
      >
        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 gap-2"
          variants={framerCardVariants.contentStagger}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={framerCardVariants.item}
              className="bg-white/5 rounded-lg p-2.5"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <stat.icon className="w-3 h-3 text-white/60" />
                <span className="text-[10px] text-white/60">{stat.label}</span>
              </div>
              <div className="text-base font-bold text-white">{stat.value}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-2 mt-3"
          variants={framerCardVariants.item}
        >
          <Button
            size="sm"
            variant="secondary"
            className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0 text-xs h-8"
            onClick={() => onViewProfile?.(creator)}
          >
            View Profile
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0 text-xs h-8"
            onClick={() => onMessage?.(creator)}
          >
            Message
          </Button>
        </motion.div>
      </ShowcaseCard>

      {/* Selection Checkbox */}
      {onToggleSelect && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(creator.userId);
          }}
          className={cn(
            "absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all z-30",
            isSelected
              ? "bg-cyan-500 border-cyan-500 scale-100"
              : "border-white/30 hover:border-white/50 opacity-0 group-hover:opacity-100 scale-90 hover:scale-100"
          )}
        >
          {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
        </button>
      )}
    </div>
  );
}

export type { Creator, CreatorShowcaseCardProps };
