"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

interface Feedback {
  _id: Id<"clientFeedback">;
  message: string;
  createdAt: number;
  isRead: boolean;
}

interface FeedbackFormProps {
  campaignId: Id<"campaigns">;
  existingFeedback?: Feedback[];
}

export function FeedbackForm({ campaignId, existingFeedback = [] }: FeedbackFormProps) {
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
    <Card className="bg-[#1a1a1a] border-[#3a3a3a] sticky top-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Submit Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-white">
              Your Message
            </Label>
            <Textarea
              id="feedback"
              placeholder="Share your thoughts about this campaign..."
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              className="min-h-[120px] bg-black/50 border-[#3a3a3a] text-white placeholder:text-white/40 resize-none focus:border-white/30 focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isSubmitting}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !feedbackMessage.trim()}
            className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Feedback
              </>
            )}
          </Button>
        </form>

        {/* Feedback History */}
        {existingFeedback.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="text-sm font-medium text-white mb-3">
              Previous Feedback
            </h4>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {existingFeedback.map((feedback) => (
                <div
                  key={feedback._id}
                  className="p-3 bg-black/50 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                >
                  <p className="text-sm text-white/80 mb-2 leading-relaxed">
                    {feedback.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">
                      {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {feedback.isRead ? (
                      <Badge className="bg-green-500/10 text-green-500 text-xs border-green-500/20">
                        Read
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500/10 text-yellow-500 text-xs border-yellow-500/20">
                        Unread
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
