import { Eye, Heart, MessageSquare, Share2 } from "lucide-react";
import { VideoThumbnail } from "./VideoThumbnail";
import { StatusBadgePremium } from "./StatusBadgePremium";
import { PlatformBadge } from "./PlatformBadge";
import { CreatorInfo } from "./CreatorInfo";
import { EngagementBar } from "./EngagementBar";
import { VideoCardActions } from "./VideoCardActions";
import { SyncingIndicator } from "../SyncingIndicator";
import { NoDataBadge } from "../NoDataBadge";
import { MetricDisplay } from "../MetricDisplay";
import { MetricsErrorBadge } from "../MetricsErrorBadge";
import { formatNumber, calculateEngagementRate, formatTimeAgo } from "@/lib/video-helpers";

interface EnhancedVideoCardProps {
  video: {
    _id: string;
    platform: "instagram" | "tiktok";
    status: "pending" | "approved" | "tracking" | "rejected";
    videoUrl: string;
    videoThumbnailUrl?: string | null;
    videoDescription?: string | null;
    creatorUsername?: string;
    creatorDisplayName?: string;
    creatorFollowerCount?: number;
    creatorProfilePictureUrl?: string;
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    engagementRate?: number;
    hasMetrics?: boolean;
    isAwaitingFirstSync?: boolean;
    hasMetricsFetchError?: boolean;
    lastMetricsFetch?: number | null;
    lastMetricsFetchError?: string | null;
    addedAt: number;
  };
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRefreshMetrics?: (id: string) => void;
  isRefreshing?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  className?: string;
}

export function EnhancedVideoCard({
  video,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  onRefreshMetrics,
  isRefreshing = false,
  selected = false,
  onToggleSelect,
  className = "",
}: EnhancedVideoCardProps) {
  const engagementRate = video.engagementRate ?? calculateEngagementRate(video);

  return (
    <div
      className={`bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden transition-all duration-200 hover:bg-white/[0.04] hover:border-white/[0.08] hover:shadow-[0_0_20px_rgb(255_255_255/0.05)] ${
        selected ? "ring-2 ring-blue-500/50" : ""
      } ${className}`}
    >
      {/* Thumbnail Section */}
      <div className="relative">
        <VideoThumbnail
          thumbnailUrl={video.videoThumbnailUrl}
          platform={video.platform}
          aspectRatio="video"
          overlayBadges={
            <>
              {/* Top-right: Status badge */}
              <div className="absolute top-2 right-2">
                <StatusBadgePremium status={video.status} variant="compact" />
              </div>

              {/* Bottom-left: Platform badge */}
              <div className="absolute bottom-2 left-2">
                <PlatformBadge platform={video.platform} variant="compact" />
              </div>

              {/* Selection checkbox */}
              {onToggleSelect && (
                <div className="absolute top-2 left-2 pointer-events-auto">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleSelect(video._id)}
                    className="h-4 w-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                    aria-label="Select video"
                  />
                </div>
              )}
            </>
          }
        />
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Creator Info */}
        <CreatorInfo
          username={video.creatorUsername}
          displayName={video.creatorDisplayName}
          followerCount={video.creatorFollowerCount}
          profilePictureUrl={video.creatorProfilePictureUrl}
        />

        {/* Video Description (truncated) */}
        {video.videoDescription && (
          <p className="text-sm text-white/70 line-clamp-2">
            {video.videoDescription}
          </p>
        )}

        {/* Metrics Grid */}
        {video.isAwaitingFirstSync ? (
          <div className="py-6 flex items-center justify-center">
            <SyncingIndicator size="md" />
          </div>
        ) : video.hasMetricsFetchError ? (
          <div className="py-6 flex items-center justify-center">
            <MetricsErrorBadge
              error={video.lastMetricsFetchError}
              lastAttempt={video.lastMetricsFetch}
            />
          </div>
        ) : !video.hasMetrics ? (
          <div className="py-6 flex items-center justify-center">
            <NoDataBadge />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {/* Views */}
            <div className="text-center">
              <Eye className="w-4 h-4 mx-auto text-indigo-400 mb-1" aria-hidden="true" />
              <p className="text-sm font-medium text-white tabular-nums">
                {formatNumber(video.views || 0)}
              </p>
              <p className="text-xs text-white/40 uppercase tracking-wider">Views</p>
            </div>

            {/* Likes */}
            <div className="text-center">
              <Heart className="w-4 h-4 mx-auto text-rose-400 mb-1" aria-hidden="true" />
              <p className="text-sm font-medium text-white tabular-nums">
                {formatNumber(video.likes || 0)}
              </p>
              <p className="text-xs text-white/40 uppercase tracking-wider">Likes</p>
            </div>

            {/* Comments */}
            <div className="text-center">
              <MessageSquare className="w-4 h-4 mx-auto text-blue-400 mb-1" aria-hidden="true" />
              <p className="text-sm font-medium text-white tabular-nums">
                {formatNumber(video.comments || 0)}
              </p>
              <p className="text-xs text-white/40 uppercase tracking-wider">Comments</p>
            </div>

            {/* Shares */}
            <div className="text-center">
              <Share2 className="w-4 h-4 mx-auto text-emerald-400 mb-1" aria-hidden="true" />
              <p className="text-sm font-medium text-white tabular-nums">
                {formatNumber(video.shares || 0)}
              </p>
              <p className="text-xs text-white/40 uppercase tracking-wider">Shares</p>
            </div>
          </div>
        )}

        {/* Engagement Rate Bar */}
        {video.hasMetrics && !video.hasMetricsFetchError && (
          <div className="pt-3 border-t border-white/[0.06]">
            <EngagementBar rate={engagementRate} showLabel={false} />
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-white/40">Engagement</span>
              <span className="text-xs font-semibold text-white tabular-nums">
                {engagementRate.toFixed(2)}%
              </span>
            </div>
          </div>
        )}

        {/* Footer: Timestamp + Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <span className="text-xs text-white/40">
            {formatTimeAgo(video.addedAt)}
          </span>

          <VideoCardActions
            videoStatus={video.status}
            videoUrl={video.videoUrl}
            onApprove={onApprove ? () => onApprove(video._id) : undefined}
            onReject={onReject ? () => onReject(video._id) : undefined}
            onEdit={onEdit ? () => onEdit(video._id) : undefined}
            onDelete={onDelete ? () => onDelete(video._id) : undefined}
            onRefreshMetrics={onRefreshMetrics ? () => onRefreshMetrics(video._id) : undefined}
            isRefreshing={isRefreshing}
            variant="compact"
          />
        </div>
      </div>
    </div>
  );
}
