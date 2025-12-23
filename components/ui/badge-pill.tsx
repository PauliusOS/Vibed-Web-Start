import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface BadgePillProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function BadgePill({ children, icon: Icon, className }: BadgePillProps) {
  return (
    <span className={cn("badge-pill", className)}>
      {Icon && <Icon className="badge-pill-icon" />}
      {children}
    </span>
  );
}
