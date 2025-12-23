import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  withSpotlight?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  withSpotlight = false,
  className,
}: StatCardProps) {
  const content = (
    <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Icon className="h-5 w-5 text-muted-foreground" />
          {trend && (
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded",
                trend.value > 0
                  ? "text-green-500 bg-green-500/10"
                  : trend.value < 0
                  ? "text-red-500 bg-red-500/10"
                  : "text-muted-foreground bg-muted/50"
              )}
            >
              {trend.value > 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </span>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-3xl font-bold text-foreground font-mono">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground/70 mt-2">{subtitle}</p>
          )}
        </div>
      </div>
  );

  if (withSpotlight) {
    return (
      <CardSpotlight className={cn("shadow-sm hover:shadow-md", className)}>
        {content}
      </CardSpotlight>
    );
  }

  return (
    <div className="relative">
      <Card className={cn("bg-card border-border shadow-sm", className)}>
        <CardContent className="p-6">{content}</CardContent>
      </Card>
      <GlowingEffect
        disabled={false}
        proximity={200}
        blur={5}
        spread={30}
        borderWidth={2}
      />
    </div>
  );
}
