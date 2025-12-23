"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, TrendingUp, TrendingDown, Minus, Instagram, ExternalLink } from "lucide-react";
import Link from "next/link";

interface CreatorRanking {
  creatorId: string;
  username: string;
  platform?: string;
  videoCount: number;
  totalViews: number;
  totalEngagement: number;
  avgEngagementRate: number;
  campaignCount: number;
}

interface TopCreatorsTableProps {
  data: CreatorRanking[] | undefined;
  isLoading?: boolean;
}

type SortBy = "views" | "engagement" | "rate" | "videos";

export function TopCreatorsTable({ data, isLoading }: TopCreatorsTableProps) {
  const [sortBy, setSortBy] = useState<SortBy>("views");

  if (isLoading) {
    return (
      <GlassPanel className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </GlassPanel>
    );
  }

  if (!data || data.length === 0) {
    return (
      <GlassPanel className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Creators</h3>
        <div className="h-[300px] flex items-center justify-center text-white/40">
          No creator data available
        </div>
      </GlassPanel>
    );
  }

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    switch (sortBy) {
      case "views":
        return b.totalViews - a.totalViews;
      case "engagement":
        return b.totalEngagement - a.totalEngagement;
      case "rate":
        return b.avgEngagementRate - a.avgEngagementRate;
      case "videos":
        return b.videoCount - a.videoCount;
      default:
        return b.totalViews - a.totalViews;
    }
  });

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return "bg-amber-500 text-black";
    if (index === 1) return "bg-gray-400 text-black";
    if (index === 2) return "bg-amber-700 text-white";
    return "bg-white/10 text-white/60";
  };

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Top Creators Leaderboard</h3>
        </div>

        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {(["views", "engagement", "rate", "videos"] as SortBy[]).map((sort) => (
            <Button
              key={sort}
              size="sm"
              variant={sortBy === sort ? "secondary" : "ghost"}
              className={
                sortBy === sort
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }
              onClick={() => setSortBy(sort)}
            >
              {sort === "rate" ? "Rate" : sort.charAt(0).toUpperCase() + sort.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-white/60 w-12">#</TableHead>
              <TableHead className="text-white/60">Creator</TableHead>
              <TableHead className="text-white/60 text-center">Campaigns</TableHead>
              <TableHead className="text-white/60 text-right">Videos</TableHead>
              <TableHead className="text-white/60 text-right">Views</TableHead>
              <TableHead className="text-white/60 text-right">Engagement</TableHead>
              <TableHead className="text-white/60 text-right">Avg Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((creator, index) => (
              <TableRow key={creator.creatorId} className="border-white/5 hover:bg-white/5">
                <TableCell>
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${getRankBadge(index)}`}
                  >
                    {index + 1}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback
                        className="text-white"
                        style={{
                          backgroundColor:
                            creator.platform === "instagram" ? "#E1306C" : "#000000",
                        }}
                      >
                        {creator.username[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-medium">{creator.username}</p>
                      <Badge
                        variant="outline"
                        className={`mt-0.5 text-xs ${
                          creator.platform === "instagram"
                            ? "border-pink-500/50 text-pink-400"
                            : "border-white/30 text-white/60"
                        }`}
                      >
                        {creator.platform === "instagram" ? (
                          <Instagram className="w-3 h-3 mr-1" />
                        ) : (
                          <svg
                            className="w-3 h-3 mr-1"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                          </svg>
                        )}
                        {creator.platform || "unknown"}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="border-white/20 text-white/80">
                    {creator.campaignCount}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-white/80">
                  {creator.videoCount}
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-purple-400 font-medium">
                    {formatValue(creator.totalViews)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-blue-400 font-medium">
                    {formatValue(creator.totalEngagement)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-emerald-400 font-medium">
                    {creator.avgEngagementRate.toFixed(2)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </GlassPanel>
  );
}
