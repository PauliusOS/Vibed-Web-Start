"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  Eye,
  Heart,
  TrendingUp,
  Video,
  DollarSign,
  BarChart3,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  platform: "tiktok" | "instagram" | "youtube";
  views: number;
  engagement: number;
  engagementRate: number;
  videos: number;
  medianCPM: number;
  performance: "excellent" | "good" | "average";
}

interface CreatorLeaderboardProps {
  creators: Creator[];
  dateRange?: string;
  className?: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function getPerformanceBadge(performance: Creator["performance"]) {
  switch (performance) {
    case "excellent":
      return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] px-2 py-0.5">Excellent</Badge>;
    case "good":
      return <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px] px-2 py-0.5">Good</Badge>;
    case "average":
      return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] px-2 py-0.5">Average</Badge>;
  }
}

function getPlatformColor(platform: Creator["platform"]) {
  switch (platform) {
    case "tiktok":
      return "border-white/10 text-white/60 bg-white/5";
    case "instagram":
      return "border-pink-500/20 text-pink-400/80 bg-pink-500/5";
    case "youtube":
      return "border-red-500/20 text-red-400/80 bg-red-500/5";
  }
}

// Smooth spring animation
const smoothSpring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export function CreatorLeaderboard({ 
  creators, 
  dateRange = "Last 30 days",
  className 
}: CreatorLeaderboardProps) {
  const [sortBy, setSortBy] = useState<"views" | "engagement" | "videos">("views");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedCreator, setExpandedCreator] = useState<string | null>(null);

  const sortedCreators = [...creators].sort((a, b) => {
    const multiplier = sortOrder === "asc" ? 1 : -1;
    return (a[sortBy] - b[sortBy]) * multiplier;
  });

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <motion.div
      className={cn(
        "bg-white/[0.02] border border-white/[0.06] overflow-hidden",
        className
      )}
      style={{
        borderRadius: '24px',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={smoothSpring}
    >
      <Tabs defaultValue="creators" className="w-full">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Creator Rankings</h2>
                <p className="text-white/40 text-xs">
                  {creators.length} creators • {dateRange}
                </p>
              </div>
            </div>
            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">
              By Views
            </Badge>
          </div>

          <TabsList className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 h-auto w-full grid grid-cols-3 gap-1">
            <TabsTrigger
              value="creators"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 rounded-lg py-2 text-sm transition-all"
            >
              Leaderboard
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 rounded-lg py-2 text-sm transition-all"
            >
              Top Videos
            </TabsTrigger>
            <TabsTrigger
              value="compare"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 rounded-lg py-2 text-sm transition-all"
            >
              Compare
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          <TabsContent value="creators" className="mt-0">
            {/* Sort Controls */}
            <div className="flex items-center gap-1 mb-3 px-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSort("views")}
                className={cn(
                  "text-white/40 hover:text-white hover:bg-white/5 text-xs h-7 px-2 rounded-lg transition-all",
                  sortBy === "views" && "text-cyan-400 bg-cyan-500/10"
                )}
              >
                <Eye className="w-3 h-3 mr-1" />
                Views
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSort("engagement")}
                className={cn(
                  "text-white/40 hover:text-white hover:bg-white/5 text-xs h-7 px-2 rounded-lg transition-all",
                  sortBy === "engagement" && "text-cyan-400 bg-cyan-500/10"
                )}
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Engagement
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSort("videos")}
                className={cn(
                  "text-white/40 hover:text-white hover:bg-white/5 text-xs h-7 px-2 rounded-lg transition-all",
                  sortBy === "videos" && "text-cyan-400 bg-cyan-500/10"
                )}
              >
                <Video className="w-3 h-3 mr-1" />
                Videos
              </Button>
            </div>

            {/* Leaderboard */}
            <div className="space-y-1.5">
              {sortedCreators.map((creator, index) => (
                <motion.div
                  key={creator.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...smoothSpring, delay: index * 0.05 }}
                >
                  <motion.div
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer",
                      "bg-white/[0.02] hover:bg-white/[0.04]",
                      expandedCreator === creator.id && "bg-white/[0.05]"
                    )}
                    onClick={() => setExpandedCreator(expandedCreator === creator.id ? null : creator.id)}
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                  >
                    {/* Rank */}
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold flex-shrink-0",
                      index === 0 && "bg-gradient-to-br from-yellow-400 to-orange-500 text-white",
                      index === 1 && "bg-gradient-to-br from-slate-300 to-slate-400 text-slate-800",
                      index === 2 && "bg-gradient-to-br from-amber-600 to-amber-700 text-white",
                      index > 2 && "bg-white/5 text-white/50"
                    )}>
                      {index + 1}
                    </div>

                    {/* Avatar & Info */}
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <Avatar className="h-9 w-9 ring-1 ring-white/10">
                        <AvatarImage src={creator.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs">
                          {creator.name[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">
                          {creator.name}
                        </h4>
                        <p className="text-[11px] text-white/40 truncate">@{creator.username}</p>
                      </div>
                    </div>

                    {/* Metrics - Desktop */}
                    <div className="hidden lg:flex items-center gap-6 text-xs flex-shrink-0">
                      <div className="text-center min-w-[60px]">
                        <div className="font-semibold text-white">{formatNumber(creator.views)}</div>
                        <div className="text-white/30 text-[10px]">Views</div>
                      </div>
                      <div className="text-center min-w-[60px]">
                        <div className="font-semibold text-white">{formatNumber(creator.engagement)}</div>
                        <div className="text-white/30 text-[10px]">Engmt</div>
                      </div>
                      <div className="text-center min-w-[50px]">
                        <div className="font-semibold text-cyan-400">{creator.engagementRate.toFixed(1)}%</div>
                        <div className="text-white/30 text-[10px]">Rate</div>
                      </div>
                      <div className="text-center min-w-[40px]">
                        <div className="font-semibold text-white">{creator.videos}</div>
                        <div className="text-white/30 text-[10px]">Vids</div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
                      {getPerformanceBadge(creator.performance)}
                      <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0.5", getPlatformColor(creator.platform))}>
                        {creator.platform}
                      </Badge>
                    </div>

                    {/* Expand Icon */}
                    <motion.div
                      animate={{ rotate: expandedCreator === creator.id ? 180 : 0 }}
                      transition={smoothSpring}
                    >
                      <ChevronDown className="w-4 h-4 text-white/30" />
                    </motion.div>
                  </motion.div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedCreator === creator.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={smoothSpring}
                        className="overflow-hidden"
                      >
                        <div className="mt-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] ml-11">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg p-2.5">
                              <Eye className="w-4 h-4 text-cyan-400" />
                              <div>
                                <div className="text-[10px] text-white/40">Total Views</div>
                                <div className="text-sm font-semibold text-white">{formatNumber(creator.views)}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg p-2.5">
                              <Heart className="w-4 h-4 text-pink-400" />
                              <div>
                                <div className="text-[10px] text-white/40">Engagement</div>
                                <div className="text-sm font-semibold text-white">{formatNumber(creator.engagement)}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg p-2.5">
                              <TrendingUp className="w-4 h-4 text-emerald-400" />
                              <div>
                                <div className="text-[10px] text-white/40">Eng. Rate</div>
                                <div className="text-sm font-semibold text-white">{creator.engagementRate.toFixed(1)}%</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg p-2.5">
                              <DollarSign className="w-4 h-4 text-emerald-400" />
                              <div>
                                <div className="text-[10px] text-white/40">Median CPM</div>
                                <div className="text-sm font-semibold text-white">${creator.medianCPM.toFixed(2)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-0">
            <div className="text-center py-16 text-white/30">
              <Video className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Top Videos coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="compare" className="mt-0">
            <div className="text-center py-16 text-white/30">
              <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Compare view coming soon</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}
