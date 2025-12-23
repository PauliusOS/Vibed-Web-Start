"use client";

import { FramerCard, FRAMER_TEXT_COLORS } from "@/components/framer-analytics";
import { LayoutDashboard, BarChart3, Users, Calendar, Video, MessageCircle, Palette, Box } from "lucide-react";

const categories = [
  { name: "Analytics", count: 42, icon: BarChart3, color: "from-cyan-500 to-blue-500", description: "Charts, dashboards, metrics" },
  { name: "UI Components", count: 112, icon: Box, color: "from-blue-500 to-indigo-500", description: "shadcn/ui library" },
  { name: "Admin", count: 90, icon: LayoutDashboard, color: "from-indigo-500 to-purple-500", description: "Dialogs, forms, panels" },
  { name: "Creator", count: 32, icon: Users, color: "from-purple-500 to-pink-500", description: "Portal & widgets" },
  { name: "Calendar", count: 4, icon: Calendar, color: "from-pink-500 to-rose-500", description: "Scheduling components" },
  { name: "Video Review", count: 3, icon: Video, color: "from-rose-500 to-orange-500", description: "Approval workflow" },
  { name: "Messaging", count: 8, icon: MessageCircle, color: "from-orange-500 to-amber-500", description: "Chat & notifications" },
];

const colorPalette = [
  { name: "Primary Line", value: "#51B3FF", hex: "#51B3FF" },
  { name: "Secondary Line", value: "#AD85FF", hex: "#AD85FF" },
  { name: "Success", value: "#4ADE80", hex: "#4ADE80" },
  { name: "Warning", value: "#FBBF24", hex: "#FBBF24" },
  { name: "Error", value: "#FF6B8A", hex: "#FF6B8A" },
  { name: "Pink", value: "#F472B6", hex: "#F472B6" },
];

export default function F0OverviewSection() {
  return (
    <div className="space-y-8">
      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FramerCard className="text-center py-6">
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">200+</p>
          <p className="text-sm text-white/60 mt-1">Total Components</p>
        </FramerCard>
        <FramerCard className="text-center py-6">
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">7</p>
          <p className="text-sm text-white/60 mt-1">Categories</p>
        </FramerCard>
        <FramerCard className="text-center py-6">
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">3</p>
          <p className="text-sm text-white/60 mt-1">Portals</p>
        </FramerCard>
        <FramerCard className="text-center py-6">
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">42</p>
          <p className="text-sm text-white/60 mt-1">Analytics Components</p>
        </FramerCard>
      </div>

      {/* Category Grid */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Component Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <FramerCard key={cat.name} className="group cursor-pointer hover:border-white/20 transition-all">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center shrink-0`}>
                  <cat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">{cat.name}</h4>
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-white/10 text-white/60">{cat.count}</span>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5">{cat.description}</p>
                </div>
              </div>
            </FramerCard>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Color Palette</h3>
        <FramerCard>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {colorPalette.map((color) => (
              <div key={color.name} className="text-center">
                <div
                  className="w-full h-16 rounded-lg mb-2 border border-white/10"
                  style={{ backgroundColor: color.value }}
                />
                <p className="text-xs font-medium text-white">{color.name}</p>
                <p className="text-[10px] text-white/50 font-mono">{color.hex}</p>
              </div>
            ))}
          </div>
        </FramerCard>
      </div>

      {/* Quick Import Reference */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Quick Start</h3>
        <FramerCard>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-black/50 border border-white/10">
              <p className="text-xs text-white/40 mb-1">Install shadcn/ui</p>
              <code className="text-xs text-cyan-400">npx shadcn@latest init</code>
            </div>
            <div className="p-3 rounded-lg bg-black/50 border border-white/10">
              <p className="text-xs text-white/40 mb-1">Import Analytics Components</p>
              <code className="text-xs text-cyan-400">{`import { FramerChart, FramerDashboard } from "@/components/framer-analytics";`}</code>
            </div>
            <div className="p-3 rounded-lg bg-black/50 border border-white/10">
              <p className="text-xs text-white/40 mb-1">Import UI Components</p>
              <code className="text-xs text-cyan-400">{`import { Button, Card, Dialog } from "@/components/ui";`}</code>
            </div>
          </div>
        </FramerCard>
      </div>

      {/* Directory Structure */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Directory Structure</h3>
        <FramerCard>
          <pre className="text-xs text-white/70 font-mono overflow-x-auto">
{`/components
├── framer-analytics/      # Analytics (42)
│   ├── blocks/            # Ready-to-use blocks
│   ├── v2/                # V2 components
│   ├── calendar/          # Calendar
│   └── SylcAIChat/        # AI chat
├── video-review/          # Video workflow (3)
├── creator/               # Creator portal (32)
├── admin6/                # Admin portal
├── client6/               # Client portal
└── ui/                    # shadcn/ui (112)`}
          </pre>
        </FramerCard>
      </div>
    </div>
  );
}
