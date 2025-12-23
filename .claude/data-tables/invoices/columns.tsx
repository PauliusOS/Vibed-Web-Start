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
import { ArrowUpDown, MoreHorizontal, Send, Check, Eye, Trash2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { format } from "date-fns";

export type Invoice = {
  _id: Id<"invoices">;
  invoiceNumber: string;
  clientId: string;
  campaignId?: Id<"campaigns">;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  tax?: number;
  total: number;
  issueDate: number;
  dueDate: number;
  paidAt?: number;
  notes?: string;
  organizationId: Id<"organizations">;
  createdAt: number;
  updatedAt: number;
};

interface InvoiceColumnsProps {
  onSend: (invoiceId: Id<"invoices">) => void;
  onMarkPaid: (invoiceId: Id<"invoices">) => void;
  onViewDetails: (invoice: Invoice) => void;
  onDelete: (invoiceId: Id<"invoices">) => void;
}

export const createInvoiceColumns = ({
  onSend,
  onMarkPaid,
  onViewDetails,
  onDelete,
}: InvoiceColumnsProps): ColumnDef<Invoice>[] => [
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invoice #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-mono font-medium">{row.getValue("invoiceNumber")}</div>
    ),
  },
  {
    accessorKey: "clientId",
    header: "Client",
    cell: ({ row }) => (
      <div className="text-muted-foreground truncate max-w-[150px]">
        {row.getValue("clientId")}
      </div>
    ),
  },
  {
    accessorKey: "total",
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
      const amount = parseFloat(row.getValue("total"));
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
      const statusColors: Record<string, string> = {
        draft: "bg-gray-500/20 text-gray-500",
        sent: "bg-blue-500/20 text-blue-500",
        paid: "bg-green-500/20 text-green-500",
        overdue: "bg-red-500/20 text-red-500",
        cancelled: "bg-gray-500/20 text-gray-400",
      };
      return (
        <Badge
          variant="secondary"
          className={statusColors[status] || ""}
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
    accessorKey: "issueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Issue Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("issueDate") as number;
      return <div>{format(new Date(date), "MMM d, yyyy")}</div>;
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
      const status = row.original.status;
      const isOverdue = dueDate < Date.now() && (status === "sent" || status === "overdue");
      return (
        <div className={isOverdue ? "text-red-500 font-medium" : ""}>
          {format(new Date(dueDate), "MMM d, yyyy")}
          {isOverdue && <span className="ml-2 text-xs">(Overdue)</span>}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;

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
            <DropdownMenuItem onClick={() => onViewDetails(invoice)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {invoice.status === "draft" && (
              <>
                <DropdownMenuItem onClick={() => onSend(invoice._id)}>
                  <Send className="mr-2 h-4 w-4" />
                  Send to Client
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(invoice._id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
            {(invoice.status === "sent" || invoice.status === "overdue") && (
              <DropdownMenuItem onClick={() => onMarkPaid(invoice._id)}>
                <Check className="mr-2 h-4 w-4" />
                Mark as Paid
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
