"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Download,
  Calendar,
  User,
  Video,
  FileVideo,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VideoReviewDialogProps {
  videoId: Id<"videos"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video?: {
    _id: Id<"videos">;
    campaignId: Id<"campaigns">;
    creatorId?: string;
    platform: "instagram" | "tiktok";
    submissionType: "url" | "file";
    videoUrl?: string;
    videoId?: string;
    fileId?: Id<"_storage">;
    fileType?: string;
    fileSize?: number;
    status: "pending_approval" | "approved" | "rejected" | "tracking";
    addedAt: number;
    creatorName?: string;
    campaignName?: string;
  };
}

export function VideoReviewDialog({
  videoId,
  open,
  onOpenChange,
  video: initialVideo,
}: VideoReviewDialogProps) {
  const [feedback, setFeedback] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showFeedbackError, setShowFeedbackError] = useState(false);

  // Fetch video file URL if it's a file upload
  const videoFileUrl = useQuery(
    api.videos.getVideoFileUrl,
    videoId && initialVideo?.submissionType === "file"
      ? { videoId }
      : "skip"
  );

  // Mutations
  const approveVideo = useMutation(api.videos.approveVideo);
  const rejectVideo = useMutation(api.videos.rejectVideo);

  // Reset feedback when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setFeedback("");
      setShowFeedbackError(false);
    }
  }, [open]);

  const handleApprove = async () => {
    if (!videoId) return;

    setIsApproving(true);
    try {
      await approveVideo({ videoId });
      toast.success("Video approved successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to approve video");
      console.error("Approve error:", error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!videoId) return;

    // Validate feedback
    if (!feedback.trim()) {
      setShowFeedbackError(true);
      toast.error("Please provide feedback for rejection");
      return;
    }

    setIsRejecting(true);
    try {
      await rejectVideo({ videoId, feedback: feedback.trim() });
      toast.success("Video rejected with feedback sent to creator");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to reject video");
      console.error("Reject error:", error);
    } finally {
      setIsRejecting(false);
    }
  };

  const handleDownload = () => {
    if (videoFileUrl && initialVideo?.submissionType === "file") {
      window.open(videoFileUrl, "_blank");
      toast.success("Starting download...");
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!initialVideo) return null;

  const isFileUpload = initialVideo.submissionType === "file";
  const isUrlSubmission = initialVideo.submissionType === "url";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Video className="h-6 w-6 text-blue-500" />
            Review Video Submission
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Review the video content and provide approval or feedback
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Video Preview Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                {isFileUpload ? (
                  <>
                    <FileVideo className="h-5 w-5 text-blue-500" />
                    Video File
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-5 w-5 text-blue-500" />
                    Video Link
                  </>
                )}
              </Label>
              <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                {initialVideo.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>

            {/* Video Player or Preview */}
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border border-border">
              {isFileUpload && videoFileUrl ? (
                <video
                  src={videoFileUrl}
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                >
                  Your browser does not support video playback.
                </video>
              ) : isFileUpload && !videoFileUrl ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                    <p className="text-sm text-muted-foreground">Loading video...</p>
                  </div>
                </div>
              ) : isUrlSubmission && initialVideo.videoUrl ? (
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">
                      {initialVideo.platform === "instagram" ? "📸" : "🎵"}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Video hosted on {initialVideo.platform}
                      </p>
                      <a
                        href={initialVideo.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open in {initialVideo.platform}
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">Video not available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Download Button for File Uploads */}
            {isFileUpload && videoFileUrl && (
              <Button
                onClick={handleDownload}
                variant="outline"
                className="w-full border-border hover:bg-muted transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Video File
              </Button>
            )}
          </div>

          {/* Video Metadata Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Creator</p>
                  <p className="text-sm font-medium text-foreground">
                    {initialVideo.creatorName || "Unknown"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Video className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Campaign</p>
                  <p className="text-sm font-medium text-foreground">
                    {initialVideo.campaignName || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(initialVideo.addedAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FileVideo className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Platform</p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {initialVideo.platform}
                  </p>
                </div>
              </div>

              {isFileUpload && (
                <>
                  <div className="flex items-start gap-3">
                    <FileVideo className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">File Type</p>
                      <p className="text-sm font-medium text-foreground">
                        {initialVideo.fileType || "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileVideo className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">File Size</p>
                      <p className="text-sm font-medium text-foreground">
                        {formatFileSize(initialVideo.fileSize)}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {isUrlSubmission && initialVideo.videoId && (
                <div className="flex items-start gap-3">
                  <ExternalLink className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Video ID</p>
                    <p className="text-sm font-medium text-foreground font-mono">
                      {initialVideo.videoId}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-3">
            <Label htmlFor="feedback" className="text-base font-semibold text-foreground">
              Rejection Feedback
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="feedback"
              placeholder="Provide detailed feedback if rejecting this video. This will be sent to the creator..."
              value={feedback}
              onChange={(e) => {
                setFeedback(e.target.value);
                setShowFeedbackError(false);
              }}
              className={cn(
                "min-h-[100px] resize-none bg-background border-border focus:border-blue-500 transition-colors",
                showFeedbackError && "border-red-500 focus:border-red-500"
              )}
            />
            {showFeedbackError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Feedback is required when rejecting a video
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Required when rejecting. Optional when approving.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isApproving || isRejecting}
            className="flex-1 sm:flex-none border-border hover:bg-muted"
          >
            Cancel
          </Button>
          <div className="flex gap-2 flex-1">
            <Button
              onClick={handleReject}
              disabled={isApproving || isRejecting}
              className="flex-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-colors"
            >
              {isRejecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </>
              )}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
              className="flex-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 transition-colors"
            >
              {isApproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
