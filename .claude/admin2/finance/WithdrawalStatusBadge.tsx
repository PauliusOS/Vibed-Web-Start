"use client";

type WithdrawalStatus = "pending" | "approved" | "paid" | "rejected";

interface WithdrawalStatusBadgeProps {
  status: WithdrawalStatus;
  className?: string;
}

const statusStyles: Record<WithdrawalStatus, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  approved: "bg-blue-500/20 text-blue-400",
  paid: "bg-emerald-500/20 text-emerald-400",
  rejected: "bg-red-500/20 text-red-400",
};

const statusLabels: Record<WithdrawalStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  paid: "Paid",
  rejected: "Rejected",
};

export function WithdrawalStatusBadge({ status, className = "" }: WithdrawalStatusBadgeProps) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]} ${className}`}
    >
      {statusLabels[status]}
    </span>
  );
}
