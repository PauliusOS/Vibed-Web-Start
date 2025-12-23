"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Users,
  MoreHorizontal,
  ExternalLink,
  Eye,
  Heart,
  Video,
  TrendingUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CREATOR_COLORS } from "../constants/colors";

// Sample creators
const SAMPLE_CREATORS = [
  {
    id: "creator_1",
    name: "Sarah Johnson",
    username: "sarahjcreates",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    platform: "tiktok" as const,
    color: CREATOR_COLORS[0],
  },
  {
    id: "creator_2",
    name: "Mike Chen",
    username: "mikechenlife",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    platform: "instagram" as const,
    color: CREATOR_COLORS[1],
  },
  {
    id: "creator_3",
    name: "Emma Wilson",
    username: "emmawilson",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    platform: "tiktok" as const,
    color: CREATOR_COLORS[2],
  },
  {
    id: "creator_4",
    name: "Alex Rivera",
    username: "alexrivera_",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    platform: "instagram" as const,
    color: CREATOR_COLORS[3],
  },
  {
    id: "creator_5",
    name: "Olivia Martinez",
    username: "oliviamartinez",
    profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    platform: "tiktok" as const,
    color: CREATOR_COLORS[4],
  },
  {
    id: "creator_6",
    name: "James Park",
    username: "jamespark_",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    platform: "instagram" as const,
    color: CREATOR_COLORS[5],
  },
];

// Seeded random
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Fixed base timestamp
const FIXED_NOW = new Date("2024-12-13T00:00:00Z").getTime();

type SortField = "name" | "views" | "engagement" | "engagementRate" | "videos";
type SortDirection = "asc" | "desc";

// Smooth easing for hover - cubic-bezier for "ease out" feel
const smoothEase = [0.25, 0.1, 0.25, 1]; // ease
const easeOutQuart = [0.25, 1, 0.5, 1]; // smooth ease out

export function CreatorListDemo() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("views");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Build creator data
  const creatorsData = useMemo(() => {
    const data = SAMPLE_CREATORS.map((creator, index) => {
      const seed = index * 100;
      const baseViews = 200000 + seededRandom(seed) * 800000;
      const baseLikes = baseViews * (0.03 + seededRandom(seed + 1) * 0.05);
      const baseComments = baseLikes * (0.1 + seededRandom(seed + 2) * 0.1);
      const videoCount = 3 + Math.floor(seededRandom(seed + 3) * 5);
      const daysAgo = 2 + Math.floor(seededRandom(seed + 4) * 10);

      return {
        ...creator,
        totalViews: Math.round(baseViews),
        totalLikes: Math.round(baseLikes),
        totalComments: Math.round(baseComments),
        totalEngagement: Math.round(baseLikes + baseComments),
        videoCount,
        engagementRate: ((baseLikes + baseComments) / baseViews) * 100,
        latestPost: FIXED_NOW - daysAgo * 24 * 60 * 60 * 1000,
      };
    });

    // Filter by search
    let filteredData = data;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.username.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    filteredData.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "views":
          comparison = a.totalViews - b.totalViews;
          break;
        case "engagement":
          comparison = a.totalEngagement - b.totalEngagement;
          break;
        case "engagementRate":
          comparison = a.engagementRate - b.engagementRate;
          break;
        case "videos":
          comparison = a.videoCount - b.videoCount;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filteredData;
  }, [search, sortField, sortDirection]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 ml-1 text-white/30" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 ml-1 text-blue-400" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1 text-blue-400" />
    );
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Campaign Creators</h2>
          <Badge
            variant="outline"
            className="border-white/10 text-white/50 text-[11px]"
          >
            {SAMPLE_CREATORS.length} creators
          </Badge>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search creators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-white/5 border-white/10 text-white text-[13px] placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_80px_70px_90px_100px_80px_80px_40px] gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
          <button
            onClick={() => handleSort("name")}
            className="flex items-center text-[11px] font-medium text-white/50 hover:text-white/80 transition-colors duration-200"
          >
            Creator
            <SortIcon field="name" />
          </button>
          <span className="text-[11px] font-medium text-white/50 text-center">Platform</span>
          <button
            onClick={() => handleSort("videos")}
            className="flex items-center justify-end text-[11px] font-medium text-white/50 hover:text-white/80 transition-colors duration-200"
          >
            Videos
            <SortIcon field="videos" />
          </button>
          <button
            onClick={() => handleSort("views")}
            className="flex items-center justify-end text-[11px] font-medium text-white/50 hover:text-white/80 transition-colors duration-200"
          >
            Views
            <SortIcon field="views" />
          </button>
          <button
            onClick={() => handleSort("engagement")}
            className="flex items-center justify-end text-[11px] font-medium text-white/50 hover:text-white/80 transition-colors duration-200"
          >
            Engagement
            <SortIcon field="engagement" />
          </button>
          <button
            onClick={() => handleSort("engagementRate")}
            className="flex items-center justify-end text-[11px] font-medium text-white/50 hover:text-white/80 transition-colors duration-200"
          >
            Eng. Rate
            <SortIcon field="engagementRate" />
          </button>
          <span className="text-[11px] font-medium text-white/50 text-center">Last Post</span>
          <span />
        </div>

        {/* Table Body */}
        <div className="divide-y divide-white/[0.04]">
          <AnimatePresence mode="popLayout">
            {creatorsData.map((creator, index) => (
              <motion.div
                key={creator.id}
                layout
                layoutId={creator.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0)",
                }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: 0.3,
                  ease: easeOutQuart,
                  delay: index * 0.02,
                }}
                whileHover={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  boxShadow: "inset 0 0 0 1px rgba(59, 130, 246, 0.3), 0 0 12px -2px rgba(59, 130, 246, 0.15)",
                  transition: { duration: 0.25, ease: smoothEase },
                }}
                className="grid grid-cols-[1fr_80px_70px_90px_100px_80px_80px_40px] gap-2 px-4 py-2.5 items-center cursor-pointer rounded-lg mx-1"
              >
                {/* Creator */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar
                    className="w-8 h-8 ring-2 ring-offset-1 ring-offset-black flex-shrink-0"
                    style={{ ringColor: creator.color }}
                  >
                    <AvatarImage
                      src={creator.profilePicture}
                      alt={creator.name}
                    />
                    <AvatarFallback
                      className="text-[10px]"
                      style={{ backgroundColor: creator.color }}
                    >
                      {creator.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-white truncate">
                      {creator.name}
                    </p>
                    <p className="text-[11px] text-white/40 truncate">
                      @{creator.username}
                    </p>
                  </div>
                </div>

                {/* Platform */}
                <div className="flex justify-center">
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-2 py-0.5 ${
                      creator.platform === "instagram"
                        ? "border-pink-500/30 text-pink-400"
                        : "border-white/20 text-white/60"
                    }`}
                  >
                    {creator.platform}
                  </Badge>
                </div>

                {/* Videos */}
                <div className="flex items-center justify-end gap-1">
                  <Video className="w-3 h-3 text-white/30" />
                  <span className="text-[13px] text-white tabular-nums">
                    {creator.videoCount}
                  </span>
                </div>

                {/* Views */}
                <div className="flex items-center justify-end gap-1">
                  <Eye className="w-3 h-3 text-white/30" />
                  <span className="text-[13px] text-white tabular-nums">
                    {formatNumber(creator.totalViews)}
                  </span>
                </div>

                {/* Engagement */}
                <div className="flex items-center justify-end gap-1">
                  <Heart className="w-3 h-3 text-white/30" />
                  <span className="text-[13px] text-white tabular-nums">
                    {formatNumber(creator.totalEngagement)}
                  </span>
                </div>

                {/* Engagement Rate */}
                <div className="text-right">
                  <span
                    className={`text-[13px] font-medium tabular-nums ${
                      creator.engagementRate >= 5
                        ? "text-emerald-400"
                        : creator.engagementRate >= 2
                        ? "text-white"
                        : "text-white/50"
                    }`}
                  >
                    {creator.engagementRate.toFixed(2)}%
                  </span>
                </div>

                {/* Last Post */}
                <div className="text-center">
                  <span className="text-[12px] text-white/50 tabular-nums">
                    {formatDate(creator.latestPost)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="h-7 w-7 flex items-center justify-center rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 ease-out"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-40 bg-black border-white/10"
                    >
                      <DropdownMenuItem className="text-[13px] text-white/70 hover:text-white hover:bg-white/5 cursor-pointer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[13px] text-white/70 hover:text-white hover:bg-white/5 cursor-pointer">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        View Analytics
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {creatorsData.length === 0 && search && (
          <div className="py-10 text-center">
            <p className="text-[13px] text-white/50">
              No creators found matching &quot;{search}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
