"use client";

import Link from "next/link";
import { Twitter, Linkedin, Instagram, Youtube, ChevronRight } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { useState, useEffect } from "react";

export function LandingFooter() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const footerLinks = [
    {
      title: "Product",
      links: [
        { id: 1, title: "Features", url: "#services" },
        { id: 2, title: "Strategy", url: "#strategy" },
        { id: 3, title: "Creators", url: "#creators" },
        { id: 4, title: "Results", url: "#results" }
      ]
    },
    {
      title: "Company",
      links: [
        { id: 1, title: "Book a Demo", url: "/demo" },
        { id: 2, title: "Sign In", url: "/sign-in" },
        { id: 3, title: "Contact", url: "/demo" }
      ]
    },
    {
      title: "Legal",
      links: [
        { id: 1, title: "Privacy Policy", url: "#privacy" },
        { id: 2, title: "Terms of Service", url: "#terms" }
      ]
    }
  ];

  return (
    <footer id="footer" className="w-full pb-0 bg-background">
      {/* Main Footer Content */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between p-10 md:p-16 max-w-7xl mx-auto">
        {/* Brand Column */}
        <div className="flex flex-col items-start justify-start gap-y-5 max-w-xs mx-0 mb-8 md:mb-0">
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-foreground">SylcRoad</p>
            <span className="text-lg text-primary font-light">×</span>
            <p className="text-xl font-bold gradient-text-blue">SocialSculp</p>
          </div>
          <p className="tracking-tight text-muted-foreground font-medium text-sm leading-relaxed">
            Scientific influencer marketing that delivers measurable results. A/B tested weekly, optimized continuously.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://twitter.com"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://linkedin.com"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link
              href="https://instagram.com"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="https://youtube.com"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Links Columns */}
        <div className="pt-5 md:pt-0 md:w-1/2">
          <div className="flex flex-col items-start justify-start md:flex-row md:items-start md:justify-between gap-y-8 lg:pl-10">
            {footerLinks.map((column, columnIndex) => (
              <ul key={columnIndex} className="flex flex-col gap-y-3">
                <li className="mb-2 text-sm font-semibold text-foreground">
                  {column.title}
                </li>
                {column.links.map((link) => (
                  <li
                    key={link.id}
                    className="group inline-flex cursor-pointer items-center justify-start gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    <Link href={link.url}>{link.title}</Link>
                    <div className="flex size-4 items-center justify-center border border-border rounded translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      {/* FlickeringGrid Background Section */}
      <div className="w-full h-48 md:h-64 relative mt-16 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-background z-10 from-40%" />
        <div className="absolute inset-0 mx-6">
          <FlickeringGrid
            text="SylcRoad × SocialSculp"
            fontSize={isMobile ? 40 : 70}
            className="h-full w-full"
            squareSize={2}
            gridGap={isMobile ? 2 : 3}
            color="#60A5FA"
            maxOpacity={0.3}
            flickerChance={0.08}
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border px-10 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SylcRoad x SocialSculp. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#privacy" className="hover:text-foreground transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="#terms" className="hover:text-foreground transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="#cookies" className="hover:text-foreground transition-colors duration-200">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
