import { CheckCircle, XCircle, ExternalLink, MoreVertical, Pencil, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoCardActionsProps {
  videoStatus: "pending" | "approved" | "tracking" | "rejected";
  videoUrl: string;
  onApprove?: () => void;
  onReject?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewVideo?: () => void;
  onRefreshMetrics?: () => void;
  isRefreshing?: boolean;
  variant?: "full" | "compact";
  className?: string;
}

export function VideoCardActions({
  videoStatus,
  videoUrl,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  onViewVideo,
  onRefreshMetrics,
  isRefreshing,
  variant = "full",
  className = "",
}: VideoCardActionsProps) {
  const handleViewVideo = () => {
    if (onViewVideo) {
      onViewVideo();
    } else {
      window.open(videoUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {/* View Video */}
        <button
          onClick={handleViewVideo}
          className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors"
          aria-label="View video"
          title="View video"
        >
          <ExternalLink className="h-3.5 w-3.5 text-white/60" />
        </button>

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="h-3.5 w-3.5 text-white/60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/[0.06]">
            {onRefreshMetrics && (
              <DropdownMenuItem
                onClick={onRefreshMetrics}
                disabled={isRefreshing}
                className="text-white/70"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {isRefreshing ? "Refreshing..." : "Refresh Metrics"}
              </DropdownMenuItem>
            )}
            {onRefreshMetrics && (videoStatus === "pending" || onEdit || onDelete) && (
              <DropdownMenuSeparator />
            )}
            {videoStatus === "pending" && onApprove && (
              <DropdownMenuItem onClick={onApprove} className="text-emerald-400">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </DropdownMenuItem>
            )}
            {videoStatus === "pending" && onReject && (
              <DropdownMenuItem onClick={onReject} className="text-red-400">
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            )}
            {(videoStatus === "pending" || onEdit) && onDelete && <DropdownMenuSeparator />}
            {onDelete && (
              <DropdownMenuItem onClick={onDelete} className="text-red-400">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Full variant with prominent buttons
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Context-aware primary actions */}
      {videoStatus === "pending" && (
        <>
          {onApprove && (
            <button
              onClick={onApprove}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium transition-colors"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Approve
            </button>
          )}
          {onReject && (
            <button
              onClick={onReject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-colors"
            >
              <XCircle className="h-3.5 w-3.5" />
              Reject
            </button>
          )}
        </>
      )}

      {/* View Video - always available */}
      <button
        onClick={handleViewVideo}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.08] border border-white/[0.06] text-white rounded-lg text-xs font-medium transition-colors"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        View
      </button>

      {/* More Options */}
      {(onEdit || onDelete || onRefreshMetrics) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="h-4 w-4 text-white/60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/[0.06]">
            {onRefreshMetrics && (
              <DropdownMenuItem
                onClick={onRefreshMetrics}
                disabled={isRefreshing}
                className="text-white/70"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {isRefreshing ? "Refreshing..." : "Refresh Metrics"}
              </DropdownMenuItem>
            )}
            {onRefreshMetrics && (onEdit || onDelete) && <DropdownMenuSeparator />}
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            )}
            {onEdit && onDelete && <DropdownMenuSeparator />}
            {onDelete && (
              <DropdownMenuItem onClick={onDelete} className="text-red-400">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
