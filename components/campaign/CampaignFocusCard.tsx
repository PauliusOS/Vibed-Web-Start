"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUpIcon, DollarSignIcon, ShoppingBagIcon, ArrowUpRightIcon, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pie, PieChart, Label } from "recharts";
import { Card as UICard, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  formatNumber,
  formatCurrency,
  formatCPM,
  formatDate,
  getStatusColor,
} from "@/lib/utils/campaignCalculations";
import type { CampaignCard } from "@/lib/utils/campaignCardHelpers";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface CampaignFocusCardProps {
  campaign: CampaignCard;
  index: number;
  hovered: number | null;
  expanded: boolean;
  onHoverChange: (index: number | null) => void;
  onClick: () => void;
}

const revenueChartConfig = {
  sales: {
    label: "Budget",
  },
  spent: {
    label: "Spent",
    color: "var(--primary)",
  },
  remaining: {
    label: "Remaining",
    color: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
} satisfies ChartConfig;

export function CampaignFocusCard({
  campaign,
  index,
  hovered,
  expanded,
  onHoverChange,
  onClick,
}: CampaignFocusCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [initializationTime] = useState(new Date());

  // Fetch campaign earnings breakdown for pending payments count
  // FIX: Changed campaign._id to campaign.campaignId (correct property name per CampaignCard interface)
  const earningsBreakdown = useQuery(
    api.earnings.getCampaignEarningsBreakdown,
    { campaignId: campaign.campaignId }
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (start: Date, end: Date) => {
    const duration = end.getTime() - start.getTime();
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // Chart data
  const budgetRemaining = Math.max(0, campaign.metrics.dedicatedRoster - campaign.metrics.totalSpend);
  const revenueChartData = [
    { month: "spent", sales: campaign.metrics.totalSpend, fill: "var(--color-spent)" },
    { month: "remaining", sales: budgetRemaining, fill: "var(--color-remaining)" },
  ];

  return (
    <motion.div
      layout
      onMouseEnter={() => onHoverChange(index)}
      onMouseLeave={() => onHoverChange(null)}
      onClick={onClick}
      className={cn(
        "rounded-lg relative bg-card border border-border overflow-hidden transition-all duration-300 ease-out cursor-pointer",
        "hover:border-primary/50",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]",
        expanded ? "col-span-full" : ""
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url(${campaign.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/opa-logo.svg"
              className="h-10 w-10 rounded-lg"
              alt="logo"
            />
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xl font-medium text-foreground">{campaign.title}</span>
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status}
                </Badge>
              </div>
              <span className="text-muted-foreground text-sm">
                Created {formatDate(campaign.createdAt)}
              </span>
            </div>
          </div>
          <div
            className="flex flex-col items-end font-mono text-xs text-red-400"
            style={{
              textShadow: "0 0 8px rgba(239,68,68,0.6), 0 0 12px rgba(239,68,68,0.4)",
              fontFamily: '"LCD", "DSEG7 Classic", "Courier New", monospace',
              letterSpacing: "0.05em",
            }}
          >
            <span className="text-red-400/60 text-[10px] mb-0.5">Last initialisation</span>
            <span>{formatDuration(initializationTime, currentTime)}</span>
          </div>
        </div>

        {/* Collapsed Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Reach */}
          <div className="flex items-center gap-3 p-3 border border-border rounded-md bg-background/50">
            <div className="flex items-center justify-center h-8 w-8 rounded-sm bg-primary/10">
              <TrendingUpIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Reach</p>
              <p className="text-lg font-medium text-foreground">
                {formatNumber(campaign.metrics.totalReach)}
              </p>
            </div>
          </div>

          {/* Total Videos */}
          <div className="flex items-center gap-3 p-3 border border-border rounded-md bg-background/50">
            <div className="flex items-center justify-center h-8 w-8 rounded-sm bg-primary/10">
              <ShoppingBagIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Videos</p>
              <p className="text-lg font-medium text-foreground">
                {campaign.metrics.totalVideos}
              </p>
            </div>
          </div>

          {/* Total Spend */}
          <div className="flex items-center gap-3 p-3 border border-border rounded-md bg-background/50">
            <div className="flex items-center justify-center h-8 w-8 rounded-sm bg-primary/10">
              <DollarSignIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Spend</p>
              <p className="text-lg font-medium text-foreground">
                {formatCurrency(campaign.metrics.totalSpend)}
              </p>
            </div>
          </div>

          {/* Budget Remaining */}
          <div className="flex items-center gap-3 p-3 border border-border rounded-md bg-background/50">
            <div className="flex items-center justify-center h-8 w-8 rounded-sm bg-green-500/10">
              <DollarSignIcon className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Budget Remaining</p>
              <p className="text-lg font-medium text-foreground">
                {formatCurrency(budgetRemaining)}
              </p>
            </div>
          </div>

          {/* CPM with animation */}
          <div className="flex items-center gap-3 p-3 rounded-md bg-background/50 relative overflow-hidden">
            <div className="flex items-center justify-center h-8 w-8 rounded-sm bg-primary/10">
              <ArrowUpRightIcon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-0.5">CPM</p>
              <div className="flex items-center gap-2">
                {/* Electricity animation container */}
                <div className="flex-1 relative flex items-center h-4">
                  {/* Base dashed line */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-[1px] border-t border-dashed border-white/20" />
                  </div>
                  {/* Animated electricity */}
                  <div className="absolute inset-0 flex items-center animate-electricity-right">
                    <div
                      className="w-full h-[1px] border-t border-dashed border-green-400"
                      style={{
                        filter:
                          "drop-shadow(0 0 3px rgba(34,197,94,1)) drop-shadow(0 0 6px rgba(34,197,94,0.8))",
                      }}
                    />
                  </div>
                </div>
                <span
                  className="font-mono text-sm font-bold text-green-400"
                  style={{
                    textShadow:
                      "0 0 8px rgba(74,222,128,0.8), 0 0 16px rgba(74,222,128,0.5)",
                    fontFamily: '"LCD", "DSEG7 Classic", "Courier New", monospace',
                  }}
                >
                  {formatCPM(campaign.metrics.cpm)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4 border-t border-border">
                {/* Budget Progress Chart */}
                <UICard className="shadow-none bg-background/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Campaign Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <ChartContainer config={revenueChartConfig} className="h-32 w-full">
                      <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                        <Pie
                          data={revenueChartData}
                          dataKey="sales"
                          nameKey="month"
                          startAngle={300}
                          endAngle={660}
                          innerRadius={45}
                          outerRadius={60}
                          paddingAngle={2}
                        >
                          <Label
                            content={({ viewBox }) => {
                              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                  <text
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                  >
                                    <tspan
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      className="fill-foreground text-2xl font-bold"
                                    >
                                      {formatCurrency(campaign.metrics.dedicatedRoster)}
                                    </tspan>
                                  </text>
                                );
                              }
                            }}
                          />
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter className="justify-end pb-3">
                    <span className="text-xl font-medium">
                      {campaign.metrics.progressPercent}%
                    </span>
                  </CardFooter>
                </UICard>

                {/* Additional Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 border border-border rounded-md bg-background/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Creators</p>
                    </div>
                    <p className="text-lg font-medium text-foreground">
                      {campaign.metrics.creatorCount}
                    </p>
                  </div>

                  <div className="p-3 border border-border rounded-md bg-background/50">
                    <p className="text-xs text-muted-foreground mb-1">Budget</p>
                    <p className="text-lg font-medium text-foreground">
                      {formatCurrency(campaign.budget)}
                    </p>
                  </div>

                  <div className="p-3 border border-border rounded-md bg-background/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <p className="text-lg font-medium text-foreground">
                      {earningsBreakdown?.paymentsCount ?? 0}
                    </p>
                  </div>
                </div>

                {/* View Full Details Button */}
                <Button
                  className="w-full"
                  variant="default"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering card onClick
                    onClick();
                  }}
                >
                  View Full Details
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
