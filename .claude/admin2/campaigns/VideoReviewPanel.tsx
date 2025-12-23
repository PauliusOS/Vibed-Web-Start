"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Play,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  User,
  ChevronRight,
  Plus,
  X,
  Loader2,
  Video,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface VideoReviewPanelProps {
  campaignId: Id<"campaigns">;
}

interface TimestampedNote {
  timestamp: string;
  note: string;
}

export function VideoReviewPanel({ campaignId }: VideoReviewPanelProps) {
  const [selectedVideoId, setSelectedVideoId] = useState<Id<"videos"> | null>(null);
  const [feedback, setFeedback] = useState("");
  const [timestampedNotes, setTimestampedNotes] = useState<TimestampedNote[]>([]);
  const [newTimestamp, setNewTimestamp] = useState("");
  const [newNote, setNewNote] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // Queries
  const pendingVideos = useQuery(api.videoRevisions.getPendingReviews, {
    campaignId,
  });

  const selectedVideo = pendingVideos?.find((v) => v._id === selectedVideoId);

  const revisionHistory = useQuery(
    api.videoRevisions.getRevisionHistory,
    selectedVideoId ? { videoId: selectedVideoId } : "skip"
  );

  // Mutations
  const approveVideo = useMutation(api.videoRevisions.approveVideo);
  const requestChanges = useMutation(api.videoRevisions.requestChanges);

  const handleApprove = async () => {
    if (!selectedVideoId) return;

    setIsApproving(true);
    try {
      await approveVideo({
        videoId: selectedVideoId,
        feedback: feedback || undefined,
      });
      toast.success("Video approved");
      setSelectedVideoId(null);
      setFeedback("");
    } catch (error) {
      toast.error("Failed to approve video");
    } finally {
      setIsApproving(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!selectedVideoId) return;

    if (!feedback.trim()) {
      toast.error("Please provide feedback");
      return;
    }

    setIsRejecting(true);
    try {
      await requestChanges({
        videoId: selectedVideoId,
        feedback,
        timestampedNotes: timestampedNotes.length > 0 ? timestampedNotes : undefined,
      });
      toast.success("Feedback sent to creator");
      setSelectedVideoId(null);
      setFeedback("");
      setTimestampedNotes([]);
    } catch (error) {
      toast.error("Failed to send feedback");
    } finally {
      setIsRejecting(false);
    }
  };

  const addTimestampedNote = () => {
    if (newTimestamp && newNote) {
      setTimestampedNotes([...timestampedNotes, { timestamp: newTimestamp, note: newNote }]);
      setNewTimestamp("");
      setNewNote("");
    }
  };

  const removeTimestampedNote = (index: number) => {
    setTimestampedNotes(timestampedNotes.filter((_, i) => i !== index));
  };

  if (!pendingVideos) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-white/40" />
      </div>
    );
  }

  if (pendingVideos.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-emerald-500/30 mx-auto mb-3" />
        <h3 className="text-[14px] font-medium text-white/60 mb-1">All caught up!</h3>
        <p className="text-[13px] text-white/40">No videos pending review</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Video List */}
      <div className="lg:col-span-1">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl">
          <div className="p-4 border-b border-white/[0.06]">
            <h3 className="text-[14px] font-medium text-white">Pending Reviews</h3>
            <p className="text-[12px] text-white/40">{pendingVideos.length} videos</p>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {pendingVideos.map((video) => (
              <button
                key={video._id}
                onClick={() => setSelectedVideoId(video._id)}
                className={cn(
                  "w-full p-3 text-left hover:bg-white/[0.02] transition-colors",
                  selectedVideoId === video._id && "bg-white/[0.04]"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                    {video.videoThumbnailUrl ? (
                      <img
                        src={video.videoThumbnailUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Video className="w-6 h-6 text-white/20" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {video.creatorInfo?.profilePictureUrl ? (
                        <img
                          src={video.creatorInfo.profilePictureUrl}
                          alt=""
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                          <User className="w-3 h-3 text-white/40" />
                        </div>
                      )}
                      <span className="text-[13px] text-white font-medium truncate">
                        {video.creatorInfo?.displayName ||
                          video.creatorInfo?.username ||
                          "Unknown Creator"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-white/40">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(video.addedAt, { addSuffix: true })}
                      {video.revisionCount > 0 && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1 py-0 h-4 border-white/10"
                        >
                          v{video.revisionCount}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-white/20 shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Review Panel */}
      <div className="lg:col-span-2">
        {!selectedVideo ? (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-12 text-center">
            <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="text-[14px] text-white/40">Select a video to review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Video Preview */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="aspect-video bg-black flex items-center justify-center relative">
                {selectedVideo.fileUrl ? (
                  <video
                    src={selectedVideo.fileUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : selectedVideo.videoUrl ? (
                  <div className="text-center">
                    <Video className="w-12 h-12 text-white/20 mx-auto mb-2" />
                    <a
                      href={selectedVideo.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] text-blue-400 hover:underline flex items-center gap-1 justify-center"
                    >
                      Open in {selectedVideo.platform}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : (
                  <Video className="w-12 h-12 text-white/20" />
                )}
              </div>

              <div className="p-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedVideo.creatorInfo?.profilePictureUrl ? (
                      <img
                        src={selectedVideo.creatorInfo.profilePictureUrl}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-white/40" />
                      </div>
                    )}
                    <div>
                      <p className="text-[14px] font-medium text-white">
                        {selectedVideo.creatorInfo?.displayName ||
                          selectedVideo.creatorInfo?.username}
                      </p>
                      <p className="text-[12px] text-white/40">
                        Submitted {format(selectedVideo.addedAt, "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-[11px] border-white/10 text-white/50"
                    >
                      {selectedVideo.platform}
                    </Badge>
                    {selectedVideo.scheduledPost && (
                      <Badge
                        variant="outline"
                        className="text-[11px] border-white/10 text-white/50"
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(selectedVideo.scheduledPost.scheduledDate, "MMM d")}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Revision History */}
            {revisionHistory && revisionHistory.length > 0 && (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                <h4 className="text-[12px] font-medium text-white/60 mb-3">
                  Revision History
                </h4>
                <div className="space-y-3">
                  {revisionHistory.map((revision) => (
                    <div
                      key={revision._id}
                      className="flex items-start gap-3 text-[12px]"
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                          revision.action === "approved" && "bg-emerald-500/20",
                          revision.action === "changes_requested" && "bg-orange-500/20",
                          revision.action === "submitted" && "bg-blue-500/20",
                          revision.action === "resubmitted" && "bg-purple-500/20"
                        )}
                      >
                        {revision.action === "approved" && (
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                        )}
                        {revision.action === "changes_requested" && (
                          <XCircle className="w-3 h-3 text-orange-400" />
                        )}
                        {(revision.action === "submitted" ||
                          revision.action === "resubmitted") && (
                          <Play className="w-3 h-3 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-white/60">
                          <span className="capitalize">
                            {revision.action.replace("_", " ")}
                          </span>
                          <span className="text-white/30">•</span>
                          <span className="text-white/40">
                            {formatDistanceToNow(revision.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                        {revision.feedback && (
                          <p className="text-white/50 mt-1">{revision.feedback}</p>
                        )}
                        {revision.timestampedNotes &&
                          revision.timestampedNotes.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {revision.timestampedNotes.map((note, i) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-2 text-[11px]"
                                >
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1 py-0 h-4 border-white/10 shrink-0"
                                  >
                                    {note.timestamp}
                                  </Badge>
                                  <span className="text-white/40">{note.note}</span>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback Form */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
              <h4 className="text-[12px] font-medium text-white/60 mb-3">
                Your Feedback
              </h4>

              <div className="space-y-4">
                <div>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Write your feedback here..."
                    className="border-white/10 bg-transparent text-white min-h-[100px]"
                  />
                </div>

                {/* Timestamped Notes */}
                <div className="space-y-2">
                  <Label className="text-[11px] text-white/40">
                    Timestamped Notes (Optional)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTimestamp}
                      onChange={(e) => setNewTimestamp(e.target.value)}
                      placeholder="0:15"
                      className="w-20 border-white/10 bg-transparent text-white text-[12px]"
                    />
                    <Input
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add note for this timestamp"
                      className="flex-1 border-white/10 bg-transparent text-white text-[12px]"
                      onKeyPress={(e) => e.key === "Enter" && addTimestampedNote()}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addTimestampedNote}
                      className="border-white/10 shrink-0 h-9 w-9"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {timestampedNotes.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {timestampedNotes.map((note, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-[12px] bg-white/5 px-2 py-1.5 rounded"
                        >
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1 py-0 h-4 border-white/10"
                          >
                            {note.timestamp}
                          </Badge>
                          <span className="flex-1 text-white/70">{note.note}</span>
                          <button
                            onClick={() => removeTimestampedNote(i)}
                            className="text-white/40 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
                  <Button
                    variant="outline"
                    onClick={handleRequestChanges}
                    disabled={isRejecting || isApproving}
                    className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                  >
                    {isRejecting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <XCircle className="w-4 h-4 mr-2" />
                    Request Changes
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {isApproving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
