"use client";

import { useEffect, useState } from "react";
import { X, TrendingUpIcon, DollarSignIcon, TargetIcon, CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CreatorCarouselCard } from "./CreatorCarouselCard";
import { useCampaignMetrics } from "@/lib/hooks/useCampaignMetrics";
import {
  formatNumber,
  formatCurrency,
  formatCPM,
  formatDate,
  getStatusColor,
  calculateEngagementRate,
} from "@/lib/utils/campaignCalculations";
import type { Id } from "@/convex/_generated/dataModel";

interface CampaignDetailModalProps {
  campaignId: Id<"campaigns"> | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CampaignDetailModal({
  campaignId,
  isOpen,
  onClose,
}: CampaignDetailModalProps) {
  const { data, isLoading, campaign, metrics, creators } = useCampaignMetrics(
    campaignId || undefined
  );

  if (!isOpen || !campaignId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <div className="flex items-center gap-3">
              <img
                src="/opa-logo.svg"
                className="h-10 w-10 rounded-lg"
                alt="logo"
              />
              <div>
                <DialogTitle className="text-2xl font-bold text-foreground">
                  {campaign?.name || "Loading..."}
                </DialogTitle>
                {campaign && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Created {formatDate(campaign.createdAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-muted-foreground">Loading campaign details...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Campaign Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Reach */}
              <Card className="shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary/10">
                      <TrendingUpIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Reach</p>
                      <p className="text-xl font-bold text-foreground">
                        {formatNumber(metrics?.totalReach || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Videos */}
              <Card className="shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-green-500/10">
                      <TargetIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Videos</p>
                      <p className="text-xl font-bold text-foreground">
                        {metrics?.totalVideos || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Spend */}
              <Card className="shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-500/10">
                      <DollarSignIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Spend</p>
                      <p className="text-xl font-bold text-foreground">
                        {formatCurrency(metrics?.totalSpend || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CPM */}
              <Card className="shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-yellow-500/10">
                      <CalendarIcon className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">CPM</p>
                      <p className="text-xl font-bold text-green-400">
                        {formatCPM(metrics?.cpm || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget Progress */}
            {metrics && campaign && (
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Budget Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatCurrency(metrics.totalSpend)} spent
                      </span>
                      <span className="text-muted-foreground">
                        {formatCurrency(campaign.budget)} budget
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-500"
                        style={{
                          width: `${Math.min(metrics.progressPercent, 100)}%`,
                          boxShadow: "0 0 8px rgba(59,130,246,0.6)",
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-foreground">
                        {metrics.progressPercent}% Complete
                      </span>
                      <span className="text-muted-foreground">
                        {formatCurrency(Math.max(0, campaign.budget - metrics.totalSpend))} remaining
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Creators Carousel */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Campaign Creators ({creators?.length || 0})
                </h3>
              </div>

              {creators && creators.length > 0 ? (
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {creators.map((creator) => (
                      <CarouselItem
                        key={creator.userId}
                        className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                      >
                        <CreatorCarouselCard
                          creator={{
                            userId: creator.userId,
                            username: creator.username,
                            platform: creator.platform,
                            videosPosted: creator.videosPosted,
                            totalViews: creator.totalViews,
                            paymentAmount: creator.paymentAmount,
                            paymentStatus: creator.paymentStatus,
                            engagementRate: creator.engagementRate,
                          }}
                          onClick={() => {
                            // TODO: Navigate to creator detail page or open creator modal
                            console.log("Creator clicked:", creator.userId);
                          }}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
              ) : (
                <Card className="shadow-none">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                      No creators assigned to this campaign yet
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Additional Metrics */}
            {metrics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-none">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Likes</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatNumber(metrics.totalLikes || 0)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-none">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Comments</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatNumber(metrics.totalComments || 0)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-none">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Shares</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatNumber(metrics.totalShares || 0)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
