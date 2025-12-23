"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

interface RevisionFeedbackCardProps {
  revision: {
    _id: Id<"revisionDrafts">;
    videoId: Id<"videos">;
    consolidatedFeedback: string;
    status: string;
    sentAt?: number;
    acknowledgedAt?: number;
    createdAt: number;
  };
}

export function RevisionFeedbackCard({ revision }: RevisionFeedbackCardProps) {
  const acknowledgeRevision = useMutation(api.draftReviews.acknowledgeRevision);

  const handleAcknowledge = async () => {
    try {
      await acknowledgeRevision({ revisionId: revision._id });
      toast.success("Feedback acknowledged. Time to work on revisions!");
    } catch (error) {
      toast.error("Failed to acknowledge feedback");
    }
  };

  const isAcknowledged = revision.status === "creator_acknowledged";
  const isSent = revision.status === "sent_to_creator" || isAcknowledged;

  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Revision Feedback
          </CardTitle>
          <Badge
            className={
              isAcknowledged
                ? "bg-green-500/10 text-green-500"
                : "bg-yellow-500/10 text-yellow-500"
            }
          >
            {isAcknowledged ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Acknowledged
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 mr-1" />
                Pending Review
              </>
            )}
          </Badge>
        </div>
        {revision.sentAt && (
          <p className="text-sm text-white/40">
            Received {formatDistanceToNow(revision.sentAt, { addSuffix: true })}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Feedback Content */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="whitespace-pre-wrap text-white/80 text-sm leading-relaxed">
            {revision.consolidatedFeedback}
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Action */}
        {!isAcknowledged && isSent && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <AlertCircle className="h-4 w-4" />
              <span>Please acknowledge to confirm you've read the feedback</span>
            </div>
            <Button
              onClick={handleAcknowledge}
              className="bg-white text-black hover:bg-white/90"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Acknowledge
            </Button>
          </div>
        )}

        {isAcknowledged && (
          <div className="flex items-center gap-2 text-sm text-green-500">
            <CheckCircle2 className="h-4 w-4" />
            <span>
              You acknowledged this feedback{" "}
              {revision.acknowledgedAt &&
                formatDistanceToNow(revision.acknowledgedAt, { addSuffix: true })}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
