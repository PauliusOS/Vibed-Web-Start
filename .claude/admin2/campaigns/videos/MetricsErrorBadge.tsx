import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricsErrorBadgeProps {
  className?: string;
  error?: string | null;
  lastAttempt?: number | null;
}

export function MetricsErrorBadge({
  className = "",
  error,
  lastAttempt
}: MetricsErrorBadgeProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-1.5 text-amber-400 text-xs cursor-help ${className}`}>
            <AlertCircle className="h-3 w-3" />
            <span>Sync failed</span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-black border-white/10 text-white max-w-[250px]"
        >
          <div className="text-xs space-y-1">
            <p className="text-white/70">
              {error || "Failed to fetch metrics from API"}
            </p>
            {lastAttempt && (
              <p className="text-white/40">
                Last attempt: {formatTime(lastAttempt)}
              </p>
            )}
            <p className="text-white/50 mt-2">
              Use the refresh option in the menu to try again
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
