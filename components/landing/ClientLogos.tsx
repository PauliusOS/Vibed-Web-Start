"use client";

import React from "react";
import { motion } from "motion/react";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

// Sample client logos - replace with actual client SVGs/images
const clientLogos = [
  { name: "Nike", width: 70 },
  { name: "Apple", width: 35 },
  { name: "Google", width: 90 },
  { name: "Meta", width: 80 },
  { name: "Amazon", width: 90 },
  { name: "Netflix", width: 80 },
  { name: "Spotify", width: 90 },
  { name: "Adobe", width: 70 },
  { name: "Shopify", width: 100 },
  { name: "Stripe", width: 60 },
];

// Text-based logos with liquid glass styling
function LogoPlaceholder({ name, width }: { name: string; width: number }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        "px-6 py-3 rounded-xl",
        "bg-white/[0.02] border border-white/[0.04]",
        "backdrop-blur-sm",
        "opacity-50 hover:opacity-80 hover:bg-white/[0.04] hover:border-white/[0.08]",
        "transition-all duration-500 cursor-default"
      )}
      style={{ minWidth: width + 32, height: 44 }}
    >
      <span className="text-white/70 font-medium text-[14px] tracking-tight whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export function ClientLogos() {
  return (
    <section className="relative py-16 bg-black border-y border-white/[0.04] overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full bg-gradient-to-r from-cyan-500/[0.02] via-white/[0.02] to-purple-500/[0.02] blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section label with glass pill */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <span className="text-[11px] font-medium text-white/40 uppercase tracking-widest">
              Trusted by leading brands
            </span>
          </span>
        </motion.div>

        {/* Marquee with liquid glass logos */}
        <div className="relative">
          <Marquee pauseOnHover className="[--duration:40s]">
            {clientLogos.map((logo) => (
              <LogoPlaceholder key={logo.name} name={logo.name} width={logo.width} />
            ))}
          </Marquee>

          {/* Enhanced gradient fades for seamless loop */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}
