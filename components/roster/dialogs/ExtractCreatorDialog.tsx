"use client";

import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle, Eye, TrendingUp, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface ExtractCreatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: Id<"organizations">;
  rosterId?: Id<"creatorRosters">;
  onSuccess?: (creatorId: string, shouldInvite?: boolean) => void;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function ExtractCreatorDialog({
  open,
  onOpenChange,
  organizationId,
  rosterId,
  onSuccess,
}: ExtractCreatorDialogProps) {
  const [url, setUrl] = useState("");
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [sendInvite, setSendInvite] = useState(false);

  const extractCreator = useAction(api.creatorExtraction.extractCreatorFromURL);
  const createExternalCreator = useMutation(api.creatorExtraction.createExternalCreator);
  const addToRoster = useMutation(api.creatorExtraction.addExtractedCreatorToRoster);

  const handleExtract = async () => {
    if (!url.trim()) return;

    setIsExtracting(true);
    setError(null);
    setExtractedData(null);

    try {
      const data = await extractCreator({
        url: url.trim(),
        organizationId,
      });

      setExtractedData(data);
    } catch (err: any) {
      setError(err.message || "Failed to extract creator data");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAddCreator = async () => {
    if (!extractedData) return;

    setIsAdding(true);
    setError(null);

    try {
      let creatorId = extractedData.existingProfileId;

      // If creator doesn't exist, create them
      if (!extractedData.isExistingCreator) {
        const result = await createExternalCreator({
          organizationId,
          platform: extractedData.platform,
          username: extractedData.username,
          displayName: extractedData.displayName,
          profileUrl: extractedData.profileUrl,
          profilePictureUrl: extractedData.profilePictureUrl,
          bio: extractedData.bio,
          followerCount: extractedData.followerCount,
          isVerified: extractedData.isVerified,
          videoCount: extractedData.videoCount,
          totalLikes: extractedData.totalLikes,
          medianViews7d: extractedData.medianViews7d,
          medianViewsPerFollower7d: extractedData.medianViewsPerFollower7d,
          engagementRate: extractedData.engagementRate,
          recentVideos: extractedData.recentVideos || [],
        });
        creatorId = result.creatorId;
      }

      // Add to roster if specified
      if (rosterId) {
        await addToRoster({
          rosterId,
          creatorId,
        });
      }

      onSuccess?.(creatorId, sendInvite);
      onOpenChange(false);
      
      // Reset state
      setUrl("");
      setExtractedData(null);
      setSendInvite(false);
    } catch (err: any) {
      setError(err.message || "Failed to add creator");
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    if (!isExtracting && !isAdding) {
      setUrl("");
      setExtractedData(null);
      setError(null);
      setSendInvite(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0f0f0f] border-white/10 text-white max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Extract Creator</DialogTitle>
          <DialogDescription className="text-white/50">
            Paste a TikTok or Instagram profile URL to automatically extract creator data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* URL Input */}
          <div className="space-y-3">
            <Label htmlFor="profile-url" className="text-white/70">
              Profile URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="profile-url"
                type="url"
                placeholder="https://www.tiktok.com/@username or https://www.instagram.com/username/"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                  setExtractedData(null);
                }}
                disabled={isExtracting || isAdding}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
              <Button
                onClick={handleExtract}
                disabled={!url.trim() || isExtracting || isAdding}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {isExtracting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Extract"
                )}
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Extracted Data Preview */}
          {extractedData && (
            <div className="space-y-4">
              {/* Existing Creator Warning */}
              {extractedData.isExistingCreator && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-400">
                    This creator already exists in your organization
                  </p>
                </div>
              )}

              {/* Creator Profile Card */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-16 w-16 ring-2 ring-cyan-500/30">
                    <AvatarImage src={extractedData.profilePictureUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-lg">
                      {extractedData.displayName?.[0] || extractedData.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {extractedData.displayName}
                      </h3>
                      {extractedData.isVerified && (
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-white/50 mb-2">@{extractedData.username}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        extractedData.platform === "tiktok"
                          ? "border-white/20 text-white/70"
                          : "border-pink-500/30 text-pink-400"
                      )}
                    >
                      {extractedData.platform}
                    </Badge>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-xl font-bold text-white">
                      {formatNumber(extractedData.followerCount)}
                    </div>
                    <div className="text-xs text-white/60">Followers</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatNumber(extractedData.medianViews7d)}
                    </div>
                    <div className="text-xs text-white/60">Median Views</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {extractedData.engagementRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-white/60">Engagement</div>
                  </div>
                </div>

                {/* Bio */}
                {extractedData.bio && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-white/70 line-clamp-2">
                      {extractedData.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Send Invite Option */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <Checkbox
                  id="send-invite"
                  checked={sendInvite}
                  onCheckedChange={(checked) => setSendInvite(checked === true)}
                  className="border-green-500/50 data-[state=checked]:bg-green-600"
                />
                <Label
                  htmlFor="send-invite"
                  className="text-sm text-green-300 cursor-pointer flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Send platform invitation after adding
                </Label>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isExtracting || isAdding}
            className="border-white/10 text-white hover:bg-white/5"
          >
            Cancel
          </Button>
          {extractedData && (
            <Button
              onClick={handleAddCreator}
              disabled={isAdding}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              {extractedData.isExistingCreator
                ? rosterId
                  ? "Add to Roster"
                  : "Confirm"
                : rosterId
                ? "Add to Roster"
                : "Add Creator"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
