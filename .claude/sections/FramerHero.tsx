"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowingOrb } from "@/components/ui/glowing-orb";
import {
  FramerAnalyticsDashboard,
  generateSampleAnalyticsData,
  sampleCountryData,
  sampleDeviceData,
} from "@/components/admin/charts/FramerAnalyticsDashboard";

interface FramerHeroProps {
  title?: string;
  subtitle?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  className?: string;
}

/**
 * FramerHero - A hero section inspired by Framer's Analytics page
 *
 * Features:
 * - Bold centered headline
 * - Subtitle paragraph
 * - Two CTAs (primary filled, secondary text)
 * - Full-width analytics dashboard showcase below
 * - Glowing blue orbs on both sides
 */
export function FramerHero({
  title = "Scale creator campaigns effortlessly",
  subtitle = "Track performance, manage creators, and optimize campaigns with real-time analytics. Built for modern marketing teams.",
  primaryCTA = { label: "Start for free", href: "/sign-up" },
  secondaryCTA = { label: "Watch video", href: "#demo" },
  className,
}: FramerHeroProps) {
  const chartData = generateSampleAnalyticsData(30);

  return (
    <section
      className={cn(
        "relative w-full bg-black overflow-hidden",
        className
      )}
    >
      {/* Glowing Orbs Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GlowingOrb
          position="left"
          size="xl"
          intensity="high"
          className="-translate-y-1/4"
        />
        <GlowingOrb
          position="right"
          size="xl"
          intensity="high"
          className="translate-y-1/4"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Text Section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 md:pt-40 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed"
            >
              {subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex items-center justify-center gap-4"
            >
              <Link
                href={primaryCTA.href}
                className={cn(
                  "inline-flex items-center justify-center",
                  "h-12 px-6 rounded-full",
                  "bg-white text-black font-medium text-sm",
                  "hover:bg-white/90 transition-colors",
                  "shadow-lg shadow-white/10"
                )}
              >
                {primaryCTA.label}
              </Link>
              <button
                onClick={() => {
                  const el = document.querySelector(secondaryCTA.href);
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className={cn(
                  "inline-flex items-center justify-center",
                  "h-12 px-6 rounded-full",
                  "bg-transparent text-white/70 font-medium text-sm",
                  "border border-white/10",
                  "hover:bg-white/5 hover:text-white hover:border-white/20",
                  "transition-all"
                )}
              >
                {secondaryCTA.label}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Dashboard Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-6 lg:px-8 pb-20"
        >
          <div className="rounded-2xl border border-white/[0.08] bg-black/50 backdrop-blur-sm p-6 md:p-8">
            <FramerAnalyticsDashboard
              chartData={chartData}
              countryData={sampleCountryData}
              deviceData={sampleDeviceData}
              liveVisitors={127}
            />
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex justify-center pb-12"
        >
          <Link
            href="#features"
            className="inline-flex flex-col items-center gap-2 text-white/40 hover:text-white/60 transition-colors group"
          >
            <span className="text-xs font-medium uppercase tracking-wider">
              See how it works
            </span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
