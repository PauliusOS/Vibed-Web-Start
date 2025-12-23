import { cn } from "@/lib/utils";

interface GradientMeshProps {
  className?: string;
  variant?: "default" | "warm" | "blue";
  animated?: boolean;
}

export function GradientMesh({
  className,
  variant = "default",
  animated = false,
}: GradientMeshProps) {
  const variantClasses = {
    default: "bg-gradient-mesh",
    warm: "bg-gradient-mesh-warm",
    blue: "bg-gradient-blue-glow",
  };

  return (
    <div
      className={cn(
        "absolute inset-0 -z-10",
        variantClasses[variant],
        animated && "animate-gradient-shift",
        className
      )}
      aria-hidden="true"
    />
  );
}
