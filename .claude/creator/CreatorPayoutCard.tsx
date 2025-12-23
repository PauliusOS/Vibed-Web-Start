"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export interface CreatorPayoutCardProps {
  className?: string;
  availableBalance?: number;
  pendingBalance?: number;
  currency?: string;
  onSubmit?: (data: PayoutFormData) => void;
  onCancel?: () => void;
}

export interface PayoutFormData {
  amount: number;
  paymentMethod: string;
  accountHolder: string;
  accountNumber: string;
  routingNumber?: string;
  bankName?: string;
  email?: string;
}

// Payment method icons as SVG components
const BankIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21h18" />
    <path d="M3 10h18" />
    <path d="M5 6l7-3 7 3" />
    <path d="M4 10v11" />
    <path d="M20 10v11" />
    <path d="M8 14v3" />
    <path d="M12 14v3" />
    <path d="M16 14v3" />
  </svg>
);

const PayPalIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.768.768 0 0 1 .758-.648h6.35c2.116 0 3.59.377 4.383 1.12.766.72 1.04 1.73.817 3.005l-.021.125v.41c-.001 1.596-.562 2.846-1.665 3.713-1.067.838-2.612 1.264-4.59 1.264H9.164a.926.926 0 0 0-.913.778l-.738 4.692-.245 1.561a.483.483 0 0 1-.476.407h-.716z" />
    <path d="M18.583 7.666c-.006.055-.013.11-.02.166-.814 4.18-3.602 5.623-7.165 5.623h-1.814a.88.88 0 0 0-.869.743l-.93 5.893-.264 1.67a.463.463 0 0 0 .457.534h3.206a.77.77 0 0 0 .76-.65l.031-.166.602-3.813.039-.21a.77.77 0 0 1 .76-.65h.478c3.097 0 5.52-1.258 6.228-4.897.296-1.52.143-2.79-.64-3.682a3.05 3.05 0 0 0-.859-.561z" />
  </svg>
);

const WiseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const VenmoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.5 3c.9 1.5 1.3 3.1 1.3 5 0 3.9-3.3 9-6 12.5H7L4.5 3.8l6-.6 1.3 10.3c1.2-2 2.7-5.1 2.7-7.2 0-1.1-.2-1.9-.5-2.5L19.5 3z" />
  </svg>
);

const PAYMENT_METHODS = [
  { id: "bank", label: "Bank Transfer", Icon: BankIcon },
  { id: "paypal", label: "PayPal", Icon: PayPalIcon },
  { id: "wise", label: "Wise", Icon: WiseIcon },
  { id: "venmo", label: "Venmo", Icon: VenmoIcon },
];

const gentleEase = [0.25, 0.1, 0.25, 1];

/**
 * CreatorPayoutCard - Creator cash out / billing details form
 *
 * Features:
 * - Available balance display
 * - Payment method selection with proper icons
 * - Bank/account details form
 * - Animated form transitions
 */
export function CreatorPayoutCard({
  className,
  availableBalance = 2450.0,
  pendingBalance = 580.0,
  currency = "$",
  onSubmit,
  onCancel,
}: CreatorPayoutCardProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form fields
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [email, setEmail] = useState("");

  const handleAmountChange = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setAmount(cleaned);
  };

  const handleQuickAmount = (pct: number) => {
    const val = (availableBalance * pct).toFixed(2);
    setAmount(val);
  };

  const handleSubmit = async () => {
    if (!onSubmit) {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitting(false);
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        amount: parseFloat(amount),
        paymentMethod: selectedMethod,
        accountHolder,
        accountNumber,
        routingNumber,
        bankName,
        email,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedStep1 =
    selectedMethod &&
    parseFloat(amount) > 0 &&
    parseFloat(amount) <= availableBalance;
  const canSubmit =
    accountHolder &&
    (selectedMethod === "paypal" || selectedMethod === "venmo"
      ? email
      : accountNumber && routingNumber);

  return (
    <motion.div
      className={cn(
        "relative rounded-xl border backdrop-blur-xl overflow-hidden",
        className
      )}
      style={{
        background:
          "linear-gradient(145deg, rgba(10, 10, 14, 0.95) 0%, rgba(5, 8, 12, 0.92) 50%, rgba(8, 5, 14, 0.95) 100%)",
        borderColor: isHovered
          ? "rgba(34, 197, 94, 0.25)"
          : "rgba(255, 255, 255, 0.08)",
        boxShadow: isHovered
          ? "0 0 40px rgba(34, 197, 94, 0.1), 0 0 80px rgba(34, 197, 94, 0.05)"
          : "0 0 20px rgba(0, 0, 0, 0.2)",
        transition: "border-color 0.5s ease, box-shadow 0.6s ease",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: gentleEase }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-white">Cash Out</h3>
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full transition-colors"
              style={{ backgroundColor: "rgb(34, 197, 94)" }}
            />
            <div
              className="w-8 h-0.5 rounded-full transition-colors"
              style={{
                backgroundColor:
                  step === 2 ? "rgb(34, 197, 94)" : "rgba(255, 255, 255, 0.1)",
              }}
            />
            <div
              className="w-2 h-2 rounded-full transition-colors"
              style={{
                backgroundColor:
                  step === 2 ? "rgb(34, 197, 94)" : "rgba(255, 255, 255, 0.2)",
              }}
            />
          </div>
        </div>
        <p className="text-sm text-white/50">
          {step === 1
            ? "Select amount and payment method"
            : "Enter your payment details"}
        </p>
      </div>

      {/* Balance Display */}
      <div className="px-6 pb-4">
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: "rgba(34, 197, 94, 0.08)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/40 mb-0.5">Available Balance</p>
              <p className="text-2xl font-bold text-emerald-400">
                {currency}
                {availableBalance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40 mb-0.5">Pending</p>
              <p className="text-lg font-semibold text-white/60">
                {currency}
                {pendingBalance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 pb-6 min-h-[320px]">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-[320px] text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "rgba(34, 197, 94, 0.2)" }}
              >
                <Check className="w-8 h-8 text-emerald-400" />
              </motion.div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Payout Requested!
              </h4>
              <p className="text-sm text-white/60">
                {currency}
                {amount} will be transferred within 2-3 business days
              </p>
            </motion.div>
          ) : step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: gentleEase }}
              className="space-y-5"
            >
              {/* Amount Input */}
              <div className="space-y-2">
                <Label className="text-white/60">Amount to withdraw</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-white/40">
                    {currency}
                  </span>
                  <Input
                    type="text"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0.00"
                    className="pl-8 text-lg font-semibold h-12 bg-transparent border-white/10 text-white focus:border-emerald-500/50"
                  />
                </div>
                {/* Quick amount buttons */}
                <div className="flex gap-2 mt-2">
                  {[0.25, 0.5, 0.75, 1].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => handleQuickAmount(pct)}
                      className="flex-1 py-1.5 text-xs font-medium rounded-md transition-colors bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
                    >
                      {pct === 1 ? "Max" : `${pct * 100}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-2">
                <Label className="text-white/60">Payment Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = selectedMethod === method.id;
                    return (
                      <motion.button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg text-left transition-all border",
                          isSelected
                            ? "bg-emerald-500/10 border-emerald-500/30"
                            : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                        )}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                            isSelected ? "bg-emerald-500/20" : "bg-white/5"
                          )}
                        >
                          <method.Icon
                            className={cn(
                              "w-5 h-5",
                              isSelected
                                ? "text-emerald-400"
                                : "text-white/50"
                            )}
                          />
                        </div>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isSelected ? "text-emerald-400" : "text-white/70"
                          )}
                        >
                          {method.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: gentleEase }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label className="text-white/60">Account Holder Name</Label>
                <Input
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="John Doe"
                  className="bg-transparent border-white/10 text-white focus:border-emerald-500/50"
                />
              </div>

              {selectedMethod === "paypal" || selectedMethod === "venmo" ? (
                <div className="space-y-2">
                  <Label className="text-white/60">
                    {selectedMethod === "paypal" ? "PayPal" : "Venmo"} Email
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="bg-transparent border-white/10 text-white focus:border-emerald-500/50"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label className="text-white/60">Bank Name</Label>
                    <Input
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Chase, Bank of America, etc."
                      className="bg-transparent border-white/10 text-white focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-white/60">Account Number</Label>
                      <Input
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="XXXX XXXX 1234"
                        className="bg-transparent border-white/10 text-white focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/60">Routing Number</Label>
                      <Input
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                        placeholder="021000021"
                        className="bg-transparent border-white/10 text-white focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Summary */}
              <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Withdrawal Amount</span>
                  <span className="text-base font-semibold text-white">
                    {currency}
                    {parseFloat(amount || "0").toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-white/50">Payment Method</span>
                  <span className="text-sm font-medium text-white/80">
                    {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      {!isSuccess && (
        <div
          className="flex justify-between items-center p-4 border-t"
          style={{
            borderColor: "rgba(255, 255, 255, 0.06)",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        >
          {step === 1 ? (
            <>
              <Button
                variant="ghost"
                onClick={onCancel}
                className="text-white/60 hover:text-white hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="text-white/60 hover:text-white hover:bg-white/5"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    Withdraw {currency}
                    {amount}
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default CreatorPayoutCard;
