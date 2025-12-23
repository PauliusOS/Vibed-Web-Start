import { Eye, Heart, MessageSquare, Share2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadgePremium } from "./StatusBadgePremium";
import { PlatformBadge } from "./PlatformBadge";
import { CreatorInfo } from "./CreatorInfo";
import { VideoCardActions } from "./VideoCardActions";
import { SyncingIndicator } from "../SyncingIndicator";
import { NoDataBadge } from "../NoDataBadge";
import { MetricDisplay } from "../MetricDisplay";
import { MetricsErrorBadge } from "../MetricsErrorBadge";
import { formatTimeAgo, calculateEngagementRate, truncateUrl } from "@/lib/video-helpers";

interface EnhancedVideoRowProps {
  video: {
    _id: string;
    platform: "instagram" | "tiktok";
    status: "pending" | "approved" | "tracking" | "rejected";
    videoUrl: string;
    videoThumbnailUrl?: string | null;
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

export function EnhancedVideoRow({
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
}: EnhancedVideoRowProps) {
  const engagementRate = video.engagementRate ?? calculateEngagementRate(video);

  return (
    <TableRow
      className={`border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors ${
        selected ? "bg-blue-500/5" : ""
      } ${className}`}
    >
      {/* Selection Checkbox */}
      {onToggleSelect && (
        <TableCell className="w-12">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect(video._id)}
            className="h-4 w-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
            aria-label="Select video"
          />
        </TableCell>
      )}

      {/* Video Info (Thumbnail + Creator) */}
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          {/* Thumbnail */}
          <div className="relative w-20 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-white/[0.02]">
            {video.videoThumbnailUrl ? (
              <img
                src={video.videoThumbnailUrl}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs text-white/30">No thumb</span>
              </div>
            )}
          </div>

          {/* Creator Info + URL */}
          <div className="flex-1 min-w-0">
            <CreatorInfo
              username={video.creatorUsername}
              displayName={video.creatorDisplayName}
              followerCount={video.creatorFollowerCount}
              profilePictureUrl={video.creatorProfilePictureUrl}
              variant="compact"
            />
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors truncate block mt-1"
              title={video.videoUrl}
            >
              {truncateUrl(video.videoUrl, 40)}
            </a>
          </div>
        </div>
      </TableCell>

      {/* Platform */}
      <TableCell>
        <PlatformBadge platform={video.platform} variant="compact" />
      </TableCell>

      {/* Status */}
      <TableCell>
        <StatusBadgePremium status={video.status} />
      </TableCell>

      {/* Views */}
      <TableCell>
        {video.isAwaitingFirstSync ? (
          <SyncingIndicator />
        ) : video.hasMetricsFetchError ? (
          <MetricsErrorBadge
            error={video.lastMetricsFetchError}
            lastAttempt={video.lastMetricsFetch}
          />
        ) : !video.hasMetrics ? (
          <NoDataBadge />
        ) : (
          <MetricDisplay value={video.views || 0} icon={Eye} color="text-indigo-400" />
        )}
      </TableCell>

      {/* Likes */}
      <TableCell>
        {video.isAwaitingFirstSync ? (
          <SyncingIndicator />
        ) : video.hasMetricsFetchError || !video.hasMetrics ? (
          <NoDataBadge />
        ) : (
          <MetricDisplay value={video.likes || 0} icon={Heart} color="text-rose-400" />
        )}
      </TableCell>

      {/* Comments */}
      <TableCell>
        {video.isAwaitingFirstSync ? (
          <SyncingIndicator />
        ) : video.hasMetricsFetchError || !video.hasMetrics ? (
          <NoDataBadge />
        ) : (
          <MetricDisplay value={video.comments || 0} icon={MessageSquare} color="text-blue-400" />
        )}
      </TableCell>

      {/* Shares */}
      <TableCell>
        {video.isAwaitingFirstSync ? (
          <SyncingIndicator />
        ) : video.hasMetricsFetchError || !video.hasMetrics ? (
          <NoDataBadge />
        ) : (
          <MetricDisplay value={video.shares || 0} icon={Share2} color="text-emerald-400" />
        )}
      </TableCell>

      {/* Engagement Rate */}
      <TableCell>
        {video.isAwaitingFirstSync ? (
          <SyncingIndicator />
        ) : video.hasMetricsFetchError || !video.hasMetrics ? (
          <NoDataBadge />
        ) : (
          <span className="text-sm text-white tabular-nums">
            {engagementRate.toFixed(2)}%
          </span>
        )}
      </TableCell>

      {/* Added */}
      <TableCell>
        <span className="text-xs text-white/40">
          {formatTimeAgo(video.addedAt)}
        </span>
      </TableCell>

      {/* Actions */}
      <TableCell>
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
      </TableCell>
    </TableRow>
  );
}
