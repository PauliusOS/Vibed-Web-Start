# Analytics Components

Full-featured analytics blocks and components based on sylcroad.com/f0 design patterns. These components provide comprehensive data visualization and creator performance tracking capabilities.

## Components

### InsightsCard

Comprehensive insights overview card displaying 6 key metrics with trends and engagement calculations.

**Features:**
- 6 metric cards (Views, Likes, Comments, CPM, Roster, Videos)
- Individual trend indicators (up/down arrows with percentage)
- Automatic engagement rate calculation
- Glass morphism design with backdrop blur
- Responsive grid layout (2/3/6 columns)
- Color-coded metric icons
- Hover animations

**Usage:**
```tsx
import { InsightsCard } from "@/components/analytics";

<InsightsCard
  title="Insights Views"
  dateRange="Nov 17 — Dec 17"
  metrics={{
    views: 1300000,
    likes: 320000,
    comments: 45000,
    cpm: 4.25,
    roster: 6,
    videos: 12,
  }}
  trend={{
    views: { value: 12, direction: "up" },
    engagement: { value: 8, direction: "up" },
  }}
/>
```

**Props:**
- `title?: string` - Card title (default: "Insights")
- `dateRange?: string` - Date range display (default: "Last 30 days")
- `metrics: object` - Required metrics object with views, likes, comments, cpm, roster, videos
- `trend?: object` - Optional trend data for views and engagement
- `className?: string` - Additional CSS classes

---

### CreatorLeaderboard

Interactive leaderboard table with sortable columns, expandable details, and tab navigation.

**Features:**
- Sortable by views, engagement, or videos
- Expandable creator rows for detailed stats
- Performance badges (excellent, good, average)
- Platform indicators (TikTok, Instagram, YouTube)
- Medal ranks for top 3 creators
- Tab navigation (Leaderboard, Top Videos, Compare)
- Responsive layout with mobile optimization
- Hover effects and transitions

**Usage:**
```tsx
import { CreatorLeaderboard } from "@/components/analytics";

<CreatorLeaderboard
  creators={[
    {
      id: "1",
      name: "Emma Wilson",
      username: "emmawilson",
      avatar: "https://...",
      platform: "tiktok",
      views: 853800,
      engagement: 50700,
      engagementRate: 5.9,
      videos: 4,
      medianCPM: 4.12,
      performance: "excellent",
    },
    // ... more creators
  ]}
  dateRange="Last 30 days"
/>
```

**Props:**
- `creators: Creator[]` - Array of creator objects (required)
- `dateRange?: string` - Date range display (default: "Last 30 days")
- `className?: string` - Additional CSS classes

**Creator Object:**
```typescript
interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  platform: "tiktok" | "instagram" | "youtube";
  views: number;
  engagement: number;
  engagementRate: number;
  videos: number;
  medianCPM: number;
  performance: "excellent" | "good" | "average";
}
```

---

### AnalyticsOverview

Detailed metrics breakdown card with engagement statistics and period selection.

**Features:**
- 6 engagement metrics with icons
- Color-coded metric indicators
- Period start/end display
- Active status badge
- Hover animations on metric cards
- Responsive grid layout

**Usage:**
```tsx
import { AnalyticsOverview } from "@/components/analytics";

<AnalyticsOverview
  title="All Platforms"
  metrics={{
    avgViews: 1300000,
    engagement: 29.2,
    comments: 45000,
    likes: 320000,
    saves: 15000,
    shares: 8000,
  }}
  period={{ start: "Nov 17", end: "Dec 17" }}
/>
```

**Props:**
- `title?: string` - Card title (default: "All Platforms")
- `metrics: object` - Required metrics object
- `period?: object` - Period object with start and end dates
- `className?: string` - Additional CSS classes

---

## Design System

All components follow the established design patterns:

### Colors
- Background: `bg-black/70` with backdrop blur
- Borders: `border-white/10` with cyan accents
- Text: White with various opacity levels (50%, 60%, 70%)
- Metrics: Color-coded icons (blue, pink, cyan, green, purple, orange)

### Typography
- Titles: `text-lg` to `text-2xl` font-bold/semibold
- Metrics: `text-2xl` font-bold
- Labels: `text-xs` font-medium uppercase
- Body: `text-sm` text-white/50

### Spacing
- Card padding: `p-4` to `p-8`
- Grid gaps: `gap-4`
- Section spacing: `space-y-6` to `space-y-8`

### Effects
- Glass morphism: `backdrop-blur-xl`
- Shadows: Custom cyan glow effects
- Hover: Brightness increase and border color changes
- Transitions: `transition-all` for smooth animations

---

## Utilities

### formatNumber

Formats large numbers with K/M suffixes:
- 1,000 → "1.0K"
- 1,000,000 → "1.0M"

```typescript
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}
```

### calculateEngagement

Calculates engagement rate from likes, comments, and views:

```typescript
function calculateEngagement(
  likes: number, 
  comments: number, 
  views: number
): number {
  if (views === 0) return 0;
  return ((likes + comments) / views) * 100;
}
```

---

## Demo

View all components in action:
- **Demo Page:** `/analytics-demo`
- **F0 Library:** `/f0` > Analytics Section

---

## Integration

These components are designed to integrate seamlessly with:
- Existing roster analytics views
- Campaign performance tracking
- Creator management dashboards
- Real-time data from Convex backend

**Example Integration:**
```tsx
// In your page component
import { InsightsCard, CreatorLeaderboard } from "@/components/analytics";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AnalyticsPage() {
  const analytics = useQuery(api.analytics.getRosterAnalytics, { 
    rosterId: "..." 
  });

  return (
    <div className="space-y-6">
      <InsightsCard
        metrics={{
          views: analytics?.totalViews || 0,
          likes: analytics?.totalLikes || 0,
          comments: analytics?.totalComments || 0,
          cpm: analytics?.avgCPM || 0,
          roster: analytics?.creatorCount || 0,
          videos: analytics?.videoCount || 0,
        }}
      />
      
      <CreatorLeaderboard
        creators={analytics?.creators || []}
      />
    </div>
  );
}
```

---

## Dependencies

- `@/components/ui/card` - shadcn/ui Card components
- `@/components/ui/badge` - shadcn/ui Badge component
- `@/components/ui/button` - shadcn/ui Button component
- `@/components/ui/tabs` - shadcn/ui Tabs component
- `@/components/ui/avatar` - shadcn/ui Avatar component
- `lucide-react` - Icon library
- `@/lib/utils` - cn() utility for className merging

---

## Notes

- All components are client-side ("use client")
- Fully responsive with mobile-first design
- Dark theme optimized
- Accessibility features included via shadcn/ui
- Performance optimized with proper memoization where needed
