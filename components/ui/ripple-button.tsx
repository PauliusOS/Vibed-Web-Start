"use client";

import { useState, MouseEvent, ComponentProps } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

interface RippleProps {
  x: number;
  y: number;
  id: number;
}

interface RippleButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  rippleColor?: string;
  rippleDuration?: number;
  asChild?: boolean;
}

export function RippleButton({
  children,
  className,
  rippleColor = "rgba(255, 255, 255, 0.4)",
  rippleDuration = 600,
  onClick,
  variant,
  size,
  asChild,
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<RippleProps[]>([]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, rippleDuration);

    onClick?.(event);
  };

  return (
    <Button
      className={cn("relative overflow-hidden", className)}
      onClick={handleClick}
      variant={variant}
      size={size}
      {...props}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="pointer-events-none absolute rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              backgroundColor: rippleColor,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{ width: 400, height: 400, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: rippleDuration / 1000, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </Button>
  );
}
