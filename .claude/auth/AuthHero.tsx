"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, TrendingUp, Video, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface StatItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export function AuthHero() {
  // Fetch real-time stats from platform
  const totalCreators = useQuery(api.platformStats.getTotalCreators);
  const activeCampaigns = useQuery(api.platformStats.getActiveCampaigns);
  const totalVideos = useQuery(api.platformStats.getTotalVideos);
  const totalViews = useQuery(api.platformStats.getTotalViews);

  // Animated counter
  const [displayStats, setDisplayStats] = useState({
    creators: 0,
    campaigns: 0,
    videos: 0,
    views: 0,
  });

  useEffect(() => {
    if (totalCreators !== undefined) {
      animateValue(0, totalCreators, 2000, (val) =>
        setDisplayStats((prev) => ({ ...prev, creators: val }))
      );
    }
    if (activeCampaigns !== undefined) {
      animateValue(0, activeCampaigns, 1500, (val) =>
        setDisplayStats((prev) => ({ ...prev, campaigns: val }))
      );
    }
    if (totalVideos !== undefined) {
      animateValue(0, totalVideos, 2500, (val) =>
        setDisplayStats((prev) => ({ ...prev, videos: val }))
      );
    }
    if (totalViews !== undefined) {
      animateValue(0, totalViews, 3000, (val) =>
        setDisplayStats((prev) => ({ ...prev, views: val }))
      );
    }
  }, [totalCreators, activeCampaigns, totalVideos, totalViews]);

  const animateValue = (
    start: number,
    end: number,
    duration: number,
    callback: (val: number) => void
  ) => {
    const startTime = Date.now();
    const update = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      callback(current);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    requestAnimationFrame(update);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const stats: StatItem[] = [
    {
      label: "Active Creators",
      value: displayStats.creators,
      icon: <Users className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Live Campaigns",
      value: displayStats.campaigns,
      icon: <Target className="h-5 w-5" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Videos Created",
      value: displayStats.videos,
      icon: <Video className="h-5 w-5" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Total Views",
      value: displayStats.views,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="h-full flex flex-col justify-center p-8 lg:p-12">
      {/* Hero Content */}
      <div className="space-y-6">
        {/* Badge */}
        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
          <Sparkles className="h-3 w-3 mr-1" />
          Trusted by Leading Brands
        </Badge>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Manage Your Brand's
            <br />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Creator Strategy
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Complete brand strategy management with creators. Track campaigns,
            manage briefs, analyze performance, and handle payments - all in one
            place.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-[#0A0A0A] border-[#3a3a3a] p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10`}
                >
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {formatNumber(stat.value)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Features List */}
        <div className="space-y-3 pt-4">
          <Feature text="Campaign & brief management" />
          <Feature text="Real-time performance analytics" />
          <Feature text="Automated payment tracking" />
          <Feature text="Creator roster organization" />
        </div>
      </div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

