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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  XCircle,
  AlertCircle,
  Check,
  Film,
  Volume,
  Eye,
  TrendingDown,
  FileX,
} from "lucide-react";
import { motion } from "motion/react";

interface RejectionReason {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const rejectionReasons: RejectionReason[] = [
  {
    id: "quality",
    label: "Poor Video Quality",
    description: "Low resolution, blurry, or technical issues",
    icon: Film,
  },
  {
    id: "audio",
    label: "Audio Issues",
    description: "Poor sound quality, background noise, or audio sync problems",
    icon: Volume,
  },
  {
    id: "content",
    label: "Content Guidelines",
    description: "Content doesn't align with brand guidelines or campaign brief",
    icon: FileX,
  },
  {
    id: "engagement",
    label: "Low Engagement Potential",
    description: "Content unlikely to perform well or engage audience",
    icon: TrendingDown,
  },
  {
    id: "inappropriate",
    label: "Inappropriate Content",
    description: "Contains prohibited or inappropriate content",
    icon: AlertCircle,
  },
];

interface VideoRejectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoTitle: string;
  creatorName: string;
  onReject: (data: {
    reason: string;
    additionalReasons: string[];
    feedback: string;
    notifyCreator: boolean;
    allowResubmission: boolean;
  }) => Promise<void>;
}

export function VideoRejectionDialog({
  open,
  onOpenChange,
  videoTitle,
  creatorName,
  onReject,
}: VideoRejectionDialogProps) {
  const [primaryReason, setPrimaryReason] = useState<string>("");
  const [additionalReasons, setAdditionalReasons] = useState<Set<string>>(
    new Set()
  );
  const [feedback, setFeedback] = useState("");
  const [notifyCreator, setNotifyCreator] = useState(true);
  const [allowResubmission, setAllowResubmission] = useState(true);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionSuccess, setRejectionSuccess] = useState(false);

  const toggleAdditionalReason = (reasonId: string) => {
    const newReasons = new Set(additionalReasons);
    if (newReasons.has(reasonId)) {
      newReasons.delete(reasonId);
    } else {
      newReasons.add(reasonId);
    }
    setAdditionalReasons(newReasons);
  };

  const handleReject = async () => {
    if (!primaryReason || !feedback.trim()) {
      return;
    }

    setIsRejecting(true);
    setRejectionSuccess(false);

    try {
      await onReject({
        reason: primaryReason,
        additionalReasons: Array.from(additionalReasons),
        feedback,
        notifyCreator,
        allowResubmission,
      });
      setRejectionSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setRejectionSuccess(false);
        // Reset form
        setPrimaryReason("");
        setAdditionalReasons(new Set());
        setFeedback("");
        setNotifyCreator(true);
        setAllowResubmission(true);
      }, 1500);
    } catch (error) {
      console.error("Rejection failed:", error);
    } finally {
      setIsRejecting(false);
    }
  };

  const isFormValid = primaryReason && feedback.trim().length >= 20;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <DialogTitle>Reject Video</DialogTitle>
              <DialogDescription className="mt-1">
                Provide detailed feedback for "{videoTitle}" by {creatorName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Primary Reason */}
          <div className="space-y-3">
            <Label className="text-white/80">
              Primary Reason for Rejection *
            </Label>
            <RadioGroup value={primaryReason} onValueChange={setPrimaryReason}>
              <div className="space-y-2">
                {rejectionReasons.map((reason) => {
                  const Icon = reason.icon;
                  return (
                    <div
                      key={reason.id}
                      className={`relative flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        primaryReason === reason.id
                          ? "border-red-500/50 bg-red-500/10"
                          : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                      onClick={() => setPrimaryReason(reason.id)}
                    >
                      <RadioGroupItem
                        value={reason.id}
                        id={reason.id}
                        className="mt-1"
                      />

                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg ${
                          primaryReason === reason.id
                            ? "bg-red-500/20"
                            : "bg-white/[0.05]"
                        } flex items-center justify-center`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            primaryReason === reason.id
                              ? "text-red-400"
                              : "text-white/60"
                          }`}
                        />
                      </div>

                      <div className="flex-1">
                        <label
                          htmlFor={reason.id}
                          className="text-sm font-medium text-white cursor-pointer block mb-1"
                        >
                          {reason.label}
                        </label>
                        <p className="text-xs text-white/60">
                          {reason.description}
                        </p>
                      </div>

                      {primaryReason === reason.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Detailed Feedback */}
          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-white/80">
              Detailed Feedback * (minimum 20 characters)
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide specific, constructive feedback explaining why this video is being rejected. Be clear about what needs to be improved..."
              className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 min-h-32"
            />
            <div className="flex items-center justify-between text-xs">
              <p className="text-white/40">
                {feedback.length < 20 ? (
                  <span className="text-amber-400">
                    {20 - feedback.length} characters required
                  </span>
                ) : (
                  <span className="text-green-400">✓ Feedback length good</span>
                )}
              </p>
              <p className="text-white/40">{feedback.length} characters</p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label className="text-white/80">Rejection Options</Label>

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
                  Send feedback to {creatorName} via email
                </p>
              </div>
            </div>

            {/* Allow Resubmission */}
            <div
              className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg cursor-pointer hover:bg-white/[0.04] transition-colors"
              onClick={() => setAllowResubmission(!allowResubmission)}
            >
              <Checkbox
                checked={allowResubmission}
                onCheckedChange={setAllowResubmission}
                className="mt-0.5"
              />
              <div className="flex-1">
                <label className="text-sm text-white cursor-pointer font-medium block mb-1">
                  Allow Resubmission
                </label>
                <p className="text-xs text-white/60">
                  Creator can submit a new video addressing the feedback
                </p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="text-red-400 font-medium mb-1">Important:</p>
                <ul className="text-white/80 space-y-1">
                  <li>• Video will be permanently rejected and removed from campaign</li>
                  <li>• {creatorName} will receive detailed rejection feedback</li>
                  <li>
                    • {allowResubmission ? "Creator can submit a replacement video" : "Creator cannot resubmit"}
                  </li>
                  <li>• Campaign metrics will be updated</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isRejecting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            disabled={isRejecting || !isFormValid}
            variant="destructive"
          >
            {isRejecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Rejecting...
              </>
            ) : rejectionSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Rejected
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 mr-2" />
                Reject Video
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
