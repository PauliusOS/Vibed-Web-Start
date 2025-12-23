"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface ShootingStarsProps {
  minSpeed?: number;
  maxSpeed?: number;
  minDelay?: number;
  maxDelay?: number;
  starColor?: string;
  trailColor?: string;
  starWidth?: number;
  starHeight?: number;
  className?: string;
}

export const ShootingStars: React.FC<ShootingStarsProps> = ({
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1200,
  maxDelay = 4200,
  starColor = "#9E00FF",
  trailColor = "#2EB9DF",
  starWidth = 10,
  starHeight = 1,
  className = "",
}) => {
  const [star, setStar] = useState<React.ReactNode>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const createStar = () => {
      const yPos = Math.random() * 100;
      const delay = Math.random() * (maxDelay - minDelay) + minDelay;
      const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;

      const newStar = (
        <motion.rect
          key={Date.now()}
          x="-100%"
          y={`${yPos}%`}
          width={starWidth}
          height={starHeight}
          fill="url(#gradient)"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{
            duration: speed,
            ease: "linear",
            delay: delay / 1000,
          }}
        />
      );

      setStar(newStar);

      setTimeout(() => {
        createStar();
      }, delay);
    };

    createStar();
  }, [minSpeed, maxSpeed, minDelay, maxDelay, starWidth, starHeight]);

  return (
    <svg
      ref={svgRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: starColor, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      {star}
    </svg>
  );
};

export const StarsBackground: React.FC<{
  starDensity?: number;
  allStarsTwinkle?: boolean;
  twinkleProbability?: number;
  minTwinkleSpeed?: number;
  maxTwinkleSpeed?: number;
  minRadius?: number;
  maxRadius?: number;
  moveSpeed?: number;
  starColor?: { r: number; g: number; b: number };
  className?: string;
}> = ({
  starDensity = 0.00015,
  allStarsTwinkle = true,
  twinkleProbability = 0.7,
  minTwinkleSpeed = 0.5,
  maxTwinkleSpeed = 1,
  minRadius = 0.5,
  maxRadius = 1.5,
  moveSpeed = 0.15,
  starColor = { r: 147, g: 197, b: 253 }, // Blue color
  className = "",
}) => {
  const starsRef = useRef<
    Array<{ x: number; y: number; z: number; twinkle: boolean; twinkleSpeed: number; vx: number; vy: number }>
  >([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateStars();
    };

    const generateStars = () => {
      const newStars: Array<{
        x: number;
        y: number;
        z: number;
        twinkle: boolean;
        twinkleSpeed: number;
        vx: number;
        vy: number;
      }> = [];
      const starCount = Math.floor(canvas.width * canvas.height * starDensity);

      for (let i = 0; i < starCount; i++) {
        const shouldTwinkle = allStarsTwinkle || Math.random() < twinkleProbability;
        const angle = Math.random() * Math.PI * 2;
        const speed = moveSpeed * (0.5 + Math.random() * 0.5);
        newStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * (maxRadius - minRadius) + minRadius,
          twinkle: shouldTwinkle,
          twinkleSpeed:
            Math.random() * (maxTwinkleSpeed - minTwinkleSpeed) + minTwinkleSpeed,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        });
      }

      starsRef.current = newStars;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [starDensity, allStarsTwinkle, twinkleProbability, minTwinkleSpeed, maxTwinkleSpeed, minRadius, maxRadius, moveSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((star) => {
        // Update position
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.z, 0, Math.PI * 2);

        if (star.twinkle) {
          const opacity = 0.3 + Math.abs(Math.sin(time * star.twinkleSpeed)) * 0.5;
          ctx.fillStyle = `rgba(${starColor.r}, ${starColor.g}, ${starColor.b}, ${opacity})`;
        } else {
          ctx.fillStyle = `rgba(${starColor.r}, ${starColor.g}, ${starColor.b}, 0.6)`;
        }

        ctx.fill();
      });

      time += 0.01;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [starColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{ pointerEvents: "none" }}
    />
  );
};
