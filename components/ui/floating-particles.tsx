"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FloatingParticlesProps {
  isActive: boolean;
  className?: string;
  particleCount?: number;
  color?: string;
  originMode?: "folder" | "card" | "both";
}

interface Particle {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: string;
  origin: "folder" | "card";
}

export function FloatingParticles({
  isActive,
  className,
  particleCount = 20,
  color = "rgba(59, 130, 246, 0.8)",
  originMode = "folder",
}: FloatingParticlesProps) {
  // Generate particles only on client to avoid hydration mismatch
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: particleCount }, (_, i) => {
        let origin: "folder" | "card" = "folder";
        if (originMode === "card") {
          origin = "card";
        } else if (originMode === "both") {
          origin = i < particleCount / 2 ? "folder" : "card";
        }

        // Card particles are more centered, folder particles spread wider
        const leftRange = origin === "card"
          ? { min: 30, range: 40 }  // 30-70% for card
          : { min: 10, range: 80 }; // 10-90% for folder

        return {
          id: i,
          left: `${leftRange.min + Math.random() * leftRange.range}%`,
          delay: `${Math.random() * 2}s`,
          duration: `${2.5 + Math.random() * 1.5}s`,
          size: `${2 + Math.random() * 3}px`,
          origin,
        };
      })
    );
  }, [particleCount, originMode]);

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-300",
        isActive ? "opacity-100" : "opacity-0",
        className
      )}
    >
      <style jsx>{`
        @keyframes float-up-folder {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-120px) scale(0.5);
            opacity: 0;
          }
        }
        @keyframes float-up-card {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-100px) scale(0.6);
            opacity: 0;
          }
        }
        .particle-folder {
          position: absolute;
          bottom: 30%;
          border-radius: 50%;
          animation: float-up-folder var(--duration) ease-out infinite;
          animation-delay: var(--delay);
          box-shadow: 0 0 6px var(--color), 0 0 12px var(--color);
        }
        .particle-card {
          position: absolute;
          bottom: 42%;
          border-radius: 50%;
          animation: float-up-card var(--duration) ease-out infinite;
          animation-delay: var(--delay);
          box-shadow: 0 0 8px var(--color), 0 0 16px var(--color), 0 0 24px var(--color);
        }
      `}</style>

      {particles.map((particle) => (
        <div
          key={particle.id}
          className={particle.origin === "card" ? "particle-card" : "particle-folder"}
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            ["--delay" as string]: particle.delay,
            ["--duration" as string]: particle.duration,
            ["--color" as string]: color,
          }}
        />
      ))}
    </div>
  );
}
