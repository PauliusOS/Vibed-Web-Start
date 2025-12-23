import { cn } from "@/lib/utils";

interface GridPatternProps {
  className?: string;
  variant?: "default" | "subtle" | "fine";
  animated?: boolean;
}

export function GridPattern({
  className,
  variant = "default",
  animated = false,
}: GridPatternProps) {
  const variantClasses = {
    default: "bg-grid-pattern",
    subtle: "bg-grid-pattern-subtle",
    fine: "bg-grid-pattern-fine",
  };

  return (
    <div
      className={cn(
        "absolute inset-0 -z-10",
        variantClasses[variant],
        animated && "animate-pulse",
        className
      )}
      aria-hidden="true"
    />
  );
}
