"use client";

import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FRAMER_TEXT_COLORS, FramerCard } from "@/components/framer-analytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  BarChart3,
  ExternalLink,
  FolderPlus,
  RefreshCw,
  Trash2,
  Loader2,
  Video,
  Calendar,
  DollarSign,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface CreatorProfileModalProps {
  creatorProfileId: Id<"creatorProfiles">;
  organizationId: Id<"organizations">;
  onClose: () => void;
}

export function CreatorProfileModal({
  creatorProfileId,
  organizationId,
  onClose,
}: CreatorProfileModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddToCampaign, setShowAddToCampaign] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [flatRate, setFlatRate] = useState("");
  const [rpmRate, setRpmRate] = useState("");
  const [requiredVideos, setRequiredVideos] = useState("1");
  const [dealNotes, setDealNotes] = useState("");
  const [isAddingToCampaign, setIsAddingToCampaign] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const creator = useQuery(api.creatorOnboarding.getOnboardedCreatorDetails, {
    creatorProfileId,
  });

  const campaigns = useQuery(api.campaigns.listCampaigns, {
    organizationId,
  });

  const addToCampaign = useMutation(api.creatorOnboarding.addCreatorToCampaign);
  const refreshProfile = useAction(api.creatorOnboarding.refreshCreatorProfile);
  const deleteCreator = useMutation(api.creatorOnboarding.deleteOnboardedCreator);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatPercentage = (num: number | undefined): string => {
    if (num === undefined || num === null) return "—";
    return num.toFixed(2) + "%";
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleAddToCampaign = async () => {
    if (!selectedCampaignId) return;

    setIsAddingToCampaign(true);
    setAddError(null);

    try {
      await addToCampaign({
        creatorProfileId,
        campaignId: selectedCampaignId as Id<"campaigns">,
        flatRatePerVideo: flatRate ? parseFloat(flatRate) : undefined,
        rpmRate: rpmRate ? parseFloat(rpmRate) : undefined,
        requiredVideos: parseInt(requiredVideos) || 1,
        dealNotes: dealNotes || undefined,
      });
      setAddSuccess(true);
      setTimeout(() => {
        setShowAddToCampaign(false);
        setAddSuccess(false);
        setSelectedCampaignId("");
        setFlatRate("");
        setRpmRate("");
        setRequiredVideos("1");
        setDealNotes("");
      }, 1500);
    } catch (err: any) {
      setAddError(err.message || "Failed to add creator to campaign");
    } finally {
      setIsAddingToCampaign(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshProfile({ creatorProfileId });
    } catch (err) {
      console.error("Failed to refresh:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove this creator? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCreator({ creatorProfileId });
      onClose();
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!creator) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-4xl bg-[#0d0d0d] border-white/10">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-white/40" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Filter out campaigns the creator is already assigned to
  const availableCampaigns = (campaigns ?? []).filter(
    (campaign) => !creator.campaigns?.some((c: any) => c.campaignId === campaign._id)
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-[#0d0d0d] border-white/10 p-0">
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16 border-2 border-white/10">
                <AvatarImage src={creator.profilePictureUrl} />
                <AvatarFallback className="text-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 text-white">
                  {creator.displayName?.[0] || creator.username[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-white truncate">
                    {creator.displayName || creator.username}
                  </h2>
                  {creator.isVerified && (
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-white/60 mb-2">@{creator.username}</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${
                      creator.platform === "tiktok"
                        ? "bg-black/50 text-white border-white/20"
                        : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-400 border-pink-500/30"
                    }`}
                  >
                    {creator.platform === "tiktok" ? "TikTok" : "Instagram"}
                  </Badge>
                  <span className="text-xs text-white/40">
                    Updated {formatDate(creator.lastAnalyzedAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => window.open(creator.profileUrl, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
            <div className="px-6 border-b border-white/10">
              <TabsList className="bg-transparent h-auto p-0 rounded-none">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent text-white/50 data-[state=active]:text-white px-4 py-3 text-sm"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="videos"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent text-white/50 data-[state=active]:text-white px-4 py-3 text-sm"
                >
                  Videos ({creator.videos?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="campaigns"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent text-white/50 data-[state=active]:text-white px-4 py-3 text-sm"
                >
                  Campaigns ({creator.campaigns?.length || 0})
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="overview" className="m-0 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-white/60">Followers</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {formatNumber(creator.followerCount)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-white/60">Median Views</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {formatNumber(creator.stats?.medianViews ?? creator.medianViews7d ?? 0)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-white/60">View Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {formatPercentage((creator.stats?.viewsPerFollower ?? creator.medianViewsPerFollower7d ?? 0) * 100)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-orange-400" />
                      <span className="text-xs text-white/60">Engagement</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {formatPercentage(creator.stats?.avgEngagementRate ?? creator.engagementRate)}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                {creator.bio && (
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h3 className="text-sm font-semibold text-white mb-2">Bio</h3>
                    <p className="text-sm text-white/70">{creator.bio}</p>
                  </div>
                )}

                {/* Additional Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                    <p className="text-2xl font-bold text-white">
                      {creator.videoCount ?? creator.stats?.totalVideos ?? 0}
                    </p>
                    <p className="text-xs text-white/60">Total Videos</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                    <p className="text-2xl font-bold text-white">
                      {formatNumber(creator.totalLikes ?? 0)}
                    </p>
                    <p className="text-xs text-white/60">Total Likes</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                    <p className="text-2xl font-bold text-white">
                      {formatNumber(creator.mostViewedVideoViews ?? 0)}
                    </p>
                    <p className="text-xs text-white/60">Most Viewed</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="videos" className="m-0">
                {creator.videos && creator.videos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {creator.videos.map((video: any) => (
                      <a
                        key={video._id}
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative aspect-[9/16] rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                      >
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.description || "Video thumbnail"}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Video className="w-8 h-8 text-white/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <div className="flex items-center justify-between text-xs text-white mb-1">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {formatNumber(video.views)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {formatNumber(video.likes)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-white/60">
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {formatNumber(video.comments)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share2 className="w-3 h-3" />
                              {formatNumber(video.shares)}
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/60">
                    <Video className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>No videos found</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="campaigns" className="m-0 space-y-4">
                {/* Add to Campaign Button */}
                {!showAddToCampaign && availableCampaigns.length > 0 && (
                  <Button
                    onClick={() => setShowAddToCampaign(true)}
                    className="w-full"
                  >
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Add to Campaign
                  </Button>
                )}

                {/* Add to Campaign Form */}
                {showAddToCampaign && (
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Add to Campaign</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddToCampaign(false)}
                        className="h-6 w-6 p-0 text-white/40 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-white/60 text-xs">Campaign</Label>
                        <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select a campaign" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a1a] border-white/10">
                            {availableCampaigns.map((campaign) => (
                              <SelectItem
                                key={campaign._id}
                                value={campaign._id}
                                className="text-white hover:bg-white/10"
                              >
                                {campaign.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-white/60 text-xs">Flat Rate per Video ($)</Label>
                          <Input
                            type="number"
                            placeholder="500"
                            value={flatRate}
                            onChange={(e) => setFlatRate(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-white/60 text-xs">RPM Rate ($)</Label>
                          <Input
                            type="number"
                            placeholder="5"
                            value={rpmRate}
                            onChange={(e) => setRpmRate(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-white/60 text-xs">Required Videos</Label>
                        <Input
                          type="number"
                          min="1"
                          value={requiredVideos}
                          onChange={(e) => setRequiredVideos(e.target.value)}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>

                      <div>
                        <Label className="text-white/60 text-xs">Deal Notes (Optional)</Label>
                        <Textarea
                          placeholder="Any special terms or notes..."
                          value={dealNotes}
                          onChange={(e) => setDealNotes(e.target.value)}
                          className="bg-white/5 border-white/10 text-white resize-none"
                          rows={2}
                        />
                      </div>

                      {addError && (
                        <div className="flex items-center gap-2 p-2 rounded bg-red-500/10 border border-red-500/20">
                          <AlertCircle className="w-4 h-4 text-red-400" />
                          <span className="text-xs text-red-400">{addError}</span>
                        </div>
                      )}

                      {addSuccess && (
                        <div className="flex items-center gap-2 p-2 rounded bg-green-500/10 border border-green-500/20">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-xs text-green-400">Successfully added to campaign!</span>
                        </div>
                      )}

                      <Button
                        onClick={handleAddToCampaign}
                        disabled={!selectedCampaignId || isAddingToCampaign || addSuccess}
                        className="w-full"
                      >
                        {isAddingToCampaign ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : addSuccess ? (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        ) : (
                          <FolderPlus className="w-4 h-4 mr-2" />
                        )}
                        {addSuccess ? "Added!" : "Add to Campaign"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Current Campaign Assignments */}
                {creator.campaigns && creator.campaigns.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-white">Assigned Campaigns</h3>
                    {creator.campaigns.map((campaign: any) => (
                      <div
                        key={campaign.campaignId}
                        className="p-4 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">{campaign.name}</span>
                          <Badge
                            variant="outline"
                            className={`${
                              campaign.status === "active"
                                ? "border-green-500/30 text-green-400"
                                : "border-yellow-500/30 text-yellow-400"
                            }`}
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        {campaign.dealTerms && (
                          <div className="flex items-center gap-4 text-xs text-white/60">
                            {campaign.dealTerms.flatRatePerVideo && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                ${campaign.dealTerms.flatRatePerVideo}/video
                              </span>
                            )}
                            {campaign.dealTerms.rpmRate && (
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                ${campaign.dealTerms.rpmRate} RPM
                              </span>
                            )}
                            {campaign.dealTerms.requiredVideos && (
                              <span className="flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                {campaign.dealTerms.requiredVideos} videos
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  !showAddToCampaign && (
                    <div className="text-center py-8 text-white/60">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      <p>Not assigned to any campaigns</p>
                    </div>
                  )
                )}
              </TabsContent>
            </div>
          </Tabs>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Remove Creator
            </Button>
            <Button variant="outline" onClick={onClose} className="border-white/20 text-white hover:bg-white/10">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

















