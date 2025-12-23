"use client";

import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Download,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  createdAt: Date;
  paidAt: Date | undefined;
  pdfUrl: string;
}

interface InvoiceHistoryProps {
  invoices: Invoice[];
  onDownload: (invoiceId: string) => void;
  onViewAll: () => void;
}

export function InvoiceHistory({ invoices, onDownload, onViewAll }: InvoiceHistoryProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case "sent":
        return (
          <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Sent
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            Overdue
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <GlassPanel className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Invoice History</h3>
            <p className="text-sm text-white/60">View and download past invoices</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-white/70 border-white/20"
          onClick={onViewAll}
        >
          View All
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {invoices.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/60">Invoice</TableHead>
                <TableHead className="text-white/60">Date</TableHead>
                <TableHead className="text-white/60">Amount</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60 w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-white/5 hover:bg-white/5">
                  <TableCell>
                    <p className="text-white font-medium">{invoice.number}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-white/80">{formatDate(invoice.createdAt)}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-white font-medium">
                      {formatAmount(invoice.amount, invoice.currency)}
                    </p>
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-white/60 hover:text-white"
                      onClick={() => onDownload(invoice.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-white/40">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No invoices yet</p>
          <p className="text-sm mt-1">Invoices will appear here after your first payment</p>
        </div>
      )}
    </GlassPanel>
  );
}
