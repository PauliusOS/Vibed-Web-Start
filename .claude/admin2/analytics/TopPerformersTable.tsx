"use client";

import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Trophy, BarChart3, Users, Video, Instagram } from "lucide-react";
import Link from "next/link";

interface TopCampaign {
  id: string;
  name: string;
  views: number;
  engagement: number;
  videoCount: number;
}

interface TopCreator {
  id: string;
  username: string;
  views: number;
  engagement: number;
  videoCount: number;
  avgEngagementRate: number;
}

interface TopVideo {
  videoId: string;
  campaignId: string;
  campaignName: string;
  creatorId: string | null;
  creatorUsername: string;
  platform: "instagram" | "tiktok";
  videoUrl?: string;
  views: number;
  engagement: number;
  engagementRate: number;
}

interface TopPerformersData {
  topCampaigns: TopCampaign[];
  topCreators: TopCreator[];
  topVideos: TopVideo[];
}

interface TopPerformersTableProps {
  data: TopPerformersData | undefined;
  isLoading?: boolean;
}

export function TopPerformersTable({
  data,
  isLoading,
}: TopPerformersTableProps) {
  if (isLoading) {
    return (
      <GlassPanel className="p-6">
        <Skeleton className="h-6 w-48 mb-6" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-[300px] w-full" />
      </GlassPanel>
    );
  }

  if (!data) {
    return (
      <GlassPanel className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Performers</h3>
        <div className="h-[300px] flex items-center justify-center text-white/40">
          No performance data available
        </div>
      </GlassPanel>
    );
  }

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  };

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-semibold text-white">Top Performers</h3>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/5 mb-4">
          <TabsTrigger
            value="campaigns"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger
            value="creators"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Users className="w-4 h-4 mr-2" />
            Creators
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Video className="w-4 h-4 mr-2" />
            Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-0">
          {data.topCampaigns.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-white/40">
              No campaigns yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/60">#</TableHead>
                  <TableHead className="text-white/60">Campaign</TableHead>
                  <TableHead className="text-white/60 text-right">Videos</TableHead>
                  <TableHead className="text-white/60 text-right">Views</TableHead>
                  <TableHead className="text-white/60 text-right">Engagement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topCampaigns.map((campaign, index) => (
                  <TableRow key={campaign.id} className="border-white/5">
                    <TableCell className="text-white/40 font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin2/campaigns/${campaign.id}`}
                        className="text-white hover:text-purple-400 transition-colors"
                      >
                        {campaign.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right text-white/80">
                      {campaign.videoCount}
                    </TableCell>
                    <TableCell className="text-right text-purple-400 font-medium">
                      {formatValue(campaign.views)}
                    </TableCell>
                    <TableCell className="text-right text-blue-400 font-medium">
                      {formatValue(campaign.engagement)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="creators" className="mt-0">
          {data.topCreators.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-white/40">
              No creators yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/60">#</TableHead>
                  <TableHead className="text-white/60">Creator</TableHead>
                  <TableHead className="text-white/60 text-right">Videos</TableHead>
                  <TableHead className="text-white/60 text-right">Views</TableHead>
                  <TableHead className="text-white/60 text-right">Avg Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topCreators.map((creator, index) => (
                  <TableRow key={creator.id} className="border-white/5">
                    <TableCell className="text-white/40 font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-purple-600 text-white text-xs">
                            {creator.username[0]?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white">{creator.username}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-white/80">
                      {creator.videoCount}
                    </TableCell>
                    <TableCell className="text-right text-purple-400 font-medium">
                      {formatValue(creator.views)}
                    </TableCell>
                    <TableCell className="text-right text-emerald-400 font-medium">
                      {creator.avgEngagementRate.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="videos" className="mt-0">
          {data.topVideos.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-white/40">
              No videos yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/60">#</TableHead>
                  <TableHead className="text-white/60">Creator</TableHead>
                  <TableHead className="text-white/60">Campaign</TableHead>
                  <TableHead className="text-white/60 text-right">Views</TableHead>
                  <TableHead className="text-white/60 text-right">Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topVideos.map((video, index) => (
                  <TableRow key={video.videoId} className="border-white/5">
                    <TableCell className="text-white/40 font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            video.platform === "instagram"
                              ? "border-pink-500/50 bg-pink-500/10"
                              : "border-white/30 bg-white/5"
                          }
                        >
                          {video.platform === "instagram" ? (
                            <Instagram className="w-3 h-3 mr-1 text-pink-400" />
                          ) : (
                            <svg
                              className="w-3 h-3 mr-1 text-white"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                            </svg>
                          )}
                          <span
                            className={
                              video.platform === "instagram"
                                ? "text-pink-400"
                                : "text-white"
                            }
                          >
                            {video.creatorUsername}
                          </span>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/60 text-sm">
                      {video.campaignName.length > 20
                        ? video.campaignName.slice(0, 20) + "..."
                        : video.campaignName}
                    </TableCell>
                    <TableCell className="text-right text-purple-400 font-medium">
                      {formatValue(video.views)}
                    </TableCell>
                    <TableCell className="text-right text-emerald-400 font-medium">
                      {video.engagementRate.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </GlassPanel>
  );
}
