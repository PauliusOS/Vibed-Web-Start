"use client";

import { ComponentPreview, ComponentGrid, ComponentCard, SectionHeader } from "@/components/f0";
import { FramerCard } from "@/components/framer-analytics";
import { User, BarChart2, Wallet, Video, Calendar, Settings, Bell, Zap, LayoutDashboard, Briefcase, Compass, MessageCircle, HelpCircle, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Demo sidebar without Clerk hooks for F0 showcase
function DemoCreatorSidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Compass, label: "Discover", active: false },
    { icon: Briefcase, label: "Campaigns", active: false },
    { icon: Video, label: "Videos", active: false },
    { icon: BarChart2, label: "Analytics", active: false },
    { icon: Wallet, label: "Wallet", active: false },
    { icon: MessageCircle, label: "Messages", active: false, hasNotification: true },
    { icon: Bell, label: "Notifications", active: false },
  ];

  return (
    <aside className="flex h-full w-full bg-black flex-col py-6 px-3">
      <div className="px-3 mb-8">
        <h1 className="text-[22px] font-bold tracking-tight text-white">SylcRoad</h1>
      </div>
      <nav className="flex-1 space-y-1">
        <div className="w-full flex items-center gap-4 px-3 py-3 rounded-lg bg-blue-500/10">
          <Avatar className="w-5 h-5 ring-1 ring-white/20">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-[10px]">C</AvatarFallback>
          </Avatar>
          <span className="text-sm text-white font-medium">Profile</span>
        </div>
        {navItems.map((item) => (
          <div key={item.label} className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg ${item.active ? "bg-blue-500/10" : "hover:bg-white/5"} cursor-pointer`}>
            <div className="relative">
              <item.icon className={`w-5 h-5 ${item.active ? "text-blue-400 stroke-[2]" : "text-white/70 stroke-[1.5]"}`} />
              {item.hasNotification && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full" />}
            </div>
            <span className={`text-sm ${item.active ? "text-white font-medium" : "text-white/70"}`}>{item.label}</span>
          </div>
        ))}
      </nav>
      <div className="space-y-1 mt-auto pt-4 border-t border-white/5">
        <div className="w-full flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-white/5 cursor-pointer">
          <Settings className="w-5 h-5 text-white/50 stroke-[1.5]" />
          <span className="text-sm text-white/50">Settings</span>
        </div>
        <div className="w-full flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-white/5 cursor-pointer">
          <HelpCircle className="w-5 h-5 text-white/50 stroke-[1.5]" />
          <span className="text-sm text-white/50">Help</span>
        </div>
        <div className="w-full flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-white/5 cursor-pointer">
          <LogOut className="w-5 h-5 text-white/50 stroke-[1.5]" />
          <span className="text-sm text-white/50">Log out</span>
        </div>
      </div>
    </aside>
  );
}

const creatorComponents = [
  "AnalyticsHeader", "AnalyticsOverviewSection", "BriefViewer", "CampaignDealCard",
  "ChartsSection", "CreatorCalendarView", "CreatorCard", "CreatorPayoutCard",
  "CreatorProfileCard", "CreatorRankingCard", "CreatorTable", "DraftSubmissionForm",
  "FilteredPerformanceChart", "KeyMetricsGrid", "LivePostSubmissionForm", "MetricSelector",
  "OdometerMetricCard", "OdometerMetricsRow", "PremiumAreaChart", "RecentActivitySection",
  "RevisionFeedbackCard", "SubmitToSlotDialog", "TopVideosSection", "ViewToggle",
];

const creatorWidgets = [
  { name: "GoalTracker", desc: "Progress toward creator goals" },
  { name: "NextMilestone", desc: "Next milestone preview" },
  { name: "PerformancePulse", desc: "Real-time performance indicator" },
  { name: "QuickStatsTicker", desc: "Scrolling stats ticker" },
  { name: "StreakCounter", desc: "Activity streak display" },
];

export default function F0CreatorSection() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Creator Portal Components"
        description="Components for the creator dashboard and portal experience"
        count={32}
        badge="CREATOR"
        badgeColor="purple"
      />

      {/* Creator Sidebar */}
      <ComponentPreview
        name="CreatorSidebar"
        description="Creator portal navigation sidebar with campaign access and notifications"
        importPath="@/components/creator"
        previewClassName="h-[500px] overflow-hidden"
      >
        <div className="flex h-full">
          <div className="w-64 border-r border-white/10">
            <DemoCreatorSidebar />
          </div>
          <div className="flex-1 p-6 flex items-center justify-center">
            <p className="text-white/40 text-sm">Main content area</p>
          </div>
        </div>
      </ComponentPreview>

      {/* Creator Widgets */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Creator Widgets</h3>
        <ComponentGrid columns={3}>
          {creatorWidgets.map((widget) => (
            <ComponentPreview
              key={widget.name}
              name={widget.name}
              description={widget.desc}
              importPath="@/components/creator/widgets"
              variant="compact"
            >
              <div className="h-20 flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
            </ComponentPreview>
          ))}
        </ComponentGrid>
      </div>

      {/* Portal Features */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Portal Features</h3>
        <FramerCard>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: User, label: "Profile", desc: "Creator profile & settings" },
              { icon: BarChart2, label: "Analytics", desc: "Performance metrics" },
              { icon: Wallet, label: "Wallet", desc: "Earnings & payouts" },
              { icon: Video, label: "Videos", desc: "Draft submissions" },
              { icon: Calendar, label: "Calendar", desc: "Content schedule" },
              { icon: Bell, label: "Notifications", desc: "Updates & alerts" },
              { icon: Settings, label: "Settings", desc: "Account preferences" },
              { icon: Zap, label: "Campaigns", desc: "Active & available" },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <item.icon className="w-6 h-6 text-purple-400 mb-2" />
                <p className="font-medium text-white text-sm">{item.label}</p>
                <p className="text-xs text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </FramerCard>
      </div>

      {/* All Components */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">All Creator Components</h3>
        <FramerCard>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {creatorComponents.map((name) => (
              <ComponentCard key={name} name={name} importPath="@/components/creator" color="purple" />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-white/40 mb-2">Widgets (@/components/creator/widgets)</p>
            <div className="flex flex-wrap gap-2">
              {creatorWidgets.map((w) => (
                <span key={w.name} className="px-2 py-1 rounded bg-purple-500/20 text-xs font-mono text-purple-400">
                  {w.name}
                </span>
              ))}
            </div>
          </div>
        </FramerCard>
      </div>
    </div>
  );
}
