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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Check,
  Users,
  CreditCard,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Creator {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  pendingPayment: number;
}

interface BulkPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creators: Creator[];
  onProcess: (data: BulkPaymentData) => Promise<void>;
}

export interface BulkPaymentData {
  creatorIds: string[];
  paymentMethod: string;
  paymentDate: string;
  notes?: string;
}

export function BulkPaymentDialog({
  open,
  onOpenChange,
  creators,
  onProcess,
}: BulkPaymentDialogProps) {
  const [selectedCreators, setSelectedCreators] = useState<Set<string>>(
    new Set(creators.map((c) => c._id))
  );
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);

  const toggleCreator = (creatorId: string) => {
    const newSelection = new Set(selectedCreators);
    if (newSelection.has(creatorId)) {
      newSelection.delete(creatorId);
    } else {
      newSelection.add(creatorId);
    }
    setSelectedCreators(newSelection);
  };

  const selectAll = () => {
    setSelectedCreators(new Set(creators.map((c) => c._id)));
  };

  const deselectAll = () => {
    setSelectedCreators(new Set());
  };

  const selectedCreatorsList = creators.filter((c) =>
    selectedCreators.has(c._id)
  );

  const totalAmount = selectedCreatorsList.reduce(
    (sum, creator) => sum + creator.pendingPayment,
    0
  );

  const handleProcess = async () => {
    if (selectedCreators.size === 0) return;

    setIsProcessing(true);
    setProcessSuccess(false);

    try {
      await onProcess({
        creatorIds: Array.from(selectedCreators),
        paymentMethod,
        paymentDate,
        notes,
      });
      setProcessSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setProcessSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to process bulk payment:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethodConfig = {
    bank_transfer: "Bank Transfer",
    wire: "Wire Transfer",
    paypal: "PayPal",
    stripe: "Stripe",
    check: "Check",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <DialogTitle>Bulk Payment Processing</DialogTitle>
              <DialogDescription className="mt-1">
                Process payments for multiple creators at once
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-2">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-white/60 text-sm">Selected</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {selectedCreators.size}
              </p>
              <p className="text-xs text-white/60">of {creators.length} creators</p>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-white/60 text-sm">Total Amount</span>
              </div>
              <p className="text-2xl font-bold text-white">
                ${totalAmount.toFixed(2)}
              </p>
              <p className="text-xs text-white/60">To be paid</p>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span className="text-white/60 text-sm">Method</span>
              </div>
              <p className="text-lg font-semibold text-white capitalize">
                {paymentMethodConfig[paymentMethod as keyof typeof paymentMethodConfig]}
              </p>
            </div>
          </div>

          {/* Creator Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-white/80">
                Select Creators ({selectedCreators.size} selected)
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAll}
                  className="text-xs"
                >
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deselectAll}
                  className="text-xs"
                >
                  Deselect All
                </Button>
              </div>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              <AnimatePresence>
                {creators.map((creator, index) => {
                  const isSelected = selectedCreators.has(creator._id);

                  return (
                    <motion.div
                      key={creator._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => toggleCreator(creator._id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-green-500/50 bg-green-500/10"
                          : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleCreator(creator._id)}
                      />

                      <Avatar className="w-10 h-10">
                        <AvatarImage src={creator.avatar} />
                        <AvatarFallback className="bg-purple-500/20 text-purple-400">
                          {creator.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <p className="text-white font-medium">{creator.name}</p>
                        <p className="text-white/60 text-sm">{creator.email}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-green-400 font-semibold">
                          ${creator.pendingPayment.toFixed(2)}
                        </p>
                        <p className="text-white/60 text-xs">Pending</p>
                      </div>

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <h4 className="text-white font-medium">Payment Details</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="text-white/80">
                  Payment Method *
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(paymentMethodConfig).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentDate" className="text-white/80">
                  Payment Date *
                </Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="bg-white/[0.02] border-white/[0.06] text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-white/80">
                Notes (Optional)
              </Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Batch payment reference or notes..."
                className="bg-white/[0.02] border-white/[0.06] text-white"
              />
            </div>
          </div>

          {/* Warning */}
          {selectedCreators.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="text-amber-400 font-medium mb-1">Important:</p>
                  <ul className="text-white/80 space-y-1">
                    <li>
                      • {selectedCreators.size} payment
                      {selectedCreators.size !== 1 ? "s" : ""} will be processed
                    </li>
                    <li>• Total amount: ${totalAmount.toFixed(2)}</li>
                    <li>• All payments will use the same payment method and date</li>
                    <li>• Creators will be notified individually</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Summary */}
          {selectedCreators.size > 0 && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center justify-between text-white mb-3">
                <span className="font-medium">Payment Summary</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-white/80">
                  <span>Number of payments:</span>
                  <span>{selectedCreators.size}</span>
                </div>
                <div className="flex items-center justify-between text-white/80">
                  <span>Payment method:</span>
                  <span className="capitalize">
                    {paymentMethodConfig[paymentMethod as keyof typeof paymentMethodConfig]}
                  </span>
                </div>
                <div className="flex items-center justify-between text-white/80">
                  <span>Payment date:</span>
                  <span>{new Date(paymentDate).toLocaleDateString()}</span>
                </div>
                <div className="border-t border-white/[0.1] pt-2 mt-2">
                  <div className="flex items-center justify-between text-white font-semibold text-lg">
                    <span>Total Amount:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleProcess}
            disabled={isProcessing || selectedCreators.size === 0}
            className={`${
              processSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-green-500 hover:bg-green-600"
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
                Processed!
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4 mr-2" />
                Process {selectedCreators.size} Payment
                {selectedCreators.size !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
