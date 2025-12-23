"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import { DollarSign, Users, TrendingUp } from "lucide-react";

interface EarningsBreakdownProps {
  revenue: number;
  talent: number;
  profit: number;
}

export function EarningsBreakdown({ revenue, talent, profit }: EarningsBreakdownProps) {
  const data = [
    { name: "Talent Costs", value: talent, color: "#f97316" },
    { name: "Profit", value: profit, color: "#22c55e" },
  ];

  const profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : "0";

  return (
    <Card className="bg-card border-border shadow-sm col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Earnings Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {/* Chart */}
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-xl font-bold">${revenue.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Talent Costs</p>
                <p className="text-xl font-bold">${talent.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Profit ({profitMargin}%)
                </p>
                <p className="text-xl font-bold">${profit.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
