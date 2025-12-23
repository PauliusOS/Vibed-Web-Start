"use client";

import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlowCard } from "@/components/ui/glow-card";
import { Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface VideoSubmissionFormProps {
  campaignId: Id<"campaigns">;
  campaignName: string;
}

export function VideoSubmissionForm({ campaignId, campaignName }: VideoSubmissionFormProps) {
  const [videoUrl, setVideoUrl] = useState("");
  const [platform, setPlatform] = useState<"instagram" | "tiktok">("instagram");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlError, setUrlError] = useState<string>("");

  // Mutation to submit video
  const submitVideoMutation = useMutation(api.videos.submitVideo);

  // Action to parse video URL
  const parseVideoUrl = useAction(api.ensembleData.parseVideoUrl);

  // Validate URL format client-side
  const validateUrlFormat = (url: string): boolean => {
    const trimmedUrl = url.trim();

    if (platform === "instagram") {
      // Instagram Reel or Post URLs
      return (
        trimmedUrl.includes("instagram.com/reel/") ||
        trimmedUrl.includes("instagram.com/p/")
      );
    } else {
      // TikTok video URLs
      return (
        trimmedUrl.includes("tiktok.com/@") ||
        trimmedUrl.includes("vm.tiktok.com/")
      );
    }
  };

  const handleUrlChange = (url: string) => {
    setVideoUrl(url);
    setUrlError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoUrl.trim()) {
      toast.error("Please enter a video URL");
      return;
    }

    // Validate URL format
    if (!validateUrlFormat(videoUrl)) {
      const errorMsg =
        platform === "instagram"
          ? "Please enter a valid Instagram Reel or Post URL (e.g., https://www.instagram.com/reel/...)"
          : "Please enter a valid TikTok video URL (e.g., https://www.tiktok.com/@username/video/...)";
      setUrlError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsSubmitting(true);
    try {
      // Parse the video URL to extract videoId
      const parsedVideo = await parseVideoUrl({ url: videoUrl.trim() });

      if (!parsedVideo) {
        throw new Error("Could not parse video URL. Please check the format and try again.");
      }

      // Submit the video
      await submitVideoMutation({
        campaignId: campaignId,
        videoUrl: videoUrl.trim(),
        platform: parsedVideo.platform,
        videoId: parsedVideo.videoId,
      });

      setVideoUrl("");
      setUrlError("");
      toast.success("Video submitted for approval! You'll be notified once it's reviewed.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit video";
      setUrlError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlowCard className="bg-card border-border">
      <CardHeader>
        <CardTitle>Submit Video for {campaignName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select
              value={platform}
              onValueChange={(value) =>
                setPlatform(value as "instagram" | "tiktok")
              }
            >
              <SelectTrigger className="bg-muted border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input
              id="videoUrl"
              type="url"
              placeholder={
                platform === "instagram"
                  ? "https://www.instagram.com/reel/..."
                  : "https://www.tiktok.com/@username/video/..."
              }
              value={videoUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              className={`bg-muted border-border transition-colors duration-200 ${
                urlError ? "border-destructive" : ""
              }`}
              required
            />
            {urlError && (
              <div className="flex items-start gap-2 text-xs text-destructive">
                <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <p>{urlError}</p>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {platform === "instagram"
                ? "Paste a link to an Instagram Reel or Post"
                : "Paste a link to a TikTok video"}
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Submit Video
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            Videos will be reviewed by the admin before tracking begins
          </p>
        </form>
      </CardContent>
    </GlowCard>
  );
}
