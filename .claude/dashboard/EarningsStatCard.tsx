"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EarningsStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  colorScheme?: "revenue" | "talent" | "profit" | "default";
}

export function EarningsStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = "default",
}: EarningsStatCardProps) {
  const colors = {
    revenue: "text-blue-500 bg-blue-500/10",
    talent: "text-orange-500 bg-orange-500/10",
    profit: "text-green-500 bg-green-500/10",
    default: "text-muted-foreground bg-muted/50",
  };

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center",
              colors[colorScheme]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded",
                trend.isPositive
                  ? "text-green-500 bg-green-500/10"
                  : "text-red-500 bg-red-500/10"
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-3xl font-bold text-foreground font-mono">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground/70 mt-2">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
