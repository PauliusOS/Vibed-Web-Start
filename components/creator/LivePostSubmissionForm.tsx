"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Instagram, Loader2, Link as LinkIcon, CheckCircle2 } from "lucide-react";

// TikTok icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}

interface LivePostSubmissionFormProps {
  campaignId: Id<"campaigns">;
  dealId: Id<"campaignCreators">;
}

export function LivePostSubmissionForm({
  campaignId,
  dealId,
}: LivePostSubmissionFormProps) {
  const { user } = useUser();
  const [platform, setPlatform] = useState<"instagram" | "tiktok">("instagram");
  const [postUrl, setPostUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLivePost = useMutation(api.creators.submitLivePost);

  // Helper to extract video ID from platform URL
  const extractVideoId = (url: string, platform: "instagram" | "tiktok"): string | null => {
    try {
      if (platform === "instagram") {
        // Instagram Reels: https://www.instagram.com/reel/ABC123/
        // Instagram Posts: https://www.instagram.com/p/ABC123/
        const reelMatch = url.match(/instagram\.com\/reel\/([^/?]+)/);
        const postMatch = url.match(/instagram\.com\/p\/([^/?]+)/);
        return reelMatch?.[1] || postMatch?.[1] || null;
      } else {
        // TikTok: https://www.tiktok.com/@user/video/1234567890123456789
        const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
        return match?.[1] || null;
      }
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("You must be logged in to submit a live post");
      return;
    }

    if (!postUrl.trim()) {
      toast.error("Please provide the live post URL");
      return;
    }

    const videoId = extractVideoId(postUrl.trim(), platform);
    if (!videoId) {
      toast.error(
        `Invalid ${platform === "instagram" ? "Instagram" : "TikTok"} URL. Please check the link and try again.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLivePost({
        dealId,
        platform,
        videoUrl: postUrl.trim(),
        videoId,
      });

      toast.success(
        "Live post submitted! Your flat rate will be credited to your wallet."
      );
      setPostUrl("");
    } catch (error) {
      toast.error("Failed to submit live post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Platform Selection */}
      <div className="space-y-2">
        <Label className="text-white">Platform</Label>
        <RadioGroup
          value={platform}
          onValueChange={(val) => setPlatform(val as "instagram" | "tiktok")}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="instagram" id="live-instagram" />
            <Label
              htmlFor="live-instagram"
              className="flex items-center gap-2 text-white/80 cursor-pointer"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="tiktok" id="live-tiktok" />
            <Label
              htmlFor="live-tiktok"
              className="flex items-center gap-2 text-white/80 cursor-pointer"
            >
              <TikTokIcon className="h-4 w-4" />
              TikTok
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Post URL */}
      <div className="space-y-2">
        <Label htmlFor="post-url" className="text-white">
          Live Post URL
        </Label>
        <Input
          id="post-url"
          type="url"
          placeholder={
            platform === "instagram"
              ? "https://www.instagram.com/reel/..."
              : "https://www.tiktok.com/@username/video/..."
          }
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
        <p className="text-xs text-white/40">
          {platform === "instagram"
            ? "Paste your Instagram Reel or Post URL"
            : "Paste your TikTok video URL"}
        </p>
      </div>

      {/* Info Box */}
      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
          <div>
            <p className="text-sm text-green-500 font-medium">
              Flat Rate Auto-Credit
            </p>
            <p className="text-xs text-green-500/80">
              Once verified, your flat rate payment will be automatically credited
              to your wallet.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || !postUrl.trim()}
        className="w-full bg-white text-black hover:bg-white/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <LinkIcon className="h-4 w-4 mr-2" />
            Submit Live Post
          </>
        )}
      </Button>
    </form>
  );
}
