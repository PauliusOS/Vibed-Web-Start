"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedLineChart } from "@/components/admin2/charts/AdvancedLineChart";
import { AdvancedBarChart } from "@/components/admin2/charts/AdvancedBarChart";
import { ComparisonChart } from "@/components/admin2/charts/ComparisonChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  DollarSign,
  Video,
  Calendar,
} from "lucide-react";
import { motion } from "motion/react";

interface CreatorAnalyticsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creatorName: string;
  creatorId: string;
}

export function CreatorAnalyticsPanel({
  open,
  onOpenChange,
  creatorName,
  creatorId,
}: CreatorAnalyticsPanelProps) {
  const [timeRange, setTimeRange] = useState("30");

  // Mock data - replace with actual data from Convex
  const performanceData = [
    { date: "Jan", views: 45000, likes: 3200, comments: 450, shares: 180 },
    { date: "Feb", views: 52000, likes: 3800, comments: 520, shares: 210 },
    { date: "Mar", views: 48000, likes: 3500, comments: 480, shares: 195 },
    { date: "Apr", views: 61000, likes: 4300, comments: 610, shares: 240 },
    { date: "May", views: 58000, likes: 4100, comments: 580, shares: 230 },
    { date: "Jun", views: 72000, likes: 5200, comments: 690, shares: 285 },
  ];

  const campaignData = [
    { name: "Summer Launch", videos: 8, views: 125000, engagement: 4.2 },
    { name: "Product Review", videos: 5, views: 89000, engagement: 5.1 },
    { name: "Brand Story", videos: 3, views: 67000, engagement: 3.8 },
    { name: "Holiday Special", videos: 6, views: 142000, engagement: 4.9 },
  ];

  const comparisonData = [
    { metric: "Views", current: 285000, previous: 248000 },
    { metric: "Engagement", current: 4.5, previous: 3.9 },
    { metric: "Videos", current: 22, previous: 18 },
  ];

  const stats = {
    totalViews: 285000,
    totalLikes: 20100,
    totalComments: 2830,
    totalShares: 1140,
    averageEngagement: 4.5,
    totalEarned: 12500,
    totalVideos: 22,
    campaignCount: 4,
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Creator Analytics</DialogTitle>
              <DialogDescription className="mt-1">
                Performance metrics for {creatorName}
              </DialogDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-white/[0.02] border-white/[0.06] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="365">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-white/60 text-sm">Total Views</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatNumber(stats.totalViews)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-white/60 text-sm">Engagement</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.averageEngagement}%
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-4 h-4 text-purple-400" />
              <span className="text-white/60 text-sm">Total Videos</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalVideos}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-white/60 text-sm">Total Earned</span>
            </div>
            <p className="text-2xl font-bold text-white">
              ${stats.totalEarned.toLocaleString()}
            </p>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="performance" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="bg-white/[0.02] border-b border-white/[0.06] rounded-none">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto py-4">
            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6 m-0">
              {/* Engagement Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Engagement Metrics Over Time
                </h3>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                  <AdvancedLineChart
                    data={performanceData}
                    lines={[
                      { dataKey: "views", color: "#3b82f6", name: "Views" },
                      { dataKey: "likes", color: "#ef4444", name: "Likes" },
                      { dataKey: "comments", color: "#8b5cf6", name: "Comments" },
                      { dataKey: "shares", color: "#10b981", name: "Shares" },
                    ]}
                    xAxisKey="date"
                    height={300}
                  />
                </div>
              </div>

              {/* Engagement Breakdown */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-white/60 text-sm">Total Likes</span>
                  </div>
                  <p className="text-xl font-bold text-white mb-1">
                    {formatNumber(stats.totalLikes)}
                  </p>
                  <p className="text-xs text-green-400">+12% from last period</p>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                    <span className="text-white/60 text-sm">Total Comments</span>
                  </div>
                  <p className="text-xl font-bold text-white mb-1">
                    {formatNumber(stats.totalComments)}
                  </p>
                  <p className="text-xs text-green-400">+8% from last period</p>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Share2 className="w-4 h-4 text-green-400" />
                    <span className="text-white/60 text-sm">Total Shares</span>
                  </div>
                  <p className="text-xl font-bold text-white mb-1">
                    {formatNumber(stats.totalShares)}
                  </p>
                  <p className="text-xs text-green-400">+15% from last period</p>
                </div>
              </div>
            </TabsContent>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-6 m-0">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Campaign Performance
                </h3>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                  <AdvancedBarChart
                    data={campaignData}
                    bars={[
                      { dataKey: "views", color: "#3b82f6", name: "Views" },
                      { dataKey: "videos", color: "#8b5cf6", name: "Videos" },
                    ]}
                    xAxisKey="name"
                    height={300}
                  />
                </div>
              </div>

              {/* Campaign List */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">
                  Campaign Details
                </h3>
                {campaignData.map((campaign, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">{campaign.name}</h4>
                      <span className="text-green-400 font-semibold">
                        {campaign.engagement}% engagement
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Videos</span>
                        <p className="text-white font-medium">{campaign.videos}</p>
                      </div>
                      <div>
                        <span className="text-white/60">Total Views</span>
                        <p className="text-white font-medium">
                          {formatNumber(campaign.views)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Comparison Tab */}
            <TabsContent value="comparison" className="space-y-6 m-0">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Period Comparison
                </h3>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                  <ComparisonChart
                    data={comparisonData}
                    currentKey="current"
                    previousKey="previous"
                    categoryKey="metric"
                    height={300}
                  />
                </div>
              </div>

              {/* Detailed Comparison */}
              <div className="space-y-3">
                {comparisonData.map((item, index) => {
                  const change =
                    ((item.current - item.previous) / item.previous) * 100;
                  const isPositive = change > 0;

                  return (
                    <div
                      key={index}
                      className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">{item.metric}</span>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-white/60 text-xs">Previous</p>
                            <p className="text-white font-medium">
                              {item.previous.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white/60 text-xs">Current</p>
                            <p className="text-white font-medium">
                              {item.current.toLocaleString()}
                            </p>
                          </div>
                          <div
                            className={`px-2 py-1 rounded ${
                              isPositive
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            <span className="text-sm font-medium">
                              {isPositive ? "+" : ""}
                              {change.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
