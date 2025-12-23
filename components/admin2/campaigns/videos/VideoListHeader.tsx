import { Search, Plus, Download, Grid3x3, List, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VideoStatus, VideoPlatform } from "@/hooks/useVideoFiltering";

interface VideoListHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: VideoStatus;
  onStatusChange: (value: VideoStatus) => void;
  platformFilter: VideoPlatform;
  onPlatformChange: (value: VideoPlatform) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  onAddVideo?: () => void;
  onExport?: () => void;
  totalCount: number;
  filteredCount: number;
  className?: string;
}

export function VideoListHeader({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  platformFilter,
  onPlatformChange,
  viewMode,
  onViewModeChange,
  onAddVideo,
  onExport,
  totalCount,
  filteredCount,
  className = "",
}: VideoListHeaderProps) {
  const hasActiveFilters = statusFilter !== "all" || platformFilter !== "all" || search.trim() !== "";

  return (
    <div className={`bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-4 ${className}`}>
      {/* Top Row: Title + Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Videos</h2>
          <p className="text-xs text-white/40 mt-0.5">
            {filteredCount === totalCount
              ? `${totalCount} total`
              : `${filteredCount} of ${totalCount} videos`}
            {hasActiveFilters && " (filtered)"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Button */}
          {onExport && (
            <button
              onClick={onExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/[0.06] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg transition-colors text-sm font-medium text-white"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

          {/* Add Video Button */}
          {onAddVideo && (
            <button
              onClick={onAddVideo}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-white/90 text-black rounded-lg transition-colors text-sm font-semibold"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Video</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Filters + View Toggle */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/[0.06] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={(value) => onStatusChange(value as VideoStatus)}>
          <SelectTrigger className="w-[140px] bg-white/[0.06] border-white/[0.06] text-white">
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-white/60" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="tracking">Tracking</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Platform Filter */}
        <Select value={platformFilter} onValueChange={(value) => onPlatformChange(value as VideoPlatform)}>
          <SelectTrigger className="w-[140px] bg-white/[0.06] border-white/[0.06] text-white">
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-white/60" />
              <SelectValue placeholder="Platform" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              onSearchChange("");
              onStatusChange("all");
              onPlatformChange("all");
            }}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Clear filters
          </button>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white/[0.06] border border-white/[0.06] rounded-lg p-1">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded transition-colors ${
              viewMode === "grid"
                ? "bg-white/[0.12] text-white"
                : "text-white/40 hover:text-white/60"
            }`}
            aria-label="Grid view"
            title="Grid view"
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange("table")}
            className={`p-1.5 rounded transition-colors ${
              viewMode === "table"
                ? "bg-white/[0.12] text-white"
                : "text-white/40 hover:text-white/60"
            }`}
            aria-label="Table view"
            title="Table view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
