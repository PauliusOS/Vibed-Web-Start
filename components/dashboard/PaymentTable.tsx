"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  Trash2,
  Edit,
  DollarSign,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";

type Payment = {
  _id: Id<"creatorPayments">;
  campaignId: Id<"campaigns">;
  campaignName?: string;
  creatorId: string;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  dueDate: number;
  paidAt?: number;
  notes?: string;
};

type SortField = "amount" | "dueDate" | "campaignName" | "creatorId";
type SortOrder = "asc" | "desc";

interface PaymentTableProps {
  payments: Payment[];
  showActions?: boolean;
  onEditPayment?: (payment: Payment) => void;
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-500",
    icon: Clock,
  },
  paid: {
    label: "Paid",
    className: "bg-green-500/10 text-green-500",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-500",
    icon: XCircle,
  },
};

export function PaymentTable({
  payments,
  showActions = false,
  onEditPayment,
}: PaymentTableProps) {
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedPayments, setSelectedPayments] = useState<Set<Id<"creatorPayments">>>(
    new Set()
  );
  const [deletePaymentId, setDeletePaymentId] = useState<Id<"creatorPayments"> | null>(
    null
  );

  const markAsPaid = useMutation(api.payments.markPaymentAsPaid);
  const deletePayment = useMutation(api.payments.deletePayment);

  // Sorting
  const sortedPayments = [...payments].sort((a, b) => {
    let aVal: string | number | undefined = a[sortField];
    let bVal: string | number | undefined = b[sortField];

    // Handle string comparisons
    if (sortField === "campaignName" || sortField === "creatorId") {
      aVal = String(aVal || "").toLowerCase();
      bVal = String(bVal || "").toLowerCase();
    }

    // Ensure values are defined for comparison
    const finalA = aVal ?? "";
    const finalB = bVal ?? "";

    if (sortOrder === "asc") {
      return finalA > finalB ? 1 : -1;
    } else {
      return finalA < finalB ? 1 : -1;
    }
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const toggleSelectPayment = (paymentId: Id<"creatorPayments">) => {
    const newSelected = new Set(selectedPayments);
    if (newSelected.has(paymentId)) {
      newSelected.delete(paymentId);
    } else {
      newSelected.add(paymentId);
    }
    setSelectedPayments(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedPayments.size === payments.length) {
      setSelectedPayments(new Set());
    } else {
      setSelectedPayments(new Set(payments.map((p) => p._id)));
    }
  };

  const handleMarkAsPaid = async (paymentId: Id<"creatorPayments">) => {
    try {
      await markAsPaid({ paymentId });
      toast.success("Payment marked as paid");
    } catch (error) {
      toast.error("Failed to mark payment as paid");
      console.error(error);
    }
  };

  const handleDeletePayment = async () => {
    if (!deletePaymentId) return;

    try {
      await deletePayment({ paymentId: deletePaymentId });
      toast.success("Payment deleted");
      setDeletePaymentId(null);
    } catch (error) {
      toast.error("Failed to delete payment");
      console.error(error);
    }
  };

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-white/60">
        <DollarSign className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">No payments found</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-[#3a3a3a] bg-black/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-[#3a3a3a]">
              {showActions && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedPayments.size === payments.length}
                    onCheckedChange={toggleSelectAll}
                    className="border-white/20"
                  />
                </TableHead>
              )}
              <TableHead className="text-white/60">
                <button
                  onClick={() => toggleSort("creatorId")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Creator <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="text-white/60">
                <button
                  onClick={() => toggleSort("campaignName")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Campaign <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="text-white/60">
                <button
                  onClick={() => toggleSort("amount")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Amount <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="text-white/60">
                <button
                  onClick={() => toggleSort("dueDate")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Due Date <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="text-white/60">Status</TableHead>
              <TableHead className="text-white/60">Paid Date</TableHead>
              {showActions && <TableHead className="text-white/60">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPayments.map((payment) => {
              const config = statusConfig[payment.status];
              const StatusIcon = config.icon;

              return (
                <TableRow
                  key={payment._id}
                  className="hover:bg-white/5 border-[#3a3a3a]"
                >
                  {showActions && (
                    <TableCell>
                      <Checkbox
                        checked={selectedPayments.has(payment._id)}
                        onCheckedChange={() => toggleSelectPayment(payment._id)}
                        className="border-white/20"
                      />
                    </TableCell>
                  )}
                  <TableCell className="text-white/80 font-medium">
                    {payment.creatorId}
                  </TableCell>
                  <TableCell className="text-white/80">
                    {payment.campaignName || "Unknown"}
                  </TableCell>
                  <TableCell className="text-white/80 font-mono font-bold">
                    ${payment.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-white/60 text-sm">
                    {new Date(payment.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", config.className)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/60 text-sm">
                    {payment.paidAt
                      ? new Date(payment.paidAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-white/60 hover:text-white"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#1a1a1a] border-[#3a3a3a]"
                        >
                          {payment.status === "pending" && (
                            <DropdownMenuItem
                              onClick={() => handleMarkAsPaid(payment._id)}
                              className="text-white hover:bg-white/5"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                          {onEditPayment && (
                            <DropdownMenuItem
                              onClick={() => onEditPayment(payment)}
                              className="text-white hover:bg-white/5"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Payment
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => setDeletePaymentId(payment._id)}
                            className="text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Bulk Actions */}
      {showActions && selectedPayments.size > 0 && (
        <div className="mt-4 flex items-center gap-4">
          <p className="text-sm text-white/60">
            {selectedPayments.size} payment(s) selected
          </p>
          <Button
            size="sm"
            className="bg-white text-black hover:bg-white/90"
            onClick={() => {
              // Bulk mark as paid
              const pendingPayments = Array.from(selectedPayments).filter((id) => {
                const payment = payments.find((p) => p._id === id);
                return payment?.status === "pending";
              });

              if (pendingPayments.length === 0) {
                toast.error("No pending payments selected");
                return;
              }

              Promise.all(
                pendingPayments.map((id) => markAsPaid({ paymentId: id }))
              )
                .then(() => {
                  toast.success(`${pendingPayments.length} payment(s) marked as paid`);
                  setSelectedPayments(new Set());
                })
                .catch(() => {
                  toast.error("Failed to mark payments as paid");
                });
            }}
          >
            Mark Selected as Paid
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deletePaymentId !== null}
        onOpenChange={(open) => !open && setDeletePaymentId(null)}
      >
        <AlertDialogContent className="bg-[#1a1a1a] border-[#3a3a3a]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Payment</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to delete this payment? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#3a3a3a] text-white hover:bg-white/5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePayment}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
