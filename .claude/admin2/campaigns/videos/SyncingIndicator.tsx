import { Loader2 } from "lucide-react";

interface SyncingIndicatorProps {
  className?: string;
  size?: "sm" | "md";
}

export function SyncingIndicator({ className = "", size = "sm" }: SyncingIndicatorProps) {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
  };

  const iconSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
  };

  return (
    <div className={`flex items-center gap-1.5 text-white/40 ${sizeClasses[size]} ${className}`}>
      <Loader2 className={`${iconSize[size]} animate-spin`} />
      <span>Syncing...</span>
    </div>
  );
}
