"use client";

import { Calendar, ChevronDown } from "lucide-react";

export function FramerAnalyticsHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      {/* Title */}
      <h2 className="text-[30px] font-semibold text-white">Overview</h2>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Last 30 days dropdown */}
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1B25] border border-white/[0.07] rounded-lg hover:bg-[#1F2029] transition-colors">
          <span className="text-sm text-white/80">Last 30 days</span>
          <ChevronDown className="h-4 w-4 text-white/60" />
        </button>

        {/* Date range */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1B25] border border-white/[0.07] rounded-lg">
          <Calendar className="h-4 w-4 text-white/60" />
          <span className="text-sm text-white/60">Dec 1 — Dec 30</span>
        </div>
      </div>
    </div>
  );
}
