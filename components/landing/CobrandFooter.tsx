"use client";

import React from "react";
import Link from "next/link";

export function CobrandFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
              <span className="text-black font-semibold text-sm">O</span>
            </div>
            <span className="text-[15px] font-medium text-white/90">OPA</span>
          </Link>

          {/* Legal links */}
          <div className="flex items-center gap-6 text-[13px] text-white/40">
            <span>&copy; {currentYear} OPA</span>
            <Link href="/privacy" className="hover:text-white/70 transition-colors duration-300">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors duration-300">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
