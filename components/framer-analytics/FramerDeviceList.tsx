"use client";

import { motion } from "motion/react";
import { Monitor, Smartphone, Tablet, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FRAMER_TEXT_COLORS,
  FRAMER_TYPOGRAPHY,
  FRAMER_BG_COLORS,
} from "./constants/colors";
import { formatCompactNumber } from "./utils/formatters";

interface DeviceData {
  type: "desktop" | "mobile" | "tablet" | "other";
  name: string;
  visitors: number;
  percentage: number;
}

const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
  other: Tv,
};

interface FramerDeviceListProps {
  data: DeviceData[];
  title?: string;
  className?: string;
  animate?: boolean;
}

/**
 * FramerDeviceList - Device breakdown list matching Framer's style
 */
export function FramerDeviceList({
  data,
  title = "Devices",
  className,
  animate = true,
}: FramerDeviceListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Title */}
      <h3
        className="font-semibold"
        style={{
          color: FRAMER_TEXT_COLORS.primary,
          fontFamily: FRAMER_TYPOGRAPHY.body,
          fontWeight: FRAMER_TYPOGRAPHY.weights.semibold,
          fontSize: "14px",
        }}
      >
        {title}
      </h3>

      {/* List */}
      <div className="space-y-2">
        {data.map((device, index) => {
          const Icon = deviceIcons[device.type] || Tv;

          return (
            <motion.div
              key={device.type}
              initial={animate ? { opacity: 0, x: -10 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center justify-between py-1.5"
            >
              {/* Device info */}
              <div className="flex items-center gap-2.5">
                <Icon
                  size={16}
                  style={{ color: FRAMER_TEXT_COLORS.secondary }}
                />
                <span
                  className="text-sm"
                  style={{
                    color: FRAMER_TEXT_COLORS.primary,
                    fontFamily: FRAMER_TYPOGRAPHY.body,
                    fontWeight: FRAMER_TYPOGRAPHY.weights.normal,
                  }}
                >
                  {device.name}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3">
                <span
                  className="text-sm tabular-nums"
                  style={{
                    color: FRAMER_TEXT_COLORS.primary,
                    fontFamily: FRAMER_TYPOGRAPHY.body,
                    fontWeight: FRAMER_TYPOGRAPHY.weights.normal,
                  }}
                >
                  {formatCompactNumber(device.visitors)}
                </span>
                <div className="flex items-center gap-2 min-w-[60px]">
                  {/* Progress bar */}
                  <div
                    className="flex-1 h-1 rounded-full overflow-hidden"
                    style={{ backgroundColor: FRAMER_BG_COLORS.cardBorder }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: FRAMER_TEXT_COLORS.secondary }}
                      initial={{ width: 0 }}
                      animate={{ width: `${device.percentage}%` }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.05 + 0.2,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  </div>
                  <span
                    className="text-xs tabular-nums min-w-[28px] text-right"
                    style={{
                      color: FRAMER_TEXT_COLORS.secondary,
                      fontFamily: FRAMER_TYPOGRAPHY.body,
                      fontWeight: FRAMER_TYPOGRAPHY.weights.normal,
                    }}
                  >
                    {device.percentage}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default FramerDeviceList;
