"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "motion/react";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "interactive";
  glow?: "none" | "blue" | "light" | "sky" | "ambient" | "cyan"; // Blue-only theme with legacy cyan support
  noPadding?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      children,
      variant = "default",
      glow = "none",
      noPadding = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative overflow-hidden rounded-xl border border-white/[0.06] transition-all duration-400";

    const variantStyles = {
      default: "bg-white/[0.02] backdrop-blur-[24px]",
      elevated:
        "bg-white/[0.03] backdrop-blur-[32px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.04)]",
      interactive:
        "bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-[24px] shadow-[0_2px_16px_-2px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.03)] cursor-pointer",
    };

    const glowStyles = {
      none: "",
      blue: "shadow-[0_0_60px_rgba(59,130,246,0.12)]",
      light: "shadow-[0_0_60px_rgba(96,165,250,0.12)]",   // blue-400 glow
      sky: "shadow-[0_0_60px_rgba(56,189,248,0.12)]",     // sky-400 glow
      ambient: "shadow-[0_0_60px_rgba(59,130,246,0.06)]", // Subtle blue ambient
      // Legacy - map cyan to sky blue
      cyan: "shadow-[0_0_60px_rgba(56,189,248,0.12)]",
    };

    const hoverVariants = {
      default: {
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
      elevated: {
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        y: -2,
        boxShadow:
          "0 8px 32px -4px rgba(0, 0, 0, 0.4), 0 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)",
      },
      interactive: {
        borderColor: "rgba(255, 255, 255, 0.1)",
        y: -2,
        scale: 1.01,
        boxShadow:
          "0 8px 32px -4px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
      },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          glowStyles[glow],
          !noPadding && "p-5 sm:p-6",
          className
        )}
        whileHover={hoverVariants[variant]}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        {...props}
      >
        {/* Shine effect on hover */}
        {variant === "interactive" && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
            }}
          />
        )}
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

// GlassCardHeader component
interface GlassCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const GlassCardHeader = React.forwardRef<HTMLDivElement, GlassCardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5", className)}
      {...props}
    >
      {children}
    </div>
  )
);

GlassCardHeader.displayName = "GlassCardHeader";

// GlassCardTitle component
interface GlassCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

const GlassCardTitle = React.forwardRef<HTMLHeadingElement, GlassCardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-lg font-medium text-white/90 tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
);

GlassCardTitle.displayName = "GlassCardTitle";

// GlassCardDescription component
interface GlassCardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  GlassCardDescriptionProps
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-white/50", className)}
    {...props}
  >
    {children}
  </p>
));

GlassCardDescription.displayName = "GlassCardDescription";

// GlassCardContent component
interface GlassCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const GlassCardContent = React.forwardRef<HTMLDivElement, GlassCardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("pt-4", className)} {...props}>
      {children}
    </div>
  )
);

GlassCardContent.displayName = "GlassCardContent";

// GlassCardFooter component
interface GlassCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const GlassCardFooter = React.forwardRef<HTMLDivElement, GlassCardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center pt-4 border-t border-white/[0.06]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

GlassCardFooter.displayName = "GlassCardFooter";

export {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
};
