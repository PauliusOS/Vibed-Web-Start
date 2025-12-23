"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconUsers,
  IconUserCheck,
  IconRocket,
  IconEye,
  IconVideo,
} from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

const statConfig = [
  {
    key: "creatorsOnline" as const,
    label: "Creators Online",
    icon: IconUserCheck,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    formatter: (val: number) => val.toLocaleString(),
  },
  {
    key: "totalCreators" as const,
    label: "Total Creators",
    icon: IconUsers,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    formatter: (val: number) => val.toLocaleString(),
  },
  {
    key: "activeCampaigns" as const,
    label: "Active Campaigns",
    icon: IconRocket,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    formatter: (val: number) => val.toLocaleString(),
  },
  {
    key: "totalViews" as const,
    label: "Total Views",
    icon: IconEye,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    formatter: (val: number) => {
      if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
      return val.toLocaleString();
    },
  },
  {
    key: "totalVideos" as const,
    label: "Total Videos",
    icon: IconVideo,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    formatter: (val: number) => val.toLocaleString(),
  },
];

export function CurrentStatsDisplay() {
  const stats = useQuery(api.platformStats.getLatestStats);

  if (stats === undefined) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground mb-4">
        Live preview - updates in real-time
      </div>

      {statConfig.map((config) => {
        const Icon = config.icon;
        const value = stats[config.key] ?? 0;

        return (
          <Card key={config.key} className="border-l-4" style={{ borderLeftColor: config.color }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${config.bgColor}`}>
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {config.label}
                  </p>
                  <p className="text-2xl font-bold">
                    {config.formatter(value)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
