"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CreditCard,
  Plus,
  MoreVertical,
  Trash2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface PaymentMethod {
  id: string;
  type: "card" | "bank";
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

interface PaymentMethodManagerProps {
  paymentMethods: PaymentMethod[];
  onAddPaymentMethod: () => void;
  onRemovePaymentMethod: (id: string) => void;
  onSetDefaultPaymentMethod: (id: string) => void;
}

export function PaymentMethodManager({
  paymentMethods,
  onAddPaymentMethod,
  onRemovePaymentMethod,
  onSetDefaultPaymentMethod,
}: PaymentMethodManagerProps) {
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [methodToRemove, setMethodToRemove] = useState<PaymentMethod | null>(null);

  const getCardIcon = (brand: string) => {
    // In a real app, you'd return different icons for different card brands
    return CreditCard;
  };

  const handleRemoveClick = (method: PaymentMethod) => {
    setMethodToRemove(method);
    setShowRemoveDialog(true);
  };

  const handleConfirmRemove = () => {
    if (methodToRemove) {
      onRemovePaymentMethod(methodToRemove.id);
      setShowRemoveDialog(false);
      setMethodToRemove(null);
    }
  };

  const isExpiringSoon = (month: number, year: number) => {
    const now = new Date();
    const expiry = new Date(year, month - 1);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiry <= threeMonthsFromNow && expiry > now;
  };

  const isExpired = (month: number, year: number) => {
    const now = new Date();
    const expiry = new Date(year, month);
    return expiry < now;
  };

  return (
    <>
      <GlassPanel className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
              <p className="text-sm text-white/60">Manage your payment methods</p>
            </div>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onAddPaymentMethod}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Method
          </Button>
        </div>

        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const CardIcon = getCardIcon(method.brand);
            const expired = isExpired(method.expiryMonth, method.expiryYear);
            const expiringSoon = isExpiringSoon(method.expiryMonth, method.expiryYear);

            return (
              <div
                key={method.id}
                className={`p-4 rounded-lg border transition-colors ${
                  method.isDefault
                    ? "bg-blue-500/10 border-blue-500/30"
                    : expired
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        method.isDefault
                          ? "bg-blue-500/20"
                          : expired
                          ? "bg-red-500/20"
                          : "bg-white/10"
                      }`}
                    >
                      <CardIcon
                        className={`w-5 h-5 ${
                          method.isDefault
                            ? "text-blue-400"
                            : expired
                            ? "text-red-400"
                            : "text-white/60"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium capitalize">
                          {method.brand} •••• {method.last4}
                        </p>
                        {method.isDefault && (
                          <Badge
                            variant="outline"
                            className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                          >
                            Default
                          </Badge>
                        )}
                        {expired && (
                          <Badge
                            variant="outline"
                            className="bg-red-500/20 text-red-400 border-red-500/30"
                          >
                            Expired
                          </Badge>
                        )}
                        {expiringSoon && !expired && (
                          <Badge
                            variant="outline"
                            className="bg-amber-500/20 text-amber-400 border-amber-500/30"
                          >
                            Expiring Soon
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/60">
                        Expires {method.expiryMonth.toString().padStart(2, "0")}/{method.expiryYear}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4 text-white/60" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-900 border-white/10">
                      {!method.isDefault && (
                        <DropdownMenuItem
                          className="text-white/80 hover:text-white focus:text-white"
                          onClick={() => onSetDefaultPaymentMethod(method.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Set as Default
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-red-400 hover:text-red-300 focus:text-red-300"
                        onClick={() => handleRemoveClick(method)}
                        disabled={method.isDefault && paymentMethods.length > 1}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>

        {paymentMethods.length === 0 && (
          <div className="text-center py-8 text-white/40">
            <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No payment methods added</p>
            <p className="text-sm mt-1">Add a payment method to manage your subscription</p>
          </div>
        )}
      </GlassPanel>

      {/* Remove Payment Method Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent className="bg-gray-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Remove Payment Method?
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Are you sure you want to remove the card ending in {methodToRemove?.last4}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowRemoveDialog(false)}
              className="text-white/60"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
