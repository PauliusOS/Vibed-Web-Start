"use client";

import { useMotionValue, useMotionTemplate, motion, useSpring } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface AppleCampaignCardProps {
  id: string;
  name: string;
  status: "active" | "draft" | "paused" | "completed" | "archived";
  videoCount?: number;
  totalViews?: number;
  budget?: number;
  index?: number;
}

export function AppleCampaignCard({
  id,
  name,
  status,
  videoCount = 0,
  totalViews = 0,
  budget,
  index = 0,
}: AppleCampaignCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const statusConfig = {
    active: { label: "Active", dot: "bg-emerald-400" },
    draft: { label: "Draft", dot: "bg-white/40" },
    paused: { label: "Paused", dot: "bg-amber-400" },
    completed: { label: "Completed", dot: "bg-blue-400" },
    archived: { label: "Archived", dot: "bg-white/20" },
  };

  const { label: statusLabel, dot: statusDot } = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Link href={`/admin3/${id}`}>
        <motion.div
          onMouseMove={handleMouseMove}
          className="group relative rounded-2xl bg-[#141414] border border-white/[0.08] overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.005 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {/* Subtle gradient follow cursor */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  350px circle at ${mouseX}px ${mouseY}px,
                  rgba(255, 255, 255, 0.03),
                  transparent 80%
                )
              `,
            }}
          />

          {/* Border glow on hover */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  200px circle at ${mouseX}px ${mouseY}px,
                  rgba(255, 255, 255, 0.06),
                  transparent 80%
                )
              `,
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Initial circle */}
              <div className="w-11 h-11 rounded-xl bg-white/[0.04] flex items-center justify-center border border-white/[0.06]">
                <span className="text-[15px] font-semibold text-white/70">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="text-[15px] font-medium text-white tracking-tight group-hover:text-white/90 transition-colors">
                  {name}
                </h3>
                <div className="flex items-center gap-3 mt-1.5">
                  {/* Status */}
                  <span className="inline-flex items-center gap-1.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full", statusDot)} />
                    <span className="text-[12px] text-white/40">{statusLabel}</span>
                  </span>

                  {/* Separator */}
                  <span className="w-px h-3 bg-white/10" />

                  {/* Video count */}
                  <span className="text-[12px] text-white/40">
                    {videoCount} video{videoCount !== 1 ? "s" : ""}
                  </span>

                  {/* Budget */}
                  {budget && (
                    <>
                      <span className="w-px h-3 bg-white/10" />
                      <span className="text-[12px] text-white/40">
                        ${budget.toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right side - Views + Arrow */}
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-[15px] font-medium text-white tabular-nums">
                  {totalViews.toLocaleString()}
                </p>
                <p className="text-[11px] text-white/30 mt-0.5">views</p>
              </div>

              {/* Arrow */}
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center border border-white/[0.06] group-hover:bg-white/[0.06] group-hover:border-white/[0.1] transition-all">
                <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
              </div>
            </div>
          </div>

          {/* Bottom subtle line */}
          <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Empty state card
export function EmptyCampaignCard() {
  return (
    <div className="rounded-2xl bg-[#141414] border border-dashed border-white/[0.1] p-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4 border border-white/[0.06]">
        <svg
          className="w-6 h-6 text-white/20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </div>
      <p className="text-[14px] text-white/50 mb-1">No campaigns yet</p>
      <p className="text-[12px] text-white/30">Create your first campaign to get started</p>
    </div>
  );
}
