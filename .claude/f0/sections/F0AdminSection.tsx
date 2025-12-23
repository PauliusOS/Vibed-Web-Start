"use client";

import { ComponentPreview, ComponentGrid, ComponentCard, SectionHeader } from "@/components/f0";
import { FramerCard } from "@/components/framer-analytics";
import { LayoutDashboard, Users, BarChart2, Settings, FileText, DollarSign, Video, Shield, HelpCircle, LogOut, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Demo sidebar without Clerk hooks for F0 showcase
function DemoAdmin6Sidebar() {
  const navItems = [
    { icon: Users, label: "Roster", active: false },
    { icon: FileText, label: "Invitations", active: false },
    { icon: MessageCircle, label: "Messages", active: false, hasNotification: true },
  ];

  return (
    <aside className="flex h-full w-full bg-black flex-col py-6 px-3">
      <div className="px-3 mb-8">
        <h1 className="text-[22px] font-bold tracking-tight text-white">SylcRoad</h1>
        <p className="text-[10px] text-white/40 font-medium tracking-wider uppercase mt-0.5">Admin Portal</p>
      </div>
      <nav className="flex-1 space-y-1">
        <div className="w-full flex items-center gap-4 px-3 py-3 rounded-lg bg-blue-500/10">
          <Avatar className="w-5 h-5 ring-1 ring-white/20">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[10px]">A</AvatarFallback>
          </Avatar>
          <span className="text-sm text-white font-medium">Profile</span>
        </div>
        {navItems.map((item) => (
          <div key={item.label} className="w-full flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-white/5 group cursor-pointer">
            <div className="relative">
              <item.icon className="w-5 h-5 text-white/70 stroke-[1.5]" />
              {item.hasNotification && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full" />}
            </div>
            <span className="text-sm text-white/70">{item.label}</span>
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

const adminDialogs = [
  "CreateCampaignDialog", "EditCampaignDialog", "DeleteCampaignDialog",
  "InviteCreatorDialog", "EditCreatorDialog", "CreateClientDialog",
  "CreateInvoiceDialog", "RecordPaymentDialog", "SchedulePaymentDialog",
  "UploadVideoDialog", "ReviewVideoDialog", "ApproveVideoDialog",
];

const adminCharts = [
  "AdvancedBarChart", "AdvancedLineChart", "AdvancedPieChart",
  "AdvancedAreaChart", "ComparisonChart", "TrendChart",
];

const adminTables = [
  "CampaignsTable", "CreatorsTable", "ClientsTable",
  "InvoicesTable", "PaymentsTable", "VideosTable",
];

export default function F0AdminSection() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Admin Portal Components"
        description="Administrative dashboard, dialogs, charts, and management tools"
        count={90}
        badge="ADMIN"
        badgeColor="blue"
      />

      {/* Admin Sidebar */}
      <ComponentPreview
        name="Admin6Sidebar"
        description="Admin portal navigation sidebar with full menu access"
        importPath="@/components/admin6"
        previewClassName="h-[500px] overflow-hidden"
      >
        <div className="flex h-full">
          <div className="w-64 border-r border-white/10">
            <DemoAdmin6Sidebar />
          </div>
          <div className="flex-1 p-6 flex items-center justify-center">
            <p className="text-white/40 text-sm">Main content area</p>
          </div>
        </div>
      </ComponentPreview>

      {/* Admin Features Grid */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Portal Features</h3>
        <FramerCard>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: LayoutDashboard, label: "Dashboard", desc: "Overview & metrics" },
              { icon: Users, label: "Creators", desc: "Manage creator roster" },
              { icon: FileText, label: "Campaigns", desc: "Campaign management" },
              { icon: DollarSign, label: "Finance", desc: "Invoices & payments" },
              { icon: Video, label: "Video Review", desc: "Draft approvals" },
              { icon: BarChart2, label: "Analytics", desc: "Performance reports" },
              { icon: Shield, label: "Clients", desc: "Client management" },
              { icon: Settings, label: "Settings", desc: "Organization config" },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <item.icon className="w-6 h-6 text-blue-400 mb-2" />
                <p className="font-medium text-white text-sm">{item.label}</p>
                <p className="text-xs text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </FramerCard>
      </div>

      {/* Dialogs */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Admin Dialogs (40+)</h3>
        <FramerCard>
          <p className="text-xs text-white/50 mb-4">Modal dialogs for CRUD operations across all admin features</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {adminDialogs.map((name) => (
              <ComponentCard key={name} name={name} importPath="@/components/admin6" color="blue" />
            ))}
          </div>
        </FramerCard>
      </div>

      {/* Charts */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Admin Charts</h3>
        <FramerCard>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {adminCharts.map((name) => (
              <ComponentCard key={name} name={name} importPath="@/components/admin" color="cyan" />
            ))}
          </div>
        </FramerCard>
      </div>

      {/* Tables */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Data Tables</h3>
        <FramerCard>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {adminTables.map((name) => (
              <ComponentCard key={name} name={name} importPath="@/components/admin" color="purple" />
            ))}
          </div>
        </FramerCard>
      </div>

      {/* All Admin Components */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Component Summary</h3>
        <FramerCard>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-2xl font-bold text-blue-400">40+</p>
              <p className="text-xs text-white/50">Dialogs</p>
            </div>
            <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <p className="text-2xl font-bold text-cyan-400">6</p>
              <p className="text-xs text-white/50">Charts</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <p className="text-2xl font-bold text-purple-400">12</p>
              <p className="text-xs text-white/50">Tables</p>
            </div>
            <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
              <p className="text-2xl font-bold text-pink-400">30+</p>
              <p className="text-xs text-white/50">Other</p>
            </div>
          </div>
        </FramerCard>
      </div>
    </div>
  );
}
