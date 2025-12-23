"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, useSpring, useTransform } from "motion/react";

type MetricType = "creatorsOnline" | "totalCreators" | "activeCampaigns" | "totalViews" | "totalVideos";

interface LiveStatsCounterProps {
  metricType: MetricType;
  label: string;
  formatValue?: (value: number) => string;
  className?: string;
}

export function LiveStatsCounter({
  metricType,
  label,
  formatValue,
  className = "",
}: LiveStatsCounterProps) {
  const stats = useQuery(api.platformStats.getLatestStats);
  const value = stats?.[metricType] ?? 0;

  const [displayValue, setDisplayValue] = useState(value);

  // Animate value changes
  const spring = useSpring(displayValue, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });

  const display = useTransform(spring, (current) =>
    formatValue ? formatValue(Math.round(current)) : Math.round(current).toLocaleString()
  );

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <div className={`flex flex-col ${className}`}>
      <motion.div
        className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span>{display}</motion.span>
      </motion.div>
      <motion.p
        className="text-sm md:text-base text-muted-foreground mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {label}
      </motion.p>
    </div>
  );
}
