"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CampaignPerformanceChartProps {
  data?: Array<{
    date: string;
    views: number;
    engagement: number;
  }>;
}

const defaultData = [
  { date: "Week 1", views: 1850, engagement: 420 },
  { date: "Week 2", views: 3050, engagement: 680 },
  { date: "Week 3", views: 2370, engagement: 550 },
  { date: "Week 4", views: 4730, engagement: 920 },
  { date: "Week 5", views: 5290, engagement: 1100 },
  { date: "Week 6", views: 6140, engagement: 1350 },
];

const chartConfig = {
  views: {
    label: "Views",
    color: "var(--chart-1)",
  },
  engagement: {
    label: "Engagement",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function CampaignPerformanceChart({
  data = defaultData,
}: CampaignPerformanceChartProps) {
  // Calculate trend percentage
  const firstWeek = data[0];
  const lastWeek = data[data.length - 1];
  const trendPercentage =
    firstWeek && lastWeek
      ? (((lastWeek.views - firstWeek.views) / firstWeek.views) * 100).toFixed(
          1
        )
      : 0;

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground">Campaign Performance</CardTitle>
        <p className="text-sm text-muted-foreground">
          Views and engagement over time
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs text-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs text-muted-foreground"
              tickFormatter={(value) => {
                if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                return value.toString();
              }}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--color-border)", strokeWidth: 1 }}
              content={<ChartTooltipContent />}
            />
            <Line
              dataKey="views"
              type="monotone"
              stroke="var(--color-views)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-views)",
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="engagement"
              type="monotone"
              stroke="var(--color-engagement)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-engagement)",
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
        <div className="flex flex-col gap-2 text-sm mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 leading-none font-medium text-foreground">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Trending up by {trendPercentage}% over the period
          </div>
          <p className="text-muted-foreground text-xs leading-none">
            Showing campaign performance metrics for active campaigns
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
