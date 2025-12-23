"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "motion/react";
import { Loader2 } from "lucide-react";

interface GlassButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "default" | "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      className,
      children,
      variant = "default",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      "relative inline-flex items-center justify-center gap-2",
      "font-medium rounded-lg",
      "transition-all duration-300 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
      "disabled:opacity-50 disabled:cursor-not-allowed"
    );

    const variantStyles = {
      default: cn(
        "bg-white/[0.04] border border-white/[0.08]",
        "text-white/80",
        "hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-white"
      ),
      primary: cn(
        "bg-white text-black",
        "hover:bg-white/90"
      ),
      ghost: cn(
        "bg-transparent text-white/50",
        "hover:text-white/80 hover:bg-white/[0.04]"
      ),
      outline: cn(
        "bg-transparent border border-white/[0.1]",
        "text-white/80",
        "hover:bg-white/[0.04] hover:border-white/[0.15] hover:text-white"
      ),
      danger: cn(
        "bg-red-500/10 border border-red-500/20",
        "text-red-400",
        "hover:bg-red-500/20 hover:border-red-500/30"
      ),
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        whileHover={!disabled && !isLoading ? { y: -1 } : undefined}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {size !== "icon" && <span>{children}</span>}
            {size === "icon" && children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

GlassButton.displayName = "GlassButton";

// GlassIconButton - for icon-only buttons
interface GlassIconButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "default" | "ghost";
  size?: "sm" | "md" | "lg";
  tooltip?: string;
}

const GlassIconButton = React.forwardRef<HTMLButtonElement, GlassIconButtonProps>(
  (
    { className, children, variant = "default", size = "md", tooltip, disabled, ...props },
    ref
  ) => {
    const baseStyles = cn(
      "relative inline-flex items-center justify-center",
      "rounded-lg",
      "transition-all duration-300 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
      "disabled:opacity-50 disabled:cursor-not-allowed"
    );

    const variantStyles = {
      default: cn(
        "bg-white/[0.04] border border-white/[0.06]",
        "text-white/60",
        "hover:bg-white/[0.08] hover:border-white/[0.1] hover:text-white/90"
      ),
      ghost: cn(
        "bg-transparent",
        "text-white/50",
        "hover:text-white/80 hover:bg-white/[0.04]"
      ),
    };

    const sizeStyles = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    };

    const iconSizeStyles = {
      sm: "[&>svg]:h-4 [&>svg]:w-4",
      md: "[&>svg]:h-5 [&>svg]:w-5",
      lg: "[&>svg]:h-6 [&>svg]:w-6",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          iconSizeStyles[size],
          className
        )}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : undefined}
        whileTap={!disabled ? { scale: 0.95 } : undefined}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        title={tooltip}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

GlassIconButton.displayName = "GlassIconButton";

export { GlassButton, GlassIconButton };
