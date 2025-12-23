"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { IconBrandLinkedin, IconBrandInstagram, IconBrandX } from "@tabler/icons-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Spotlight } from "@/components/ui/spotlight";

export function CTAFooter() {
  return (
    <section className="relative py-24 md:py-32 bg-black overflow-hidden">
      {/* Spotlight effects for liquid glass ambiance */}
      <Spotlight
        className="-top-20 left-1/4"
        fill="rgba(255, 255, 255, 0.03)"
      />
      <Spotlight
        className="top-0 right-1/4"
        fill="rgba(59, 130, 246, 0.02)"
      />

      {/* Enhanced ambient glow - centered */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gradient-to-b from-white/[0.03] via-white/[0.01] to-transparent blur-3xl" />

      {/* Side ambient glows */}
      <div className="absolute top-1/2 -left-20 w-[300px] h-[300px] rounded-full bg-cyan-500/[0.02] blur-3xl" />
      <div className="absolute top-1/2 -right-20 w-[300px] h-[300px] rounded-full bg-purple-500/[0.02] blur-3xl" />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main headline with TextGenerateEffect */}
          <div className="mb-6">
            <TextGenerateEffect
              words="Supercharge your creator marketing today."
              className="!text-3xl md:!text-4xl lg:!text-[44px] !font-medium !tracking-[-0.02em] !leading-[1.15]"
              duration={0.5}
            />
          </div>

          {/* Subtext with glass pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-[16px] text-white/50 max-w-md mx-auto leading-[1.7]">
              Join hundreds of brands transforming their influencer campaigns with OPA.
            </p>
          </motion.div>

          {/* CTA Button with HoverBorderGradient */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            <Link href="/demo">
              <HoverBorderGradient
                containerClassName="rounded-full"
                className="flex items-center gap-2 px-8 py-3 bg-white text-black font-medium text-[14px] hover:bg-white/95"
                duration={2}
              >
                <span>Book a Demo</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </HoverBorderGradient>
            </Link>
          </motion.div>

          {/* Social links with glass effect */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 flex items-center justify-center gap-3"
          >
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group"
            >
              <IconBrandLinkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group"
            >
              <IconBrandInstagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group"
            >
              <IconBrandX className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
