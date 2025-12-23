"use client";

import { motion } from "motion/react";
import {
  DollarSign,
  UserPlus,
  CheckCircle2,
  FileText,
  Target,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type ActivityType = "payment" | "lead" | "task" | "invoice" | "campaign" | "alert";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: number;
  metadata?: Record<string, string | number>;
}

interface RecentActivitiesProps {
  activities: Activity[];
  title?: string;
  className?: string;
  href?: string;
  maxItems?: number;
}

const activityConfig: Record<
  ActivityType,
  { icon: typeof DollarSign; color: string; bgColor: string }
> = {
  payment: {
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  lead: {
    icon: UserPlus,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  task: {
    icon: CheckCircle2,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  invoice: {
    icon: FileText,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  campaign: {
    icon: Target,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  alert: {
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
};

export function RecentActivities({
  activities,
  title = "Recent Activities",
  className,
  href,
  maxItems = 5,
}: RecentActivitiesProps) {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className={cn("h-full", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {href && (
            <Link href={href}>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

            {/* Activities */}
            <div className="space-y-4">
              {displayedActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recent activities
                </p>
              ) : (
                displayedActivities.map((activity, index) => {
                  const config = activityConfig[activity.type];
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.5 + index * 0.1,
                      }}
                      className="relative flex gap-4"
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-card",
                          config.bgColor
                        )}
                      >
                        <Icon className={cn("h-4 w-4", config.color)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm font-medium truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          {formatDistanceToNow(activity.timestamp, {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
