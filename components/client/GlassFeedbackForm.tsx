"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, Check, Clock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Feedback {
  _id: Id<"clientFeedback">;
  message: string;
  createdAt: number;
  isRead: boolean;
}

interface GlassFeedbackFormProps {
  campaignId: Id<"campaigns">;
  existingFeedback?: Feedback[];
}

export function GlassFeedbackForm({ campaignId, existingFeedback = [] }: GlassFeedbackFormProps) {
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = useMutation(api.clients.submitFeedback);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedbackMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback({
        campaignId,
        message: feedbackMessage.trim(),
      });
      setFeedbackMessage("");
      toast.success("Feedback submitted successfully");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
    >
      {/* Hover glow */}
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />

      <div className="relative rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.03] transition-all overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <MessageSquare className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Submit Feedback</h3>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="feedback" className="text-sm font-medium text-white/70">
                Your Message
              </label>
              <textarea
                id="feedback"
                placeholder="Share your thoughts about this campaign..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                className="w-full min-h-[120px] px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-white/[0.15] focus:bg-white/[0.04] transition-all"
                disabled={isSubmitting}
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting || !feedbackMessage.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all",
                isSubmitting || !feedbackMessage.trim()
                  ? "bg-white/[0.04] text-white/30 cursor-not-allowed"
                  : "bg-white text-black hover:bg-white/90"
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Feedback</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Feedback History */}
          {existingFeedback.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <h4 className="text-sm font-medium text-white mb-4">
                Previous Feedback ({existingFeedback.length})
              </h4>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {existingFeedback.map((feedback, index) => (
                    <motion.div
                      key={feedback._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all"
                    >
                      <p className="text-sm text-white/80 mb-3 leading-relaxed">
                        {feedback.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs text-white/40">
                          <Clock className="h-3 w-3" />
                          {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {feedback.isRead ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Check className="h-3 w-3" />
                            Read
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Pending
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
