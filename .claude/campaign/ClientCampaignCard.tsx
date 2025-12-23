import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import { Eye, Heart, Video, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientCampaignCardProps {
  id: string;
  name: string;
  budget: number;
  status: "draft" | "active" | "paused" | "completed" | "archived";
  videosCount: number;
  totalViews: number;
  totalEngagement: number;
  engagementRate: number;
  href?: string;
}

const statusConfig = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  active: { label: "Active", className: "bg-green-500/10 text-green-600 dark:text-green-400" },
  paused: { label: "Paused", className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
  completed: { label: "Completed", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  archived: { label: "Archived", className: "bg-gray-500/10 text-gray-600 dark:text-gray-400" },
};

export function ClientCampaignCard({
  id,
  name,
  budget,
  status,
  videosCount,
  totalViews,
  totalEngagement,
  engagementRate,
  href,
}: ClientCampaignCardProps) {
  const config = statusConfig[status];
  const linkHref = href || `/client/campaigns/${id}`;

  return (
    <GlowCard className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <Link href={linkHref}>
              <h3 className="text-lg font-semibold text-foreground hover:text-foreground/80 transition-colors line-clamp-2">
                {name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground font-mono">
              ${budget.toLocaleString()} budget
            </p>
          </div>
          <Badge variant="outline" className={cn("text-xs whitespace-nowrap", config.className)}>
            {config.label}
          </Badge>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Video className="h-4 w-4" />
              <span className="text-xs">Videos</span>
            </div>
            <p className="text-xl font-semibold text-foreground font-mono">
              {videosCount}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span className="text-xs">Views</span>
            </div>
            <p className="text-xl font-semibold text-foreground font-mono">
              {totalViews >= 1000
                ? `${(totalViews / 1000).toFixed(1)}K`
                : totalViews}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span className="text-xs">Engagement</span>
            </div>
            <p className="text-xl font-semibold text-foreground font-mono">
              {totalEngagement >= 1000
                ? `${(totalEngagement / 1000).toFixed(1)}K`
                : totalEngagement}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Eng. Rate</span>
            </div>
            <p className="text-xl font-semibold text-foreground font-mono">
              {engagementRate.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Link href={linkHref}>
          <Button
            variant="outline"
            className="w-full transition-colors duration-200 hover:bg-primary/10"
            aria-label={`View ${name} campaign details`}
          >
            View Details
          </Button>
        </Link>
      </div>
    </GlowCard>
  );
}
