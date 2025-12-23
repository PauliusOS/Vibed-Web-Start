"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Link as LinkIcon,
  Loader2,
  User,
  Instagram,
  CheckCircle,
  AlertCircle,
  Users,
  BadgeCheck,
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

interface CreatorPreview {
  platform: "instagram" | "tiktok";
  username: string;
  displayName: string;
  followerCount: number;
  profilePictureUrl: string;
  isVerified: boolean;
  bio?: string;
  videoCount?: number;
  profileUrl: string;
  // New metrics
  medianViews7d: number;
  medianViewsPerFollower7d: number;
  engagementRate: number;
}

interface AddCreatorBySocialLinkProps {
  organizationId: Id<"organizations">;
  campaignId?: Id<"campaigns">;
  rosterId?: Id<"creatorRosters">;
  onSuccess?: (result: {
    externalId: string;
    username: string;
    platform: string;
  }) => void;
  trigger?: React.ReactNode;
}

export function AddCreatorBySocialLink({
  organizationId,
  campaignId,
  rosterId,
  onSuccess,
  trigger,
}: AddCreatorBySocialLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<CreatorPreview | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  const fetchProfileInfo = useAction(api.ensembleData.fetchCreatorProfileInfo);
  const addCreatorByUrl = useAction(api.creatorRosters.addCreatorByProfileUrl);

  const formatNumber = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const formatViewsPerFollower = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const handleFetchPreview = async () => {
    if (!profileUrl.trim()) {
      setError("Please enter a profile URL");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPreview(null);

    try {
      const info = await fetchProfileInfo({ profileUrl: profileUrl.trim() });
      setPreview(info);
    } catch (err: any) {
      setError(err.message || "Failed to fetch profile info");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCreator = async () => {
    if (!preview) return;

    setIsAdding(true);
    setError(null);

    try {
      const result = await addCreatorByUrl({
        organizationId,
        profileUrl: preview.profileUrl,
        campaignId,
        rosterId,
      });

      setAddSuccess(true);

      if (onSuccess) {
        onSuccess({
          externalId: result.externalId,
          username: result.creatorInfo.username,
          platform: result.creatorInfo.platform,
        });
      }

      // Reset after short delay
      setTimeout(() => {
        setProfileUrl("");
        setPreview(null);
        setAddSuccess(false);
        setIsOpen(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to add creator");
    } finally {
      setIsAdding(false);
    }
  };

  const handleReset = () => {
    setProfileUrl("");
    setPreview(null);
    setError(null);
    setAddSuccess(false);
  };

  const PlatformIcon = preview?.platform === "instagram" ? Instagram : TikTokIcon;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Add by Link
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md bg-[#0a0a0a] border-white/[0.06]">
        <DialogHeader>
          <DialogTitle className="text-white">Add Creator by Profile URL</DialogTitle>
          <DialogDescription className="text-white/60">
            Paste a TikTok or Instagram profile URL to add a creator
          </DialogDescription>
        </DialogHeader>

        {/* URL Input */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://www.tiktok.com/@username or https://instagram.com/username"
              value={profileUrl}
              onChange={(e) => {
                setProfileUrl(e.target.value);
                setError(null);
                setPreview(null);
              }}
              className="flex-1 bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/30"
              disabled={isLoading || isAdding}
            />
            <Button
              onClick={handleFetchPreview}
              disabled={isLoading || !profileUrl.trim()}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Preview"
              )}
            </Button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Preview Card */}
          {preview && !addSuccess && (
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-4">
              <div className="flex items-start gap-4">
                {/* Profile Picture */}
                <div className="relative">
                  {preview.profilePictureUrl ? (
                    <img
                      src={preview.profilePictureUrl}
                      alt={preview.displayName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center",
                      preview.platform === "instagram"
                        ? "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"
                        : "bg-black"
                    )}
                  >
                    <PlatformIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-semibold truncate">
                      {preview.displayName}
                    </h4>
                    {preview.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-white/60 text-sm">@{preview.username}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-white/40">
                    <Users className="w-3.5 h-3.5" />
                    <span>{formatNumber(preview.followerCount)} followers</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {preview.bio && (
                <p className="text-white/50 text-sm line-clamp-2">{preview.bio}</p>
              )}

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.06]">
                <div className="bg-white/[0.02] rounded-lg p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Median Views</p>
                  <p className="text-sm font-medium text-white">{formatNumber(preview.medianViews7d)}</p>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Views/Follower</p>
                  <p className="text-sm font-medium text-white">{formatViewsPerFollower(preview.medianViewsPerFollower7d)}</p>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Engagement Rate</p>
                  <p className="text-sm font-medium text-white">{formatPercentage(preview.engagementRate)}</p>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Followers</p>
                  <p className="text-sm font-medium text-white">{formatNumber(preview.followerCount)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-white/[0.06]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-white/60 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCreator}
                  disabled={isAdding}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      Add to {campaignId ? "Campaign" : "Roster"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Success State */}
          {addSuccess && (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <p className="text-emerald-400 font-medium">Creator Added Successfully!</p>
              <p className="text-white/60 text-sm mt-1">
                @{preview?.username} has been added
              </p>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="text-xs text-white/40 text-center pt-2 border-t border-white/[0.06]">
          <p className="mb-1">Supported URLs:</p>
          <p>https://www.tiktok.com/@username</p>
          <p>https://www.instagram.com/username/</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
