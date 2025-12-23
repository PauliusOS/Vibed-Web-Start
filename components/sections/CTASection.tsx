"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function CTASection() {
  return (
    <section
      id="cta"
      className="flex flex-col items-center justify-center w-full relative px-6 py-12 md:py-20 bg-background"
    >
      <div className="w-full max-w-7xl">
        {/* CTA Card - Magic UI Style */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="h-[400px] md:h-[450px] overflow-hidden shadow-lg w-full border border-border rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 relative"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-grid-pattern-fine" />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/60" />

          {/* Large Logo - Bottom Right (Asymmetric) */}
          <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none hidden md:block">
            <Image
              src="/opa-logo.svg"
              alt=""
              width={320}
              height={320}
              className="w-80 h-80"
            />
          </div>

          {/* Content - Asymmetrically positioned */}
          <div className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-16 lg:px-24">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent backdrop-blur-sm border border-border text-sm text-foreground mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-medium">Limited Time Offer</span>
              </div>

              {/* Headline */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
                Ready to Transform Your
                <br />
                <span className="gradient-text-blue">
                  Influencer Marketing?
                </span>
              </h2>

              {/* Description */}
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Join 500+ brands running data-driven campaigns that actually deliver results. Start your journey today.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link href="/demo">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-12 flex items-center justify-center px-8 text-sm font-semibold tracking-wide rounded-full bg-primary text-primary-foreground shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_3px_3px_-1.5px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.2)] border border-border hover:bg-primary/90 transition-all duration-200"
                  >
                    Book a Demo
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </motion.button>
                </Link>
                <Link href="#strategy">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-12 flex items-center justify-center px-8 text-sm font-medium tracking-wide rounded-full bg-transparent text-foreground border border-border hover:bg-accent hover:border-border transition-all duration-200"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Data-driven approach</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Proven ROI</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Expert support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
