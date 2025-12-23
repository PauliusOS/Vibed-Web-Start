import { LucideIcon, Clock, CheckCircle, XCircle, Activity } from "lucide-react";

interface StatusBadgePremiumProps {
  status: "pending" | "approved" | "tracking" | "rejected";
  count?: number;
  variant?: "default" | "compact";
  className?: string;
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    color: "amber-500",
    textColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    pulseDotBg: "bg-amber-500",
    pulseRingBg: "bg-amber-500",
    countBadgeBg: "bg-amber-500/20",
  },
  approved: {
    icon: CheckCircle,
    label: "Approved",
    color: "emerald-500",
    textColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    pulseDotBg: "bg-emerald-500",
    pulseRingBg: "bg-emerald-500",
    countBadgeBg: "bg-emerald-500/20",
  },
  tracking: {
    icon: Activity,
    label: "Tracking",
    color: "blue-400",
    textColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    pulse: true,
    pulseDotBg: "bg-blue-400",
    pulseRingBg: "bg-blue-400",
    countBadgeBg: "bg-blue-400/20",
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    color: "red-500",
    textColor: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    pulseDotBg: "bg-red-500",
    pulseRingBg: "bg-red-500",
    countBadgeBg: "bg-red-500/20",
  },
};

export function StatusBadgePremium({
  status,
  count,
  variant = "default",
  className = "",
}: StatusBadgePremiumProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  if (variant === "compact") {
    return (
      <span
        role="status"
        aria-label={`Video status: ${config.label}`}
        title={config.label}
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${config.bgColor} ${config.borderColor} border ${className}`}
      >
        {config.pulse ? (
          <span className={`w-1.5 h-1.5 rounded-full ${config.pulseDotBg} animate-pulse`} />
        ) : (
          <Icon className={`h-3 w-3 ${config.textColor}`} />
        )}
      </span>
    );
  }

  return (
    <span
      role="status"
      aria-label={`Video status: ${config.label}${count ? `, ${count} videos` : ""}`}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bgColor} ${config.borderColor} border ${config.textColor} text-xs font-semibold uppercase tracking-wider ${className}`}
    >
      {config.pulse ? (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.pulseRingBg} opacity-75`}
            aria-hidden="true"
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${config.pulseDotBg}`}
            aria-hidden="true"
          />
        </span>
      ) : (
        <Icon className="h-3 w-3" aria-hidden="true" />
      )}
      <span>{config.label}</span>
      {count !== undefined && (
        <span className={`inline-flex items-center justify-center min-w-[1rem] h-4 px-1 rounded-full ${config.countBadgeBg} text-[10px] font-bold`}>
          {count}
        </span>
      )}
    </span>
  );
}
