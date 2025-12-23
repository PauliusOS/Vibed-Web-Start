"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Eye, TrendingUp, Video } from "lucide-react";

interface RosterStatsBarProps {
  totalCreators: number;
  totalViews?: number;
  avgEngagement?: number;
  totalVideos?: number;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function RosterStatsBar({
  totalCreators,
  totalViews,
  avgEngagement,
  totalVideos,
}: RosterStatsBarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {totalViews !== undefined && (
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/50 font-medium">Total Views</p>
              <Eye className="w-4 h-4 text-white/30" />
            </div>
            <p className="text-2xl font-semibold text-white">
              {formatNumber(totalViews)}
            </p>
          </CardContent>
        </Card>
      )}

      {avgEngagement !== undefined && (
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/50 font-medium">Avg Engagement</p>
              <TrendingUp className="w-4 h-4 text-white/30" />
            </div>
            <p className="text-2xl font-semibold text-white">
              {avgEngagement.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      )}

      {totalVideos !== undefined && (
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/50 font-medium">Total Videos</p>
              <Video className="w-4 h-4 text-white/30" />
            </div>
            <p className="text-2xl font-semibold text-white">{totalVideos}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
