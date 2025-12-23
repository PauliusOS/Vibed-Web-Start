"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MessageCircle,
  Plus,
  X,
  Clock,
  Check,
  AlertCircle,
  Edit,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TimestampedComment {
  id: string;
  timestamp: string;
  comment: string;
}

interface RevisionRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoTitle: string;
  creatorName: string;
  videoDuration: number;
  onRequestRevision: (data: {
    comments: TimestampedComment[];
    generalFeedback: string;
    notifyCreator: boolean;
    dueDate?: Date;
  }) => Promise<void>;
}

export function RevisionRequestDialog({
  open,
  onOpenChange,
  videoTitle,
  creatorName,
  videoDuration,
  onRequestRevision,
}: RevisionRequestDialogProps) {
  const [comments, setComments] = useState<TimestampedComment[]>([]);
  const [newTimestamp, setNewTimestamp] = useState("");
  const [newComment, setNewComment] = useState("");
  const [generalFeedback, setGeneralFeedback] = useState("");
  const [notifyCreator, setNotifyCreator] = useState(true);
  const [setDueDate, setSetDueDate] = useState(false);
  const [dueDate, setDueDateValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const parseTimestamp = (timestamp: string): number | null => {
    const parts = timestamp.split(":");
    if (parts.length === 2) {
      const [mins, secs] = parts.map(Number);
      if (!isNaN(mins) && !isNaN(secs)) {
        return mins * 60 + secs;
      }
    }
    return null;
  };

  const validateTimestamp = (timestamp: string): boolean => {
    const seconds = parseTimestamp(timestamp);
    return seconds !== null && seconds >= 0 && seconds <= videoDuration;
  };

  const addComment = () => {
    if (!newTimestamp || !newComment.trim()) return;
    if (!validateTimestamp(newTimestamp)) return;

    const comment: TimestampedComment = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: newTimestamp,
      comment: newComment,
    };

    setComments([...comments, comment].sort((a, b) => {
      const aSeconds = parseTimestamp(a.timestamp) || 0;
      const bSeconds = parseTimestamp(b.timestamp) || 0;
      return aSeconds - bSeconds;
    }));

    setNewTimestamp("");
    setNewComment("");
  };

  const removeComment = (id: string) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  const handleSubmit = async () => {
    if (comments.length === 0 && !generalFeedback.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      await onRequestRevision({
        comments,
        generalFeedback,
        notifyCreator,
        dueDate: setDueDate && dueDate ? new Date(dueDate) : undefined,
      });
      setSubmitSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setSubmitSuccess(false);
        // Reset form
        setComments([]);
        setGeneralFeedback("");
        setNotifyCreator(true);
        setSetDueDate(false);
        setDueDateValue("");
      }, 1500);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = comments.length > 0 || generalFeedback.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <DialogTitle>Request Revisions</DialogTitle>
              <DialogDescription className="mt-1">
                Provide timestamped feedback for "{videoTitle}" by {creatorName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Add Timestamped Comment */}
          <div className="space-y-3">
            <Label className="text-white/80">Add Timestamped Comments</Label>
            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="timestamp" className="text-xs text-white/60">
                    Timestamp (MM:SS)
                  </Label>
                  <Input
                    id="timestamp"
                    value={newTimestamp}
                    onChange={(e) => setNewTimestamp(e.target.value)}
                    placeholder="0:00"
                    className="bg-white/[0.05] border-white/[0.1] text-white"
                  />
                  <p className="text-xs text-white/40">
                    Max: {formatDuration(videoDuration)}
                  </p>
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <Label htmlFor="comment" className="text-xs text-white/60">
                    Comment
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="comment"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="e.g., Audio is too quiet here, needs to be louder"
                      className="flex-1 bg-white/[0.05] border-white/[0.1] text-white"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addComment();
                        }
                      }}
                    />
                    <Button
                      onClick={addComment}
                      disabled={!newTimestamp || !newComment.trim() || !validateTimestamp(newTimestamp)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          {comments.length > 0 && (
            <div className="space-y-2">
              <Label className="text-white/80">
                Timestamped Comments ({comments.length})
              </Label>
              <div className="space-y-2">
                <AnimatePresence>
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                    >
                      <div className="flex-shrink-0 w-16 h-8 rounded bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                        <Clock className="w-3 h-3 text-blue-400 mr-1" />
                        <span className="text-xs text-blue-400 font-mono">
                          {comment.timestamp}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white">{comment.comment}</p>
                      </div>
                      <button
                        onClick={() => removeComment(comment.id)}
                        className="flex-shrink-0 p-1 rounded hover:bg-white/[0.05] text-white/60 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* General Feedback */}
          <div className="space-y-2">
            <Label htmlFor="general-feedback" className="text-white/80">
              General Feedback (Optional)
            </Label>
            <Textarea
              id="general-feedback"
              value={generalFeedback}
              onChange={(e) => setGeneralFeedback(e.target.value)}
              placeholder="Add any general feedback or notes that don't relate to specific timestamps..."
              className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 min-h-24"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label className="text-white/80">Revision Options</Label>

            {/* Notify Creator */}
            <div
              className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg cursor-pointer hover:bg-white/[0.04] transition-colors"
              onClick={() => setNotifyCreator(!notifyCreator)}
            >
              <Checkbox
                checked={notifyCreator}
                onCheckedChange={setNotifyCreator}
                className="mt-0.5"
              />
              <div className="flex-1">
                <label className="text-sm text-white cursor-pointer font-medium block mb-1">
                  Notify Creator
                </label>
                <p className="text-xs text-white/60">
                  Send revision request to {creatorName} via email
                </p>
              </div>
            </div>

            {/* Set Due Date */}
            <div
              className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg cursor-pointer hover:bg-white/[0.04] transition-colors"
              onClick={() => setSetDueDate(!setDueDate)}
            >
              <Checkbox
                checked={setDueDate}
                onCheckedChange={setSetDueDate}
                className="mt-0.5"
              />
              <div className="flex-1">
                <label className="text-sm text-white cursor-pointer font-medium block mb-1">
                  Set Revision Deadline
                </label>
                <p className="text-xs text-white/60 mb-2">
                  Specify when the revised version should be submitted
                </p>

                {setDueDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => setDueDateValue(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <Edit className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="text-blue-400 font-medium mb-1">
                  Revision Request Summary:
                </p>
                <ul className="text-white/80 space-y-1">
                  {comments.length > 0 && (
                    <li>• {comments.length} timestamped comment{comments.length !== 1 ? "s" : ""}</li>
                  )}
                  {generalFeedback.trim() && <li>• General feedback provided</li>}
                  {notifyCreator && (
                    <li>• {creatorName} will be notified via email</li>
                  )}
                  {setDueDate && dueDate && (
                    <li>
                      • Deadline: {new Date(dueDate).toLocaleString()}
                    </li>
                  )}
                  <li>• Video status will be set to "Needs Revision"</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Sending...
              </>
            ) : submitSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Sent!
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Revision Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
