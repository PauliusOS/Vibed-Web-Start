import { getEngagementCategory } from "@/lib/video-helpers";

interface EngagementBarProps {
  rate: number;
  showLabel?: boolean;
  className?: string;
}

export function EngagementBar({ rate, showLabel = true, className = "" }: EngagementBarProps) {
  const { label, color, bgColor } = getEngagementCategory(rate);
  const clampedRate = Math.min(Math.max(rate, 0), 100);

  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/60">Engagement Rate</span>
          <span className={`font-semibold tabular-nums ${color}`}>
            {rate.toFixed(2)}%
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div className="relative h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 ${bgColor} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedRate}%` }}
        />
      </div>

      {/* Category label (optional) */}
      {showLabel && (
        <div className="flex items-center justify-end">
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${color}`}>
            {label} Engagement
          </span>
        </div>
      )}
    </div>
  );
}
