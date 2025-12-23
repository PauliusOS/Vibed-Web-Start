"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CreatorStoryFeedProps {
  organizationId: Id<"organizations">;
  viewerRole: "admin" | "client";
  onCreatorClick: (creatorId: string) => void;
  className?: string;
}

export function CreatorStoryFeed({
  organizationId,
  viewerRole,
  onCreatorClick,
  className,
}: CreatorStoryFeedProps) {
  const creators = useQuery(api.videoSubmissions.getCreatorsWithPendingVideos, {
    organizationId,
    viewerRole,
  });

  if (!creators || creators.length === 0) {
    return null;
  }

  return (
    <div className={cn("w-full", className)}>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4 px-1">
          {creators.map((creator) => (
            <CreatorStoryAvatar
              key={creator.creatorId}
              username={creator.username}
              displayName={creator.displayName}
              profilePictureUrl={creator.profilePictureUrl}
              pendingCount={creator.pendingCount}
              onClick={() => onCreatorClick(creator.creatorId)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5 bg-white/5" />
      </ScrollArea>
    </div>
  );
}

interface CreatorStoryAvatarProps {
  username: string | null;
  displayName: string | null;
  profilePictureUrl: string | null;
  pendingCount: number;
  onClick: () => void;
}

function CreatorStoryAvatar({
  username,
  displayName,
  profilePictureUrl,
  pendingCount,
  onClick,
}: CreatorStoryAvatarProps) {
  const displayUsername = username || displayName || "Creator";
  const truncatedUsername = truncateUsername(displayUsername, 12);
  const initials = getInitials(displayUsername);
  const isActive = pendingCount > 0;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
    >
      {/* Ring + Avatar */}
      <div
        className={cn(
          "p-[3px] rounded-full transition-all duration-200",
          isActive
            ? "bg-gradient-to-br from-cyan-400 to-blue-600"
            : "bg-white/20 group-hover:bg-white/30"
        )}
      >
        <Avatar className="h-16 w-16 border-2 border-[#0a0a0a]">
          <AvatarImage
            src={profilePictureUrl || undefined}
            alt={displayUsername}
            className="object-cover"
          />
          <AvatarFallback
            className={cn(
              "text-sm font-semibold",
              isActive
                ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
                : "bg-white/10 text-white/60"
            )}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Username */}
      <span
        className={cn(
          "text-xs font-medium text-center max-w-[72px] truncate transition-colors duration-200",
          isActive
            ? "text-white group-hover:text-cyan-300"
            : "text-white/50 group-hover:text-white/70"
        )}
      >
        {truncatedUsername}
      </span>
    </button>
  );
}

/**
 * Format time since submission into a short string (e.g., "2h", "4h", "12h")
 */
function formatTimeSince(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes < 1 ? "now" : `${diffMinutes}m`;
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return `${Math.floor(diffDays / 7)}w ago`;
}

/**
 * Truncate username to specified length with ellipsis
 */
function truncateUsername(username: string, maxLength: number): string {
  if (username.length <= maxLength) {
    return username;
  }
  return `${username.slice(0, maxLength - 2)}..`;
}

/**
 * Get initials from username or display name
 */
function getInitials(name: string): string {
  const parts = name.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
