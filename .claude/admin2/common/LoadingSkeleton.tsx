"use client";

import { motion } from "motion/react";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export function LoadingSkeleton({
  className = "",
  variant = "text",
  width,
  height,
  animate = true,
}: LoadingSkeletonProps) {
  const baseClass = "bg-white/[0.05] overflow-hidden";

  const variantClass = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-lg",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  const shimmer = (
    <motion.div
      className="h-full w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
      animate={
        animate
          ? {
              x: ["-100%", "100%"],
            }
          : {}
      }
      transition={{
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      }}
    />
  );

  return (
    <div
      className={`${baseClass} ${variantClass[variant]} ${className}`}
      style={style}
    >
      {animate && shimmer}
    </div>
  );
}

// Pre-made skeleton layouts
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`p-6 bg-white/[0.02] border border-white/[0.06] rounded-lg ${className}`}>
      <div className="space-y-4">
        <LoadingSkeleton variant="rounded" height={200} />
        <LoadingSkeleton width="60%" />
        <LoadingSkeleton width="80%" />
        <div className="flex gap-2">
          <LoadingSkeleton variant="rounded" width={80} height={32} />
          <LoadingSkeleton variant="rounded" width={80} height={32} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className = "",
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={`bg-white/[0.02] border border-white/[0.06] rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <LoadingSkeleton key={`header-${i}`} width="70%" />
          ))}
        </div>
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="p-4 border-b border-white/[0.06] last:border-b-0"
        >
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <LoadingSkeleton key={`cell-${rowIndex}-${colIndex}`} width="90%" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({
  items = 5,
  className = "",
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={`list-item-${i}`}
          className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
        >
          <LoadingSkeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton width="40%" />
            <LoadingSkeleton width="70%" />
          </div>
          <LoadingSkeleton variant="rounded" width={80} height={32} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ className = "" }: { className?: string }) {
  return (
    <div className={`p-6 bg-white/[0.02] border border-white/[0.06] rounded-lg ${className}`}>
      <div className="space-y-4">
        <LoadingSkeleton width="30%" height={24} />
        <LoadingSkeleton variant="rounded" height={300} />
        <div className="flex justify-center gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`legend-${i}`} className="flex items-center gap-2">
              <LoadingSkeleton variant="circular" width={12} height={12} />
              <LoadingSkeleton width={60} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonProfile({ className = "" }: { className?: string }) {
  return (
    <div className={`p-6 bg-white/[0.02] border border-white/[0.06] rounded-lg ${className}`}>
      <div className="flex items-start gap-6">
        <LoadingSkeleton variant="circular" width={96} height={96} />
        <div className="flex-1 space-y-3">
          <LoadingSkeleton width="40%" height={28} />
          <LoadingSkeleton width="60%" />
          <LoadingSkeleton width="80%" />
          <div className="flex gap-2 mt-4">
            <LoadingSkeleton variant="rounded" width={100} height={36} />
            <LoadingSkeleton variant="rounded" width={100} height={36} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonMetric({ className = "" }: { className?: string }) {
  return (
    <div className={`p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg ${className}`}>
      <div className="space-y-2">
        <LoadingSkeleton width="50%" />
        <LoadingSkeleton width="70%" height={32} />
        <LoadingSkeleton width="40%" height={12} />
      </div>
    </div>
  );
}

export function SkeletonGrid({
  items = 6,
  columns = 3,
  className = "",
}: {
  items?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      className={`grid gap-4 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonCard key={`grid-item-${i}`} />
      ))}
    </div>
  );
}
