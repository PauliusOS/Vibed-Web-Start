"use client";

type PaymentStatus = "pending" | "paid" | "cancelled";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const statusStyles: Record<PaymentStatus, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  paid: "bg-emerald-500/20 text-emerald-400",
  cancelled: "bg-white/[0.04] text-white/40",
};

const statusLabels: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  cancelled: "Cancelled",
};

export function PaymentStatusBadge({ status, className = "" }: PaymentStatusBadgeProps) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]} ${className}`}
    >
      {statusLabels[status]}
    </span>
  );
}
