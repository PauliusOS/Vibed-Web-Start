"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Eye, Users, TrendingUp, Clock } from "lucide-react";

interface DropStatsProps {
  views: number;
  signups: number;
  conversionRate?: number;
  slotsRemaining?: number;
  totalSlots?: number;
}

export function DropStats({
  views,
  signups,
  conversionRate = 0,
  slotsRemaining,
  totalSlots,
}: DropStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const stats = [
    {
      label: "Views",
      value: formatNumber(views),
      icon: <Eye className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Sign Ups",
      value: formatNumber(signups),
      icon: <Users className="h-5 w-5" />,
      color: "from-green-500 to-emerald-500",
    },
    ...(totalSlots && slotsRemaining !== undefined
      ? [
          {
            label: "Spots Left",
            value: slotsRemaining.toString(),
            icon: <Clock className="h-5 w-5" />,
            color: "from-orange-500 to-red-500",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Campaign Activity
        </h2>
        <p className="text-muted-foreground mb-6">
          Join hundreds of creators who have already expressed interest in this
          opportunity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="bg-[#1a1a1a] border-[#3a3a3a] hover:border-primary/50 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold font-mono text-white">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10`}
                >
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Bar if slots are limited */}
      {totalSlots && slotsRemaining !== undefined && (
        <Card className="bg-[#1a1a1a] border-[#3a3a3a]">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Campaign Progress</span>
                <span className="font-semibold text-white">
                  {((1 - slotsRemaining / totalSlots) * 100).toFixed(0)}% Full
                </span>
              </div>
              <div className="w-full bg-[#0A0A0A] rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${((1 - slotsRemaining / totalSlots) * 100).toFixed(0)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {slotsRemaining} of {totalSlots} spots remaining
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

