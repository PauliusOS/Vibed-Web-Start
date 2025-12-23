"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "motion/react";

interface GlassPanelProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  variant?: "default" | "sidebar" | "header" | "modal";
  blur?: "sm" | "md" | "lg" | "xl";
}

const blurValues = {
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
};

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, children, variant = "default", blur = "lg", ...props }, ref) => {
    const baseStyles = "relative overflow-hidden";

    const variantStyles = {
      default: cn(
        "rounded-xl border border-white/[0.06]",
        "bg-white/[0.02]"
      ),
      sidebar: cn(
        "h-full border-r border-white/[0.06]",
        "bg-[rgba(8,8,8,0.95)]"
      ),
      header: cn(
        "sticky top-0 z-40 border-b border-white/[0.06]",
        "bg-black/80"
      ),
      modal: cn(
        "rounded-2xl border border-white/[0.08]",
        "bg-[rgba(12,12,12,0.95)]",
        "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
      ),
    };

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        style={{
          backdropFilter: `blur(${blurValues[blur]})`,
          WebkitBackdropFilter: `blur(${blurValues[blur]})`,
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassPanel.displayName = "GlassPanel";

// GlassDivider - subtle divider for glass panels
interface GlassDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

const GlassDivider = React.forwardRef<HTMLDivElement, GlassDividerProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-white/[0.06]",
        orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
        className
      )}
      {...props}
    />
  )
);

GlassDivider.displayName = "GlassDivider";

// GlassOverlay - for modals and overlays
interface GlassOverlayProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
}

const GlassOverlay = React.forwardRef<HTMLDivElement, GlassOverlayProps>(
  ({ className, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  )
);

GlassOverlay.displayName = "GlassOverlay";

export { GlassPanel, GlassDivider, GlassOverlay };
