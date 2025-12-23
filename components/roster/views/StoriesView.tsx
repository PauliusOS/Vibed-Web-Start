"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Creator {
  _id: string;
  userId: string;
  username: string;
  displayName?: string;
  profilePictureUrl?: string;
  platform: "tiktok" | "instagram";
  followerCount: number;
}

interface StoriesViewProps {
  creators: Creator[];
  onCreatorClick?: (creatorId: string) => void;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function StoriesView({ creators, onCreatorClick }: StoriesViewProps) {
  if (creators.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-white/60">No creators in this roster yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {creators.map((creator) => (
          <button
            key={creator.userId}
            onClick={() => onCreatorClick?.(creator.userId)}
            className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group transition-transform hover:scale-105"
          >
            {/* Ring + Avatar */}
            <div className="p-[3px] rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 transition-all duration-200">
              <Avatar className="h-20 w-20 border-[3px] border-[#0a0a0a]">
                <AvatarImage src={creator.profilePictureUrl} alt={creator.displayName} />
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-lg">
                  {creator.displayName?.[0] || creator.username[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Username */}
            <div className="text-center">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors duration-200 max-w-[90px] truncate block">
                {creator.username}
              </span>
              <span className="text-xs text-white/50 block">
                {formatNumber(creator.followerCount)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
