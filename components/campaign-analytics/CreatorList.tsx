"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  MessageCircle,
  Video,
  TrendingUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { motion } from "motion/react";

interface CreatorListProps {
  campaignId: Id<"campaigns">;
}

type SortField = "name" | "views" | "engagement" | "engagementRate" | "videos";
type SortDirection = "asc" | "desc";

export function CreatorList({ campaignId }: CreatorListProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("views");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Fetch creator analytics
  const creatorAnalytics = useQuery(api.analytics.getCampaignCreatorAnalytics, {
    campaignId,
    days: 90,
  });

  const isLoading = creatorAnalytics === undefined;

  // Build creator data with aggregated stats
  const creatorsData = useMemo(() => {
    if (!creatorAnalytics) return [];

    const creatorStats = new Map<
      string,
      {
        id: string;
        name: string;
        username: string;
        profilePicture: string;
        platform: string;
        color: string;
        totalViews: number;
        totalLikes: number;
        totalComments: number;
        totalEngagement: number;
        videoCount: number;
        engagementRate: number;
        latestPost: number | null;
      }
    >();

    // Initialize with creator info
    creatorAnalytics.creators.forEach((creator) => {
      creatorStats.set(creator.id, {
        id: creator.id,
        name: creator.name,
        username: creator.username,
        profilePicture: creator.profilePicture,
        platform: creator.platform,
        color: creator.color,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalEngagement: 0,
        videoCount: 0,
        engagementRate: 0,
        latestPost: null,
      });
    });

    // Aggregate from posts
    creatorAnalytics.posts.forEach((post) => {
      const stats = creatorStats.get(post.creatorId);
      if (stats) {
        stats.totalViews += post.views;
        stats.totalLikes += post.likes;
        stats.totalComments += post.comments;
        stats.totalEngagement += post.likes + post.comments;
        stats.videoCount += 1;
        if (!stats.latestPost || post.postedAt > stats.latestPost) {
          stats.latestPost = post.postedAt;
        }
      }
    });

    // Calculate engagement rates
    creatorStats.forEach((stats) => {
      if (stats.totalViews > 0) {
        stats.engagementRate = (stats.totalEngagement / stats.totalViews) * 100;
      }
    });

    // Filter by search
    let filteredData = Array.from(creatorStats.values());
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(
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
  }, [creatorAnalytics, search, sortField, sortDirection]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "—";
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 bg-white/10" />
          <Skeleton className="h-9 w-64 bg-white/10" />
        </div>
        <Skeleton className="h-[400px] bg-white/10 rounded-xl" />
      </div>
    );
  }

  if (creatorsData.length === 0 && !search) {
    return (
      <GlassPanel className="p-12 text-center">
        <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          No Creators Yet
        </h3>
        <p className="text-[13px] text-white/50">
          Add creators to this campaign to see their performance data.
        </p>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Campaign Creators</h2>
          <Badge
            variant="outline"
            className="border-white/10 text-white/50 text-[11px]"
          >
            {creatorAnalytics?.creators.length || 0} creators
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

      {/* Table */}
      <GlassPanel className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-white/50 text-[12px] font-medium">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center hover:text-white transition-colors"
                >
                  Creator
                  <SortIcon field="name" />
                </button>
              </TableHead>
              <TableHead className="text-white/50 text-[12px] font-medium text-center">
                Platform
              </TableHead>
              <TableHead className="text-white/50 text-[12px] font-medium text-right">
                <button
                  onClick={() => handleSort("videos")}
                  className="flex items-center justify-end w-full hover:text-white transition-colors"
                >
                  Videos
                  <SortIcon field="videos" />
                </button>
              </TableHead>
              <TableHead className="text-white/50 text-[12px] font-medium text-right">
                <button
                  onClick={() => handleSort("views")}
                  className="flex items-center justify-end w-full hover:text-white transition-colors"
                >
                  Views
                  <SortIcon field="views" />
                </button>
              </TableHead>
              <TableHead className="text-white/50 text-[12px] font-medium text-right">
                <button
                  onClick={() => handleSort("engagement")}
                  className="flex items-center justify-end w-full hover:text-white transition-colors"
                >
                  Engagement
                  <SortIcon field="engagement" />
                </button>
              </TableHead>
              <TableHead className="text-white/50 text-[12px] font-medium text-right">
                <button
                  onClick={() => handleSort("engagementRate")}
                  className="flex items-center justify-end w-full hover:text-white transition-colors"
                >
                  Eng. Rate
                  <SortIcon field="engagementRate" />
                </button>
              </TableHead>
              <TableHead className="text-white/50 text-[12px] font-medium text-center">
                Last Post
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {creatorsData.map((creator, index) => (
              <motion.tr
                key={creator.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="border-white/[0.06] hover:bg-white/[0.02] transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      className="w-9 h-9 ring-2 ring-offset-1 ring-offset-black ring-blue-500/50"
                    >
                      <AvatarImage
                        src={creator.profilePicture}
                        alt={creator.name}
                      />
                      <AvatarFallback className="text-[11px] bg-blue-600">
                        {creator.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[13px] font-medium text-white">
                        {creator.name}
                      </p>
                      <p className="text-[11px] text-white/40">
                        @{creator.username}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      creator.platform === "instagram"
                        ? "border-pink-500/30 text-pink-400"
                        : "border-white/20 text-white/60"
                    }`}
                  >
                    {creator.platform}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Video className="w-3 h-3 text-white/30" />
                    <span className="text-[13px] text-white">
                      {creator.videoCount}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Eye className="w-3 h-3 text-white/30" />
                    <span className="text-[13px] text-white">
                      {formatNumber(creator.totalViews)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Heart className="w-3 h-3 text-white/30" />
                    <span className="text-[13px] text-white">
                      {formatNumber(creator.totalEngagement)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`text-[13px] font-medium ${
                      creator.engagementRate >= 5
                        ? "text-emerald-400"
                        : creator.engagementRate >= 2
                        ? "text-white"
                        : "text-white/50"
                    }`}
                  >
                    {creator.engagementRate.toFixed(2)}%
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-[12px] text-white/50">
                    {formatDate(creator.latestPost)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/5"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
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
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>

        {creatorsData.length === 0 && search && (
          <div className="py-12 text-center">
            <p className="text-[13px] text-white/50">
              No creators found matching "{search}"
            </p>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
