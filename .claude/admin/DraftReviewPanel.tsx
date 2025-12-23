"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Video,
  X,
  Send,
  FileText,
  Instagram,
  ExternalLink,
  Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}

interface DraftReviewPanelProps {
  videoId: Id<"videos">;
  organizationId: Id<"organizations">;
  onClose: () => void;
}

function ReviewStatusIcon({ status }: { status: string }) {
  if (status === "approved") {
    return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  }
  if (status === "changes_requested") {
    return <XCircle className="h-4 w-4 text-red-500" />;
  }
  return <Clock className="h-4 w-4 text-yellow-500" />;
}

export function DraftReviewPanel({
  videoId,
  organizationId,
  onClose,
}: DraftReviewPanelProps) {
  const { user } = useUser();
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConsolidateModal, setShowConsolidateModal] = useState(false);
  const [consolidatedFeedback, setConsolidatedFeedback] = useState("");

  // Queries
  const video = useQuery(api.videos.getVideoById, { videoId });
  const reviews = useQuery(api.draftReviews.getDraftReviews, { videoId });
  const reviewSummary = useQuery(api.draftReviews.getDraftReviewSummary, { videoId });
  const myReview = useQuery(
    api.draftReviews.getAdminReview,
    user?.id ? { videoId, adminId: user.id } : "skip"
  );

  // Mutations
  const submitReview = useMutation(api.draftReviews.submitDraftReview);
  const createRevisionDraft = useMutation(api.draftReviews.createRevisionDraft);
  const sendRevision = useMutation(api.draftReviews.sendRevisionToCreator);

  const handleSubmitReview = async (status: "approved" | "changes_requested") => {
    if (!user?.id) return;

    if (status === "changes_requested" && !feedback.trim()) {
      toast.error("Please provide feedback when requesting changes");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview({
        videoId,
        adminId: user.id,
        organizationId,
        feedback: feedback.trim() || "Approved",
        status,
      });
      toast.success(
        status === "approved"
          ? "Draft approved!"
          : "Changes requested"
      );
      setFeedback("");
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateRevision = async () => {
    if (!user?.id || !consolidatedFeedback.trim()) return;

    setIsSubmitting(true);
    try {
      await createRevisionDraft({
        videoId,
        organizationId,
        consolidatedFeedback: consolidatedFeedback.trim(),
        createdBy: user.id,
      });
      toast.success("Revision draft created");
      setShowConsolidateModal(false);
    } catch (error) {
      toast.error("Failed to create revision draft");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendToCreator = async (revisionId: Id<"revisionDrafts">) => {
    if (!user?.id) return;

    try {
      await sendRevision({ revisionId, sentBy: user.id });
      toast.success("Revision sent to creator!");
    } catch (error) {
      toast.error("Failed to send revision");
    }
  };

  // Auto-consolidate feedback from all reviews
  const autoConsolidate = () => {
    if (!reviews) return "";
    return reviews
      .filter((r) => r.feedback)
      .map((r, i) => `Admin ${i + 1}:\n${r.feedback}`)
      .join("\n\n---\n\n");
  };

  if (!video) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const PlatformIcon = video.platform === "instagram" ? Instagram : TikTokIcon;
  const hasReviewed = myReview && myReview.status !== "pending";
  const allApproved = reviewSummary?.allApproved;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Review Draft</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Video Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center">
                <Video className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <PlatformIcon className="h-4 w-4" />
                  <span className="font-medium">
                    Draft v{video.draftVersion || 1}
                  </span>
                  <Badge variant="outline">{video.status}</Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                  <User className="h-3 w-3" />
                  <span>{video.creatorId?.split("|")[1] || "Unassigned"}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Submitted {formatDistanceToNow(video.addedAt, { addSuffix: true })}
                </div>
              </div>
            </div>

            {video.videoUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Draft
                </a>
              </Button>
            )}
          </div>

          <Separator />

          {/* Review Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Review Status
              </h3>
              <Badge
                className={
                  allApproved
                    ? "bg-green-500/10 text-green-500"
                    : "bg-yellow-500/10 text-yellow-500"
                }
              >
                {reviewSummary?.approved || 0}/{reviewSummary?.totalReviews || 0} approved
              </Badge>
            </div>

            {/* Individual Reviews */}
            {reviews && reviews.length > 0 && (
              <div className="space-y-2">
                {reviews.map((review, index) => (
                  <div
                    key={review._id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {`A${index + 1}`}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          Admin {index + 1}
                          {review.adminId === user?.id && " (You)"}
                        </span>
                        <ReviewStatusIcon status={review.status} />
                        <span className="text-xs text-muted-foreground">
                          {review.status === "pending"
                            ? "Pending"
                            : review.status === "approved"
                            ? "Approved"
                            : "Requested Changes"}
                        </span>
                      </div>
                      {review.feedback && (
                        <p className="text-sm text-muted-foreground">
                          {review.feedback}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Submit Review */}
          {!hasReviewed ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedback">Your Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Write your review notes here..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-red-500/50 text-red-500 hover:bg-red-500/10"
                  onClick={() => handleSubmitReview("changes_requested")}
                  disabled={isSubmitting}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Request Changes
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleSubmitReview("approved")}
                  disabled={isSubmitting}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium">You have reviewed this draft</p>
              <p className="text-sm text-muted-foreground">
                Status: {myReview.status === "approved" ? "Approved" : "Requested Changes"}
              </p>
            </div>
          )}

          {/* Consolidate & Send Action */}
          {allApproved && reviewSummary && reviewSummary.totalReviews > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  All admins have approved. Create a consolidated revision draft to send to the creator.
                </p>
                <Button
                  className="w-full"
                  onClick={() => {
                    setConsolidatedFeedback(autoConsolidate());
                    setShowConsolidateModal(true);
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create Revision Draft
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Consolidate Modal */}
      <Dialog open={showConsolidateModal} onOpenChange={setShowConsolidateModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Revision Draft</DialogTitle>
            <DialogDescription>
              Consolidate all admin feedback into a single message for the creator.
              You can edit the feedback before sending.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Consolidated Feedback</Label>
              <Textarea
                value={consolidatedFeedback}
                onChange={(e) => setConsolidatedFeedback(e.target.value)}
                rows={8}
                placeholder="Combine feedback from all admins..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConsolidateModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateRevision} disabled={isSubmitting}>
              <Send className="h-4 w-4 mr-2" />
              Create & Send to Creator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
