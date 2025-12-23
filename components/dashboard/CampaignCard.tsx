import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Video, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignCardProps {
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
  draft: { label: "Draft", className: "bg-white/10 text-white/60" },
  active: { label: "Active", className: "bg-green-500/10 text-green-500" },
  paused: { label: "Paused", className: "bg-yellow-500/10 text-yellow-500" },
  completed: { label: "Completed", className: "bg-blue-500/10 text-blue-500" },
  archived: { label: "Archived", className: "bg-gray-500/10 text-gray-500" },
};

export function CampaignCard({
  id,
  name,
  budget,
  status,
  videosCount,
  totalViews,
  totalEngagement,
  engagementRate,
  href,
}: CampaignCardProps) {
  const config = statusConfig[status];
  const linkHref = href || `/admin/campaigns/${id}`;

  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a] hover:border-white/20 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Link href={linkHref}>
              <h3 className="text-lg font-semibold text-white hover:text-white/80 transition-colors">
                {name}
              </h3>
            </Link>
            <p className="text-sm text-white/60 font-mono">
              ${budget.toLocaleString()} budget
            </p>
          </div>
          <Badge className={cn("text-xs", config.className)}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/60">
              <Video className="h-4 w-4" />
              <span className="text-xs">Videos</span>
            </div>
            <p className="text-xl font-bold text-white font-mono">
              {videosCount}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/60">
              <Eye className="h-4 w-4" />
              <span className="text-xs">Views</span>
            </div>
            <p className="text-xl font-bold text-white font-mono">
              {totalViews >= 1000
                ? `${(totalViews / 1000).toFixed(1)}K`
                : totalViews}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/60">
              <Heart className="h-4 w-4" />
              <span className="text-xs">Engagement</span>
            </div>
            <p className="text-xl font-bold text-white font-mono">
              {totalEngagement >= 1000
                ? `${(totalEngagement / 1000).toFixed(1)}K`
                : totalEngagement}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/60">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Eng. Rate</span>
            </div>
            <p className="text-xl font-bold text-white font-mono">
              {engagementRate.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Link href={linkHref}>
          <Button
            variant="outline"
            className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
          >
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
