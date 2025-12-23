"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Analytics", href: "#analytics" },
  { label: "Pricing", href: "#pricing" },
  { label: "Stories", href: "#stories" },
];

export function CobrandNav() {
  const { isSignedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500",
          scrolled
            ? "w-[calc(100%-3rem)] max-w-4xl"
            : "w-[calc(100%-3rem)] max-w-5xl"
        )}
      >
        <div
          className={cn(
            "rounded-2xl transition-all duration-500",
            scrolled
              ? "bg-black/70 backdrop-blur-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              : "bg-black/30 backdrop-blur-md border border-white/[0.04]"
          )}
        >
          <div className="px-5 lg:px-6">
            <div className="flex items-center justify-between h-12 md:h-14">
              {/* Logo with glass effect */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center group-hover:bg-white transition-colors shadow-sm">
                  <span className="text-black font-semibold text-sm">O</span>
                </div>
                <span className="text-[15px] font-medium text-white/90">OPA</span>
              </Link>

              {/* Desktop Navigation with glass pills on hover */}
              <div className="hidden md:flex items-center">
                <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/[0.02]">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-[13px] font-medium",
                        "text-white/50 hover:text-white/90",
                        "hover:bg-white/[0.06]",
                        "transition-all duration-300"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Desktop CTA with HoverBorderGradient */}
              <div className="hidden md:flex items-center gap-2">
                {isSignedIn ? (
                  <Link href="/admin">
                    <HoverBorderGradient
                      containerClassName="rounded-full"
                      className="px-4 py-1.5 bg-white text-black text-[13px] font-medium"
                      duration={2}
                    >
                      Dashboard
                    </HoverBorderGradient>
                  </Link>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <button className="h-8 px-3 text-[13px] font-medium text-white/60 hover:text-white/90 transition-colors">
                        Log in
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <HoverBorderGradient
                        containerClassName="rounded-full"
                        className="px-4 py-1.5 bg-white text-black text-[13px] font-medium"
                        duration={2}
                      >
                        Book a Demo
                      </HoverBorderGradient>
                    </SignUpButton>
                  </>
                )}
              </div>

              {/* Mobile Menu Button with glass effect */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "md:hidden p-2 rounded-lg",
                  "bg-white/[0.04] border border-white/[0.06]",
                  "text-white/70 hover:text-white hover:bg-white/[0.08]",
                  "transition-all duration-300"
                )}
              >
                {mobileMenuOpen ? (
                  <IconX className="w-5 h-5" />
                ) : (
                  <IconMenu2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Liquid Glass Premium */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl pt-20 md:hidden"
          >
            {/* Ambient glows */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-b from-white/[0.02] to-transparent blur-3xl pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="px-6 py-8"
            >
              {/* Nav links with glass pills */}
              <div className="space-y-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-xl",
                        "text-[15px] font-medium text-white/80",
                        "bg-white/[0.02] border border-white/[0.04]",
                        "hover:bg-white/[0.04] hover:border-white/[0.08] hover:text-white",
                        "transition-all duration-300"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* CTA buttons with glass effect */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="pt-8 mt-8 border-t border-white/[0.04] space-y-3"
              >
                {isSignedIn ? (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full h-12 text-[14px] font-medium rounded-xl bg-white text-black hover:bg-white/90 transition-colors">
                      Dashboard
                    </button>
                  </Link>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <button className={cn(
                        "w-full h-12 text-[14px] font-medium rounded-xl",
                        "text-white/70 bg-white/[0.03] border border-white/[0.06]",
                        "hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-white",
                        "transition-all duration-300"
                      )}>
                        Log in
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="w-full h-12 text-[14px] font-medium rounded-xl bg-white text-black hover:bg-white/90 transition-colors">
                        Book a Demo
                      </button>
                    </SignUpButton>
                  </>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
