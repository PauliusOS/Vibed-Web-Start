"use client";

import { useMemo } from "react";
import { FramerDashboard } from "../FramerDashboard";
import { FramerChatLayout } from "../FramerChatLayout";
import { FRAMER_BG_COLORS, CREATOR_COLORS } from "../constants/colors";
import { generateSampleData, sampleCountryData, sampleDeviceData } from "../utils/formatters";
import type { Creator } from "../CreatorAvatarRow";
import type { CreatorChartData } from "../FramerChart";

// Simple seeded pseudo-random for deterministic values
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Fixed base timestamp for consistent dates
const FIXED_NOW = new Date("2024-12-13T00:00:00Z").getTime();

// Default sample creators
const DEFAULT_CREATORS: Creator[] = [
  {
    id: "creator_1",
    name: "Sarah Johnson",
    username: "sarahjcreates",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    platform: "tiktok",
    color: CREATOR_COLORS[0],
  },
  {
    id: "creator_2",
    name: "Mike Chen",
    username: "mikechenlife",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    platform: "instagram",
    color: CREATOR_COLORS[1],
  },
  {
    id: "creator_3",
    name: "Emma Wilson",
    username: "emmawilson",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    platform: "tiktok",
    color: CREATOR_COLORS[2],
  },
  {
    id: "creator_4",
    name: "Alex Rivera",
    username: "alexrivera_",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    platform: "instagram",
    color: CREATOR_COLORS[3],
  },
];

interface AnalyticsDashboardBlockProps {
  /** Title for the dashboard */
  title?: string;
  /** Total views metric */
  totalViews?: number;
  /** Cost per mille */
  cpm?: number;
  /** Total comments */
  totalComments?: number;
  /** Total likes */
  totalLikes?: number;
  /** Number of creators in roster */
  rosterCount?: number;
  /** Total videos */
  totalVideos?: number;
  /** Custom creators (uses defaults if not provided) */
  creators?: Creator[];
  /** Include chat sidebar layout */
  withChatLayout?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * AnalyticsDashboardBlock
 * 
 * A complete, ready-to-use analytics dashboard block with sample data.
 * Just drop it in and it works!
 * 
 * @example
 * ```tsx
 * // Basic usage - uses all defaults
 * <AnalyticsDashboardBlock />
 * 
 * // With custom metrics
 * <AnalyticsDashboardBlock
 *   totalViews={2500000}
 *   cpm={5.50}
 *   rosterCount={8}
 * />
 * 
 * // With chat sidebar
 * <AnalyticsDashboardBlock withChatLayout />
 * ```
 */
export function AnalyticsDashboardBlock({
  title = "Campaign Analytics",
  totalViews = 1250000,
  cpm = 4.25,
  totalComments = 45000,
  totalLikes = 320000,
  rosterCount = 12,
  totalVideos = 48,
  creators = DEFAULT_CREATORS,
  withChatLayout = false,
  className,
}: AnalyticsDashboardBlockProps) {
  // Generate chart data
  const fullData = generateSampleData(30, 2000, 0.25);
  const chartData = fullData.filter((_, i) => i % 2 === 0 || i === fullData.length - 1);

  // Date range for creator analytics
  const dateRange = useMemo(() => {
    const end = FIXED_NOW;
    const start = end - 30 * 24 * 60 * 60 * 1000;
    return { start, end };
  }, []);

  // Generate creator chart data
  const creatorChartData = useMemo<CreatorChartData[]>(() => {
    return creators.map((creator, creatorIdx) => {
      const data = chartData.map((_, i) => {
        const seed = creatorIdx * 1000 + i;
        const baseValue = 50000 + seededRandom(seed) * 100000;
        const dayVariance = Math.sin((i / chartData.length) * Math.PI * 2) * 0.3 + 1;
        return Math.round(baseValue * dayVariance);
      });
      return {
        creatorId: creator.id,
        color: creator.color,
        name: creator.name,
        data,
      };
    });
  }, [chartData, creators]);

  // Generate video posts
  const videoPosts = useMemo(() => {
    const posts: Array<{
      creatorId: string;
      videoId: string;
      postedAt: number;
      thumbnailUrl: string;
      videoUrl: string;
      platform: "instagram" | "tiktok";
      views: number;
      likes: number;
      comments: number;
      shares: number;
      cpm: number;
      description: string;
    }> = [];

    creators.forEach((creator, creatorIndex) => {
      const postCount = 3;
      const baseViews = 200000 + seededRandom(creatorIndex * 100) * 100000;

      for (let p = 0; p < postCount; p++) {
        const seed = creatorIndex * 10 + p;
        const daysAgo = 3 + Math.floor(seededRandom(seed) * 25);
        const performanceMultiplier = 0.3 + seededRandom(seed + 1) * 1.4;
        const views = Math.round(baseViews * performanceMultiplier);
        const likes = Math.round(views * (0.02 + seededRandom(seed + 2) * 0.08));
        const comments = Math.round(likes * (0.05 + seededRandom(seed + 3) * 0.15));
        const shares = Math.round(likes * (0.1 + seededRandom(seed + 4) * 0.3));
        const postCpm = 2 + seededRandom(seed + 5) * 8;

        posts.push({
          creatorId: creator.id,
          videoId: `video_${creator.id}_${p}`,
          postedAt: FIXED_NOW - daysAgo * 24 * 60 * 60 * 1000,
          thumbnailUrl: `https://picsum.photos/seed/${creatorIndex}${p}/400/600`,
          videoUrl: creator.platform === "tiktok"
            ? "https://www.tiktok.com/@tiktok/video/7000000000000000000"
            : "https://www.instagram.com/reel/ABC123/",
          platform: creator.platform,
          views,
          likes,
          comments,
          shares,
          cpm: postCpm,
          description: `Amazing content from ${creator.name}! 🔥 #viral #fyp`,
        });
      }
    });

    return posts;
  }, [creators]);

  const dashboardContent = (
    <div
      className={className}
      style={{ backgroundColor: FRAMER_BG_COLORS.page, minHeight: "100vh", padding: "24px" }}
    >
      <div className="max-w-6xl mx-auto">
        <FramerDashboard
          chartData={chartData}
          countryData={sampleCountryData}
          deviceData={sampleDeviceData}
          title={title}
          totalViews={totalViews}
          cpm={cpm}
          totalComments={totalComments}
          totalLikes={totalLikes}
          rosterCount={rosterCount}
          totalVideos={totalVideos}
          creators={creators}
          creatorChartData={creatorChartData}
          videoPosts={videoPosts}
          dateRange={dateRange}
        />
      </div>
    </div>
  );

  if (withChatLayout) {
    return (
      <FramerChatLayout sidebarWidth={380} showFloatingButton>
        {dashboardContent}
      </FramerChatLayout>
    );
  }

  return dashboardContent;
}

export default AnalyticsDashboardBlock;


















