"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Instagram,
  Link as LinkIcon,
  Loader2,
  CheckCircle2,
  Upload,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}

interface LiveLinkSubmissionDialogProps {
  organizationId: Id<"organizations">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SubmissionState = "input" | "submitting" | "success";

export function LiveLinkSubmissionDialog({
  organizationId,
  open,
  onOpenChange,
}: LiveLinkSubmissionDialogProps) {
  const [selectedVideoId, setSelectedVideoId] = useState<Id<"videos"> | null>(null);
  const [liveUrl, setLiveUrl] = useState("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("input");

  const readyVideos = useQuery(api.videoSubmissions.getVideosReadyToPost, {
    organizationId,
  });

  const submitLiveLink = useMutation(api.videoSubmissions.submitLiveLink);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSelectedVideoId(null);
        setLiveUrl("");
        setSubmissionState("input");
      }, 200);
    }
  }, [open]);

  // Auto-select first video if only one
  useEffect(() => {
    if (readyVideos?.length === 1 && !selectedVideoId) {
      setSelectedVideoId(readyVideos[0]._id);
    }
  }, [readyVideos, selectedVideoId]);

  const selectedVideo = readyVideos?.find((v) => v._id === selectedVideoId);

  const handleSubmit = async () => {
    if (!selectedVideoId || !liveUrl.trim()) {
      toast.error("Please select a video and enter the live post URL");
      return;
    }

    setSubmissionState("submitting");

    try {
      await submitLiveLink({
        videoId: selectedVideoId,
        livePostUrl: liveUrl.trim(),
      });

      setSubmissionState("success");

      // Close dialog after showing success
      setTimeout(() => {
        onOpenChange(false);
        toast.success("Live post submitted successfully!");
      }, 1500);
    } catch (error: any) {
      setSubmissionState("input");
      toast.error(error.message || "Failed to submit live link");
    }
  };

  const hasReadyVideos = readyVideos && readyVideos.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-500" />
            Submit Live Post
          </DialogTitle>
          <DialogDescription>
            Your video has been approved! Post it to social media and paste the link below.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {submissionState === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-8 space-y-4"
            >
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="h-20 w-20 rounded-full border-4 border-green-500/30 animate-ping" />
                </motion.div>
              </div>
              <p className="text-lg font-medium text-green-500">Done!</p>
              <p className="text-sm text-muted-foreground">Your live post is being processed...</p>
            </motion.div>
          ) : submissionState === "submitting" ? (
            <motion.div
              key="submitting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-8 space-y-4"
            >
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              <p className="text-lg font-medium">Uploading...</p>
              <p className="text-sm text-muted-foreground">Submitting your live post link</p>
            </motion.div>
          ) : (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {!hasReadyVideos ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                  <AlertCircle className="h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground text-center">
                    No videos ready to post. Check back after your videos are approved.
                  </p>
                </div>
              ) : (
                <>
                  {/* Video selection if multiple */}
                  {readyVideos.length > 1 && (
                    <div className="space-y-2">
                      <Label>Select Video</Label>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {readyVideos.map((video) => (
                          <button
                            key={video._id}
                            onClick={() => setSelectedVideoId(video._id)}
                            className={cn(
                              "w-full p-3 rounded-lg border text-left transition-colors",
                              selectedVideoId === video._id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              {video.thumbnailUrl ? (
                                <img
                                  src={video.thumbnailUrl}
                                  alt=""
                                  className="w-12 h-12 rounded object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                                  {video.platform === "instagram" ? (
                                    <Instagram className="h-5 w-5 text-muted-foreground" />
                                  ) : (
                                    <TikTokIcon className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {video.campaignName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {video.platform === "instagram" ? "Instagram" : "TikTok"} •{" "}
                                  {formatDate(video.addedAt)}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Platform indicator */}
                  {selectedVideo && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      {selectedVideo.platform === "instagram" ? (
                        <>
                          <div className="p-2 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                            <Instagram className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Post to Instagram</p>
                            <p className="text-xs text-muted-foreground">
                              Instagram Reel or Post
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-2 rounded-full bg-black">
                            <TikTokIcon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Post to TikTok</p>
                            <p className="text-xs text-muted-foreground">TikTok Video</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* URL Input */}
                  <div className="space-y-2">
                    <Label htmlFor="live-url">Live Post URL</Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="live-url"
                        type="url"
                        placeholder={
                          selectedVideo?.platform === "instagram"
                            ? "https://www.instagram.com/reel/..."
                            : "https://www.tiktok.com/@username/video/..."
                        }
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedVideo?.platform === "instagram"
                        ? "Paste your Instagram Reel or Post URL after publishing"
                        : "Paste your TikTok video URL after publishing"}
                    </p>
                  </div>

                  {/* Submit button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedVideoId || !liveUrl.trim()}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Submit Live Post
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Format timestamp to readable date
 */
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
