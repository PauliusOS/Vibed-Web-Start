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
  CreditCard,
  Check,
  DollarSign,
  Upload,
  FileText,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";

interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: "pending" | "partial" | "paid";
}

interface PaymentProcessingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice;
  onProcess: (paymentData: PaymentData) => Promise<void>;
}

export interface PaymentData {
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  paymentDate: string;
  notes?: string;
  receiptUrl?: string;
}

export function PaymentProcessingDialog({
  open,
  onOpenChange,
  invoice,
  onProcess,
}: PaymentProcessingDialogProps) {
  const [amount, setAmount] = useState(invoice.remainingAmount);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (amount > invoice.remainingAmount) {
      newErrors.amount = `Amount cannot exceed remaining balance of $${invoice.remainingAmount.toFixed(2)}`;
    }

    if (!paymentDate) {
      newErrors.paymentDate = "Payment date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProcess = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setProcessSuccess(false);

    try {
      await onProcess({
        amount,
        paymentMethod,
        transactionId,
        paymentDate,
        notes,
        receiptUrl,
      });
      setProcessSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setProcessSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to process payment:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethodConfig = {
    bank_transfer: { label: "Bank Transfer", icon: DollarSign },
    credit_card: { label: "Credit Card", icon: CreditCard },
    check: { label: "Check", icon: FileText },
    cash: { label: "Cash", icon: DollarSign },
    wire: { label: "Wire Transfer", icon: DollarSign },
    other: { label: "Other", icon: DollarSign },
  };

  const isFullPayment = amount === invoice.remainingAmount;
  const isPartialPayment = amount > 0 && amount < invoice.remainingAmount;
  const newRemainingAmount = invoice.remainingAmount - amount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <DialogTitle>Process Payment</DialogTitle>
              <DialogDescription className="mt-1">
                Record payment for Invoice #{invoice.invoiceNumber}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-2">
          {/* Invoice Summary */}
          <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
            <h4 className="text-white font-medium mb-3">Invoice Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/60 mb-1">Client</p>
                <p className="text-white font-medium">{invoice.clientName}</p>
              </div>
              <div>
                <p className="text-white/60 mb-1">Invoice Number</p>
                <p className="text-white font-medium">#{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-white/60 mb-1">Total Amount</p>
                <p className="text-white font-medium">
                  ${invoice.totalAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-white/60 mb-1">Remaining Balance</p>
                <p className="text-green-400 font-semibold">
                  ${invoice.remainingAmount.toFixed(2)}
                </p>
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
                max={invoice.remainingAmount}
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
            {errors.amount && (
              <p className="text-red-400 text-xs">{errors.amount}</p>
            )}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmount(invoice.remainingAmount)}
                className="text-xs"
              >
                Pay in Full
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmount(invoice.remainingAmount / 2)}
                className="text-xs"
              >
                Pay 50%
              </Button>
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
                {Object.entries(paymentMethodConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transaction ID */}
          <div className="space-y-2">
            <Label htmlFor="transactionId" className="text-white/80">
              Transaction ID (Optional)
            </Label>
            <Input
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g., TXN-123456"
              className="bg-white/[0.02] border-white/[0.06] text-white"
            />
          </div>

          {/* Payment Date */}
          <div className="space-y-2">
            <Label htmlFor="paymentDate" className="text-white/80">
              Payment Date *
            </Label>
            <Input
              id="paymentDate"
              type="date"
              value={paymentDate}
              onChange={(e) => {
                setPaymentDate(e.target.value);
                if (errors.paymentDate) {
                  setErrors({ ...errors, paymentDate: "" });
                }
              }}
              className={`bg-white/[0.02] border-white/[0.06] text-white ${
                errors.paymentDate ? "border-red-500" : ""
              }`}
            />
            {errors.paymentDate && (
              <p className="text-red-400 text-xs">{errors.paymentDate}</p>
            )}
          </div>

          {/* Receipt Upload */}
          <div className="space-y-2">
            <Label htmlFor="receipt" className="text-white/80">
              Payment Receipt (Optional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="receipt"
                value={receiptUrl}
                onChange={(e) => setReceiptUrl(e.target.value)}
                placeholder="Receipt URL or file path"
                className="bg-white/[0.02] border-white/[0.06] text-white flex-1"
              />
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white/80">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes about this payment..."
              className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 min-h-20"
            />
          </div>

          {/* Payment Summary */}
          {amount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                isPartialPayment
                  ? "bg-amber-500/10 border border-amber-500/20"
                  : "bg-green-500/10 border border-green-500/20"
              }`}
            >
              <div className="flex items-start gap-3">
                {isPartialPayment ? (
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 text-sm">
                  <p
                    className={`font-medium mb-1 ${
                      isPartialPayment ? "text-amber-400" : "text-green-400"
                    }`}
                  >
                    {isFullPayment ? "Full Payment" : "Partial Payment"}
                  </p>
                  <ul className="text-white/80 space-y-1">
                    <li>• Payment of ${amount.toFixed(2)} will be recorded</li>
                    {isFullPayment ? (
                      <li>• Invoice will be marked as fully paid</li>
                    ) : (
                      <>
                        <li>
                          • Remaining balance: ${newRemainingAmount.toFixed(2)}
                        </li>
                        <li>• Invoice will be marked as partially paid</li>
                      </>
                    )}
                    <li>
                      • Payment method: {paymentMethodConfig[paymentMethod as keyof typeof paymentMethodConfig].label}
                    </li>
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
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleProcess}
            disabled={isProcessing || amount <= 0}
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
                Process Payment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
