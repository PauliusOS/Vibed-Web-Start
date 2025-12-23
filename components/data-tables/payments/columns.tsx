"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, Check, X, Eye } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { format } from "date-fns";

export type Payment = {
  _id: Id<"creatorPayments">;
  campaignId: Id<"campaigns">;
  creatorId: string;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  dueDate: number;
  paidAt?: number;
  notes?: string;
  campaignName: string;
};

interface PaymentColumnsProps {
  onMarkPaid: (paymentId: Id<"creatorPayments">) => void;
  onCancel: (paymentId: Id<"creatorPayments">) => void;
  onViewDetails: (payment: Payment) => void;
}

export const createPaymentColumns = ({
  onMarkPaid,
  onCancel,
  onViewDetails,
}: PaymentColumnsProps): ColumnDef<Payment>[] => [
  {
    accessorKey: "campaignName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Campaign
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("campaignName")}</div>
    ),
  },
  {
    accessorKey: "creatorId",
    header: "Creator",
    cell: ({ row }) => (
      <div className="text-muted-foreground truncate max-w-[150px]">
        {row.getValue("creatorId")}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "paid"
              ? "default"
              : status === "pending"
                ? "secondary"
                : "destructive"
          }
          className={
            status === "paid"
              ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
              : status === "pending"
                ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                : ""
          }
        >
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate") as number;
      const isOverdue = dueDate < Date.now() && row.original.status === "pending";
      return (
        <div className={isOverdue ? "text-red-500 font-medium" : ""}>
          {format(new Date(dueDate), "MMM d, yyyy")}
          {isOverdue && <span className="ml-2 text-xs">(Overdue)</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "paidAt",
    header: "Paid On",
    cell: ({ row }) => {
      const paidAt = row.getValue("paidAt") as number | undefined;
      return paidAt ? (
        <div className="text-muted-foreground">
          {format(new Date(paidAt), "MMM d, yyyy")}
        </div>
      ) : (
        <div className="text-muted-foreground">-</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onViewDetails(payment)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {payment.status === "pending" && (
              <>
                <DropdownMenuItem onClick={() => onMarkPaid(payment._id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Paid
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onCancel(payment._id)}
                  className="text-destructive"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel Payment
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
