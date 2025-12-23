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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  X,
  DollarSign,
  User,
  Calendar,
  CreditCard,
  AlertCircle,
  FileText,
  ChevronLeft,
} from "lucide-react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface WithdrawalRequest {
  _id: string;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  creatorAvatar?: string;
  amount: number;
  requestedAt: number;
  paymentMethod: string;
  accountDetails: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
}

interface WithdrawalApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawal: WithdrawalRequest;
  onApprove: (data: ApprovalData) => Promise<void>;
  onReject: (reason: string) => Promise<void>;
}

interface ApprovalData {
  approvalNotes?: string;
  processingFee?: number;
  expectedDate: string;
}

export function WithdrawalApprovalDialog({
  open,
  onOpenChange,
  withdrawal,
  onApprove,
  onReject,
}: WithdrawalApprovalDialogProps) {
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingFee, setProcessingFee] = useState(0);
  const [expectedDate, setExpectedDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateApproval = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!expectedDate) {
      newErrors.expectedDate = "Expected payment date is required";
    }

    if (processingFee < 0) {
      newErrors.processingFee = "Processing fee cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRejection = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!rejectionReason.trim()) {
      newErrors.rejectionReason = "Rejection reason is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApprove = async () => {
    if (!validateApproval()) return;

    setIsProcessing(true);
    setProcessSuccess(false);

    try {
      await onApprove({
        approvalNotes,
        processingFee,
        expectedDate,
      });
      setProcessSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setProcessSuccess(false);
        setAction(null);
      }, 1500);
    } catch (error) {
      console.error("Failed to approve withdrawal:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!validateRejection()) return;

    setIsProcessing(true);
    setProcessSuccess(false);

    try {
      await onReject(rejectionReason);
      setProcessSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setProcessSuccess(false);
        setAction(null);
      }, 1500);
    } catch (error) {
      console.error("Failed to reject withdrawal:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const finalAmount = withdrawal.amount - processingFee;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-full ${
              action === "approve"
                ? "bg-green-500/20"
                : action === "reject"
                ? "bg-red-500/20"
                : "bg-amber-500/20"
            } flex items-center justify-center`}>
              {action === "approve" ? (
                <Check className="w-6 h-6 text-green-400" />
              ) : action === "reject" ? (
                <X className="w-6 h-6 text-red-400" />
              ) : (
                <DollarSign className="w-6 h-6 text-amber-400" />
              )}
            </div>
            <div>
              <DialogTitle>
                {action === "approve"
                  ? "Approve Withdrawal"
                  : action === "reject"
                  ? "Reject Withdrawal"
                  : "Review Withdrawal Request"}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Withdrawal request from {withdrawal.creatorName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-2">
          {/* Creator Info */}
          <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={withdrawal.creatorAvatar} />
                <AvatarFallback className="bg-purple-500/20 text-purple-400">
                  {withdrawal.creatorName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-medium">{withdrawal.creatorName}</p>
                <p className="text-white/60 text-sm">{withdrawal.creatorEmail}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-white/60">Requested Amount</span>
                </div>
                <p className="text-white font-semibold text-lg">
                  ${withdrawal.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-white/60">Requested On</span>
                </div>
                <p className="text-white">
                  {new Date(withdrawal.requestedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <span className="text-white/60">Payment Method</span>
                </div>
                <p className="text-white capitalize">
                  {withdrawal.paymentMethod.replace("_", " ")}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="text-white/60">Account Details</span>
                </div>
                <p className="text-white">{withdrawal.accountDetails}</p>
              </div>
            </div>

            {withdrawal.notes && (
              <div className="mt-4 p-3 bg-white/[0.02] rounded-lg">
                <p className="text-white/60 text-xs mb-1">Creator Notes:</p>
                <p className="text-white text-sm">{withdrawal.notes}</p>
              </div>
            )}
          </div>

          {/* Action Selection */}
          {!action && (
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setAction("approve")}
                className="h-20 bg-green-500 hover:bg-green-600 text-white"
              >
                <div className="text-center">
                  <Check className="w-6 h-6 mx-auto mb-1" />
                  <p className="font-semibold">Approve</p>
                </div>
              </Button>
              <Button
                onClick={() => setAction("reject")}
                variant="destructive"
                className="h-20"
              >
                <div className="text-center">
                  <X className="w-6 h-6 mx-auto mb-1" />
                  <p className="font-semibold">Reject</p>
                </div>
              </Button>
            </div>
          )}

          {/* Approval Form */}
          {action === "approve" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="expectedDate" className="text-white/80">
                  Expected Payment Date *
                </Label>
                <Input
                  id="expectedDate"
                  type="date"
                  value={expectedDate}
                  onChange={(e) => {
                    setExpectedDate(e.target.value);
                    if (errors.expectedDate) {
                      setErrors({ ...errors, expectedDate: "" });
                    }
                  }}
                  className={`bg-white/[0.02] border-white/[0.06] text-white ${
                    errors.expectedDate ? "border-red-500" : ""
                  }`}
                />
                {errors.expectedDate && (
                  <p className="text-red-400 text-xs">{errors.expectedDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="processingFee" className="text-white/80">
                  Processing Fee (Optional)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    id="processingFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={processingFee}
                    onChange={(e) => {
                      setProcessingFee(Number(e.target.value));
                      if (errors.processingFee) {
                        setErrors({ ...errors, processingFee: "" });
                      }
                    }}
                    className={`pl-10 bg-white/[0.02] border-white/[0.06] text-white ${
                      errors.processingFee ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.processingFee && (
                  <p className="text-red-400 text-xs">{errors.processingFee}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="approvalNotes" className="text-white/80">
                  Approval Notes (Optional)
                </Label>
                <Textarea
                  id="approvalNotes"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Additional notes for the creator..."
                  className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 min-h-20"
                />
              </div>

              {/* Approval Summary */}
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm">
                    <p className="text-green-400 font-medium mb-1">
                      Approval Summary:
                    </p>
                    <ul className="text-white/80 space-y-1">
                      <li>• Original amount: ${withdrawal.amount.toFixed(2)}</li>
                      {processingFee > 0 && (
                        <li>• Processing fee: ${processingFee.toFixed(2)}</li>
                      )}
                      <li className="font-semibold">
                        • Final payout: ${finalAmount.toFixed(2)}
                      </li>
                      <li>
                        • Expected by:{" "}
                        {new Date(expectedDate).toLocaleDateString()}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rejection Form */}
          {action === "reject" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="rejectionReason" className="text-white/80">
                  Reason for Rejection *
                </Label>
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    if (errors.rejectionReason) {
                      setErrors({ ...errors, rejectionReason: "" });
                    }
                  }}
                  placeholder="Explain why this withdrawal is being rejected..."
                  className={`bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 min-h-24 ${
                    errors.rejectionReason ? "border-red-500" : ""
                  }`}
                />
                {errors.rejectionReason && (
                  <p className="text-red-400 text-xs">{errors.rejectionReason}</p>
                )}
              </div>

              {/* Rejection Warning */}
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm">
                    <p className="text-red-400 font-medium mb-1">Warning:</p>
                    <ul className="text-white/80 space-y-1">
                      <li>
                        • {withdrawal.creatorName} will be notified of the rejection
                      </li>
                      <li>• The reason will be shared with the creator</li>
                      <li>• Creator can submit a new withdrawal request</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <DialogFooter>
          {action ? (
            <>
              <Button
                variant="outline"
                onClick={() => setAction(null)}
                disabled={isProcessing}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={action === "approve" ? handleApprove : handleReject}
                disabled={isProcessing}
                className={`${
                  processSuccess
                    ? "bg-green-500 hover:bg-green-600"
                    : action === "approve"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                } text-white`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : processSuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Done!
                  </>
                ) : action === "approve" ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Approve Withdrawal
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Reject Withdrawal
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
