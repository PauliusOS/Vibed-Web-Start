"use client";

import { useState } from "react";
import { ComponentPreview, ComponentGrid, SectionHeader } from "@/components/f0";
import { FramerCard, FRAMER_TEXT_COLORS } from "@/components/framer-analytics";
import { ArrowRight, Upload, Eye, CheckCircle2, Send, Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const sampleCreators = [
  {
    id: "1",
    name: "Sarah Chen",
    username: "sarahchen",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    hasUnwatched: true,
    platform: "tiktok" as const,
  },
  {
    id: "2",
    name: "Marcus Rivera",
    username: "marcusrivera",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    hasUnwatched: true,
    platform: "instagram" as const,
  },
  {
    id: "3",
    name: "Emma Taylor",
    username: "emmataylor",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    hasUnwatched: false,
    platform: "tiktok" as const,
  },
  {
    id: "4",
    name: "James Wilson",
    username: "jameswilson",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    hasUnwatched: true,
    platform: "instagram" as const,
  },
];

const workflowSteps = [
  { step: 1, title: "Upload", desc: "Creator uploads draft", status: "pending_admin_review", icon: Upload },
  { step: 2, title: "Admin Review", desc: "Admin reviews video", status: "pending_client_review", icon: Eye },
  { step: 3, title: "Client Review", desc: "Client approves/feedback", status: "client_approved", icon: CheckCircle2 },
  { step: 4, title: "Final Approval", desc: "Admin gives final OK", status: "ready_to_post", icon: CheckCircle2 },
  { step: 5, title: "Go Live", desc: "Creator posts & submits link", status: "processing", icon: Send },
];

// Static demo version of CreatorStoryFeed for F0 showcase
function DemoCreatorStoryFeed({
  creators,
  onCreatorClick,
}: {
  creators: typeof sampleCreators;
  onCreatorClick: (creator: typeof sampleCreators[0]) => void;
}) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex space-x-4 pb-4 px-1">
        {creators.map((creator) => (
          <button
            key={creator.id}
            onClick={() => onCreatorClick(creator)}
            className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
          >
            <div
              className={cn(
                "p-0.5 rounded-full transition-all duration-200",
                creator.hasUnwatched
                  ? "bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500"
                  : "bg-white/20"
              )}
            >
              <div className="p-0.5 bg-[#0a0a0a] rounded-full">
                <Avatar className="h-14 w-14 border-2 border-transparent">
                  <AvatarImage src={creator.profilePicture} alt={creator.name} />
                  <AvatarFallback className="text-sm bg-white/10 text-white">
                    {creator.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <span className="text-[11px] text-white/70 max-w-[72px] truncate group-hover:text-white transition-colors">
              {creator.username}
            </span>
            {creator.hasUnwatched && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full border-2 border-[#0a0a0a]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function F0VideoSection() {
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Video Review Components"
        description="Multi-stage approval workflow for creator video submissions"
        count={3}
        badge="VIDEO"
        badgeColor="pink"
      />

      {/* Creator Story Feed */}
      <ComponentPreview
        name="CreatorStoryFeed"
        description="Instagram Stories-style creator ring feed for video review"
        importPath="@/components/video-review"
        props={[
          { name: "organizationId", type: "Id<'organizations'>", required: true, description: "Organization ID for fetching creators" },
          { name: "viewerRole", type: "'admin' | 'client'", required: true, description: "Role determines which videos to show" },
          { name: "onCreatorClick", type: "(creatorId) => void", description: "Callback when creator is clicked" },
        ]}
      >
        <DemoCreatorStoryFeed
          creators={sampleCreators}
          onCreatorClick={(creator) => setSelectedCreator(creator.id)}
        />
        {selectedCreator && (
          <p className="text-xs text-white/50 mt-3 text-center">
            Selected: {sampleCreators.find(c => c.id === selectedCreator)?.name}
          </p>
        )}
      </ComponentPreview>

      {/* Video Story Modal Info */}
      <ComponentPreview
        name="VideoStoryModal"
        description="Fullscreen video review modal with approval actions (click creator above to demo)"
        importPath="@/components/video-review"
        showImport={true}
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-white" />
          </div>
          <p className="text-white/60 mb-2">VideoStoryModal</p>
          <p className="text-xs text-white/40 max-w-md mx-auto">
            Opens as a fullscreen modal when clicking a creator. Features video player, approval buttons, feedback form, and navigation between videos.
          </p>
        </div>
      </ComponentPreview>

      {/* Live Link Submission Dialog Info */}
      <ComponentPreview
        name="LiveLinkSubmissionDialog"
        description="Post-approval link submission dialog for creators"
        importPath="@/components/video-review"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-white" />
          </div>
          <p className="text-white/60 mb-2">LiveLinkSubmissionDialog</p>
          <p className="text-xs text-white/40 max-w-md mx-auto">
            After final approval, creators use this dialog to submit the live post URL. Validates platform-specific URL formats for TikTok and Instagram.
          </p>
        </div>
      </ComponentPreview>

      {/* Workflow Diagram */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Video Review Workflow</h3>
        <FramerCard>
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {workflowSteps.map((item, index, arr) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium text-white mt-2">{item.title}</p>
                    <p className="text-[10px] text-white/50 text-center max-w-[80px]">{item.desc}</p>
                  </div>
                  {index < arr.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-white/30 hidden md:block" />
                  )}
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs" style={{ color: FRAMER_TEXT_COLORS.muted }}>
                Each stage triggers notifications to relevant parties (admins, clients, creators). Videos are stored in Convex with full status tracking.
              </p>
            </div>
          </div>
        </FramerCard>
      </div>

      {/* Status Types */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Video Status Types</h3>
        <FramerCard>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { status: "pending_admin_review", label: "Pending Admin", color: "bg-yellow-500/20 text-yellow-400" },
              { status: "pending_client_review", label: "Pending Client", color: "bg-blue-500/20 text-blue-400" },
              { status: "revision_requested", label: "Revision Needed", color: "bg-orange-500/20 text-orange-400" },
              { status: "client_approved", label: "Client Approved", color: "bg-cyan-500/20 text-cyan-400" },
              { status: "ready_to_post", label: "Ready to Post", color: "bg-emerald-500/20 text-emerald-400" },
              { status: "live", label: "Live", color: "bg-green-500/20 text-green-400" },
            ].map((item) => (
              <div key={item.status} className={`px-3 py-2 rounded-lg ${item.color} text-center`}>
                <p className="text-xs font-medium">{item.label}</p>
                <code className="text-[10px] opacity-60">{item.status}</code>
              </div>
            ))}
          </div>
        </FramerCard>
      </div>
    </div>
  );
}
