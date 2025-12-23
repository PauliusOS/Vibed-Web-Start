"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, DollarSign, TrendingUp, Video, Award } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InfluencerRankingsSidebarProps {
  organizationId: Id<"organizations">;
  campaignId?: Id<"campaigns">;
  showCampaignFilter?: boolean;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
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

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function InfluencerRankingsSidebar({
  organizationId,
  campaignId: initialCampaignId,
  showCampaignFilter = false,
}: InfluencerRankingsSidebarProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<
    Id<"campaigns"> | undefined
  >(initialCampaignId);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Get campaigns for filter
  const campaigns = useQuery(
    api.campaigns.listCampaigns,
    showCampaignFilter ? { organizationId } : "skip"
  );

  // Get rankings
  const rankings = useQuery(api.analytics.getInfluencerRankings, {
    organizationId,
    campaignId: selectedCampaignId,
    limit: 50,
  });

  useOutsideClick(ref, () => {
    setExpandedId(null);
  });

  if (rankings === undefined) {
    return (
      <div className="w-full lg:w-[350px] border-l border-white/10 bg-black p-4 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          {showCampaignFilter && <Skeleton className="h-10 w-full" />}
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <aside 
      className="w-full lg:w-[350px] border-l border-white/10 bg-black"
      aria-label="Influencer Rankings Sidebar"
    >
      <div className="p-4 border-b border-white/10 sticky top-0 bg-black z-10">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Influencer Rankings
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Ranked by total views
        </p>

        {showCampaignFilter && campaigns && campaigns.length > 0 && (
          <Select
            value={selectedCampaignId || "all"}
            onValueChange={(value) =>
              setSelectedCampaignId(value === "all" ? undefined : (value as Id<"campaigns">))
            }
          >
            <SelectTrigger className="w-full" aria-label="Filter by campaign">
              <SelectValue placeholder="All Campaigns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign._id} value={campaign._id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div 
        className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]" 
        ref={ref}
        role="list"
        aria-label="Ranked influencers"
      >
        {rankings.length === 0 ? (
          <Card className="p-6 text-center border-dashed">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">No creators yet</p>
          </Card>
        ) : (
          <AnimatePresence>
            {rankings.map((creator, index) => {
              const isExpanded = expandedId === creator.creatorId;
              const progressPercentage =
                creator.videosRequired > 0
                  ? (creator.videosCompleted / creator.videosRequired) * 100
                  : 0;

              return (
                <motion.div
                  key={creator.creatorId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  role="listitem"
                >
                  <Card
                    className={cn(
                      "relative overflow-hidden transition-all duration-200 cursor-pointer",
                      "hover:shadow-md border-border focus:outline-none focus:ring-2 focus:ring-primary",
                      isExpanded && "shadow-lg border-primary/50"
                    )}
                    onClick={() =>
                      setExpandedId(isExpanded ? null : creator.creatorId)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setExpandedId(isExpanded ? null : creator.creatorId);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-expanded={isExpanded}
                    aria-label={`${creator.username}, rank ${index + 1}, ${formatNumber(creator.totalViews)} views. ${isExpanded ? "Collapse" : "Expand"} to ${isExpanded ? "hide" : "see"} details.`}
                  >
                    {/* Rank Badge */}
                    <div className="absolute top-2 right-2 z-10">
                      <Badge
                        variant={index < 3 ? "default" : "secondary"}
                        className="text-xs font-semibold"
                      >
                        #{index + 1}
                      </Badge>
                    </div>

                    {/* Collapsed View */}
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-16 w-16 border-2 border-border">
                          <AvatarImage
                            src={creator.profilePicture || undefined}
                            alt={creator.username}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {creator.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {creator.username}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Eye className="h-3.5 w-3.5" />
                            <span className="font-medium">
                              {formatNumber(creator.totalViews)} views
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded View */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 space-y-4 border-t border-border pt-4"
                          >
                            {/* Video Progress */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                  Video Progress
                                </span>
                                <span className="font-medium text-foreground">
                                  {creator.videosCompleted} of{" "}
                                  {creator.videosRequired} completed
                                </span>
                              </div>
                              <Progress value={progressPercentage} className="h-2" />
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <Eye className="h-3.5 w-3.5" />
                                  <span className="text-xs">Total Views</span>
                                </div>
                                <p className="text-sm font-semibold text-foreground">
                                  {formatNumber(creator.totalViews)}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <DollarSign className="h-3.5 w-3.5" />
                                  <span className="text-xs">Payment</span>
                                </div>
                                <p className="text-sm font-semibold text-foreground">
                                  {formatCurrency(creator.paymentAmount)}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <TrendingUp className="h-3.5 w-3.5" />
                                  <span className="text-xs">Engagement</span>
                                </div>
                                <p className="text-sm font-semibold text-foreground">
                                  {creator.engagementRate.toFixed(2)}%
                                </p>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <Video className="h-3.5 w-3.5" />
                                  <span className="text-xs">Platform</span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-xs capitalize"
                                >
                                  {creator.platform}
                                </Badge>
                              </div>
                            </div>

                            {/* Campaigns */}
                            {creator.campaigns.length > 0 && (
                              <div className="space-y-2">
                                <span className="text-xs text-muted-foreground">
                                  Campaigns
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {creator.campaigns.map((campaign, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {campaign}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </aside>
  );
}

