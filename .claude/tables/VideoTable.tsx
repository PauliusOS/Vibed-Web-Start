"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, ExternalLink, Check, X, AlertCircle, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface Video {
  _id: string;
  campaignId?: string;
  videoUrl?: string;
  platform: "instagram" | "tiktok";
  creatorName?: string;
  campaignName?: string;
  status: "pending_approval" | "approved" | "rejected" | "tracking";
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  engagementRate?: number;
  addedAt: number;
  adminFeedback?: string;
  reviewedAt?: number;
}

interface VideoTableProps {
  videos: Video[];
  onApprove?: (videoId: string) => void;
  onReject?: (videoId: string) => void;
  onResubmit?: (videoId: string, campaignId: string) => void;
  showActions?: boolean;
  showCreator?: boolean;
  showCampaign?: boolean;
}

type SortField = "creatorName" | "views" | "likes" | "engagementRate" | "addedAt";
type SortOrder = "asc" | "desc";

const statusConfig = {
  pending_approval: {
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-500",
  },
  approved: { label: "Approved", className: "bg-green-500/10 text-green-500" },
  rejected: { label: "Rejected", className: "bg-red-500/10 text-red-500" },
  tracking: { label: "Tracking", className: "bg-cyan-500/10 text-cyan-500" },
};

const platformConfig = {
  instagram: { label: "Instagram", icon: "📸" },
  tiktok: { label: "TikTok", icon: "🎵" },
};

export function VideoTable({
  videos,
  onApprove,
  onReject,
  onResubmit,
  showActions = true,
  showCreator = true,
  showCampaign = false,
}: VideoTableProps) {
  const [sortField, setSortField] = useState<SortField>("addedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sortedVideos = [...videos].sort((a, b) => {
    const aVal = a[sortField] ?? 0;
    const bVal = b[sortField] ?? 0;

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortOrder === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-white/[0.06]">
            <TableHead className="text-white/50">Platform</TableHead>
            {showCampaign && (
              <TableHead className="text-white/50">Campaign</TableHead>
            )}
            {showCreator && (
              <TableHead className="text-white/50">
                <button
                  onClick={() => toggleSort("creatorName")}
                  className="flex items-center gap-1 hover:text-white transition-colors duration-200"
                  aria-label="Sort by creator name"
                >
                  Creator
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
            )}
            <TableHead className="text-white/50">Status</TableHead>
            <TableHead className="text-white/50">
              <button
                onClick={() => toggleSort("views")}
                className="flex items-center gap-1 hover:text-white transition-colors duration-200"
                aria-label="Sort by views"
              >
                Views
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead className="text-white/50">
              <button
                onClick={() => toggleSort("likes")}
                className="flex items-center gap-1 hover:text-white transition-colors duration-200"
                aria-label="Sort by likes"
              >
                Likes
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead className="text-white/50">
              <button
                onClick={() => toggleSort("engagementRate")}
                className="flex items-center gap-1 hover:text-white transition-colors duration-200"
                aria-label="Sort by engagement rate"
              >
                Eng. Rate
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead className="text-white/50">
              <button
                onClick={() => toggleSort("addedAt")}
                className="flex items-center gap-1 hover:text-white transition-colors duration-200"
                aria-label="Sort by date added"
              >
                Added
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            {showActions && (
              <TableHead className="text-white/50 text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedVideos.map((video) => {
            const statusStyle = statusConfig[video.status];
            const platformStyle = platformConfig[video.platform];
            const isRejected = video.status === "rejected" && video.adminFeedback;

            return (
              <>
                <TableRow
                  key={video._id}
                  className={cn(
                    "hover:bg-white/[0.02] border-white/[0.06] transition-colors duration-200",
                    isRejected && "border-b-0"
                  )}
                >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{platformStyle.icon}</span>
                    <span className="text-white/70 text-sm">
                      {platformStyle.label}
                    </span>
                  </div>
                </TableCell>
                {showCampaign && (
                  <TableCell className="text-white/70">
                    {video.campaignName || "-"}
                  </TableCell>
                )}
                {showCreator && (
                  <TableCell className="text-white/70">
                    {video.creatorName ? `@${video.creatorName}` : "-"}
                  </TableCell>
                )}
                <TableCell>
                  <Badge className={cn("text-xs", statusStyle.className)}>
                    {statusStyle.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-white/70 font-mono">
                  {video.views !== undefined
                    ? video.views >= 1000
                      ? `${(video.views / 1000).toFixed(1)}K`
                      : video.views
                    : "-"}
                </TableCell>
                <TableCell className="text-white/70 font-mono">
                  {video.likes !== undefined
                    ? video.likes >= 1000
                      ? `${(video.likes / 1000).toFixed(1)}K`
                      : video.likes
                    : "-"}
                </TableCell>
                <TableCell className="text-white/70 font-mono">
                  {video.engagementRate !== undefined
                    ? `${video.engagementRate.toFixed(2)}%`
                    : "-"}
                </TableCell>
                <TableCell className="text-white/50 text-sm">
                  {new Date(video.addedAt).toLocaleDateString()}
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {video.status === "pending_approval" && onApprove && onReject && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => onApprove(video._id)}
                            className="h-8 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => onReject(video._id)}
                            className="h-8 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-white/10 transition-colors duration-200 focus:ring-2 focus:ring-primary focus:outline-none"
                            aria-label="Video actions menu"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-black/90 backdrop-blur-xl border-white/10 shadow-md"
                        >
                          {video.videoUrl && (
                            <DropdownMenuItem asChild>
                              <a
                                href={video.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/70 hover:text-white cursor-pointer"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Video
                              </a>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                )}
              </TableRow>

              {/* Rejection Feedback Row */}
              {isRejected && (
                <TableRow
                  key={`${video._id}-feedback`}
                  className="hover:bg-white/[0.02] border-white/[0.06] bg-red-500/5"
                >
                  <TableCell
                    colSpan={
                      (showCampaign ? 1 : 0) +
                      (showCreator ? 1 : 0) +
                      (showActions ? 9 : 8)
                    }
                    className="p-4"
                  >
                    <div className="flex items-start gap-3 border-l-4 border-red-500 pl-4">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-red-500">
                              Video Rejected
                            </p>
                            {video.reviewedAt && (
                              <p className="text-xs text-white/50">
                                Reviewed on {new Date(video.reviewedAt).toLocaleDateString()} at{" "}
                                {new Date(video.reviewedAt).toLocaleTimeString()}
                              </p>
                            )}
                          </div>
                          {onResubmit && video.campaignId && (
                            <Button
                              size="sm"
                              onClick={() => onResubmit(video._id, video.campaignId!)}
                              className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/25"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Resubmit Video
                            </Button>
                          )}
                        </div>
                        <div className="bg-red-500/10 rounded-md p-3 border border-red-500/20">
                          <p className="text-xs font-medium text-white/50 mb-1">
                            Admin Feedback:
                          </p>
                          <p className="text-sm text-white">{video.adminFeedback}</p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
