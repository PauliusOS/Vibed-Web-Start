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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Check,
  DollarSign,
  Repeat,
  User,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Creator {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface PaymentScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creator: Creator;
  onSchedule: (scheduleData: ScheduleData) => Promise<void>;
}

export interface ScheduleData {
  amount: number;
  frequency: string;
  startDate: string;
  endDate?: string;
  occurrences?: number;
  paymentMethod: string;
  notes?: string;
}

export function PaymentScheduleDialog({
  open,
  onOpenChange,
  creator,
  onSchedule,
}: PaymentScheduleDialogProps) {
  const [amount, setAmount] = useState(0);
  const [frequency, setFrequency] = useState("monthly");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endType, setEndType] = useState<"never" | "date" | "occurrences">("never");
  const [endDate, setEndDate] = useState("");
  const [occurrences, setOccurrences] = useState(12);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [notes, setNotes] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (endType === "date" && !endDate) {
      newErrors.endDate = "End date is required";
    }

    if (endType === "date" && endDate && new Date(endDate) <= new Date(startDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    if (endType === "occurrences" && occurrences <= 0) {
      newErrors.occurrences = "Occurrences must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSchedule = async () => {
    if (!validateForm()) return;

    setIsScheduling(true);
    setScheduleSuccess(false);

    try {
      await onSchedule({
        amount,
        frequency,
        startDate,
        endDate: endType === "date" ? endDate : undefined,
        occurrences: endType === "occurrences" ? occurrences : undefined,
        paymentMethod,
        notes,
      });
      setScheduleSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setScheduleSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to schedule payment:", error);
    } finally {
      setIsScheduling(false);
    }
  };

  const frequencyConfig = {
    weekly: { label: "Weekly", description: "Every week" },
    biweekly: { label: "Bi-weekly", description: "Every 2 weeks" },
    monthly: { label: "Monthly", description: "Every month" },
    quarterly: { label: "Quarterly", description: "Every 3 months" },
    yearly: { label: "Yearly", description: "Every year" },
  };

  const calculateTotalPayments = (): number => {
    if (endType === "occurrences") return occurrences;
    if (endType === "never") return Infinity;

    // Calculate based on frequency and date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (frequency) {
      case "weekly":
        return Math.floor(diffDays / 7);
      case "biweekly":
        return Math.floor(diffDays / 14);
      case "monthly":
        return Math.floor(diffDays / 30);
      case "quarterly":
        return Math.floor(diffDays / 90);
      case "yearly":
        return Math.floor(diffDays / 365);
      default:
        return 0;
    }
  };

  const totalPayments = calculateTotalPayments();
  const totalAmount = totalPayments === Infinity ? Infinity : totalPayments * amount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Repeat className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <DialogTitle>Schedule Recurring Payment</DialogTitle>
              <DialogDescription className="mt-1">
                Set up automatic recurring payments for {creator.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-2">
          {/* Creator Info */}
          <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={creator.avatar} />
                <AvatarFallback className="bg-purple-500/20 text-purple-400">
                  {creator.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-white/60">Creator</span>
                </div>
                <p className="text-white font-medium">{creator.name}</p>
                <p className="text-white/60 text-sm">{creator.email}</p>
              </div>
            </div>
          </div>

          {/* Payment Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-white/80">
              Payment Amount *
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => {
                  setAmount(Number(e.target.value));
                  if (errors.amount) {
                    setErrors({ ...errors, amount: "" });
                  }
                }}
                className={`pl-10 bg-white/[0.02] border-white/[0.06] text-white ${
                  errors.amount ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.amount && <p className="text-red-400 text-xs">{errors.amount}</p>}
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-white/80">
              Payment Frequency *
            </Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(frequencyConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div>
                      <p>{config.label}</p>
                      <p className="text-xs text-white/60">{config.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-white/80">
              Start Date *
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (errors.startDate) {
                  setErrors({ ...errors, startDate: "" });
                }
              }}
              className={`bg-white/[0.02] border-white/[0.06] text-white ${
                errors.startDate ? "border-red-500" : ""
              }`}
            />
            {errors.startDate && (
              <p className="text-red-400 text-xs">{errors.startDate}</p>
            )}
          </div>

          {/* End Condition */}
          <div className="space-y-4">
            <Label className="text-white/80">End Condition</Label>

            <div className="space-y-3">
              <div
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  endType === "never"
                    ? "border-blue-500/50 bg-blue-500/10"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
                onClick={() => setEndType("never")}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={endType === "never"}
                    onChange={() => setEndType("never")}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-white font-medium">Never ends</p>
                    <p className="text-white/60 text-xs">
                      Payment continues indefinitely until manually stopped
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  endType === "date"
                    ? "border-blue-500/50 bg-blue-500/10"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
                onClick={() => setEndType("date")}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={endType === "date"}
                    onChange={() => setEndType("date")}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium mb-2">End on specific date</p>
                    {endType === "date" && (
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          if (errors.endDate) {
                            setErrors({ ...errors, endDate: "" });
                          }
                        }}
                        className={`bg-white/[0.02] border-white/[0.06] text-white ${
                          errors.endDate ? "border-red-500" : ""
                        }`}
                      />
                    )}
                    {errors.endDate && (
                      <p className="text-red-400 text-xs mt-1">{errors.endDate}</p>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  endType === "occurrences"
                    ? "border-blue-500/50 bg-blue-500/10"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
                onClick={() => setEndType("occurrences")}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={endType === "occurrences"}
                    onChange={() => setEndType("occurrences")}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium mb-2">
                      End after number of payments
                    </p>
                    {endType === "occurrences" && (
                      <Input
                        type="number"
                        min="1"
                        value={occurrences}
                        onChange={(e) => {
                          setOccurrences(Number(e.target.value));
                          if (errors.occurrences) {
                            setErrors({ ...errors, occurrences: "" });
                          }
                        }}
                        className={`bg-white/[0.02] border-white/[0.06] text-white ${
                          errors.occurrences ? "border-red-500" : ""
                        }`}
                      />
                    )}
                    {errors.occurrences && (
                      <p className="text-red-400 text-xs mt-1">{errors.occurrences}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod" className="text-white/80">
              Payment Method *
            </Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="wire">Wire Transfer</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white/80">
              Notes (Optional)
            </Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Payment schedule reference..."
              className="bg-white/[0.02] border-white/[0.06] text-white"
            />
          </div>

          {/* Summary */}
          {amount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <Repeat className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="text-blue-400 font-medium mb-1">Schedule Summary:</p>
                  <ul className="text-white/80 space-y-1">
                    <li>• ${amount.toFixed(2)} per payment</li>
                    <li>
                      • {frequencyConfig[frequency as keyof typeof frequencyConfig].label}{" "}
                      frequency
                    </li>
                    <li>• Starts on {new Date(startDate).toLocaleDateString()}</li>
                    {endType === "never" && <li>• Continues until manually stopped</li>}
                    {endType === "date" && (
                      <li>• Ends on {new Date(endDate).toLocaleDateString()}</li>
                    )}
                    {endType === "occurrences" && (
                      <li>• Ends after {occurrences} payments</li>
                    )}
                    {totalPayments !== Infinity && (
                      <li className="font-semibold">
                        • Total: {totalPayments} payment
                        {totalPayments !== 1 ? "s" : ""} = $
                        {totalAmount.toFixed(2)}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isScheduling}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={isScheduling || amount <= 0}
            className={`${
              scheduleSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isScheduling ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Scheduling...
              </>
            ) : scheduleSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Scheduled!
              </>
            ) : (
              <>
                <Repeat className="w-4 h-4 mr-2" />
                Schedule Payments
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
