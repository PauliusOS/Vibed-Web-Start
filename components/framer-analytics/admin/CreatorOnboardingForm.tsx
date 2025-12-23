"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FRAMER_BG_COLORS, FRAMER_TEXT_COLORS, FRAMER_CHART_COLORS, FramerCard } from "@/components/framer-analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Users,
  TrendingUp,
  Video,
  ExternalLink,
  UserPlus,
  BarChart3,
  Sparkles,
} from "lucide-react";

interface CreatorOnboardingFormProps {
  organizationId: Id<"organizations">;
  onSuccess?: () => void;
}

interface FetchedProfile {
  platform: "instagram" | "tiktok";
  username: string;
  displayName: string;
  followerCount: number;
  followingCount?: number;
  bio?: string;
  profilePictureUrl?: string;
  isVerified?: boolean;
  videoCount?: number;
  totalLikes?: number;
  profileUrl: string;
  medianViews7d: number;
  medianViewsPerFollower7d: number;
  engagementRate: number;
  recentVideos: Array<{
    platformVideoId: string;
    videoUrl: string;
    description?: string;
    thumbnailUrl?: string;
    duration?: number;
    createdAt: number;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
  }>;
}

export function CreatorOnboardingForm({ organizationId, onSuccess }: CreatorOnboardingFormProps) {
  const [profileUrl, setProfileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedProfile, setFetchedProfile] = useState<FetchedProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const onboardCreator = useAction(api.creatorOnboarding.onboardCreatorFromUrl);

  const handleFetchProfile = async () => {
    if (!profileUrl.trim()) return;

    setIsLoading(true);
    setError(null);
    setFetchedProfile(null);
    setSaveSuccess(false);

    try {
      const result = await onboardCreator({
        organizationId,
        profileUrl: profileUrl.trim(),
      });

      if (result.success && result.profile) {
        setFetchedProfile(result.profile);
        setSaveSuccess(true);
      } else {
        setError(result.error || "Failed to fetch profile");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return num.toFixed(2) + "%";
  };

  const handleReset = () => {
    setProfileUrl("");
    setFetchedProfile(null);
    setSaveSuccess(false);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* URL Input Section */}
      <FramerCard padding="lg">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Add New Creator</h2>
              <p className="text-sm text-white/60">
                Enter a TikTok or Instagram profile URL
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="https://www.tiktok.com/@username or https://instagram.com/username"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                onKeyDown={(e) => e.key === "Enter" && handleFetchProfile()}
                disabled={isLoading || saveSuccess}
              />
            </div>
            <Button
              onClick={saveSuccess ? handleReset : handleFetchProfile}
              disabled={isLoading || (!saveSuccess && !profileUrl.trim())}
              className="px-6"
              variant={saveSuccess ? "outline" : "default"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : saveSuccess ? (
                <>
                  Add Another
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Fetch Profile
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">
                Creator profile saved successfully! You can now add them to campaigns.
              </span>
            </div>
          )}
        </div>
      </FramerCard>

      {/* Fetched Profile Preview */}
      {fetchedProfile && (
        <FramerCard padding="lg">
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20 border-2 border-white/10">
                <AvatarImage src={fetchedProfile.profilePictureUrl} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 text-white">
                  {fetchedProfile.displayName?.[0] || fetchedProfile.username[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white truncate">
                    {fetchedProfile.displayName || fetchedProfile.username}
                  </h3>
                  {fetchedProfile.isVerified && (
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-white/60 mb-2">@{fetchedProfile.username}</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${
                      fetchedProfile.platform === "tiktok"
                        ? "bg-black/50 text-white border-white/20"
                        : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-400 border-pink-500/30"
                    }`}
                  >
                    {fetchedProfile.platform === "tiktok" ? "TikTok" : "Instagram"}
                  </Badge>
                  <a
                    href={fetchedProfile.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-white/40 hover:text-white/60 transition-colors"
                  >
                    View Profile <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bio */}
            {fetchedProfile.bio && (
              <p className="text-sm text-white/70 line-clamp-2">{fetchedProfile.bio}</p>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-white/60">Followers</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatNumber(fetchedProfile.followerCount)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-white/60">Median Views</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatNumber(fetchedProfile.medianViews7d)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-white/60">View Rate</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatPercentage(fetchedProfile.medianViewsPerFollower7d * 100)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-white/60">Engagement</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatPercentage(fetchedProfile.engagementRate)}
                </p>
              </div>
            </div>

            {/* Recent Videos */}
            {fetchedProfile.recentVideos.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Recent Videos ({fetchedProfile.recentVideos.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {fetchedProfile.recentVideos.slice(0, 6).map((video, idx) => (
                    <a
                      key={idx}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-between text-xs text-white">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {formatNumber(video.views)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {formatNumber(video.likes)}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Video Stats Summary */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {formatNumber(fetchedProfile.recentVideos.reduce((sum, v) => sum + v.views, 0))}
                  </p>
                  <p className="text-xs text-white/60">Total Views</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {formatNumber(fetchedProfile.recentVideos.reduce((sum, v) => sum + v.likes, 0))}
                  </p>
                  <p className="text-xs text-white/60">Total Likes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {formatNumber(fetchedProfile.recentVideos.reduce((sum, v) => sum + v.comments, 0))}
                  </p>
                  <p className="text-xs text-white/60">Total Comments</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {formatNumber(fetchedProfile.recentVideos.reduce((sum, v) => sum + v.shares, 0))}
                  </p>
                  <p className="text-xs text-white/60">Total Shares</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={() => onSuccess?.()}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                View in Roster
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Add Another
              </Button>
            </div>
          </div>
        </FramerCard>
      )}

      {/* Empty State / Instructions */}
      {!fetchedProfile && !isLoading && (
        <FramerCard padding="lg">
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Analyze Creator Metrics
              </h3>
              <p className="text-sm text-white/60 max-w-md mx-auto">
                We&apos;ll fetch their follower count, recent video performance, median view rate,
                and engagement metrics to help you evaluate potential collaborations.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Badge variant="outline" className="border-white/20 text-white/60">
                <Users className="w-3 h-3 mr-1" /> Follower Count
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white/60">
                <Eye className="w-3 h-3 mr-1" /> Median Views
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white/60">
                <TrendingUp className="w-3 h-3 mr-1" /> View Rate
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white/60">
                <BarChart3 className="w-3 h-3 mr-1" /> Engagement Rate
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white/60">
                <Video className="w-3 h-3 mr-1" /> Last 30 Videos
              </Badge>
            </div>
          </div>
        </FramerCard>
      )}
    </div>
  );
}

















