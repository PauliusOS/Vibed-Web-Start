"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Video,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Platform icons
const InstagramIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TikTokIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);


// Sample creators for demo
const SAMPLE_CREATORS = [
  {
    id: "creator_1",
    name: "Sarah Johnson",
    username: "sarahjcreates",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    platform: "tiktok" as const,
  },
  {
    id: "creator_2",
    name: "Mike Chen",
    username: "mikechenlife",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    platform: "instagram" as const,
  },
  {
    id: "creator_3",
    name: "Emma Wilson",
    username: "emmawilson",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    platform: "tiktok" as const,
  },
  {
    id: "creator_4",
    name: "Alex Rivera",
    username: "alexrivera_",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    platform: "instagram" as const,
  },
  {
    id: "creator_5",
    name: "Olivia Martinez",
    username: "oliviamartinez",
    profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    platform: "tiktok" as const,
  },
  {
    id: "creator_6",
    name: "James Park",
    username: "jamespark_",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    platform: "instagram" as const,
  },
];

// Seeded random for consistent values
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

type SortMetric = "views" | "engagement" | "engagementRate" | "videos" | "median" | "cpm";

// Smooth spring animation config
const smoothSpring = {
  type: "spring" as const,
  stiffness: 200,
  damping: 30,
  mass: 0.8,
};

// Even smoother for layout changes
const layoutSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 35,
  mass: 0.5,
};

export function CreatorLeaderboardDemo() {
  const [sortBy, setSortBy] = useState<SortMetric>("views");
  const [timeRange, setTimeRange] = useState<number>(30);

  // Generate sample leaderboard data
  const leaderboardData = useMemo(() => {
    return SAMPLE_CREATORS.map((creator, index) => {
      const seed = index * 100 + timeRange;
      const baseViews = 200000 + seededRandom(seed) * 800000;
      const baseEngagement = baseViews * (0.03 + seededRandom(seed + 1) * 0.07);
      const videoCount = 3 + Math.floor(seededRandom(seed + 2) * 5);
      const medianViews = Math.round(baseViews / videoCount * (0.8 + seededRandom(seed + 3) * 0.4));
      const cpm = 2.5 + seededRandom(seed + 4) * 5.5; // CPM between $2.50 and $8.00
      
      return {
        ...creator,
        totalViews: Math.round(baseViews),
        totalEngagement: Math.round(baseEngagement),
        videoCount,
        engagementRate: (baseEngagement / baseViews) * 100,
        medianViews,
        cpm,
      };
    }).sort((a, b) => {
      switch (sortBy) {
        case "views":
          return b.totalViews - a.totalViews;
        case "engagement":
          return b.totalEngagement - a.totalEngagement;
        case "engagementRate":
          return b.engagementRate - a.engagementRate;
        case "videos":
          return b.videoCount - a.videoCount;
        case "median":
          return b.medianViews - a.medianViews;
        case "cpm":
          return a.cpm - b.cpm; // Lower CPM is better
        default:
          return b.totalViews - a.totalViews;
      }
    });
  }, [sortBy, timeRange]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  // Just show the rank number for all positions
  const getRankDisplay = (rank: number) => {
    return (
      <span className="w-5 h-5 flex items-center justify-center text-[13px] font-medium text-white/50">
        {rank}
      </span>
    );
  };


  // Calculate progress percentage for a creator
  const getProgressPercentage = (creator: typeof leaderboardData[0]) => {
    switch (sortBy) {
      case "views":
        return (creator.totalViews / Math.max(...leaderboardData.map((c) => c.totalViews))) * 100;
      case "engagement":
        return (creator.totalEngagement / Math.max(...leaderboardData.map((c) => c.totalEngagement))) * 100;
      case "engagementRate":
        return (creator.engagementRate / Math.max(...leaderboardData.map((c) => c.engagementRate))) * 100;
      case "videos":
        return (creator.videoCount / Math.max(...leaderboardData.map((c) => c.videoCount))) * 100;
      case "median":
        return (creator.medianViews / Math.max(...leaderboardData.map((c) => c.medianViews))) * 100;
      case "cpm":
        const minCpm = Math.min(...leaderboardData.map((c) => c.cpm));
        const maxCpm = Math.max(...leaderboardData.map((c) => c.cpm));
        return ((maxCpm - creator.cpm) / (maxCpm - minCpm)) * 100;
      default:
        return (creator.totalViews / Math.max(...leaderboardData.map((c) => c.totalViews))) * 100;
    }
  };

  // Column definitions for cleaner header
  const columns = [
    { key: "views", label: "Views", width: "min-w-[80px]" },
    { key: "engagement", label: "Engagement", width: "min-w-[90px]" },
    { key: "engagementRate", label: "Eng. Rate", width: "min-w-[70px]" },
    { key: "videos", label: "Videos", width: "min-w-[60px]" },
    { key: "median", label: "Median", width: "min-w-[70px]" },
    { key: "cpm", label: "CPM", width: "min-w-[60px]" },
  ];

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Metallic ranking icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C0C0C0" />
                <stop offset="25%" stopColor="#E8E8E8" />
                <stop offset="50%" stopColor="#A8A8A8" />
                <stop offset="75%" stopColor="#D4D4D4" />
                <stop offset="100%" stopColor="#9A9A9A" />
              </linearGradient>
              <linearGradient id="metalShine" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
              </linearGradient>
            </defs>
            <rect x="3" y="12" width="4" height="9" rx="1" fill="url(#metalGradient)" />
            <rect x="3" y="12" width="4" height="9" rx="1" fill="url(#metalShine)" />
            <rect x="10" y="6" width="4" height="15" rx="1" fill="url(#metalGradient)" />
            <rect x="10" y="6" width="4" height="15" rx="1" fill="url(#metalShine)" />
            <rect x="17" y="3" width="4" height="18" rx="1" fill="url(#metalGradient)" />
            <rect x="17" y="3" width="4" height="18" rx="1" fill="url(#metalShine)" />
          </svg>
          <h2 className="text-lg font-semibold text-white">
            Creator Rankings
          </h2>
          <Badge
            variant="outline"
            className="border-white/10 text-white/50 text-[11px]"
          >
            {leaderboardData.length} creators
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={timeRange.toString()}
            onValueChange={(v) => setTimeRange(parseInt(v))}
          >
            <SelectTrigger className="w-32 h-9 bg-white/5 border-white/10 text-white text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              <SelectItem value="7" className="text-white text-[13px]">
                Last 7 days
              </SelectItem>
              <SelectItem value="14" className="text-white text-[13px]">
                Last 14 days
              </SelectItem>
              <SelectItem value="30" className="text-white text-[13px]">
                Last 30 days
              </SelectItem>
              <SelectItem value="90" className="text-white text-[13px]">
                Last 90 days
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortMetric)}
          >
            <SelectTrigger className="w-40 h-9 bg-white/5 border-white/10 text-white text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              <SelectItem value="views" className="text-white text-[13px]">
                <div className="flex items-center gap-2">
                  <Eye className="w-3 h-3" /> Views
                </div>
              </SelectItem>
              <SelectItem value="engagement" className="text-white text-[13px]">
                <div className="flex items-center gap-2">
                  <Heart className="w-3 h-3" /> Engagement
                </div>
              </SelectItem>
              <SelectItem
                value="engagementRate"
                className="text-white text-[13px]"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" /> Eng. Rate
                </div>
              </SelectItem>
              <SelectItem value="videos" className="text-white text-[13px]">
                <div className="flex items-center gap-2">
                  <Video className="w-3 h-3" /> Videos
                </div>
              </SelectItem>
              <SelectItem value="median" className="text-white text-[13px]">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3 h-3" /> Median
                </div>
              </SelectItem>
              <SelectItem value="cpm" className="text-white text-[13px]">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" /> CPM
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Header - Hidden on mobile, shown on larger screens */}
      <div className="hidden lg:flex items-center gap-4 px-4 py-2 border-b border-white/10">
        {/* Rank column */}
        <div className="w-8 text-center">
          <span className="text-[11px] font-medium text-white/40">#</span>
        </div>
        
        {/* Creator column */}
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-medium text-white/40">Creator</span>
        </div>
        
        {/* Stats columns */}
        <div className="flex items-center gap-8">
          {columns.map((col) => (
            <div key={col.key} className={`text-center ${col.width}`}>
              <motion.span
                className={`text-[11px] font-medium transition-colors ${
                  sortBy === col.key ? "text-blue-400" : "text-white/40"
                }`}
                animate={{ 
                  color: sortBy === col.key ? "rgb(96, 165, 250)" : "rgba(255, 255, 255, 0.4)" 
                }}
                transition={smoothSpring}
              >
                {col.label}
              </motion.span>
            </div>
          ))}
        </div>
        
        {/* Progress column */}
        <div className="w-32 text-center">
          <span className="text-[11px] font-medium text-white/40">Performance</span>
        </div>
      </div>

      {/* Rankings List */}
      <div className="divide-y divide-white/[0.06]">
        <AnimatePresence mode="popLayout">
          {leaderboardData.map((creator, index) => {
            const progressPercent = getProgressPercentage(creator);
            
            return (
              <motion.div
                key={creator.id}
                layout
                layoutId={creator.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={layoutSpring}
                whileHover={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  transition: { duration: 0.15 },
                }}
                className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 px-4 py-3.5 cursor-pointer"
              >
                {/* Mobile: Rank + Creator Info Row */}
                <div className="flex items-center gap-3 lg:contents">
                  {/* Rank */}
                  <div className="w-8 flex justify-center shrink-0">{getRankDisplay(index + 1)}</div>

                  {/* Creator Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="w-10 h-10 ring-1 ring-white/10 shrink-0">
                      <AvatarImage src={creator.profilePicture} alt={creator.name} />
                      <AvatarFallback className="text-sm font-medium bg-white/5 text-white/70">
                        {creator.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-white truncate">
                        {creator.name}
                      </p>
                      <p className="text-[12px] text-white/50 truncate">
                        @{creator.username}
                      </p>
                    </div>
                    {creator.platform === "instagram" ? (
                      <InstagramIcon className="ml-2 h-4 w-4 text-white/50 shrink-0" />
                    ) : (
                      <TikTokIcon className="ml-2 h-4 w-4 text-white/50 shrink-0" />
                    )}
                  </div>
                </div>

                {/* Mobile: Stats Grid */}
                <div className="grid grid-cols-3 gap-3 pl-11 lg:hidden">
                  <div>
                    <p className="text-[10px] text-white/40 mb-0.5">Views</p>
                    <motion.p
                      className={`text-[14px] font-semibold ${
                        sortBy === "views" ? "text-blue-400" : "text-white"
                      }`}
                    >
                      {formatNumber(creator.totalViews)}
                    </motion.p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 mb-0.5">Engagement</p>
                    <motion.p
                      className={`text-[14px] font-semibold ${
                        sortBy === "engagement" ? "text-blue-400" : "text-white"
                      }`}
                    >
                      {formatNumber(creator.totalEngagement)}
                    </motion.p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 mb-0.5">Eng. Rate</p>
                    <motion.p
                      className={`text-[14px] font-semibold ${
                        sortBy === "engagementRate" ? "text-blue-400" : "text-white"
                      }`}
                    >
                      {creator.engagementRate.toFixed(2)}%
                    </motion.p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 mb-0.5">Videos</p>
                    <motion.p
                      className={`text-[14px] font-semibold ${
                        sortBy === "videos" ? "text-blue-400" : "text-white"
                      }`}
                    >
                      {creator.videoCount}
                    </motion.p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 mb-0.5">Median</p>
                    <motion.p
                      className={`text-[14px] font-semibold ${
                        sortBy === "median" ? "text-blue-400" : "text-white"
                      }`}
                    >
                      {formatNumber(creator.medianViews)}
                    </motion.p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 mb-0.5">CPM</p>
                    <motion.p
                      className={`text-[14px] font-semibold ${
                        sortBy === "cpm" ? "text-green-400" : "text-white"
                      }`}
                    >
                      ${creator.cpm.toFixed(2)}
                    </motion.p>
                  </div>
                </div>

                {/* Desktop: Stats - Values only (no labels) */}
                <div className="hidden lg:flex items-center gap-8">
                  <div className="text-center min-w-[80px]">
                    <motion.p
                      className={`text-[15px] font-semibold ${
                        sortBy === "views" ? "text-blue-400" : "text-white"
                      }`}
                      animate={{ 
                        color: sortBy === "views" ? "rgb(96, 165, 250)" : "rgb(255, 255, 255)" 
                      }}
                      transition={smoothSpring}
                    >
                      {formatNumber(creator.totalViews)}
                    </motion.p>
                  </div>
                  <div className="text-center min-w-[90px]">
                    <motion.p
                      className={`text-[15px] font-semibold ${
                        sortBy === "engagement" ? "text-blue-400" : "text-white"
                      }`}
                      animate={{ 
                        color: sortBy === "engagement" ? "rgb(96, 165, 250)" : "rgb(255, 255, 255)" 
                      }}
                      transition={smoothSpring}
                    >
                      {formatNumber(creator.totalEngagement)}
                    </motion.p>
                  </div>
                  <div className="text-center min-w-[70px]">
                    <motion.p
                      className={`text-[15px] font-semibold ${
                        sortBy === "engagementRate" ? "text-blue-400" : "text-white"
                      }`}
                      animate={{ 
                        color: sortBy === "engagementRate" ? "rgb(96, 165, 250)" : "rgb(255, 255, 255)" 
                      }}
                      transition={smoothSpring}
                    >
                      {creator.engagementRate.toFixed(2)}%
                    </motion.p>
                  </div>
                  <div className="text-center min-w-[60px]">
                    <motion.p
                      className={`text-[15px] font-semibold ${
                        sortBy === "videos" ? "text-blue-400" : "text-white"
                      }`}
                      animate={{ 
                        color: sortBy === "videos" ? "rgb(96, 165, 250)" : "rgb(255, 255, 255)" 
                      }}
                      transition={smoothSpring}
                    >
                      {creator.videoCount}
                    </motion.p>
                  </div>
                  <div className="text-center min-w-[70px]">
                    <motion.p
                      className={`text-[15px] font-semibold ${
                        sortBy === "median" ? "text-blue-400" : "text-white"
                      }`}
                      animate={{ 
                        color: sortBy === "median" ? "rgb(96, 165, 250)" : "rgb(255, 255, 255)" 
                      }}
                      transition={smoothSpring}
                    >
                      {formatNumber(creator.medianViews)}
                    </motion.p>
                  </div>
                  <div className="text-center min-w-[60px]">
                    <motion.p
                      className={`text-[15px] font-semibold ${
                        sortBy === "cpm" ? "text-green-400" : "text-white"
                      }`}
                      animate={{ 
                        color: sortBy === "cpm" ? "rgb(74, 222, 128)" : "rgb(255, 255, 255)" 
                      }}
                      transition={smoothSpring}
                    >
                      ${creator.cpm.toFixed(2)}
                    </motion.p>
                  </div>
                </div>

                {/* Progress Bar - Full width on mobile, fixed width on desktop */}
                <div className="w-full lg:w-32 pl-11 lg:pl-0">
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        mass: 0.5,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
