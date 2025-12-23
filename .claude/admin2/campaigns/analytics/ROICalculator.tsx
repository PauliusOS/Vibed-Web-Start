"use client";

import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, TrendingUp, TrendingDown, DollarSign, Eye, Heart, Target } from "lucide-react";

interface ROIData {
  totalBudget: number;
  totalSpent: number;
  totalViews: number;
  totalEngagement: number;
  costPerView: number;
  costPerEngagement: number;
  estimatedReach: number;
  estimatedValue: number;
}

interface ROICalculatorProps {
  data: ROIData | undefined;
  isLoading?: boolean;
}

export function ROICalculator({ data, isLoading }: ROICalculatorProps) {
  if (isLoading) {
    return (
      <GlassPanel className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </GlassPanel>
    );
  }

  // Default values if no data
  const metrics = data || {
    totalBudget: 0,
    totalSpent: 0,
    totalViews: 0,
    totalEngagement: 0,
    costPerView: 0,
    costPerEngagement: 0,
    estimatedReach: 0,
    estimatedValue: 0,
  };

  const roi = metrics.totalSpent > 0
    ? ((metrics.estimatedValue - metrics.totalSpent) / metrics.totalSpent) * 100
    : 0;

  const budgetUtilization = metrics.totalBudget > 0
    ? (metrics.totalSpent / metrics.totalBudget) * 100
    : 0;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const roiCards = [
    {
      label: "Total Spent",
      value: formatCurrency(metrics.totalSpent),
      subLabel: `${budgetUtilization.toFixed(0)}% of budget`,
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      tooltip: "Total amount spent on this campaign",
    },
    {
      label: "Cost Per View",
      value: `$${metrics.costPerView.toFixed(4)}`,
      subLabel: `${formatNumber(metrics.totalViews)} views`,
      icon: Eye,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      tooltip: "Average cost per view",
    },
    {
      label: "Cost Per Engagement",
      value: `$${metrics.costPerEngagement.toFixed(3)}`,
      subLabel: `${formatNumber(metrics.totalEngagement)} engagements`,
      icon: Heart,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      tooltip: "Average cost per engagement (likes, comments, shares)",
    },
    {
      label: "Estimated ROI",
      value: `${roi >= 0 ? "+" : ""}${roi.toFixed(1)}%`,
      subLabel: `Est. value: ${formatCurrency(metrics.estimatedValue)}`,
      icon: roi >= 0 ? TrendingUp : TrendingDown,
      color: roi >= 0 ? "text-emerald-400" : "text-red-400",
      bgColor: roi >= 0 ? "bg-emerald-500/10" : "bg-red-500/10",
      tooltip: "Return on investment based on estimated media value",
    },
  ];

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">ROI & Budget Analysis</h3>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-4 h-4 text-white/40 hover:text-white/60" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>ROI is calculated based on estimated media value derived from industry benchmarks for views and engagements.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {roiCards.map((card) => (
          <TooltipProvider key={card.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`${card.bgColor} rounded-xl p-4 cursor-help`}>
                  <div className="flex items-center gap-2 mb-2">
                    <card.icon className={`w-4 h-4 ${card.color}`} />
                    <span className="text-sm text-white/60">{card.label}</span>
                  </div>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-white/40 mt-1">{card.subLabel}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{card.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Budget Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/60">Budget Utilization</span>
          <span className="text-white">
            {formatCurrency(metrics.totalSpent)} / {formatCurrency(metrics.totalBudget)}
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              budgetUtilization > 90
                ? "bg-red-500"
                : budgetUtilization > 70
                ? "bg-amber-500"
                : "bg-emerald-500"
            }`}
            style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/40 mt-1">
          <span>0%</span>
          <span>{budgetUtilization.toFixed(1)}% used</span>
          <span>100%</span>
        </div>
      </div>
    </GlassPanel>
  );
}
