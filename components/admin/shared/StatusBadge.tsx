import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

const statusColors: Record<string, string> = {
  // Campaign statuses
  active: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  completed: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  paused: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  draft: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",

  // Lead statuses
  new: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  qualified: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  proposal: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
  negotiation: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  closed_won: "bg-green-600/10 text-green-600 hover:bg-green-600/20",
  closed_lost: "bg-red-500/10 text-red-500 hover:bg-red-500/20",

  // Payment/Invoice statuses
  paid: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  overdue: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  sent: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  cancelled: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",

  // Task priorities
  low: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  high: "bg-red-500/10 text-red-500 hover:bg-red-500/20",

  // Task statuses
  in_progress: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",

  // Generic
  approved: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  rejected: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const formattedStatus = status.split("_").map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");

  const colorClass = statusColors[status.toLowerCase()] || statusColors.draft;

  return (
    <Badge
      variant={variant || "outline"}
      className={cn(
        "font-medium",
        !variant && colorClass,
        className
      )}
    >
      {formattedStatus}
    </Badge>
  );
}
