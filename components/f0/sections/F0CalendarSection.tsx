"use client";

import { ComponentPreview, ComponentGrid, ComponentCard, SectionHeader } from "@/components/f0";
import { FramerCard } from "@/components/framer-analytics";
import { CampaignCalendarDashboard, CreatorRankings, CreatorRankingsCompact, type ScheduledPost } from "@/components/framer-analytics/calendar";
import { Calendar, Trophy, Users } from "lucide-react";

// Sample data for CampaignCalendarDashboard
const sampleCampaigns = [
  { id: "1", name: "Q4 Holiday Campaign", status: "active" as const },
  { id: "2", name: "New Year Promo", status: "draft" as const },
];

const sampleScheduledPosts: ScheduledPost[] = [
  {
    id: "post1",
    creatorId: "creator1",
    scheduledDate: new Date().toISOString(),
    status: "scheduled",
    platform: "tiktok",
    creatorInfo: {
      username: "sarahchen",
      displayName: "Sarah Chen",
      profilePictureUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    },
  },
  {
    id: "post2",
    creatorId: "creator2",
    scheduledDate: new Date(Date.now() + 86400000).toISOString(),
    status: "draft_submitted",
    platform: "instagram",
    creatorInfo: {
      username: "marcusrivera",
      displayName: "Marcus Rivera",
      profilePictureUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    },
  },
];

const sampleRankings = [
  {
    creatorId: "1",
    rank: 1,
    overallScore: 95,
    timelinessScore: 98,
    reliabilityScore: 92,
    qualityScore: 96,
    engagementScore: 94,
    totalAssignments: 24,
    completedOnTime: 22,
    completedLate: 2,
    missed: 0,
    previousRank: 2,
    creatorInfo: {
      username: "sarahchen",
      displayName: "Sarah Chen",
      profilePictureUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      platform: "tiktok",
    },
  },
  {
    creatorId: "2",
    rank: 2,
    overallScore: 91,
    timelinessScore: 90,
    reliabilityScore: 94,
    qualityScore: 88,
    engagementScore: 92,
    totalAssignments: 18,
    completedOnTime: 16,
    completedLate: 1,
    missed: 1,
    previousRank: 1,
    creatorInfo: {
      username: "marcusrivera",
      displayName: "Marcus Rivera",
      profilePictureUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      platform: "instagram",
    },
  },
  {
    creatorId: "3",
    rank: 3,
    overallScore: 87,
    timelinessScore: 85,
    reliabilityScore: 90,
    qualityScore: 86,
    engagementScore: 87,
    totalAssignments: 15,
    completedOnTime: 13,
    completedLate: 2,
    missed: 0,
    previousRank: 4,
    creatorInfo: {
      username: "emmataylor",
      displayName: "Emma Taylor",
      profilePictureUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      platform: "tiktok",
    },
  },
];

export default function F0CalendarSection() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Calendar Components"
        description="Content calendar and creator scheduling system"
        count={4}
        badge="CALENDAR"
        badgeColor="emerald"
      />

      {/* Campaign Calendar Dashboard */}
      <ComponentPreview
        name="CampaignCalendarDashboard"
        description="Full calendar dashboard with campaign scheduling, creator rankings, and analytics"
        importPath="@/components/framer-analytics/calendar"
        props={[
          { name: "campaigns", type: "Campaign[]", required: true, description: "List of campaigns" },
          { name: "scheduledPosts", type: "ScheduledPost[]", required: true, description: "Scheduled posts data" },
          { name: "userRole", type: "'admin' | 'client' | 'creator'", required: true, description: "Current user role" },
        ]}
      >
        <div className="h-[500px] overflow-hidden rounded-lg border border-white/10">
          <CampaignCalendarDashboard
            campaigns={sampleCampaigns}
            scheduledPosts={sampleScheduledPosts}
            userRole="admin"
          />
        </div>
      </ComponentPreview>

      {/* Creator Rankings */}
      <ComponentPreview
        name="CreatorRankings"
        description="Full creator performance rankings table with scores and stats"
        importPath="@/components/framer-analytics/calendar"
      >
        <CreatorRankings rankings={sampleRankings} />
      </ComponentPreview>

      {/* Compact Rankings */}
      <ComponentPreview
        name="CreatorRankingsCompact"
        description="Compact rankings widget for sidebars"
        importPath="@/components/framer-analytics/calendar"
        previewClassName="max-w-sm"
      >
        <CreatorRankingsCompact rankings={sampleRankings.slice(0, 3)} />
      </ComponentPreview>

      {/* Calendar Types */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Calendar Types</h3>
        <FramerCard>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
              <Calendar className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-medium text-white">Month View</p>
              <p className="text-xs text-white/50 mt-1">Full month overview with all scheduled posts</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
              <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="font-medium text-white">Week View</p>
              <p className="text-xs text-white/50 mt-1">Weekly schedule with time slots</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
              <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="font-medium text-white">Day View</p>
              <p className="text-xs text-white/50 mt-1">Detailed daily breakdown</p>
            </div>
          </div>
        </FramerCard>
      </div>

      {/* Component List */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">All Calendar Components</h3>
        <FramerCard>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              "CampaignCalendarDashboard",
              "FramerCalendar",
              "CreatorRankings",
              "CreatorRankingsCompact",
            ].map((name) => (
              <ComponentCard key={name} name={name} importPath="@/components/framer-analytics/calendar" color="emerald" />
            ))}
          </div>
        </FramerCard>
      </div>
    </div>
  );
}
