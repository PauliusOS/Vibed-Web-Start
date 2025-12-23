"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Marquee } from "@/components/ui/marquee";
import { IconBrandInstagram, IconBrandTiktok } from "@tabler/icons-react";

interface CreatorAvatarStreamProps {
  limit?: number;
  speed?: "slow" | "normal" | "fast";
  pauseOnHover?: boolean;
}

export function CreatorAvatarStream({
  limit = 30,
  speed = "normal",
  pauseOnHover = true,
}: CreatorAvatarStreamProps) {
  const creators = useQuery(api.homepageData.getFeaturedCreators, { limit });

  if (!creators || creators.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Loading creators...</p>
        </div>
      </div>
    );
  }

  // Split creators into two rows for better visual effect
  const firstRow = creators.slice(0, Math.ceil(creators.length / 2));
  const secondRow = creators.slice(Math.ceil(creators.length / 2));

  return (
    <div className="relative w-full">
      <div className="space-y-4">
        {/* First Row - Left to Right */}
        <Marquee pauseOnHover={pauseOnHover} className="[--duration:40s]">
          {firstRow.map((creator) => (
            <CreatorCard key={creator._id} creator={creator} />
          ))}
        </Marquee>

        {/* Second Row - Right to Left */}
        <Marquee reverse pauseOnHover={pauseOnHover} className="[--duration:40s]">
          {secondRow.map((creator) => (
            <CreatorCard key={creator._id} creator={creator} />
          ))}
        </Marquee>
      </div>

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent"></div>
    </div>
  );
}

interface CreatorCardProps {
  creator: {
    _id: any;
    username: string | null;
    platform: "instagram" | "tiktok";
    followerCount: number | null;
    avatarUrl?: string;
  };
}

function CreatorCard({ creator }: CreatorCardProps) {
  const PlatformIcon =
    creator.platform === "instagram" ? IconBrandInstagram : IconBrandTiktok;

  const platformColor =
    creator.platform === "instagram"
      ? "text-pink-500"
      : "text-cyan-500";

  const platformBg =
    creator.platform === "instagram"
      ? "bg-pink-500/10"
      : "bg-cyan-500/10";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="group relative mx-2 w-[200px] cursor-pointer"
    >
      <div className="rounded-xl border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/50">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <AvatarImage src={creator.avatarUrl} alt={creator.username || "Creator"} />
              <AvatarFallback className="text-xs">
                {creator.username?.slice(0, 2).toUpperCase() || "CR"}
              </AvatarFallback>
            </Avatar>

            {/* Platform badge */}
            <div className={`absolute -bottom-1 -right-1 ${platformBg} rounded-full p-1`}>
              <PlatformIcon className={`h-3 w-3 ${platformColor}`} />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">
              {creator.username || "Creator"}
            </p>
            {creator.followerCount !== null && (
              <p className="text-xs text-muted-foreground">
                {formatFollowerCount(creator.followerCount)} followers
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function formatFollowerCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}K`;
  }
  return count.toString();
}
