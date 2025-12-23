"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

interface CountAnimationProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  formatNumber?: boolean;
}

export function CountAnimation({
  value,
  duration = 1.5,
  delay = 0,
  className,
  prefix = "",
  suffix = "",
  decimals = 0,
  formatNumber = true,
}: CountAnimationProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasStarted, setHasStarted] = useState(false);
  const [displayValue, setDisplayValue] = useState("0");

  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    const unsubscribe = spring.on("change", (current) => {
      const num = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);
      if (formatNumber) {
        if (typeof num === "number") {
          setDisplayValue(num.toLocaleString());
        } else {
          setDisplayValue(
            parseFloat(num).toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })
          );
        }
      } else {
        setDisplayValue(String(num));
      }
    });

    return () => unsubscribe();
  }, [spring, decimals, formatNumber]);

  useEffect(() => {
    if (isInView && !hasStarted) {
      const timeout = setTimeout(() => {
        spring.set(value);
        setHasStarted(true);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, hasStarted, spring, value, delay]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      <span>{displayValue}</span>
      {suffix}
    </span>
  );
}

interface AnimatedNumberProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedNumber({
  value,
  className,
  prefix = "",
  suffix = "",
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState("0");

  const spring = useSpring(value, {
    duration: 500,
    bounce: 0,
  });

  useEffect(() => {
    const unsubscribe = spring.on("change", (current) => {
      setDisplayValue(Math.floor(current).toLocaleString());
    });

    return () => unsubscribe();
  }, [spring]);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      <span>{displayValue}</span>
      {suffix}
    </span>
  );
}
