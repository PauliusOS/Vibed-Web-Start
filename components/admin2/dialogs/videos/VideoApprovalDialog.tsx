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
import {
  Check,
  CheckCircle,
  Mail,
  Bell,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

interface VideoApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoTitle: string;
  creatorName: string;
  onApprove: (data: {
    notes: string;
    notifyCreator: boolean;
    schedulePublication: boolean;
    publicationDate?: Date;
  }) => Promise<void>;
}

export function VideoApprovalDialog({
  open,
  onOpenChange,
  videoTitle,
  creatorName,
  onApprove,
}: VideoApprovalDialogProps) {
  const [notes, setNotes] = useState("");
  const [notifyCreator, setNotifyCreator] = useState(true);
  const [schedulePublication, setSchedulePublication] = useState(false);
  const [publicationDate, setPublicationDate] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [approvalSuccess, setApprovalSuccess] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    setApprovalSuccess(false);

    try {
      await onApprove({
        notes,
        notifyCreator,
        schedulePublication,
        publicationDate: publicationDate ? new Date(publicationDate) : undefined,
      });
      setApprovalSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setApprovalSuccess(false);
        // Reset form
        setNotes("");
        setNotifyCreator(true);
        setSchedulePublication(false);
        setPublicationDate("");
      }, 1500);
    } catch (error) {
      console.error("Approval failed:", error);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <DialogTitle>Approve Video</DialogTitle>
              <DialogDescription className="mt-1">
                Approve "{videoTitle}" by {creatorName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Approval Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white/80">
              Approval Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any positive feedback or notes for the creator..."
              className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 min-h-24"
            />
            <p className="text-xs text-white/40">
              These notes will be shared with the creator if notifications are enabled
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label className="text-white/80">Approval Options</Label>

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
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <label className="text-sm text-white cursor-pointer font-medium">
                    Notify Creator
                  </label>
                </div>
                <p className="text-xs text-white/60">
                  Send an email notification to {creatorName} about the approval
                </p>
              </div>
            </div>

            {/* Schedule Publication */}
            <div
              className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg cursor-pointer hover:bg-white/[0.04] transition-colors"
              onClick={() => setSchedulePublication(!schedulePublication)}
            >
              <Checkbox
                checked={schedulePublication}
                onCheckedChange={setSchedulePublication}
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <label className="text-sm text-white cursor-pointer font-medium">
                    Schedule Publication
                  </label>
                </div>
                <p className="text-xs text-white/60 mb-2">
                  Set a specific date and time for the video to go live
                </p>

                {schedulePublication && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="datetime-local"
                      value={publicationDate}
                      onChange={(e) => setPublicationDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Success Preview */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="text-green-400 font-medium mb-1">
                  What happens next:
                </p>
                <ul className="text-white/80 space-y-1">
                  <li>• Video status will be set to "Approved"</li>
                  {schedulePublication && publicationDate ? (
                    <li>
                      • Video will be published on{" "}
                      {new Date(publicationDate).toLocaleString()}
                    </li>
                  ) : (
                    <li>• Video will be immediately available for publication</li>
                  )}
                  {notifyCreator && (
                    <li>• {creatorName} will receive an approval notification</li>
                  )}
                  <li>• Campaign metrics will be updated</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isApproving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isApproving || (schedulePublication && !publicationDate)}
            className={`${
              approvalSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {isApproving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Approving...
              </>
            ) : approvalSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Approved!
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Video
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
