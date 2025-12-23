/**
 * Formatters for Framer Analytics Components
 *
 * Utility functions for formatting numbers, dates, and other values
 */

/**
 * Format a number with locale-aware thousand separators
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * Format a large number with suffix (K, M, B)
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Format a percentage value
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format duration in minutes and seconds (e.g., "2m 34s")
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  if (mins === 0) {
    return `${secs}s`;
  }
  if (secs === 0) {
    return `${mins}m`;
  }
  return `${mins}m ${secs}s`;
}

/**
 * Format a date for chart X-axis display
 */
export function formatChartDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date range string
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const formatOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  const start = startDate.toLocaleDateString('en-US', formatOptions);
  const end = endDate.toLocaleDateString('en-US', formatOptions);

  return `${start} — ${end}`;
}

/**
 * Get date range based on days offset
 */
export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);

  return { start, end };
}

// Seeded pseudo-random for deterministic values (SSR-safe)
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Fixed reference date for SSR consistency
const FIXED_TODAY = new Date("2024-12-13T00:00:00Z");

/**
 * Generate sample analytics data for demo/testing (SSR-safe)
 */
export function generateSampleData(
  days: number = 30,
  baseValue: number = 2000,
  variance: number = 0.4
): Array<{ date: string; primary: number; secondary: number }> {
  const data: Array<{ date: string; primary: number; secondary: number }> = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(FIXED_TODAY);
    date.setDate(date.getDate() - i);

    // Generate realistic-looking data with seeded randomness and trend
    const dayFactor = Math.sin((i / days) * Math.PI * 2) * 0.3 + 1;
    const randomFactor = 1 + (seededRandom(i * 7) - 0.5) * variance;
    const weekendFactor = [0, 6].includes(date.getDay()) ? 0.7 : 1;

    const primary = Math.round(baseValue * dayFactor * randomFactor * weekendFactor);
    const secondary = Math.round(primary * (0.65 + seededRandom(i * 11) * 0.1)); // 65-75% of primary

    data.push({
      date: date.toISOString().split('T')[0],
      primary,
      secondary,
    });
  }

  return data;
}

/**
 * Multi-metric data point for extended charts (campaign-focused)
 */
export interface MultiMetricDataPoint {
  date: string;
  views: number;
  cpm: number;
  totalComments: number;
  totalLikes: number;
  rosterCount: number;
}

/**
 * Generate sample campaign analytics data with all 5 metrics (SSR-safe)
 */
export function generateMultiMetricData(
  days: number = 30,
  baseValue: number = 2000,
  variance: number = 0.25
): MultiMetricDataPoint[] {
  const data: MultiMetricDataPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(FIXED_TODAY);
    date.setDate(date.getDate() - i);

    // Generate realistic-looking campaign data with seeded randomness and trend
    const dayFactor = Math.sin((i / days) * Math.PI * 2) * 0.3 + 1;
    const randomFactor = 1 + (seededRandom(i * 13) - 0.5) * variance;
    const weekendFactor = [0, 6].includes(date.getDay()) ? 0.7 : 1;

    // Views: base value scaled
    const views = Math.round(baseValue * 500 * dayFactor * randomFactor * weekendFactor);
    // CPM: $3-7 range scaled for chart visualization
    const cpm = Math.round((3 + seededRandom(i * 17) * 4) * dayFactor * 1000);
    // Comments: roughly 1% of views
    const totalComments = Math.round(views * (0.008 + seededRandom(i * 19) * 0.004));
    // Likes: roughly 8% of views
    const totalLikes = Math.round(views * (0.06 + seededRandom(i * 23) * 0.04));
    // Roster count: relatively stable 8-15
    const rosterCount = Math.round((10 + seededRandom(i * 29) * 5) * dayFactor * 100);

    data.push({
      date: date.toISOString().split('T')[0],
      views,
      cpm,
      totalComments,
      totalLikes,
      rosterCount,
    });
  }

  return data;
}

/**
 * Sample country data for demos
 */
export const sampleCountryData = [
  { code: 'US', name: 'United States', flag: '🇺🇸', visitors: 713000, percentage: 42 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', visitors: 240000, percentage: 14 },
  { code: 'NL', name: 'The Netherlands', flag: '🇳🇱', visitors: 45000, percentage: 3 },
  { code: 'FR', name: 'France', flag: '🇫🇷', visitors: 20000, percentage: 1 },
];

/**
 * Sample device data for demos
 */
export const sampleDeviceData = [
  { type: 'mobile' as const, name: 'Mobile', icon: '📱', visitors: 561000, percentage: 42 },
  { type: 'desktop' as const, name: 'Desktop', icon: '🖥️', visitors: 504000, percentage: 38 },
  { type: 'tablet' as const, name: 'Tablet', icon: '📲', visitors: 253000, percentage: 19 },
  { type: 'other' as const, name: 'Other', icon: '📺', visitors: 51000, percentage: 4 },
];
