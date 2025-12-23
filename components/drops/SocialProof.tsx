"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Eye, Users, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialProofProps {
  views: number;
  signups: number;
  conversionRate?: number;
  slotsRemaining?: number;
  className?: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

export function SocialProof({
  views,
  signups,
  conversionRate,
  slotsRemaining,
  className,
}: SocialProofProps) {
  const stats = [
    {
      icon: Eye,
      label: "People Viewing",
      value: formatNumber(views),
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Users,
      label: "Already Signed Up",
      value: formatNumber(signups),
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
    },
  ];

  if (conversionRate !== undefined && conversionRate > 0) {
    stats.push({
      icon: TrendingUp,
      label: "Conversion Rate",
      value: `${conversionRate.toFixed(1)}%`,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
    });
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bgColor)}>
                    <Icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                  <div>
                    <div className={cn("text-2xl font-bold", stat.color)}>
                      {stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Urgency Banner */}
      {slotsRemaining !== undefined && slotsRemaining > 0 && slotsRemaining <= 10 && (
        <Card className="bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-orange-500/10 border-yellow-500/30 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Only {slotsRemaining} {slotsRemaining === 1 ? "spot" : "spots"} remaining!
                </p>
                <p className="text-xs text-muted-foreground">
                  This opportunity is filling up fast
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Proof Message */}
      {signups > 50 && (
        <Card className="bg-gradient-to-br from-primary/5 via-card to-card border-border shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Join <span className="font-semibold text-foreground">{formatNumber(signups)}</span> others who have already signed up for this exclusive opportunity
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
