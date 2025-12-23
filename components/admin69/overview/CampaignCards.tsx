"use client";

import { FramerCard } from "@/components/framer-analytics";
import { ChevronRight, Users, Video, TrendingUp, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface CampaignSummary {
  id: string;
  name: string;
  status: "active" | "pending" | "completed" | "draft";
  creatorsCount: number;
  videosCount: number;
  progress: number; // 0-100
  totalViews?: number;
  budget?: number;
  thumbnailUrl?: string;
}

const statusStyles = {
  active: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Active" },
  pending: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Pending" },
  completed: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Completed" },
  draft: { bg: "bg-white/10", text: "text-white/50", label: "Draft" },
};

interface CampaignCardProps {
  campaign: CampaignSummary;
}

function CampaignCard({ campaign }: CampaignCardProps) {
  const status = statusStyles[campaign.status];

  return (
    <Link href={`/admin69/campaigns/${campaign.id}`}>
      <FramerCard
        padding="none"
        className="group hover:border-cyan-500/30 transition-all cursor-pointer h-full"
      >
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide", status.bg, status.text)}>
                  {status.label}
                </span>
              </div>
              <h4 className="text-sm font-medium text-white truncate group-hover:text-cyan-400 transition-colors">
                {campaign.name}
              </h4>
            </div>
            <button
              onClick={(e) => e.preventDefault()}
              className="p-1 rounded hover:bg-white/[0.05] text-white/30 hover:text-white/60 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-white/50">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{campaign.creatorsCount} creators</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" />
              <span>{campaign.videosCount} videos</span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white/40">Progress</span>
              <span className="text-white/70 font-medium">{campaign.progress}%</span>
            </div>
            <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  campaign.status === "active" && "bg-gradient-to-r from-cyan-500 to-blue-500",
                  campaign.status === "pending" && "bg-amber-500",
                  campaign.status === "completed" && "bg-emerald-500",
                  campaign.status === "draft" && "bg-white/30"
                )}
                style={{ width: `${campaign.progress}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          {campaign.totalViews !== undefined && (
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
              <div className="flex items-center gap-1.5 text-xs">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white/70">
                  {(campaign.totalViews / 1000).toFixed(0)}K views
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-cyan-400 transition-colors" />
            </div>
          )}
        </div>
      </FramerCard>
    </Link>
  );
}

interface CampaignCardsProps {
  campaigns: CampaignSummary[];
  maxItems?: number;
  title?: string;
}

export function CampaignCards({ campaigns, maxItems = 4, title = "Active Campaigns" }: CampaignCardsProps) {
  const displayedCampaigns = campaigns.slice(0, maxItems);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <Link
          href="/admin69/campaigns"
          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-0.5"
        >
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedCampaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}

export default CampaignCards;
