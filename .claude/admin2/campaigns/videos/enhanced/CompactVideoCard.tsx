"use client";

import { Eye, Heart, MessageSquare, Share2, ExternalLink, MoreHorizontal, RefreshCw, Check, X, Trash2 } from "lucide-react";
import { StatusBadgePremium } from "./StatusBadgePremium";
import { PlatformBadge } from "./PlatformBadge";
import { SyncingIndicator } from "../SyncingIndicator";
import { formatNumber, formatTimeAgo } from "@/lib/video-helpers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CompactVideoCardProps {
  video: {
    _id: string;
    platform: "instagram" | "tiktok";
    status: "pending" | "approved" | "tracking" | "rejected";
    videoUrl: string;
    videoThumbnailUrl?: string | null;
    videoDescription?: string | null;
    creatorUsername?: string;
    creatorDisplayName?: string;
    creatorProfilePictureUrl?: string;
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    hasMetrics?: boolean;
    isAwaitingFirstSync?: boolean;
    hasMetricsFetchError?: boolean;
    addedAt: number;
  };
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRefreshMetrics?: (id: string) => void;
  isRefreshing?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function CompactVideoCard({
  video,
  onApprove,
  onReject,
  onDelete,
  onRefreshMetrics,
  isRefreshing = false,
  selected = false,
  onToggleSelect,
}: CompactVideoCardProps) {
  const hasValidThumbnail = video.videoThumbnailUrl && !video.hasMetricsFetchError;

  return (
    <div
      className={`group bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden transition-all duration-200 hover:bg-white/[0.04] hover:border-white/[0.1] ${
        selected ? "ring-2 ring-blue-500/50" : ""
      }`}
    >
      <div className="flex gap-3 p-3">
        {/* Compact Thumbnail */}
        <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-white/[0.04]">
          {hasValidThumbnail ? (
            <img
              src={video.videoThumbnailUrl!}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PlatformBadge platform={video.platform} variant="icon" />
            </div>
          )}

          {/* Selection checkbox */}
          {onToggleSelect && (
            <div className="absolute top-1 left-1">
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggleSelect(video._id)}
                className="h-3.5 w-3.5 rounded border-white/30 bg-black/50 text-blue-500 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* Top: Creator + Status */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {video.creatorProfilePictureUrl && (
                <img
                  src={video.creatorProfilePictureUrl}
                  alt=""
                  className="w-5 h-5 rounded-full flex-shrink-0"
                />
              )}
              <span className="text-[13px] font-medium text-white truncate">
                @{video.creatorUsername || "unknown"}
              </span>
              <PlatformBadge platform={video.platform} variant="compact" />
            </div>
            <StatusBadgePremium status={video.status} variant="compact" />
          </div>

          {/* Metrics Row */}
          {video.isAwaitingFirstSync ? (
            <div className="flex items-center gap-2 py-1">
              <SyncingIndicator size="sm" />
              <span className="text-[11px] text-white/40">Syncing metrics...</span>
            </div>
          ) : video.hasMetrics ? (
            <div className="flex items-center gap-4 py-1">
              <MetricItem icon={Eye} value={video.views || 0} color="text-indigo-400" />
              <MetricItem icon={Heart} value={video.likes || 0} color="text-rose-400" />
              <MetricItem icon={MessageSquare} value={video.comments || 0} color="text-blue-400" />
              <MetricItem icon={Share2} value={video.shares || 0} color="text-emerald-400" />
            </div>
          ) : (
            <div className="py-1">
              <span className="text-[11px] text-white/30">No metrics yet</span>
            </div>
          )}

          {/* Bottom: Time + Actions */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/30">
              {formatTimeAgo(video.addedAt)}
            </span>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded hover:bg-white/[0.08] text-white/40 hover:text-white transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded hover:bg-white/[0.08] text-white/40 hover:text-white transition-colors">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 bg-[#141414] border-white/10">
                  {onRefreshMetrics && (
                    <DropdownMenuItem
                      onClick={() => onRefreshMetrics(video._id)}
                      disabled={isRefreshing}
                      className="text-[12px] text-white/70 hover:text-white hover:bg-white/[0.06] cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                      Refresh
                    </DropdownMenuItem>
                  )}
                  {video.status === "pending" && onApprove && (
                    <DropdownMenuItem
                      onClick={() => onApprove(video._id)}
                      className="text-[12px] text-emerald-400 hover:text-emerald-300 hover:bg-white/[0.06] cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 mr-2" />
                      Approve
                    </DropdownMenuItem>
                  )}
                  {video.status === "pending" && onReject && (
                    <DropdownMenuItem
                      onClick={() => onReject(video._id)}
                      className="text-[12px] text-amber-400 hover:text-amber-300 hover:bg-white/[0.06] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 mr-2" />
                      Reject
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem
                        onClick={() => onDelete(video._id)}
                        className="text-[12px] text-red-400 hover:text-red-300 hover:bg-white/[0.06] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact metric display matching reference design
function MetricItem({
  icon: Icon,
  value,
  color
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className="text-[12px] font-medium text-white tabular-nums">
        {formatNumber(value)}
      </span>
    </div>
  );
}
