"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FramerCTAFooterProps {
  headline?: string;
  subheadline?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  className?: string;
}

/**
 * FramerCTAFooter - Bold CTA section inspired by Framer's "Design bold. Launch fast."
 *
 * Features:
 * - Large, bold headline (can be multi-line)
 * - Two CTAs side by side
 * - Clean, minimal design
 * - Optional gradient text effect
 */
export function FramerCTAFooter({
  headline = "Design bold.\nLaunch fast.",
  subheadline,
  primaryCTA = { label: "Start for free", href: "/sign-up" },
  secondaryCTA = { label: "Start with AI", href: "/demo" },
  className,
}: FramerCTAFooterProps) {
  // Split headline by newlines for separate animation
  const headlineLines = headline.split("\n");

  return (
    <section
      className={cn(
        "relative w-full py-32 md:py-40 bg-black overflow-hidden",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              {headlineLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </motion.div>

          {/* Optional Subheadline */}
          {subheadline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-lg text-white/50 max-w-xl mx-auto"
            >
              {subheadline}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex items-center justify-center gap-4"
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
            <Link
              href={secondaryCTA.href}
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
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * FramerMinimalFooter - Clean footer with links
 */
interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FramerMinimalFooterProps {
  sections?: FooterSection[];
  className?: string;
}

export function FramerMinimalFooter({
  sections = defaultFooterSections,
  className,
}: FramerMinimalFooterProps) {
  return (
    <footer
      className={cn(
        "w-full py-16 bg-black border-t border-white/[0.06]",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo Section */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <span className="text-black font-bold text-sm">S</span>
              </div>
              <span className="text-white font-medium">SylcRoad</span>
            </Link>
            <p className="mt-4 text-sm text-white/40 max-w-xs">
              Scale creator campaigns with real-time analytics and seamless management.
            </p>
          </div>

          {/* Link Sections */}
          {sections.map((section, i) => (
            <div key={i}>
              <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} SylcRoad. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const defaultFooterSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Analytics", href: "#analytics" },
      { label: "Integrations", href: "#integrations" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Help Center", href: "/help" },
      { label: "API Reference", href: "/api" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];
