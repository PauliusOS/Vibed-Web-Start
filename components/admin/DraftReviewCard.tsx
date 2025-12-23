"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { FileVideo, Clock, Instagram, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}

interface DraftVideo {
  _id: Id<"videos">;
  platform: "instagram" | "tiktok";
  creatorId?: string;
  addedAt: number;
  draftVersion?: number;
  status: string;
  submissionType: string;
  videoUrl?: string;
  fileId?: Id<"_storage">;
}

interface DraftReviewCardProps {
  draft: DraftVideo;
  isSelected: boolean;
  onClick: () => void;
}

export function DraftReviewCard({ draft, isSelected, onClick }: DraftReviewCardProps) {
  const PlatformIcon = draft.platform === "instagram" ? Instagram : TikTokIcon;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:border-primary/50",
        isSelected && "border-primary ring-1 ring-primary"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Thumbnail placeholder */}
          <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center shrink-0">
            <FileVideo className="h-6 w-6 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <PlatformIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium truncate">
                Draft v{draft.draftVersion || 1}
              </span>
              <Badge variant="outline" className="text-xs">
                {draft.status === "pending_approval" ? "Pending" : draft.status}
              </Badge>
            </div>

            {/* Creator */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <User className="h-3 w-3" />
              <span className="truncate">
                {draft.creatorId?.split("|")[1] || "Unassigned"}
              </span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {formatDistanceToNow(draft.addedAt, { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
