"use client";

import { useState } from "react";
import { GlassCard } from "@/components/dashboard/GlassCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoData {
  _id: string;
  videoUrl?: string;
  platform: "instagram" | "tiktok";
  status: string;
  addedAt: number;
  creatorName?: string;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  engagementRate?: number;
}

interface VideoPerformanceTableProps {
  videos?: VideoData[];
  showCreator?: boolean;
  title?: string;
  itemsPerPage?: number;
}

type SortField = "views" | "likes" | "comments" | "shares" | "engagementRate" | "addedAt";
type SortOrder = "asc" | "desc";

function formatNumber(num?: number): string {
  if (!num) return "0";
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function VideoPerformanceTable({
  videos,
  showCreator = true,
  title = "Video Performance",
  itemsPerPage = 10,
}: VideoPerformanceTableProps) {
  const [sortField, setSortField] = useState<SortField>("views");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-white/40" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4 text-white" />
    ) : (
      <ArrowDown className="h-4 w-4 text-white" />
    );
  };

  if (videos === undefined) {
    return (
      <GlassCard variant="elevated">
        <div className="p-6">
          <Skeleton className="h-6 w-48 glass-skeleton mb-4" />
          <TableSkeleton />
        </div>
      </GlassCard>
    );
  }

  if (videos.length === 0) {
    return (
      <GlassCard variant="elevated">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white/90 mb-4">{title}</h3>
          <div className="py-12 text-center">
            <p className="text-white/60">No videos to display</p>
            <p className="text-sm text-white/40 mt-1">
              Videos will appear here once they are added to the campaign
            </p>
          </div>
        </div>
      </GlassCard>
    );
  }

  // Sort videos
  const sortedVideos = [...videos].sort((a, b) => {
    const aVal = a[sortField] || 0;
    const bVal = b[sortField] || 0;
    return sortOrder === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVideos = sortedVideos.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <GlassCard variant="elevated" noPadding>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white/90">
            {title}
          </h3>
          <span className="text-sm text-white/50">
            {sortedVideos.length} total videos
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-white/80">Video</TableHead>
                {showCreator && (
                  <TableHead className="text-white/80">Creator</TableHead>
                )}
                <TableHead className="text-white/80">
                  <button
                    onClick={() => handleSort("views")}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Views
                    {getSortIcon("views")}
                  </button>
                </TableHead>
                <TableHead className="text-white/80">
                  <button
                    onClick={() => handleSort("likes")}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    Likes
                    {getSortIcon("likes")}
                  </button>
                </TableHead>
                <TableHead className="text-white/80">
                  <button
                    onClick={() => handleSort("comments")}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Comments
                    {getSortIcon("comments")}
                  </button>
                </TableHead>
                <TableHead className="text-white/80">
                  <button
                    onClick={() => handleSort("shares")}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    Shares
                    {getSortIcon("shares")}
                  </button>
                </TableHead>
                <TableHead className="text-white/80">
                  <button
                    onClick={() => handleSort("engagementRate")}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Eng. Rate
                    {getSortIcon("engagementRate")}
                  </button>
                </TableHead>
                <TableHead className="text-white/80">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVideos.map((video) => (
                <TableRow
                  key={video._id}
                  className="border-white/[0.06] hover:bg-white/[0.02] transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-black/50 flex items-center justify-center text-lg">
                        {video.platform === "instagram" ? "📸" : "🎵"}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium capitalize">
                          {video.platform}
                        </p>
                        <Badge
                          className={cn(
                            "text-xs mt-1",
                            video.status === "tracking"
                              ? "bg-green-500/10 text-green-500"
                              : video.status === "approved"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          )}
                        >
                          {video.status}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  {showCreator && (
                    <TableCell className="text-white/80">
                      {video.creatorName || "Unknown"}
                    </TableCell>
                  )}
                  <TableCell className="text-white font-medium">
                    {formatNumber(video.views)}
                  </TableCell>
                  <TableCell className="text-white font-medium">
                    {formatNumber(video.likes)}
                  </TableCell>
                  <TableCell className="text-white font-medium">
                    {formatNumber(video.comments)}
                  </TableCell>
                  <TableCell className="text-white font-medium">
                    {formatNumber(video.shares)}
                  </TableCell>
                  <TableCell className="text-white font-medium">
                    {video.engagementRate
                      ? `${video.engagementRate.toFixed(2)}%`
                      : "0%"}
                  </TableCell>
                  <TableCell>
                    {video.videoUrl ? (
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white/[0.02] border border-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.04] hover:border-white/[0.1] transition-all"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white/[0.02] border border-white/[0.06] text-white/20">
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/[0.06]">
            <div className="text-sm text-white/50">
              Showing {startIndex + 1} to {Math.min(endIndex, sortedVideos.length)} of{" "}
              {sortedVideos.length} videos
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  currentPage === 1
                    ? "bg-white/[0.02] text-white/30 cursor-not-allowed"
                    : "bg-white/[0.02] text-white/60 hover:bg-white/[0.04] hover:text-white border border-white/[0.06] hover:border-white/[0.1]"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first, last, current, and pages around current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1);

                  if (!showPage && page === 2) {
                    return (
                      <span key={page} className="px-2 text-white/40">
                        ...
                      </span>
                    );
                  }

                  if (!showPage && page === totalPages - 1) {
                    return (
                      <span key={page} className="px-2 text-white/40">
                        ...
                      </span>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={cn(
                        "w-10 h-10 rounded-lg text-sm font-medium transition-all",
                        currentPage === page
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "bg-white/[0.02] text-white/60 hover:bg-white/[0.04] hover:text-white border border-white/[0.06] hover:border-white/[0.1]"
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  currentPage === totalPages
                    ? "bg-white/[0.02] text-white/30 cursor-not-allowed"
                    : "bg-white/[0.02] text-white/60 hover:bg-white/[0.04] hover:text-white border border-white/[0.06] hover:border-white/[0.1]"
                )}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
