"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  TrendingUp,
  Users,
  Video,
  DollarSign,
  Eye,
  ArrowRight,
  BarChart3,
  Filter,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateCampaignDialog } from "./CreateCampaignDialog";
import Link from "next/link";

interface CampaignsDashboardProps {
  organizationId?: Id<"organizations">;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function CampaignsDashboard({ organizationId }: CampaignsDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "completed" | "paused">("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Fetch campaigns with metrics
  const campaigns = useQuery(
    api.campaigns.listCampaignsWithMetrics,
    organizationId
      ? {
          organizationId,
          status: statusFilter === "all" ? undefined : statusFilter,
        }
      : "skip"
  );

  const isLoading = campaigns === undefined;

  // Calculate summary stats
  const stats = campaigns
    ? {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter((c) => c.status === "active").length,
        totalCreators: campaigns.reduce((sum, c) => sum + (c.creatorCount || 0), 0),
        totalSpend: campaigns.reduce((sum, c) => sum + (c.totalSpend || 0), 0),
        totalReach: campaigns.reduce((sum, c) => sum + (c.totalReach || 0), 0),
      }
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "'Euclid Circular A', system-ui, sans-serif" }}
          >
            Campaigns
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Manage and track your marketing campaigns
          </p>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white gap-2"
          disabled={!organizationId}
        >
          <Plus className="w-4 h-4" />
          Create Campaign
        </Button>
      </div>

      {/* Summary Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-white/50 font-medium">Total Campaigns</p>
                <BarChart3 className="w-4 h-4 text-white/30" />
              </div>
              <p className="text-2xl font-semibold text-white">{stats.totalCampaigns}</p>
              <p className="text-xs text-white/40 mt-1">
                {stats.activeCampaigns} active
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-white/50 font-medium">Total Creators</p>
                <Users className="w-4 h-4 text-white/30" />
              </div>
              <p className="text-2xl font-semibold text-white">{stats.totalCreators}</p>
              <p className="text-xs text-white/40 mt-1">
                Across all campaigns
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-white/50 font-medium">Total Spend</p>
                <DollarSign className="w-4 h-4 text-white/30" />
              </div>
              <p className="text-2xl font-semibold text-white">
                {formatCurrency(stats.totalSpend)}
              </p>
              <p className="text-xs text-white/40 mt-1">
                Paid to creators
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-white/50 font-medium">Total Reach</p>
                <Eye className="w-4 h-4 text-white/30" />
              </div>
              <p className="text-2xl font-semibold text-white">
                {formatNumber(stats.totalReach)}
              </p>
              <p className="text-xs text-white/40 mt-1">
                Total views
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-white/50 font-medium">Avg CPM</p>
                <TrendingUp className="w-4 h-4 text-white/30" />
              </div>
              <p className="text-2xl font-semibold text-white">
                {stats.totalReach > 0
                  ? formatCurrency((stats.totalSpend / stats.totalReach) * 1000)
                  : "$0"}
              </p>
              <p className="text-xs text-white/40 mt-1">
                Cost per 1K views
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status Filters */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-white/50" />
        <div className="flex items-center gap-2">
          {["all", "active", "draft", "completed", "paused"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as typeof statusFilter)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                statusFilter === status
                  ? "bg-blue-500 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
              )}
              style={{ fontFamily: "'Euclid Circular A', system-ui, sans-serif" }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && campaigns && campaigns.length === 0 && (
        <Card className="bg-white/[0.03] border-white/10 border-dashed">
          <CardContent className="p-12">
            <div className="text-center">
              <Video className="w-16 h-16 mx-auto mb-4 text-blue-400 opacity-30" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {statusFilter === "all" ? "No campaigns yet" : `No ${statusFilter} campaigns`}
              </h3>
              <p className="text-white/60 mb-6">
                {statusFilter === "all"
                  ? "Get started by creating your first campaign"
                  : `You don't have any ${statusFilter} campaigns`}
              </p>
              {statusFilter === "all" && (
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white gap-2"
                  disabled={!organizationId}
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Campaign
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaigns Grid */}
      {!isLoading && campaigns && campaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <Card
              key={campaign._id}
              className="bg-white/[0.03] border-white/10 hover:bg-white/[0.05] transition-all duration-200 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-white text-lg mb-2 truncate">
                      {campaign.name}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        campaign.status === "active"
                          ? "border-green-500/30 text-green-400 bg-green-500/10"
                          : campaign.status === "draft"
                          ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
                          : campaign.status === "completed"
                          ? "border-blue-500/30 text-blue-400 bg-blue-500/10"
                          : campaign.status === "paused"
                          ? "border-orange-500/30 text-orange-400 bg-orange-500/10"
                          : "border-white/20 text-white/50"
                      )}
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                    <Users className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-xs text-white/50">Creators</p>
                      <p className="text-sm font-semibold text-white">
                        {campaign.creatorCount || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                    <Video className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-xs text-white/50">Videos</p>
                      <p className="text-sm font-semibold text-white">
                        {campaign.totalVideos || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-xs text-white/50">Views</p>
                      <p className="text-sm font-semibold text-white">
                        {formatNumber(campaign.totalReach || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-xs text-white/50">CPM</p>
                      <p className="text-sm font-semibold text-white">
                        {campaign.cpm ? formatCurrency(campaign.cpm) : "$0"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Budget Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/50">Budget</span>
                    <span className="text-xs text-white/70">
                      {formatCurrency(campaign.totalSpend || 0)} /{" "}
                      {formatCurrency(campaign.dedicatedRoster || 0)}
                    </span>
                  </div>
                  <Progress
                    value={campaign.progressPercent || 0}
                    className="h-2 bg-white/5"
                  />
                  <p className="text-xs text-white/40 mt-1">
                    {campaign.progressPercent || 0}% utilized
                  </p>
                </div>

                {/* Action Button */}
                <Link href={`/admin6/campaigns/${campaign._id}/roster`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-white/10 text-white hover:bg-white/5 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all"
                  >
                    View Campaign
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Campaign Dialog */}
      <CreateCampaignDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        organizationId={organizationId}
      />
    </div>
  );
}
