"use client";

type VideoStatus = "pending_approval" | "approved" | "rejected" | "tracking";

interface VideoStatusBadgeProps {
  status: VideoStatus;
  isDraft?: boolean;
  className?: string;
}

const statusStyles: Record<VideoStatus, string> = {
  pending_approval: "bg-amber-500/20 text-amber-400",
  approved: "bg-emerald-500/20 text-emerald-400",
  rejected: "bg-red-500/20 text-red-400",
  tracking: "bg-blue-500/20 text-blue-400",
};

const statusLabels: Record<VideoStatus, string> = {
  pending_approval: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  tracking: "Live",
};

export function VideoStatusBadge({ status, isDraft, className = "" }: VideoStatusBadgeProps) {
  // Show draft badge if it's a draft
  if (isDraft) {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 ${className}`}
      >
        Draft
      </span>
    );
  }

  // Live status gets pulse animation
  if (status === "tracking") {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]} ${className} relative`}
      >
        <span className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        <span className="ml-2">{statusLabels[status]}</span>
      </span>
    );
  }

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]} ${className}`}
    >
      {statusLabels[status]}
    </span>
  );
}
