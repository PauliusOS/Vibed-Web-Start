"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ParticleBurstProps {
  isActive: boolean;
  className?: string;
  color?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  isBurst: boolean;
}

let particleIdCounter = 0;

export function ParticleBurst({
  isActive,
  className,
  color = "rgba(255, 255, 255, 1)",
}: ParticleBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevActiveRef = useRef(false);

  // Create a single particle - gentle and slow
  const createParticle = useCallback((): Particle => {
    particleIdCounter++;
    return {
      id: particleIdCounter,
      // Full width spread: 10% to 90% of card width
      x: 10 + Math.random() * 80,
      y: 40, // Start from card opening
      vx: (Math.random() - 0.5) * 1.2, // Slower horizontal drift
      // Gentle upward velocity
      vy: -(2.5 + Math.random() * 2),
      size: 3 + Math.random() * 2,
      opacity: 1,
      isBurst: false,
    };
  }, []);

  // Handle activation/deactivation
  useEffect(() => {
    if (isActive && !prevActiveRef.current) {
      // Just activated - start continuous gentle spawning (no burst)
      // 8-10 particles per second = ~110ms interval
      spawnIntervalRef.current = setInterval(() => {
        setParticles(prev => [...prev, createParticle()]);
      }, 110);
    } else if (!isActive && prevActiveRef.current) {
      // Just deactivated - stop spawning new particles
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
      }
    }
    prevActiveRef.current = isActive;
  }, [isActive, createParticle]);

  // Animation loop - runs whenever there are particles
  useEffect(() => {
    if (particles.length === 0) return;

    const animate = () => {
      setParticles(prev => {
        const updated = prev
          .map(p => {
            // Slower fade rate for longer travel (~320px before fading)
            const fadeRate = p.isBurst ? 0.008 : 0.006;
            return {
              ...p,
              x: p.x + p.vx * 0.12,
              y: p.y + Math.abs(p.vy) * 0.25, // Move up (increase y = higher on screen)
              vy: p.vy * 0.995, // Very gradual slowdown
              opacity: Math.max(0, p.opacity - fadeRate),
            };
          })
          .filter(p => p.opacity > 0.02 && p.y < 250); // Remove faded or too-high particles

        return updated;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles.length > 0]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (particles.length === 0) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-visible z-[25]",
        className
      )}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            bottom: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size}px ${color}, 0 0 ${particle.size * 2}px ${color}, 0 0 ${particle.size * 3}px rgba(255, 255, 255, 0.5)`,
            transform: 'translate(-50%, 50%)',
          }}
        />
      ))}
    </div>
  );
}
