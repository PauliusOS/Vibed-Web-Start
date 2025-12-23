"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface IdleSparklesProps {
  className?: string;
  particleCount?: number;
}

interface Sparkle {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: string;
  maxOpacity: number;
}

export function IdleSparkles({
  className,
  particleCount = 3,
}: IdleSparklesProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    // Evenly distributed positions and staggered delays for consistency
    const positions = [30, 50, 70]; // Fixed positions across the folder
    const delays = [0, 10, 20]; // Staggered delays in seconds
    const opacities = [0.6, 0.3, 0.4]; // Varied max opacities - some dimmer

    setSparkles(
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: `${positions[i % positions.length]}%`,
        delay: `${delays[i % delays.length]}s`,
        duration: `60s`,
        size: `2px`,
        maxOpacity: opacities[i % opacities.length],
      }))
    );
  }, [particleCount]);

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden",
        className
      )}
    >
      <style jsx>{`
        @keyframes sparkle-float {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: var(--max-opacity);
          }
          35% {
            opacity: calc(var(--max-opacity) * 0.65);
          }
          55% {
            opacity: calc(var(--max-opacity) * 0.3);
          }
          70% {
            transform: translateY(-30px) scale(0.5);
            opacity: 0;
          }
          100% {
            transform: translateY(-30px) scale(0.5);
            opacity: 0;
          }
        }
        .sparkle {
          position: absolute;
          bottom: 35%;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          animation: sparkle-float var(--duration) linear infinite;
          animation-delay: var(--delay);
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.8), 0 0 8px rgba(200, 200, 220, 0.4);
        }
      `}</style>

      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            left: sparkle.left,
            width: sparkle.size,
            height: sparkle.size,
            ["--delay" as string]: sparkle.delay,
            ["--duration" as string]: sparkle.duration,
            ["--max-opacity" as string]: sparkle.maxOpacity,
          }}
        />
      ))}
    </div>
  );
}
