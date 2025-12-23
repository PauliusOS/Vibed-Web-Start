"use client";

type InvitationStatus = "pending" | "accepted" | "declined" | "expired" | "cancelled";

interface InvitationStatusBadgeProps {
  status: InvitationStatus;
  className?: string;
}

const statusStyles: Record<InvitationStatus, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  accepted: "bg-emerald-500/20 text-emerald-400",
  declined: "bg-red-500/20 text-red-400",
  expired: "bg-white/[0.08] text-white/40",
  cancelled: "bg-white/[0.04] text-white/40",
};

const statusLabels: Record<InvitationStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  expired: "Expired",
  cancelled: "Cancelled",
};

export function InvitationStatusBadge({ status, className = "" }: InvitationStatusBadgeProps) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]} ${className}`}
    >
      {statusLabels[status]}
    </span>
  );
}
