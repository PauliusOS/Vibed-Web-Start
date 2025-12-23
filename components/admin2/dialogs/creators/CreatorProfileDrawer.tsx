"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Instagram,
  Video,
  DollarSign,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Briefcase,
  Calendar,
  Check,
  Clock,
  X,
  ExternalLink,
} from "lucide-react";
import { motion } from "motion/react";

interface Creator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  instagram?: string;
  tiktok?: string;
  joinedAt: number;
  totalEarned: number;
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  averageEngagement: number;
}

interface Campaign {
  id: string;
  name: string;
  status: "active" | "completed" | "pending";
  videosSubmitted: number;
  videosApproved: number;
  earned: number;
}

interface CreatorVideo {
  id: string;
  title: string;
  thumbnail: string;
  campaignName: string;
  status: "pending" | "approved" | "rejected";
  views: number;
  likes: number;
  uploadedAt: number;
}

interface CreatorProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creator: Creator;
  campaigns?: Campaign[];
  videos?: CreatorVideo[];
  onAssignToCampaign?: () => void;
  onSetDealTerms?: () => void;
  onSendMessage?: () => void;
}

export function CreatorProfileDrawer({
  open,
  onOpenChange,
  creator,
  campaigns = [],
  videos = [],
  onAssignToCampaign,
  onSetDealTerms,
  onSendMessage,
}: CreatorProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const statusConfig = {
    pending: { color: "text-amber-400", bg: "bg-amber-500/20", icon: Clock },
    approved: { color: "text-green-400", bg: "bg-green-500/20", icon: Check },
    rejected: { color: "text-red-400", bg: "bg-red-500/20", icon: X },
    active: { color: "text-blue-400", bg: "bg-blue-500/20", icon: TrendingUp },
    completed: { color: "text-green-400", bg: "bg-green-500/20", icon: Check },
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 bg-[#0A0F1E] border-l border-white/[0.1] overflow-hidden flex flex-col">
        <SheetHeader className="p-6 border-b border-white/[0.06]">
          {/* Creator Header */}
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={creator.avatar} />
              <AvatarFallback className="bg-purple-500/20 text-purple-400 text-2xl">
                {creator.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <SheetTitle className="text-2xl text-white mb-1">
                {creator.name}
              </SheetTitle>
              <div className="flex flex-col gap-2 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{creator.email}</span>
                </div>
                {creator.instagram && (
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    <a
                      href={`https://instagram.com/${creator.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors flex items-center gap-1"
                    >
                      {creator.instagram}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onAssignToCampaign}
              className="flex-1 bg-purple-500 hover:bg-purple-600"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Assign to Campaign
            </Button>
            <Button
              onClick={onSetDealTerms}
              variant="outline"
              className="flex-1"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Deal Terms
            </Button>
            <Button
              onClick={onSendMessage}
              variant="outline"
            >
              <Mail className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="w-full bg-white/[0.02] border-b border-white/[0.06] rounded-none px-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 space-y-6 m-0">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="w-4 h-4 text-blue-400" />
                    <span className="text-white/60 text-sm">Total Videos</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {creator.totalVideos}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-white/60 text-sm">Total Earned</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    ${creator.totalEarned.toLocaleString()}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span className="text-white/60 text-sm">Total Views</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {formatNumber(creator.totalViews)}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-pink-400" />
                    <span className="text-white/60 text-sm">Avg Engagement</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {creator.averageEngagement.toFixed(1)}%
                  </p>
                </motion.div>
              </div>

              {/* Creator Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white/80">
                  Creator Information
                </h3>
                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Joined</span>
                    <span className="text-white">
                      {new Date(creator.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Active Campaigns</span>
                    <span className="text-white">
                      {campaigns.filter((c) => c.status === "active").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Completed Campaigns</span>
                    <span className="text-white">
                      {campaigns.filter((c) => c.status === "completed").length}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="p-6 space-y-3 m-0">
              {campaigns.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 text-white/20" />
                  <p className="text-white/60 text-sm">
                    No campaigns assigned yet
                  </p>
                </div>
              ) : (
                campaigns.map((campaign, index) => {
                  const config = statusConfig[campaign.status];
                  const StatusIcon = config.icon;
                  return (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-white font-medium mb-1">
                            {campaign.name}
                          </h4>
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${config.bg} w-fit`}>
                            <StatusIcon className={`w-3 h-3 ${config.color}`} />
                            <span className={`text-xs capitalize ${config.color}`}>
                              {campaign.status}
                            </span>
                          </div>
                        </div>
                        <span className="text-green-400 font-semibold">
                          ${campaign.earned.toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-white/60">Videos Submitted</span>
                          <p className="text-white font-medium">
                            {campaign.videosSubmitted}
                          </p>
                        </div>
                        <div>
                          <span className="text-white/60">Videos Approved</span>
                          <p className="text-white font-medium">
                            {campaign.videosApproved}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="p-6 space-y-3 m-0">
              {videos.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-12 h-12 mx-auto mb-3 text-white/20" />
                  <p className="text-white/60 text-sm">No videos submitted yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {videos.map((video, index) => {
                    const config = statusConfig[video.status];
                    const StatusIcon = config.icon;
                    return (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg hover:bg-white/[0.04] transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0 w-32 h-20 rounded bg-white/[0.05] overflow-hidden">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded ${config.bg}`}>
                            <span className={`text-xs ${config.color}`}>
                              {video.status}
                            </span>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium line-clamp-1 mb-1">
                            {video.title}
                          </h4>
                          <p className="text-xs text-white/60 mb-2">
                            {video.campaignName}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-white/60">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{formatNumber(video.views)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{formatNumber(video.likes)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(video.uploadedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="p-6 space-y-4 m-0">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-medium">Total Earnings</span>
                  <span className="text-2xl font-bold text-white">
                    ${creator.totalEarned.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 mx-auto mb-3 text-white/20" />
                <p className="text-white/60 text-sm">
                  Payment history will be displayed here
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
