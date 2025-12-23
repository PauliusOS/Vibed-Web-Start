"use client";

import { useState, useCallback } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Loader2,
  Instagram,
  Music2,
  CheckCircle,
  AlertCircle,
  Send,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface ProfilePreview {
  platform: "instagram" | "tiktok";
  username: string;
  displayName: string;
  followerCount: number;
  bio?: string;
  profilePictureUrl?: string;
  isVerified: boolean;
  medianViews7d?: number;
  engagementRate?: number;
  fetchedAt: number;
}

interface CreatorInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: Id<"organizations">;
}

export function CreatorInviteDialog({
  open,
  onOpenChange,
  organizationId,
}: CreatorInviteDialogProps) {
  // Form state
  const [email, setEmail] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState<Id<"campaigns">[]>(
    []
  );
  const [isSending, setIsSending] = useState(false);

  // Profile preview state
  const [profilePreview, setProfilePreview] = useState<ProfilePreview | null>(
    null
  );
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // API hooks
  const campaigns = useQuery(api.campaigns.listCampaigns, { organizationId });
  const fetchProfile = useAction(api.ensembleData.fetchCreatorProfileInfo);
  const sendInvitation = useMutation(api.invitations.sendInvitation);

  // Fetch profile when URL is entered
  const handleProfileUrlFetch = useCallback(
    async (url: string, platform: "instagram" | "tiktok") => {
      // Validate URL format
      const platformDomain =
        platform === "instagram" ? "instagram.com" : "tiktok.com";
      if (!url.includes(platformDomain)) {
        return;
      }

      setIsLoadingProfile(true);
      setProfileError(null);

      try {
        const data = await fetchProfile({ profileUrl: url });

        if (data) {
          setProfilePreview({
            platform,
            username: data.username || "",
            displayName: data.displayName || "",
            followerCount: data.followerCount || 0,
            bio: data.bio,
            profilePictureUrl: data.profilePictureUrl,
            isVerified: data.isVerified || false,
            medianViews7d: data.medianViews7d,
            engagementRate: data.engagementRate,
            fetchedAt: Date.now(),
          });
        }
      } catch (err) {
        setProfileError(
          err instanceof Error ? err.message : "Failed to fetch profile"
        );
        setProfilePreview(null);
      } finally {
        setIsLoadingProfile(false);
      }
    },
    [fetchProfile]
  );

  // Handle URL input changes
  const handleInstagramUrlChange = (value: string) => {
    setInstagramUrl(value);
  };

  const handleTiktokUrlChange = (value: string) => {
    setTiktokUrl(value);
  };

  // Handle URL blur to trigger fetch
  const handleInstagramUrlBlur = () => {
    if (instagramUrl && instagramUrl.includes("instagram.com")) {
      handleProfileUrlFetch(instagramUrl, "instagram");
    }
  };

  const handleTiktokUrlBlur = () => {
    if (tiktokUrl && tiktokUrl.includes("tiktok.com")) {
      handleProfileUrlFetch(tiktokUrl, "tiktok");
    }
  };

  // Toggle campaign selection
  const toggleCampaign = (campaignId: Id<"campaigns">) => {
    setSelectedCampaigns((prev) =>
      prev.includes(campaignId)
        ? prev.filter((id) => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  // Send invitation
  const handleSend = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    // Basic email validation
    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSending(true);

    try {
      await sendInvitation({
        email,
        organizationId,
        role: "creator",
        campaignIds:
          selectedCampaigns.length > 0 ? selectedCampaigns : undefined,
        instagramUrl: instagramUrl || undefined,
        tiktokUrl: tiktokUrl || undefined,
        creatorProfileData: profilePreview
          ? {
              platform: profilePreview.platform,
              username: profilePreview.username,
              displayName: profilePreview.displayName,
              followerCount: profilePreview.followerCount,
              bio: profilePreview.bio,
              profilePictureUrl: profilePreview.profilePictureUrl,
              isVerified: profilePreview.isVerified,
              medianViews7d: profilePreview.medianViews7d,
              engagementRate: profilePreview.engagementRate,
              fetchedAt: profilePreview.fetchedAt,
            }
          : undefined,
      });

      toast.success("Invitation sent successfully");
      onOpenChange(false);
      resetForm();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send invitation"
      );
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setInstagramUrl("");
    setTiktokUrl("");
    setSelectedCampaigns([]);
    setProfilePreview(null);
    setProfileError(null);
  };

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141414] border-white/10 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Invite Creator</DialogTitle>
          <DialogDescription className="text-white/50">
            Invite a creator to join your platform. Optionally add their social
            profiles to pre-fetch their data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label className="text-white/70">
              Email <span className="text-red-400">*</span>
            </Label>
            <Input
              type="email"
              placeholder="creator@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/[0.03] border-white/[0.06] text-white placeholder:text-white/30"
            />
          </div>

          {/* Social Profile URLs */}
          <div className="space-y-4">
            <Label className="text-white/70">Social Profiles (Optional)</Label>
            <p className="text-[11px] text-white/40">
              Add profile URLs to preview creator data before inviting
            </p>

            {/* Instagram URL */}
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400/60" />
              <Input
                placeholder="https://instagram.com/username"
                value={instagramUrl}
                onChange={(e) => handleInstagramUrlChange(e.target.value)}
                onBlur={handleInstagramUrlBlur}
                className="bg-white/[0.03] border-white/[0.06] text-white pl-10 placeholder:text-white/30"
              />
            </div>

            {/* TikTok URL */}
            <div className="relative">
              <Music2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400/60" />
              <Input
                placeholder="https://tiktok.com/@username"
                value={tiktokUrl}
                onChange={(e) => handleTiktokUrlChange(e.target.value)}
                onBlur={handleTiktokUrlBlur}
                className="bg-white/[0.03] border-white/[0.06] text-white pl-10 placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Profile Preview Loading */}
          {isLoadingProfile && (
            <div className="flex items-center gap-3 p-4 bg-white/[0.02] rounded-lg border border-white/[0.06]">
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
              <span className="text-white/50 text-sm">Fetching profile...</span>
            </div>
          )}

          {/* Profile Preview Error */}
          {profileError && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <span className="text-red-400 text-sm">{profileError}</span>
            </div>
          )}

          {/* Profile Preview Card */}
          {profilePreview && (
            <div className="p-4 bg-white/[0.02] rounded-lg border border-white/[0.06] space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-white/10">
                  <AvatarImage src={profilePreview.profilePictureUrl} />
                  <AvatarFallback className="bg-white/5 text-white">
                    {profilePreview.username?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium truncate">
                      {profilePreview.displayName || profilePreview.username}
                    </span>
                    {profilePreview.isVerified && (
                      <CheckCircle className="h-4 w-4 text-blue-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-white/50 text-sm">
                    {profilePreview.platform === "instagram" ? (
                      <Instagram className="h-3 w-3" />
                    ) : (
                      <Music2 className="h-3 w-3" />
                    )}
                    <span>@{profilePreview.username}</span>
                  </div>
                </div>
              </div>

              {profilePreview.bio && (
                <p className="text-white/60 text-sm line-clamp-2">
                  {profilePreview.bio}
                </p>
              )}

              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/[0.06]">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">
                    Followers
                  </p>
                  <p className="text-white font-medium">
                    {formatNumber(profilePreview.followerCount)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">
                    Median Views
                  </p>
                  <p className="text-white font-medium">
                    {profilePreview.medianViews7d
                      ? formatNumber(profilePreview.medianViews7d)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">
                    Engagement
                  </p>
                  <p className="text-white font-medium">
                    {profilePreview.engagementRate
                      ? `${profilePreview.engagementRate.toFixed(1)}%`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Assignment */}
          <div className="space-y-3">
            <div>
              <Label className="text-white/70">
                Assign to Campaigns (Optional)
              </Label>
              <p className="text-[11px] text-white/40 mt-1">
                Select campaigns to immediately assign this creator to. Leave
                empty for platform-only access.
              </p>
            </div>

            {campaigns && campaigns.length > 0 ? (
              <div className="max-h-[150px] overflow-y-auto space-y-1 rounded-lg border border-white/[0.06] p-2 bg-white/[0.01]">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign._id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] cursor-pointer transition-colors"
                    onClick={() => toggleCampaign(campaign._id)}
                  >
                    <Checkbox
                      checked={selectedCampaigns.includes(campaign._id)}
                      onCheckedChange={() => toggleCampaign(campaign._id)}
                      className="border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <span className="text-white/70 text-sm">
                      {campaign.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-white/[0.06] bg-white/[0.01]">
                <Users className="h-4 w-4 text-white/30" />
                <span className="text-white/40 text-sm">
                  No campaigns available
                </span>
              </div>
            )}

            {selectedCampaigns.length > 0 && (
              <p className="text-[11px] text-blue-400">
                {selectedCampaigns.length} campaign
                {selectedCampaigns.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-white/50 hover:text-white hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || !email}
            className="bg-white text-black hover:bg-white/90 disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Invitation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
