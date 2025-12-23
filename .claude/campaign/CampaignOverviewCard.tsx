"use client";

import { useState, useEffect } from "react";
import { TrendingUpIcon, BadgePercentIcon, DollarSignIcon, ShoppingBagIcon, ArrowUpRightIcon } from "lucide-react";
import { Bar, BarChart, Label, Pie, PieChart } from "recharts";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatCurrency, formatCPM, formatTimeElapsed, getStatusColor } from "@/lib/utils/campaignCalculations";
import type { Id } from "@/convex/_generated/dataModel";

interface CampaignOverviewCardProps {
  campaignId: Id<"campaigns">;
  campaign: {
    _id: Id<"campaigns">;
    name: string;
    budget: number;
    status: "draft" | "active" | "paused" | "completed" | "archived";
    createdAt: number;
  };
  metrics: {
    totalReach: number;
    totalVideos: number;
    totalSpend: number;
    dedicatedRoster: number;
    cpm: number;
    progressPercent: number;
  };
  onClick?: () => void;
  className?: string;
}

const revenueChartConfig = {
  sales: {
    label: "Budget",
  },
  spent: {
    label: "Spent",
    color: "var(--primary)",
  },
  remaining: {
    label: "Remaining",
    color: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
} satisfies ChartConfig;

export function CampaignOverviewCard({
  campaignId,
  campaign,
  metrics,
  onClick,
  className,
}: CampaignOverviewCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [initializationTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDuration = (start: Date, end: Date) => {
    const duration = end.getTime() - start.getTime();
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // Prepare chart data
  const budgetRemaining = Math.max(0, metrics.dedicatedRoster - metrics.totalSpend);
  const revenueChartData = [
    { month: "spent", sales: metrics.totalSpend, fill: "var(--color-spent)" },
    { month: "remaining", sales: budgetRemaining, fill: "var(--color-remaining)" },
  ];

  const MetricsData = [
    {
      icons: <TrendingUpIcon className="size-5" />,
      title: "Total Reach",
      value: formatNumber(metrics.totalReach),
    },
    {
      icons: <BadgePercentIcon className="size-5" />,
      title: "Dedicated Roster",
      value: formatCurrency(metrics.dedicatedRoster),
    },
    {
      icons: <DollarSignIcon className="size-5" />,
      title: "Total Spend",
      value: formatCurrency(metrics.totalSpend),
    },
    {
      icons: <ShoppingBagIcon className="size-5" />,
      title: "Total Videos",
      value: metrics.totalVideos.toString(),
    },
    {
      icons: <ArrowUpRightIcon className="size-5" />,
      title: "CPM",
      showIndicator: true,
    },
  ];

  return (
    <Card className={`${className} cursor-pointer hover:border-primary/50 transition-all`} onClick={onClick}>
      <CardContent className="space-y-4">
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="flex flex-col gap-7 lg:col-span-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/opa-logo.svg"
                  className="size-10.5 rounded-lg"
                  alt="logo"
                />
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-medium">{campaign.name}</span>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    Created {formatDate(new Date(campaign.createdAt))}
                  </span>
                </div>
              </div>
              <div
                className="flex flex-col items-end font-mono text-xs text-red-400"
                style={{
                  textShadow: "0 0 8px rgba(239,68,68,0.6), 0 0 12px rgba(239,68,68,0.4)",
                  fontFamily: '"LCD", "DSEG7 Classic", "Courier New", monospace',
                  letterSpacing: "0.05em",
                }}
              >
                <span className="text-red-400/60 text-[10px] mb-0.5">Last initialisation</span>
                <span>{formatDuration(initializationTime, currentTime)}</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {MetricsData.map((metric, index) => (
                <div
                  key={index}
                  className={`flex items-center rounded-md px-4 gap-3.5 leading-3 ${
                    index === MetricsData.length - 1 ? "sm:col-span-2 py-1.5 relative overflow-hidden" : "py-2 border"
                  }`}
                >
                  <Avatar className="size-8.5 rounded-sm">
                    <AvatarFallback className="bg-primary/10 text-primary shrink-0 rounded-sm">
                      {metric.icons}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={`text-sm ${index === MetricsData.length - 1 ? "font-bold" : "font-medium text-muted-foreground"}`}
                    >
                      {metric.title}
                    </span>
                    {metric.value && <span className="text-lg font-medium">{metric.value}</span>}
                  </div>
                  {metric.showIndicator && (
                    <>
                      <div className="flex-1 relative flex items-center h-6 z-10">
                        {/* Left side - from CRM to logo */}
                        <div className="flex-1 relative h-full flex items-center overflow-hidden">
                          {/* Base dashed line - grey, low opacity */}
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-[1px] border-t border-dashed border-white/20" />
                          </div>

                          {/* Green electricity that lights up dashes - triggered by wave */}
                          <div className="absolute inset-0 flex items-center animate-electricity-left">
                            <div
                              className="w-full h-[1px] border-t border-dashed border-green-400"
                              style={{
                                filter:
                                  "drop-shadow(0 0 3px rgba(34,197,94,1)) drop-shadow(0 0 6px rgba(34,197,94,0.8))",
                              }}
                            />
                          </div>
                        </div>

                        <div className="relative flex items-center justify-center mx-3">
                          {/* Circular wave: originates exactly behind logo, expands outward */}
                          <div
                            className="absolute top-1/2 left-1/2 w-20 h-20 rounded-full pointer-events-none animate-circular-wave"
                            style={{
                              background:
                                "radial-gradient(circle, rgba(34,197,94,0.6) 0%, rgba(34,197,94,0.4) 30%, rgba(34,197,94,0.2) 60%, transparent 100%)",
                              filter: "blur(6px)",
                              zIndex: 0,
                            }}
                          />

                          {/* Green glow pulse behind logo */}
                          <span
                            className="animate-logo-glow absolute inline-flex h-14 w-14 rounded-full bg-green-500/50 blur-lg"
                            style={{ zIndex: 1 }}
                          ></span>

                          {/* Logo stays WHITE */}
                          <img
                            src="/opa-logo.svg"
                            alt="Sylc Road"
                            className="h-10 w-auto relative"
                            style={{
                              zIndex: 2,
                              filter:
                                "brightness(0) invert(1) drop-shadow(0 4px 8px rgba(0,0,0,0.7)) drop-shadow(0 2px 4px rgba(0,0,0,0.5)) drop-shadow(0 0 12px rgba(34,197,94,0.5))",
                            }}
                          />
                        </div>

                        {/* Right side - from logo to red indicator */}
                        <div className="flex-1 relative h-full flex items-center overflow-hidden">
                          {/* Base dashed line - grey, low opacity */}
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-[1px] border-t border-dashed border-white/20" />
                          </div>

                          {/* Green electricity that lights up dashes - triggered by wave */}
                          <div className="absolute inset-0 flex items-center animate-electricity-right">
                            <div
                              className="w-full h-[1px] border-t border-dashed border-green-400"
                              style={{
                                filter:
                                  "drop-shadow(0 0 3px rgba(34,197,94,1)) drop-shadow(0 0 6px rgba(34,197,94,0.8))",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="relative z-10">
                        <span
                          className="font-mono text-sm font-bold tracking-wider text-green-400"
                          style={{
                            textShadow:
                              "0 0 8px rgba(74,222,128,0.8), 0 0 16px rgba(74,222,128,0.5), 0 0 24px rgba(34,197,94,0.5))",
                            fontFamily: '"LCD", "DSEG7 Classic", "Courier New", monospace',
                            letterSpacing: "0.05em",
                          }}
                        >
                          {formatCPM(metrics.cpm)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Card className="gap-4 py-4 shadow-none lg:col-span-2 relative">
            <div className="absolute top-4 right-4">
              <div className="relative flex h-2.5 w-2.5">
                <span
                  className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60"
                  style={{
                    animation: "pulse-distort 3s ease-in-out infinite",
                  }}
                ></span>
                <span
                  className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"
                  style={{
                    boxShadow: "0 0 6px rgba(239,68,68,0.8), 0 0 12px rgba(239,68,68,0.5)",
                    animation: "distort 3s ease-in-out infinite",
                  }}
                ></span>
              </div>
            </div>

            <CardHeader className="gap-1">
              <CardTitle className="text-lg font-semibold">Campaign Progress</CardTitle>
            </CardHeader>

            <CardContent className="px-0">
              <ChartContainer config={revenueChartConfig} className="h-38.5 w-full">
                <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={revenueChartData}
                    dataKey="sales"
                    nameKey="month"
                    startAngle={300}
                    endAngle={660}
                    innerRadius={58}
                    outerRadius={75}
                    paddingAngle={2}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan x={viewBox.cx} y={viewBox.cy} className="fill-card-foreground text-3xl font-bold">
                                {formatCurrency(metrics.dedicatedRoster)}
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>

            <CardFooter className="justify-end">
              <span className="text-2xl font-medium">{metrics.progressPercent}%</span>
            </CardFooter>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
