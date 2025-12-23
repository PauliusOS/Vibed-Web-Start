"use client";

import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

// Custom hooks
import { useVideoFiltering, VideoStatus, VideoPlatform } from "@/hooks/useVideoFiltering";
import { useVideoSorting, SortField, SortDirection } from "@/hooks/useVideoSorting";
import { useVideoBulkSelection } from "@/hooks/useVideoBulkSelection";

// Layout components
import { VideoListHeader } from "./videos/VideoListHeader";
import { VideoGridView } from "./videos/VideoGridView";
import { VideoTableView } from "./videos/VideoTableView";

// State components
import { VideoLoadingState } from "./videos/VideoLoadingState";
import { VideoEmptyState } from "./videos/VideoEmptyState";
import { VideoNoResults } from "./videos/VideoNoResults";

// UI components
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { AddVideoByLink } from "./AddVideoByLink";

interface CampaignVideosListProps {
  campaignId: Id<"campaigns">;
}

export function CampaignVideosList({ campaignId }: CampaignVideosListProps) {
  // State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VideoStatus>("all");
  const [platformFilter, setPlatformFilter] = useState<VideoPlatform>("all");
  const [sortField, setSortField] = useState<SortField>("addedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [refreshingVideoId, setRefreshingVideoId] = useState<string | null>(null);

  // Data
  const videos = useQuery(api.videos.getCampaignVideosWithDetails, { campaignId });

  // Custom hooks
  const filteredVideos = useVideoFiltering(videos, { search, statusFilter, platformFilter });
  const sortedVideos = useVideoSorting(filteredVideos, sortField, sortDirection);
  const selection = useVideoBulkSelection();

  // Mutations
  const approveVideo = useMutation(api.videos.approveVideo);
  const rejectVideo = useMutation(api.videos.rejectVideo);
  const deleteVideo = useMutation(api.videos.deleteVideo);

  // Actions
  const refreshVideoMetrics = useAction(api.ensembleData.refreshVideoMetrics);

  // Handlers
  const handleApprove = async (videoId: string) => {
    try {
      await approveVideo({ videoId: videoId as Id<"videos"> });
      toast.success("Video approved successfully");
    } catch (error) {
      toast.error("Failed to approve video");
    }
  };

  const handleReject = async (videoId: string) => {
    const feedback = window.prompt("Please provide a reason for rejection:");
    if (!feedback) return;

    try {
      await rejectVideo({ videoId: videoId as Id<"videos">, feedback });
      toast.success("Video rejected");
    } catch (error) {
      toast.error("Failed to reject video");
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!window.confirm("Are you sure you want to remove this video from the campaign?")) return;

    try {
      await deleteVideo({ videoId: videoId as Id<"videos"> });
      toast.success("Video removed from campaign");
      selection.toggle(videoId); // Remove from selection if selected
    } catch (error) {
      toast.error("Failed to remove video");
    }
  };

  const handleRefreshMetrics = async (videoId: string) => {
    setRefreshingVideoId(videoId);
    try {
      const result = await refreshVideoMetrics({ videoId: videoId as Id<"videos"> });
      if (result.success) {
        toast.success("Metrics refreshed successfully");
      } else {
        toast.error(result.error || "Failed to refresh metrics");
      }
    } catch (error) {
      toast.error("Failed to refresh metrics");
    } finally {
      setRefreshingVideoId(null);
    }
  };

  const handleExport = () => {
    if (!videos || videos.length === 0) return;

    const headers = ["Creator", "Platform", "Status", "Views", "Likes", "Comments", "Shares", "Engagement Rate", "Added", "URL"];
    const rows = videos.map((v) => [
      v.creatorUsername || v.creatorDisplayName || "Unknown",
      v.platform,
      v.status,
      v.views || 0,
      v.likes || 0,
      v.comments || 0,
      v.shares || 0,
      (v.engagementRate || 0).toFixed(2) + "%",
      new Date(v.addedAt).toISOString(),
      v.videoUrl || "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campaign-videos-${campaignId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Export downloaded");
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPlatformFilter("all");
  };

  const handleToggleAll = () => {
    const visibleIds = sortedVideos.map((v) => v._id);
    selection.toggleAll(visibleIds);
  };

  // Loading state
  if (videos === undefined) {
    return (
      <div className="space-y-4">
        <GlassPanel className="p-4">
          <div className="h-10 animate-pulse bg-white/[0.04] rounded" />
        </GlassPanel>
        <VideoLoadingState view={viewMode} count={6} />
      </div>
    );
  }

  // Empty state (no videos at all)
  if (videos.length === 0) {
    return (
      <GlassPanel>
        <VideoEmptyState />
      </GlassPanel>
    );
  }

  // No results state (filtered out all videos)
  const hasNoResults = sortedVideos.length === 0 && (search || statusFilter !== "all" || platformFilter !== "all");

  return (
    <div className="space-y-4">
      {/* Header with filters and controls */}
      <VideoListHeader
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        platformFilter={platformFilter}
        onPlatformChange={setPlatformFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExport={handleExport}
        totalCount={videos.length}
        filteredCount={sortedVideos.length}
      />

      {/* Bulk actions bar */}
      {selection.hasSelection && (
        <GlassPanel className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">
              {selection.count} video{selection.count !== 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  selection.selectedArray.forEach((id) => handleApprove(id));
                  selection.clear();
                }}
                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium transition-colors"
              >
                Approve Selected
              </button>
              <button
                onClick={selection.clear}
                className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.08] border border-white/[0.06] text-white rounded-lg text-xs font-medium transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* Main content */}
      {hasNoResults ? (
        <GlassPanel>
          <VideoNoResults
            onClearFilters={handleClearFilters}
            searchTerm={search}
          />
        </GlassPanel>
      ) : viewMode === "grid" ? (
        <VideoGridView
          videos={sortedVideos}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          onRefreshMetrics={handleRefreshMetrics}
          refreshingVideoId={refreshingVideoId}
          selectedIds={selection.selectedIds}
          onToggleSelect={selection.toggle}
        />
      ) : (
        <VideoTableView
          videos={sortedVideos}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          onRefreshMetrics={handleRefreshMetrics}
          refreshingVideoId={refreshingVideoId}
          selectedIds={selection.selectedIds}
          onToggleSelect={selection.toggle}
          onToggleAll={handleToggleAll}
          allSelected={selection.areAllSelected(sortedVideos.map((v) => v._id))}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      )}
    </div>
  );
}
