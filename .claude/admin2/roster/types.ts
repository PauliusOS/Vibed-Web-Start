// Types for Creator Roster UI components
// Backend types will be defined in convex/schema.ts separately

export interface Roster {
  _id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  tags: string[];
  totalCreators: number;
  averageEngagement: number;
  updatedAt: number;
  createdAt: number;
}

export interface RosterFormData {
  name: string;
  description: string;
  icon: string;
  color: string;
  tags: string[];
  visibility?: "private" | "clientele" | "organization";
}

// Preset colors for roster selection
export const ROSTER_COLORS = [
  { name: "Purple", value: "#8b5cf6" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Green", value: "#22c55e" },
  { name: "Yellow", value: "#eab308" },
  { name: "Orange", value: "#f97316" },
  { name: "Red", value: "#ef4444" },
  { name: "Pink", value: "#ec4899" },
] as const;

// Common emojis for roster icons
export const ROSTER_ICONS = [
  "star", "fire", "rocket", "crown", "heart", "lightning",
  "sparkles", "gem", "trophy", "target", "users", "briefcase"
] as const;

// Map icon names to emoji characters
export const ICON_EMOJI_MAP: Record<string, string> = {
  star: "\u2B50",
  fire: "\uD83D\uDD25",
  rocket: "\uD83D\uDE80",
  crown: "\uD83D\uDC51",
  heart: "\u2764\uFE0F",
  lightning: "\u26A1",
  sparkles: "\u2728",
  gem: "\uD83D\uDC8E",
  trophy: "\uD83C\uDFC6",
  target: "\uD83C\uDFAF",
  users: "\uD83D\uDC65",
  briefcase: "\uD83D\uDCBC",
};
