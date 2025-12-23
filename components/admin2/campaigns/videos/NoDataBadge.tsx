interface NoDataBadgeProps {
  className?: string;
}

export function NoDataBadge({ className = "" }: NoDataBadgeProps) {
  return (
    <span className={`text-white/30 text-sm font-mono ${className}`}>
      —
    </span>
  );
}
