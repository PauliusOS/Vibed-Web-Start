"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoStoryModalProps {
  organizationId: Id<"organizations">;
  creatorId: string;
  viewerRole: "admin" | "client";
  open: boolean;
  onClose: () => void;
}

export function VideoStoryModal({
  organizationId,
  creatorId,
  viewerRole,
  open,
  onClose,
}: VideoStoryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videos = useQuery(
    api.videoSubmissions.getPendingVideosForCreator,
    creatorId ? { organizationId, creatorId, viewerRole } : "skip"
  );

  // Mutations for actions
  const sendToClient = useMutation(api.videoSubmissions.sendToClientReview);
  const clientReview = useMutation(api.videoSubmissions.clientReviewVideo);
  const adminFinalApproval = useMutation(api.videoSubmissions.adminFinalApproval);
  const adminRequestChanges = useMutation(api.videoSubmissions.adminRequestChanges);

  const currentVideo = videos?.[currentIndex];

  // Reset index when videos change
  useEffect(() => {
    if (videos && currentIndex >= videos.length) {
      setCurrentIndex(Math.max(0, videos.length - 1));
    }
  }, [videos, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, currentIndex, videos]);

  const goToPrevious = useCallback(() => {
    if (videos && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowFeedbackInput(false);
      setFeedback("");
    }
  }, [currentIndex, videos]);

  const goToNext = useCallback(() => {
    if (videos && currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowFeedbackInput(false);
      setFeedback("");
    }
  }, [currentIndex, videos]);

  const handleSendToClient = async () => {
    if (!currentVideo) return;

    setIsSubmitting(true);
    try {
      await sendToClient({ videoId: currentVideo._id });
      toast.success("Video sent to client for review");
      // Move to next video or close if last
      if (videos && currentIndex < videos.length - 1) {
        goToNext();
      } else {
        onClose();
      }
    } catch (error) {
      toast.error("Failed to send to client");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClientApprove = async () => {
    if (!currentVideo) return;

    setIsSubmitting(true);
    try {
      await clientReview({
        videoId: currentVideo._id,
        action: "approve",
        feedback: feedback || undefined,
      });
      toast.success("Video approved!");
      if (videos && currentIndex < videos.length - 1) {
        goToNext();
      } else {
        onClose();
      }
    } catch (error) {
      toast.error("Failed to approve video");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminApprove = async () => {
    if (!currentVideo) return;

    setIsSubmitting(true);
    try {
      await adminFinalApproval({ videoId: currentVideo._id });
      toast.success("Video approved! Creator has been notified.");
      if (videos && currentIndex < videos.length - 1) {
        goToNext();
      } else {
        onClose();
      }
    } catch (error) {
      toast.error("Failed to approve video");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!currentVideo || !feedback.trim()) {
      toast.error("Please provide feedback");
      return;
    }

    setIsSubmitting(true);
    try {
      if (viewerRole === "client") {
        await clientReview({
          videoId: currentVideo._id,
          action: "request_changes",
          feedback,
        });
      } else {
        await adminRequestChanges({
          videoId: currentVideo._id,
          feedback,
        });
      }
      toast.success("Changes requested");
      setFeedback("");
      setShowFeedbackInput(false);
      if (videos && currentIndex < videos.length - 1) {
        goToNext();
      } else {
        onClose();
      }
    } catch (error) {
      toast.error("Failed to request changes");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!videos || videos.length === 0) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-md">
          <DialogTitle className="sr-only">No Videos</DialogTitle>
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No pending videos to review</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-[100vw] w-screen h-screen max-h-screen p-0 border-0 bg-black/95 overflow-hidden">
        <DialogTitle className="sr-only">Video Review</DialogTitle>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="h-6 w-6 text-white" />
        </button>

        {/* Progress bar */}
        <div className="absolute top-4 left-4 right-16 z-50 flex gap-1">
          {videos.map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex-1 h-1 rounded-full transition-colors",
                index === currentIndex
                  ? "bg-white"
                  : index < currentIndex
                    ? "bg-white/60"
                    : "bg-white/20"
              )}
            />
          ))}
        </div>

        {/* Creator info header */}
        {currentVideo && (
          <div className="absolute top-12 left-4 z-50 flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-white/20">
              <AvatarImage src={currentVideo.creatorProfilePictureUrl || undefined} />
              <AvatarFallback className="text-xs">
                {currentVideo.creatorUsername?.slice(0, 2).toUpperCase() || "CR"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-medium text-sm">
                @{currentVideo.creatorUsername || "creator"}
              </p>
              <p className="text-white/60 text-xs">
                {formatTimeAgo(currentVideo.addedAt)} • {currentVideo.campaignName}
              </p>
            </div>
          </div>
        )}

        {/* Navigation arrows */}
        {currentIndex > 0 && (
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>
        )}
        {videos && currentIndex < videos.length - 1 && (
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>
        )}

        {/* Video content */}
        <AnimatePresence mode="wait">
          {currentVideo && (
            <motion.div
              key={currentVideo._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center w-full h-full"
            >
              <div className="relative max-w-md w-full mx-auto aspect-[9/16] max-h-[80vh]">
                {currentVideo.fileUrl ? (
                  <video
                    src={currentVideo.fileUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : currentVideo.thumbnailUrl ? (
                  <img
                    src={currentVideo.thumbnailUrl}
                    alt="Video thumbnail"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-lg">
                    <p className="text-white/40">No preview available</p>
                  </div>
                )}

                {/* Video description overlay */}
                {currentVideo.description && (
                  <div className="absolute bottom-24 left-0 right-0 px-4">
                    <p className="text-white text-sm bg-black/50 p-3 rounded-lg line-clamp-3">
                      {currentVideo.description}
                    </p>
                  </div>
                )}

                {/* Previous feedback display */}
                {(currentVideo.adminFeedback || currentVideo.clientFeedback) && (
                  <div className="absolute top-24 left-0 right-0 px-4">
                    <div className="bg-yellow-500/20 border border-yellow-500/30 p-3 rounded-lg">
                      <p className="text-yellow-400 text-xs font-medium mb-1">
                        Previous Feedback:
                      </p>
                      <p className="text-white/80 text-sm">
                        {currentVideo.clientFeedback || currentVideo.adminFeedback}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action bar */}
        {currentVideo && (
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
            {showFeedbackInput ? (
              <div className="max-w-md mx-auto space-y-3">
                <Textarea
                  placeholder="Describe the changes needed..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowFeedbackInput(false);
                      setFeedback("");
                    }}
                    className="flex-1 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRequestChanges}
                    disabled={!feedback.trim() || isSubmitting}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Feedback
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto flex gap-2">
                {/* Request Changes button - always available */}
                <Button
                  variant="ghost"
                  onClick={() => setShowFeedbackInput(true)}
                  className="flex-1 text-white hover:bg-white/10 border border-white/20"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Request Changes
                </Button>

                {/* Role-specific actions */}
                {viewerRole === "admin" ? (
                  currentVideo.status === "pending_admin_review" ? (
                    <Button
                      onClick={handleSendToClient}
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Notify Client
                        </>
                      )}
                    </Button>
                  ) : currentVideo.status === "client_approved" ? (
                    <Button
                      onClick={handleAdminApprove}
                      disabled={isSubmitting}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve
                        </>
                      )}
                    </Button>
                  ) : null
                ) : (
                  /* Client actions */
                  <Button
                    onClick={handleClientApprove}
                    disabled={isSubmitting}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Approve
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Format timestamp to human-readable "time ago" string
 */
function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}
