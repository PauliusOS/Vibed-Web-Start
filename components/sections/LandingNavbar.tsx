"use client";

import { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Features", link: "#features" },
    { name: "Case Studies", link: "#case-studies" },
    { name: "Pricing", link: "#pricing" },
    { name: "Resources", link: "#resources" },
  ];

  return (
    <Navbar className="top-0 bg-[rgb(2,6,23)]/80 backdrop-blur-xl border-b border-white/10">
      <NavBody>
        {/* Logo */}
        <Link
          href="/home"
          className="relative z-20 flex items-center gap-2 px-2 py-1 text-sm font-semibold"
        >
          <span className="text-xl font-bold text-white">
            SylcRoad
          </span>
          <span className="text-lg text-blue-400 font-light">×</span>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            SocialSculp
          </span>
        </Link>

        {/* Nav Items */}
        <NavItems
          items={navItems}
          className="text-white/80 hover:text-white transition-colors duration-200"
        />

        {/* Buttons */}
        <div className="relative z-20 flex items-center gap-2">
          <NavbarButton
            href="/sign-in"
            variant="secondary"
            className="text-white hover:bg-white/10 border-white/20"
          >
            Sign In
          </NavbarButton>
          <NavbarButton
            href="/sign-up"
            variant="dark"
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Get Started
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Nav */}
      <MobileNav>
        <MobileNavHeader>
          <Link
            href="/home"
            className="flex items-center gap-2 px-2 py-1 text-sm font-semibold"
          >
            <span className="text-xl font-bold text-white">SylcRoad</span>
            <span className="text-lg text-blue-400 font-light">×</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">SocialSculp</span>
          </Link>
          <MobileNavToggle
            isOpen={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              {item.name}
            </a>
          ))}
          <div className="flex flex-col gap-2 w-full mt-4">
            <NavbarButton
              href="/sign-in"
              variant="secondary"
              className="w-full text-white hover:bg-white/10 border-white/20"
            >
              Sign In
            </NavbarButton>
            <NavbarButton
              href="/sign-up"
              variant="dark"
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              Get Started
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
