"use client";

import { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Link as LinkIcon,
  Loader2,
  User,
  Instagram,
  CheckCircle,
  AlertCircle,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Video,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}

interface AddVideoByLinkProps {
  campaignId: Id<"campaigns">;
  onSuccess?: (result: {
    videoId: Id<"videos">;
    platform: string;
    views?: number;
  }) => void;
  trigger?: React.ReactNode;
}

export function AddVideoByLink({
  campaignId,
  onSuccess,
  trigger,
}: AddVideoByLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addedMetrics, setAddedMetrics] = useState<{
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
  } | null>(null);
  const [addedCreatorInfo, setAddedCreatorInfo] = useState<{
    username: string;
    displayName: string;
    followerCount: number;
    profilePictureUrl: string;
  } | null>(null);
  const [addedVideoInfo, setAddedVideoInfo] = useState<{
    thumbnailUrl: string;
    description: string;
  } | null>(null);
  const [addedPlatform, setAddedPlatform] = useState<string | null>(null);

  // Get campaign creators for dropdown
  const campaignCreators = useQuery(api.videos.getCampaignCreatorsForVideoAdd, {
    campaignId,
  });

  const adminSubmitVideo = useAction(api.videos.adminSubmitVideo);
  const parseVideoUrl = useAction(api.ensembleData.parseVideoUrl);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Detect platform from URL for preview
  const detectedPlatform = videoUrl.includes("tiktok.com")
    ? "tiktok"
    : videoUrl.includes("instagram.com")
    ? "instagram"
    : null;

  const handleAddVideo = async () => {
    if (!videoUrl.trim()) {
      setError("Please enter a video URL");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First validate the URL
      const parsed = await parseVideoUrl({ url: videoUrl.trim() });
      if (!parsed) {
        setError("Invalid video URL. Please provide a valid TikTok or Instagram video/reel URL.");
        setIsLoading(false);
        return;
      }

      // Submit the video (creatorId is optional - pass undefined if "assign later")
      const creatorIdToSubmit = selectedCreatorId && selectedCreatorId !== "__assign_later__"
        ? selectedCreatorId
        : undefined;

      const result = await adminSubmitVideo({
        campaignId,
        creatorId: creatorIdToSubmit,
        videoUrl: videoUrl.trim(),
      });

      if (!result.success) {
        setError(result.error || "Failed to add video");
        setIsLoading(false);
        return;
      }

      setAddSuccess(true);
      setAddedPlatform(parsed.platform);
      if (result.initialMetrics) {
        setAddedMetrics(result.initialMetrics);
      }
      if (result.creatorInfo) {
        setAddedCreatorInfo(result.creatorInfo);
      }
      if (result.videoInfo) {
        setAddedVideoInfo(result.videoInfo);
      }

      if (onSuccess && result.videoId) {
        onSuccess({
          videoId: result.videoId,
          platform: parsed.platform,
          views: result.initialMetrics?.views,
        });
      }

      // Reset after longer delay to show the rich preview
      setTimeout(() => {
        setVideoUrl("");
        setSelectedCreatorId("");
        setAddSuccess(false);
        setAddedMetrics(null);
        setAddedCreatorInfo(null);
        setAddedVideoInfo(null);
        setAddedPlatform(null);
        setIsOpen(false);
      }, 4000);
    } catch (err: any) {
      setError(err.message || "Failed to add video");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setVideoUrl("");
    setSelectedCreatorId("");
    setError(null);
    setAddSuccess(false);
    setAddedMetrics(null);
    setAddedCreatorInfo(null);
    setAddedVideoInfo(null);
    setAddedPlatform(null);
  };

  const selectedCreator = selectedCreatorId && selectedCreatorId !== "__assign_later__"
    ? campaignCreators?.find((c) => c.creatorId === selectedCreatorId)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
          >
            <Video className="w-4 h-4 mr-2" />
            Add Video by Link
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md bg-[#0a0a0a] border-white/[0.06]">
        <DialogHeader>
          <DialogTitle className="text-white">Add Video by URL</DialogTitle>
          <DialogDescription className="text-white/60">
            Paste a TikTok or Instagram video URL to add it to this campaign
          </DialogDescription>
        </DialogHeader>

        {!addSuccess ? (
          <div className="space-y-4">
            {/* Creator Selection */}
            <div className="space-y-2">
              <Label className="text-white text-sm">Select Creator</Label>
              {campaignCreators === undefined ? (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-white/40">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading creators...
                </div>
              ) : (
                <Select
                  value={selectedCreatorId}
                  onValueChange={(value) => {
                    setSelectedCreatorId(value);
                    setError(null);
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
                    <SelectValue placeholder="Choose a creator..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/[0.06]">
                    <SelectItem value="__assign_later__" className="text-white/60">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-white/[0.06] border border-dashed border-white/20">
                          <User className="w-3 h-3 text-white/40" />
                        </div>
                        <span>Assign creator later</span>
                      </div>
                    </SelectItem>
                    {campaignCreators.length > 0 && (
                      <div className="h-px bg-white/10 my-1" />
                    )}
                    {campaignCreators.map((creator) => (
                      <SelectItem
                        key={creator.creatorId}
                        value={creator.creatorId}
                        className="text-white"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center",
                              creator.platform === "instagram"
                                ? "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"
                                : "bg-black border border-white/10"
                            )}
                          >
                            {creator.platform === "instagram" ? (
                              <Instagram className="w-3 h-3 text-white" />
                            ) : (
                              <TikTokIcon className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span>@{creator.username}</span>
                          {creator.isExternal && (
                            <span className="text-xs text-white/40">(external)</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Selected Creator Preview */}
            {selectedCreator && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    selectedCreator.platform === "instagram"
                      ? "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"
                      : "bg-black border border-white/10"
                  )}
                >
                  {selectedCreator.profilePictureUrl ? (
                    <img
                      src={selectedCreator.profilePictureUrl}
                      alt={selectedCreator.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : selectedCreator.platform === "instagram" ? (
                    <Instagram className="w-5 h-5 text-white" />
                  ) : (
                    <TikTokIcon className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">
                    {selectedCreator.displayName}
                  </p>
                  <p className="text-white/40 text-xs">
                    @{selectedCreator.username} · {formatNumber(selectedCreator.followerCount)} followers
                  </p>
                </div>
              </div>
            )}

            {/* Assign Later Info */}
            {selectedCreatorId === "__assign_later__" && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500/20 border border-dashed border-amber-500/40">
                  <User className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-amber-400 font-medium text-sm">
                    No creator assigned
                  </p>
                  <p className="text-amber-400/60 text-xs">
                    You can assign a creator to this video later
                  </p>
                </div>
              </div>
            )}

            {/* Video URL Input */}
            <div className="space-y-2">
              <Label className="text-white text-sm">Video URL *</Label>
              <div className="relative">
                <Input
                  placeholder="https://www.tiktok.com/@username/video/123... or https://instagram.com/reel/..."
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    setError(null);
                  }}
                  className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/30 pr-10"
                  disabled={isLoading}
                />
                {detectedPlatform && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {detectedPlatform === "instagram" ? (
                      <Instagram className="w-4 h-4 text-pink-400" />
                    ) : (
                      <TikTokIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="text-white/60 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddVideo}
                disabled={isLoading || !videoUrl.trim()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding Video...
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-2" />
                    Add Video
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Success State - Rich Preview */
          <div className="space-y-4">
            {/* Success Header */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle className="w-8 h-8 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-emerald-400 font-medium">Video Added Successfully!</p>
                <p className="text-white/60 text-sm">Now tracking metrics</p>
              </div>
            </div>

            {/* Video & Creator Preview Card */}
            {(addedVideoInfo || addedCreatorInfo) && (
              <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] overflow-hidden">
                {/* Video Thumbnail */}
                {addedVideoInfo?.thumbnailUrl && (
                  <div className="relative aspect-video bg-black/50">
                    <img
                      src={addedVideoInfo.thumbnailUrl}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                    {/* Platform Badge */}
                    <div className={cn(
                      "absolute top-2 right-2 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium",
                      addedPlatform === "instagram"
                        ? "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400"
                        : "bg-black border border-white/20"
                    )}>
                      {addedPlatform === "instagram" ? (
                        <Instagram className="w-3 h-3 text-white" />
                      ) : (
                        <TikTokIcon className="w-3 h-3 text-white" />
                      )}
                      <span className="text-white capitalize">{addedPlatform}</span>
                    </div>
                  </div>
                )}

                {/* Creator Info */}
                {addedCreatorInfo && (
                  <div className="p-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      {addedCreatorInfo.profilePictureUrl ? (
                        <img
                          src={addedCreatorInfo.profilePictureUrl}
                          alt={addedCreatorInfo.displayName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          addedPlatform === "instagram"
                            ? "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"
                            : "bg-black border border-white/20"
                        )}>
                          {addedPlatform === "instagram" ? (
                            <Instagram className="w-5 h-5 text-white" />
                          ) : (
                            <TikTokIcon className="w-5 h-5 text-white" />
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {addedCreatorInfo.displayName || addedCreatorInfo.username}
                        </p>
                        <p className="text-white/50 text-sm">
                          @{addedCreatorInfo.username}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-white/60">
                          <Users className="w-3 h-3" />
                          <span className="text-sm font-medium text-white">
                            {formatNumber(addedCreatorInfo.followerCount)}
                          </span>
                        </div>
                        <p className="text-white/40 text-xs">followers</p>
                      </div>
                    </div>
                    {/* Video Description */}
                    {addedVideoInfo?.description && (
                      <p className="mt-2 text-white/60 text-sm line-clamp-2">
                        {addedVideoInfo.description}
                      </p>
                    )}
                  </div>
                )}

                {/* Metrics Grid */}
                {addedMetrics && (
                  <div className="p-3">
                    <div className="grid grid-cols-5 gap-2">
                      <div className="text-center">
                        <div className="flex items-center justify-center text-white/60 mb-1">
                          <Eye className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-white font-semibold text-sm">
                          {formatNumber(addedMetrics.views)}
                        </p>
                        <p className="text-white/40 text-[10px]">Views</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center text-white/60 mb-1">
                          <Heart className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-white font-semibold text-sm">
                          {formatNumber(addedMetrics.likes)}
                        </p>
                        <p className="text-white/40 text-[10px]">Likes</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center text-white/60 mb-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-white font-semibold text-sm">
                          {formatNumber(addedMetrics.comments)}
                        </p>
                        <p className="text-white/40 text-[10px]">Comments</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center text-white/60 mb-1">
                          <Share2 className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-white font-semibold text-sm">
                          {formatNumber(addedMetrics.shares)}
                        </p>
                        <p className="text-white/40 text-[10px]">Shares</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center text-emerald-400 mb-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-emerald-400 font-semibold text-sm">
                          {addedMetrics.engagementRate.toFixed(1)}%
                        </p>
                        <p className="text-white/40 text-[10px]">Engage</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Fallback if no rich data */}
            {!addedVideoInfo && !addedCreatorInfo && addedMetrics && (
              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <p className="text-white/60 text-xs mb-3">Initial Metrics</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <Eye className="w-4 h-4 text-white/60 mx-auto mb-1" />
                    <p className="text-white font-semibold text-sm">
                      {formatNumber(addedMetrics.views)}
                    </p>
                    <p className="text-white/40 text-xs">Views</p>
                  </div>
                  <div className="text-center">
                    <Heart className="w-4 h-4 text-white/60 mx-auto mb-1" />
                    <p className="text-white font-semibold text-sm">
                      {formatNumber(addedMetrics.likes)}
                    </p>
                    <p className="text-white/40 text-xs">Likes</p>
                  </div>
                  <div className="text-center">
                    <MessageCircle className="w-4 h-4 text-white/60 mx-auto mb-1" />
                    <p className="text-white font-semibold text-sm">
                      {formatNumber(addedMetrics.comments)}
                    </p>
                    <p className="text-white/40 text-xs">Comments</p>
                  </div>
                  <div className="text-center">
                    <Share2 className="w-4 h-4 text-white/60 mx-auto mb-1" />
                    <p className="text-white font-semibold text-sm">
                      {formatNumber(addedMetrics.shares)}
                    </p>
                    <p className="text-white/40 text-xs">Shares</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-white/40 text-center pt-2 border-t border-white/[0.06]">
          <p className="mb-1">Supported video URLs:</p>
          <p>https://www.tiktok.com/@username/video/123...</p>
          <p>https://www.instagram.com/reel/ABC123/</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
