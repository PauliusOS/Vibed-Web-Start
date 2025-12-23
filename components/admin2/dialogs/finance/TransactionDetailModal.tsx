"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  Calendar,
  CreditCard,
  User,
  FileText,
  Download,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Transaction {
  _id: string;
  type: "payment" | "withdrawal" | "refund" | "fee";
  status: "completed" | "pending" | "failed";
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId?: string;
  invoiceId?: string;
  invoiceNumber?: string;

  // Parties involved
  fromName: string;
  fromEmail: string;
  fromAvatar?: string;
  toName: string;
  toEmail: string;
  toAvatar?: string;

  // Dates
  createdAt: number;
  completedAt?: number;

  // Additional details
  description?: string;
  notes?: string;
  receiptUrl?: string;
  metadata?: Record<string, any>;
}

interface TransactionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
}

export function TransactionDetailModal({
  open,
  onOpenChange,
  transaction,
}: TransactionDetailModalProps) {
  const [activeTab, setActiveTab] = useState("details");

  const statusConfig = {
    completed: {
      label: "Completed",
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-500/20",
      border: "border-green-500/30",
    },
    pending: {
      label: "Pending",
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/20",
      border: "border-amber-500/30",
    },
    failed: {
      label: "Failed",
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-500/20",
      border: "border-red-500/30",
    },
  };

  const typeConfig = {
    payment: { label: "Payment", color: "text-green-400" },
    withdrawal: { label: "Withdrawal", color: "text-blue-400" },
    refund: { label: "Refund", color: "text-amber-400" },
    fee: { label: "Fee", color: "text-purple-400" },
  };

  const config = statusConfig[transaction.status];
  const StatusIcon = config.icon;
  const typeInfo = typeConfig[transaction.type];

  // Mock activity log
  const activityLog = [
    {
      id: "1",
      action: "Transaction initiated",
      timestamp: transaction.createdAt,
      user: "System",
    },
    {
      id: "2",
      action: "Payment method verified",
      timestamp: transaction.createdAt + 5000,
      user: "System",
    },
    {
      id: "3",
      action: transaction.status === "completed" ? "Payment processed successfully" : "Processing payment",
      timestamp: transaction.completedAt || transaction.createdAt + 10000,
      user: "System",
    },
  ];

  if (transaction.status === "completed" && transaction.completedAt) {
    activityLog.push({
      id: "4",
      action: "Receipt generated",
      timestamp: transaction.completedAt + 1000,
      user: "System",
    });
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl mb-2">
                Transaction Details
              </DialogTitle>
              <div className="flex items-center gap-3">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded ${config.bg} ${config.border}`}>
                  <StatusIcon className={`w-4 h-4 ${config.color}`} />
                  <span className={`text-sm font-medium ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <div className="px-3 py-1 rounded bg-white/[0.05] border border-white/[0.1]">
                  <span className={`text-sm font-medium ${typeInfo.color}`}>
                    {typeInfo.label}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm mb-1">Transaction ID</p>
              <p className="text-white font-mono text-sm">
                {transaction.transactionId || transaction._id}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Amount Display */}
        <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Amount</p>
              <div className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-400" />
                <p className="text-3xl font-bold text-white">
                  {transaction.amount.toFixed(2)}
                </p>
                <span className="text-white/60 text-lg">{transaction.currency}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm mb-1">Payment Method</p>
              <div className="flex items-center gap-2 justify-end">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <p className="text-white capitalize">
                  {transaction.paymentMethod.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="bg-white/[0.02] border-b border-white/[0.06] rounded-none w-full justify-start">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="parties">Parties</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto py-4">
            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4 m-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-white/60 text-sm">Created</span>
                  </div>
                  <p className="text-white font-medium">
                    {formatTimestamp(transaction.createdAt)}
                  </p>
                </div>

                {transaction.completedAt && (
                  <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white/60 text-sm">Completed</span>
                    </div>
                    <p className="text-white font-medium">
                      {formatTimestamp(transaction.completedAt)}
                    </p>
                  </div>
                )}

                {transaction.invoiceNumber && (
                  <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span className="text-white/60 text-sm">Invoice</span>
                    </div>
                    <p className="text-white font-medium">
                      #{transaction.invoiceNumber}
                    </p>
                  </div>
                )}

                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-blue-400" />
                    <span className="text-white/60 text-sm">Payment Method</span>
                  </div>
                  <p className="text-white font-medium capitalize">
                    {transaction.paymentMethod.replace("_", " ")}
                  </p>
                </div>
              </div>

              {transaction.description && (
                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <p className="text-white/60 text-sm mb-2">Description</p>
                  <p className="text-white">{transaction.description}</p>
                </div>
              )}

              {transaction.notes && (
                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <p className="text-white/60 text-sm mb-2">Notes</p>
                  <p className="text-white">{transaction.notes}</p>
                </div>
              )}

              {transaction.receiptUrl && (
                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium mb-1">Receipt</p>
                      <p className="text-white/60 text-sm">
                        Download transaction receipt
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              )}

              {transaction.metadata && (
                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <p className="text-white/60 text-sm mb-3">Additional Information</p>
                  <div className="space-y-2">
                    {Object.entries(transaction.metadata).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-white/60 capitalize">
                          {key.replace("_", " ")}:
                        </span>
                        <span className="text-white font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Parties Tab */}
            <TabsContent value="parties" className="space-y-4 m-0">
              {/* From */}
              <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                <p className="text-white/60 text-sm mb-3">From</p>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={transaction.fromAvatar} />
                    <AvatarFallback className="bg-purple-500/20 text-purple-400">
                      {transaction.fromName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">{transaction.fromName}</p>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <Mail className="w-3 h-3" />
                      <span>{transaction.fromEmail}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* To */}
              <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                <p className="text-white/60 text-sm mb-3">To</p>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={transaction.toAvatar} />
                    <AvatarFallback className="bg-green-500/20 text-green-400">
                      {transaction.toName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">{transaction.toName}</p>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <Mail className="w-3 h-3" />
                      <span>{transaction.toEmail}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Flow Visualization */}
              <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-2">
                      <AvatarImage src={transaction.fromAvatar} />
                      <AvatarFallback className="bg-purple-500/20 text-purple-400">
                        {transaction.fromName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-white font-medium text-sm">
                      {transaction.fromName}
                    </p>
                  </div>

                  <div className="flex-1 px-8">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-0.5 bg-green-500" />
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-white font-semibold">
                          ${transaction.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex-1 h-0.5 bg-green-500" />
                    </div>
                  </div>

                  <div className="text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-2">
                      <AvatarImage src={transaction.toAvatar} />
                      <AvatarFallback className="bg-green-500/20 text-green-400">
                        {transaction.toName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-white font-medium text-sm">
                      {transaction.toName}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Activity Log Tab */}
            <TabsContent value="activity" className="space-y-3 m-0">
              {activityLog.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-white/60 text-sm mt-1">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                    <p className="text-white/40 text-xs mt-1">By {activity.user}</p>
                  </div>
                </motion.div>
              ))}
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            {transaction.receiptUrl && (
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
            )}
            {transaction.invoiceId && (
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Invoice
              </Button>
            )}
          </div>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
