"use client";

import { motion } from "motion/react";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CountAnimation } from "@/components/ui/count-animation";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MetricPreview {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

interface DetailLinkCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  href: string;
  metrics: MetricPreview[];
  colorScheme?: "blue" | "green" | "orange" | "purple" | "cyan";
  delay?: number;
}

const colorConfig = {
  blue: {
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-500",
    hover: "hover:border-blue-500/30",
    gradient: "from-blue-500/5 via-transparent to-transparent",
  },
  green: {
    iconBg: "bg-green-500/10",
    iconText: "text-green-500",
    hover: "hover:border-green-500/30",
    gradient: "from-green-500/5 via-transparent to-transparent",
  },
  orange: {
    iconBg: "bg-orange-500/10",
    iconText: "text-orange-500",
    hover: "hover:border-orange-500/30",
    gradient: "from-orange-500/5 via-transparent to-transparent",
  },
  purple: {
    iconBg: "bg-purple-500/10",
    iconText: "text-purple-500",
    hover: "hover:border-purple-500/30",
    gradient: "from-purple-500/5 via-transparent to-transparent",
  },
  cyan: {
    iconBg: "bg-cyan-500/10",
    iconText: "text-cyan-500",
    hover: "hover:border-cyan-500/30",
    gradient: "from-cyan-500/5 via-transparent to-transparent",
  },
};

export function DetailLinkCard({
  title,
  description,
  icon: Icon,
  href,
  metrics,
  colorScheme = "blue",
  delay = 0,
}: DetailLinkCardProps) {
  const colors = colorConfig[colorScheme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Link href={href} className="block group">
        <Card
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            "hover:shadow-lg",
            colors.hover
          )}
        >
          {/* Gradient background on hover */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              colors.gradient
            )}
          />

          <CardContent className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              {/* Icon */}
              <motion.div
                className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                  colors.iconBg
                )}
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.3 }}
              >
                <Icon className={cn("h-6 w-6", colors.iconText)} />
              </motion.div>

              {/* Arrow indicator */}
              <motion.div
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -5 }}
                whileHover={{ x: 0 }}
              >
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            </div>

            {/* Title and description */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>

            {/* Metrics preview */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              {metrics.slice(0, 4).map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: delay * 0.1 + 0.2 + index * 0.1 }}
                  className="space-y-1"
                >
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="text-lg font-semibold">
                    <CountAnimation
                      value={metric.value}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                      duration={1.5}
                      delay={delay * 0.1 + 0.3}
                    />
                  </p>
                </motion.div>
              ))}
            </div>

            {/* View details button */}
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full group-hover:bg-muted/50 transition-colors"
              >
                View Details
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
