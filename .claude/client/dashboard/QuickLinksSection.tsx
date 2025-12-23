"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { BarChart3, Video, Receipt, LucideIcon } from "lucide-react";

interface QuickLink {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

const quickLinks: QuickLink[] = [
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "View comprehensive performance charts and trends",
    href: "/client/analytics",
  },
  {
    icon: Video,
    title: "All Videos",
    description: "Browse and filter all campaign videos",
    href: "/client/videos",
  },
  {
    icon: Receipt,
    title: "Invoices",
    description: "View billing history and payment status",
    href: "/client/invoices",
  },
];

export function QuickLinksSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-white">Quick Links</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="group relative p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all"
              >
                {/* Hover glow */}
                <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-blue-400/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />

                <div className="relative text-center">
                  <div className="inline-flex p-3 rounded-xl bg-blue-500/10 mb-4">
                    <Icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-base font-medium text-white mb-2">{link.title}</h3>
                  <p className="text-sm text-white/60">{link.description}</p>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
