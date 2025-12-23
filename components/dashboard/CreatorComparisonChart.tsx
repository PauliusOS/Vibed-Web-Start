"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CreatorComparisonChartProps {
  data?: Array<{
    creator: string;
    views: number;
    engagement: number;
  }>;
}

const defaultData = [
  { creator: "@alex_design", views: 12500, engagement: 2400 },
  { creator: "@tech_guru", views: 10800, engagement: 2100 },
  { creator: "@style_maven", views: 9200, engagement: 1850 },
  { creator: "@food_blogger", views: 8600, engagement: 1700 },
  { creator: "@fitness_pro", views: 7900, engagement: 1500 },
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

export function CreatorComparisonChart({
  data = defaultData,
}: CreatorComparisonChartProps) {
  // Find top performer
  const topCreator = data.reduce((prev, current) =>
    prev.views > current.views ? prev : current
  );

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground">Top Creators</CardTitle>
        <p className="text-sm text-muted-foreground">
          Performance comparison by views and engagement
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
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
              dataKey="creator"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
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
              cursor={{ fill: "var(--color-muted)", opacity: 0.2 }}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="views"
              fill="var(--color-views)"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="engagement"
              fill="var(--color-engagement)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
        <div className="flex flex-col gap-2 text-sm mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 leading-none font-medium text-foreground">
            <TrendingUp className="h-4 w-4 text-green-500" />
            {topCreator.creator} is the top performer with{" "}
            {topCreator.views.toLocaleString()} views
          </div>
          <p className="text-muted-foreground text-xs leading-none">
            Showing performance metrics for top 5 creators
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
