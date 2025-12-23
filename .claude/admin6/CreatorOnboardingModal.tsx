"use client";

import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Search,
  CheckCircle2,
  AlertCircle,
  Users,
  Eye,
  Heart,
  TrendingUp,
  ExternalLink,
  Video,
  Verified,
  Mail,
  Save,
  Send,
  Copy,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

interface CreatorOnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: Id<"organizations">;
  onSuccess?: () => void;
}

interface CreatorProfile {
  platform: "instagram" | "tiktok";
  username: string;
  displayName: string;
  followerCount: number;
  followingCount: number;
  bio: string;
  profilePictureUrl: string;
  isVerified: boolean;
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

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function CreatorOnboardingModal({
  open,
  onOpenChange,
  organizationId,
  onSuccess,
}: CreatorOnboardingModalProps) {
  const [profileUrl, setProfileUrl] = useState("");
  const [email, setEmail] = useState("");
  const [sendInvitation, setSendInvitation] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [creatorProfileId, setCreatorProfileId] = useState<Id<"creatorProfiles"> | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [invitationSent, setInvitationSent] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);

  const onboardCreator = useAction(api.creatorOnboarding.onboardCreatorFromUrl);
  const updateCreatorContact = useMutation(api.creatorOnboarding.updateCreatorContact);

  const handleFetchProfile = async () => {
    if (!profileUrl.trim()) {
      setError("Please enter a TikTok or Instagram profile URL");
      return;
    }

    // Validate URL format
    if (!profileUrl.includes("tiktok.com") && !profileUrl.includes("instagram.com")) {
      setError("Please enter a valid TikTok or Instagram profile URL");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCreatorProfile(null);

    try {
      const result = await onboardCreator({
        organizationId,
        profileUrl: profileUrl.trim(),
      });

      if (!result.success) {
        setError(result.error || "Failed to fetch creator profile");
        return;
      }

      setCreatorProfile(result.profile as CreatorProfile);
      setCreatorProfileId(result.profileId as Id<"creatorProfiles">);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to fetch creator profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!creatorProfileId || !email.trim()) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSavingEmail(true);
    setError(null);

    try {
      const result = await updateCreatorContact({
        creatorProfileId,
        email: email.trim(),
        sendInvitation,
      });
      setEmailSaved(true);
      setInvitationSent(result.invitationSent || false);
      if (result.inviteUrl) {
        setInviteUrl(result.inviteUrl);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save email");
    } finally {
      setIsSavingEmail(false);
    }
  };

  const handleClose = () => {
    setProfileUrl("");
    setEmail("");
    setSendInvitation(true);
    setCreatorProfile(null);
    setCreatorProfileId(null);
    setError(null);
    setSuccess(false);
    setEmailSaved(false);
    setInvitationSent(false);
    setInviteUrl(null);
    setIsLoading(false);
    setIsSavingEmail(false);
    onOpenChange(false);
    if (success) {
      onSuccess?.();
    }
  };

  const handleAddAnother = () => {
    setProfileUrl("");
    setEmail("");
    setSendInvitation(true);
    setCreatorProfile(null);
    setCreatorProfileId(null);
    setError(null);
    setSuccess(false);
    setEmailSaved(false);
    setInvitationSent(false);
    setInviteUrl(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0f0f0f] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle
            className="text-xl font-semibold"
            style={{ fontFamily: "'Euclid Circular A', system-ui, sans-serif" }}
          >
            Add Creator
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Enter a TikTok or Instagram profile URL to add a creator to your organization.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="profile-url" className="text-white/70">
              Profile URL
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="profile-url"
                  placeholder="https://www.tiktok.com/@username"
                  value={profileUrl}
                  onChange={(e) => {
                    setProfileUrl(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isLoading && !success) {
                      handleFetchProfile();
                    }
                  }}
                  disabled={isLoading || success}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-10"
                />
                {profileUrl && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {profileUrl.includes("tiktok") ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
                          fill="#fff"
                        />
                      </svg>
                    ) : profileUrl.includes("instagram") ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                        <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    ) : null}
                  </div>
                )}
              </div>
              <Button
                onClick={handleFetchProfile}
                disabled={isLoading || success || !profileUrl.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Fetch
                  </>
                )}
              </Button>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <Card className="bg-white/[0.03] border-white/10">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                  <div className="text-center">
                    <p className="text-white font-medium">Fetching creator profile...</p>
                    <p className="text-white/50 text-sm mt-1">
                      This may take a few seconds while we gather their data
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success State with Profile Preview */}
          {success && creatorProfile && (
            <div className="space-y-4">
              {/* Success Banner */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-green-400 font-medium">Creator added successfully!</p>
                  <p className="text-green-400/70 text-sm">
                    @{creatorProfile.username} has been added to your organization.
                  </p>
                </div>
              </div>

              {/* Profile Card */}
              <Card className="bg-white/[0.03] border-white/10 overflow-hidden">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="p-6 border-b border-white/5">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-20 h-20 ring-2 ring-white/10">
                        <AvatarImage src={creatorProfile.profilePictureUrl} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                          {creatorProfile.displayName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white truncate">
                            {creatorProfile.displayName}
                          </h3>
                          {creatorProfile.isVerified && (
                            <Verified className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs capitalize",
                              creatorProfile.platform === "tiktok"
                                ? "border-white/20 text-white"
                                : "border-pink-500/30 text-pink-400"
                            )}
                          >
                            {creatorProfile.platform}
                          </Badge>
                          <span className="text-white/50 text-sm">@{creatorProfile.username}</span>
                        </div>
                        <p className="text-white/60 text-sm line-clamp-2">{creatorProfile.bio}</p>
                      </div>
                      <a
                        href={creatorProfile.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-white/50" />
                      </a>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 divide-x divide-white/5">
                    <div className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Users className="w-4 h-4 text-white/40" />
                      </div>
                      <p className="text-xl font-semibold text-white">
                        {formatNumber(creatorProfile.followerCount)}
                      </p>
                      <p className="text-xs text-white/40">Followers</p>
                    </div>
                    <div className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Eye className="w-4 h-4 text-white/40" />
                      </div>
                      <p className="text-xl font-semibold text-white">
                        {formatNumber(creatorProfile.medianViews7d)}
                      </p>
                      <p className="text-xs text-white/40">Median Views</p>
                    </div>
                    <div className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <TrendingUp className="w-4 h-4 text-white/40" />
                      </div>
                      <p className="text-xl font-semibold text-white">
                        {(creatorProfile.medianViewsPerFollower7d * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-white/40">View Rate</p>
                    </div>
                    <div className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Heart className="w-4 h-4 text-white/40" />
                      </div>
                      <p className="text-xl font-semibold text-white">
                        {creatorProfile.engagementRate.toFixed(1)}%
                      </p>
                      <p className="text-xs text-white/40">Engagement</p>
                    </div>
                  </div>

                  {/* Recent Videos Preview */}
                  {creatorProfile.recentVideos && creatorProfile.recentVideos.length > 0 && (
                    <div className="p-4 border-t border-white/5">
                      <div className="flex items-center gap-2 mb-3">
                        <Video className="w-4 h-4 text-white/50" />
                        <span className="text-sm text-white/70">
                          Recent Videos ({creatorProfile.recentVideos.length})
                        </span>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {creatorProfile.recentVideos.slice(0, 6).map((video, index) => (
                          <a
                            key={video.platformVideoId || index}
                            href={video.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 w-20 h-28 rounded-lg overflow-hidden bg-white/5 relative group"
                          >
                            {video.thumbnailUrl ? (
                              <img
                                src={video.thumbnailUrl}
                                alt="Video thumbnail"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Video className="w-6 h-6 text-white/30" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ExternalLink className="w-4 h-4 text-white" />
                            </div>
                            <div className="absolute bottom-1 left-1 right-1">
                              <div className="flex items-center gap-1 text-[10px] text-white/80 bg-black/60 rounded px-1 py-0.5">
                                <Eye className="w-2.5 h-2.5" />
                                {formatNumber(video.views)}
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Email Input */}
              <Card className="bg-white/[0.03] border-white/10">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-white/50" />
                      <Label className="text-white/70 text-sm font-medium">
                        Creator's Email
                      </Label>
                    </div>
                    <p className="text-white/40 text-xs">
                      Add their email to invite them to the platform.
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="creator@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError(null);
                          setEmailSaved(false);
                          setInvitationSent(false);
                        }}
                        disabled={isSavingEmail || emailSaved}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                      <Button
                        onClick={handleSaveEmail}
                        disabled={!email.trim() || isSavingEmail || emailSaved}
                        className={cn(
                          "min-w-[140px]",
                          emailSaved
                            ? "bg-green-600 hover:bg-green-600 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        )}
                      >
                        {isSavingEmail ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : emailSaved ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {invitationSent ? "Invited!" : "Saved"}
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            {sendInvitation ? "Save & Invite" : "Save"}
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {/* Send Invitation Checkbox */}
                    <div className="flex items-center gap-2 pt-1">
                      <Checkbox
                        id="send-invitation"
                        checked={sendInvitation}
                        onCheckedChange={(checked) => setSendInvitation(checked === true)}
                        disabled={isSavingEmail || emailSaved}
                        className="border-white/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <label
                        htmlFor="send-invitation"
                        className="text-sm text-white/60 cursor-pointer select-none"
                      >
                        Send platform invitation email
                      </label>
                    </div>
                    
                    {emailSaved && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-400 text-xs">
                          <CheckCircle2 className="w-3 h-3" />
                          {invitationSent 
                            ? "Email saved & invitation sent!"
                            : "Email saved successfully"
                          }
                        </div>
                        {inviteUrl && (
                          <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
                            <p className="text-xs text-white/60">Share this link with the creator:</p>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 text-xs bg-black/30 text-blue-400 px-2 py-1.5 rounded font-mono overflow-x-auto">
                                {inviteUrl}
                              </code>
                              <Button
                                size="sm"
                                variant="outline"
                                className="shrink-0 border-white/10 text-white hover:bg-white/10"
                                onClick={() => {
                                  navigator.clipboard.writeText(inviteUrl);
                                }}
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            <p className="text-xs text-white/40">
                              They can use a different email when signing up.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleAddAnother}
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  Add Another
                </Button>
                <Button
                  onClick={handleClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Done
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !success && !creatorProfile && (
            <Card className="bg-white/[0.03] border-white/10 border-dashed">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white/30" />
                  </div>
                  <div>
                    <p className="text-white/70 font-medium">No creator loaded</p>
                    <p className="text-white/40 text-sm mt-1">
                      Enter a TikTok or Instagram profile URL above to preview and add a creator
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    <Badge variant="outline" className="border-white/10 text-white/50">
                      tiktok.com/@username
                    </Badge>
                    <Badge variant="outline" className="border-white/10 text-white/50">
                      instagram.com/username
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

