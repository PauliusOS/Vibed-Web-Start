"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FramerCalendar, type ScheduledPost, type UserRole } from "./FramerCalendar";
import {
  FRAMER_TEXT_COLORS,
  FRAMER_BG_COLORS,
} from "../constants/colors";
import { Download } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: "draft" | "active" | "paused" | "completed" | "archived";
}

interface CampaignCalendarDashboardProps {
  campaigns: Campaign[];
  scheduledPosts: ScheduledPost[];
  userRole: UserRole;
  currentUserId?: string;
  selectedCampaignId?: string;
  onSelectCampaign?: (campaignId: string) => void;
  onCreatePost?: (date: Date) => void;
  onEditPost?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
  onViewPost?: (postId: string) => void;
  onEditBrief?: (postId: string) => void;
  onExportCalendar?: () => void;
  className?: string;
}

export function CampaignCalendarDashboard({
  campaigns,
  scheduledPosts,
  userRole,
  currentUserId,
  selectedCampaignId,
  onSelectCampaign,
  onCreatePost,
  onEditPost,
  onDeletePost,
  onViewPost,
  onEditBrief,
  onExportCalendar,
  className,
}: CampaignCalendarDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Calculate stats
  const stats = useMemo(() => {
    const filtered = scheduledPosts;

    return {
      total: filtered.length,
      scheduled: filtered.filter((p) => p.status === "scheduled").length,
      pendingReview: filtered.filter((p) => p.status === "draft_submitted").length,
      approved: filtered.filter(
        (p) => p.status === "approved" || p.status === "completed"
      ).length,
      needsRevision: filtered.filter((p) => p.status === "revision_needed").length,
      missed: filtered.filter((p) => p.status === "missed").length,
    };
  }, [scheduledPosts]);

  // Filter posts by status
  const filteredPosts = useMemo(() => {
    if (statusFilter === "all") return scheduledPosts;
    return scheduledPosts.filter((p) => p.status === statusFilter);
  }, [scheduledPosts, statusFilter]);

  return (
    <div className={className} style={{ backgroundColor: FRAMER_BG_COLORS.page }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-xl font-semibold tracking-tight"
              style={{ color: FRAMER_TEXT_COLORS.primary }}
            >
              Content Calendar
            </h1>
            <p className="text-[13px] mt-0.5" style={{ color: FRAMER_TEXT_COLORS.muted }}>
              {userRole === "admin"
                ? "Manage and schedule content across your campaigns"
                : userRole === "creator"
                ? "View your assigned content and deadlines"
                : "Overview of campaign content schedule"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Campaign Selector */}
            {campaigns.length > 1 && (
              <Select
                value={selectedCampaignId}
                onValueChange={onSelectCampaign}
              >
                <SelectTrigger
                  className="w-[200px] h-9 text-[13px] bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05] transition-colors"
                  style={{ color: FRAMER_TEXT_COLORS.primary }}
                >
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/[0.08]">
                  {campaigns.map((campaign) => (
                    <SelectItem
                      key={campaign.id}
                      value={campaign.id}
                      className="text-[13px] text-white/80 focus:bg-white/[0.04] focus:text-white"
                    >
                      <div className="flex items-center gap-2">
                        <span>{campaign.name}</span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] h-4 border-0 ${
                            campaign.status === "active"
                              ? "bg-green-500/10 text-green-400"
                              : campaign.status === "paused"
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-white/5 text-white/40"
                          }`}
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Export Button */}
            {onExportCalendar && userRole === "admin" && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExportCalendar}
                className="h-9 text-[12px] border-white/[0.08] bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.04]"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export
              </Button>
            )}
          </div>
        </div>

        {/* Stats Row - Clean minimal design */}
        <div className="flex items-center gap-6 py-4 px-5 rounded-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <StatItem label="Total" value={stats.total} />
          <div className="w-px h-6" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }} />
          <StatItem label="Scheduled" value={stats.scheduled} color="rgb(59, 130, 246)" />
          <StatItem label="Pending" value={stats.pendingReview} color="rgb(245, 158, 11)" />
          <StatItem label="Approved" value={stats.approved} color="rgb(34, 197, 94)" />
          <StatItem label="Revision" value={stats.needsRevision} color="rgb(249, 115, 22)" />
          <StatItem label="Missed" value={stats.missed} color="rgb(239, 68, 68)" />
          
          {/* Spacer */}
          <div className="flex-1" />
          
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="w-[130px] h-8 text-[12px] bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]"
              style={{ color: FRAMER_TEXT_COLORS.secondary }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] border-white/[0.08]">
              <SelectItem value="all" className="text-[12px]">All Statuses</SelectItem>
              <SelectItem value="scheduled" className="text-[12px]">Scheduled</SelectItem>
              <SelectItem value="draft_submitted" className="text-[12px]">Pending Review</SelectItem>
              <SelectItem value="revision_needed" className="text-[12px]">Needs Revision</SelectItem>
              <SelectItem value="approved" className="text-[12px]">Approved</SelectItem>
              <SelectItem value="completed" className="text-[12px]">Completed</SelectItem>
              <SelectItem value="missed" className="text-[12px]">Missed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calendar */}
        <FramerCalendar
          posts={filteredPosts}
          userRole={userRole}
          currentUserId={currentUserId}
          onCreatePost={onCreatePost}
          onEditPost={onEditPost}
          onDeletePost={onDeletePost}
          onViewPost={onViewPost}
          onEditBrief={onEditBrief}
        />
      </div>
    </div>
  );
}

// Clean stat item - minimal design matching Framer style
function StatItem({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {color && (
        <div 
          className="w-2 h-2 rounded-full" 
          style={{ backgroundColor: color }} 
        />
      )}
      <span 
        className="text-lg font-semibold tabular-nums" 
        style={{ color: FRAMER_TEXT_COLORS.primary }}
      >
        {value}
      </span>
      <span 
        className="text-[13px]" 
        style={{ color: FRAMER_TEXT_COLORS.muted }}
      >
        {label}
      </span>
    </div>
  );
}

export default CampaignCalendarDashboard;
