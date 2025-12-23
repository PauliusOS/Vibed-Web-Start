import { LucideIcon } from "lucide-react";

interface MetricDisplayProps {
  value: number;
  icon?: LucideIcon;
  color?: string;
  className?: string;
  size?: "sm" | "md";
}

// Format number with K/M suffix
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export function MetricDisplay({
  value,
  icon: Icon,
  color = "text-white",
  className = "",
  size = "sm"
}: MetricDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
  };

  const iconSize = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {Icon && <Icon className={`${iconSize[size]} ${color}`} />}
      <span className={`${sizeClasses[size]} font-medium ${color} tabular-nums`}>
        {formatNumber(value)}
      </span>
    </div>
  );
}
