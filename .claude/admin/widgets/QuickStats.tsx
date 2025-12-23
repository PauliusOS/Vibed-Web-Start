"use client";

import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CountAnimation } from "@/components/ui/count-animation";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon?: LucideIcon;
  colorScheme?: "blue" | "green" | "orange" | "red" | "cyan";
  showProgress?: boolean;
  maxValue?: number;
}

interface QuickStatsProps {
  stats: StatItem[];
  title?: string;
  className?: string;
}

const colorConfig = {
  blue: { text: "text-blue-500", bg: "bg-blue-500", ring: "ring-blue-500/20" },
  green: { text: "text-green-500", bg: "bg-green-500", ring: "ring-green-500/20" },
  orange: { text: "text-orange-500", bg: "bg-orange-500", ring: "ring-orange-500/20" },
  red: { text: "text-red-500", bg: "bg-red-500", ring: "ring-red-500/20" },
  cyan: { text: "text-cyan-500", bg: "bg-cyan-500", ring: "ring-cyan-500/20" },
};

function ProgressRing({
  progress,
  color,
  size = 48,
  strokeWidth = 4,
}: {
  progress: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted/30"
      />
      {/* Progress circle */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
  );
}

export function QuickStats({
  stats,
  title = "Quick Stats",
  className,
}: QuickStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className={cn("h-full", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => {
              const colors = colorConfig[stat.colorScheme || "blue"];
              const Icon = stat.icon;
              const progress =
                stat.showProgress && stat.maxValue
                  ? Math.min((stat.value / stat.maxValue) * 100, 100)
                  : null;

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.7 + index * 0.1,
                  }}
                  className="relative flex flex-col items-center justify-center p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  {/* Progress ring or icon */}
                  {progress !== null ? (
                    <div className="relative mb-2">
                      <ProgressRing
                        progress={progress}
                        color={colors.bg.replace("bg-", "var(--")}
                        size={48}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={cn("text-xs font-semibold", colors.text)}>
                          {Math.round(progress)}%
                        </span>
                      </div>
                    </div>
                  ) : Icon ? (
                    <div
                      className={cn(
                        "mb-2 p-2 rounded-lg",
                        `${colors.bg}/10`
                      )}
                    >
                      <Icon className={cn("h-5 w-5", colors.text)} />
                    </div>
                  ) : null}

                  {/* Value */}
                  <p className={cn("text-xl font-bold", colors.text)}>
                    <CountAnimation
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      duration={1.5}
                      delay={0.7 + index * 0.1}
                    />
                  </p>

                  {/* Label */}
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
