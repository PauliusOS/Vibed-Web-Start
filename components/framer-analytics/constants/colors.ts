/**
 * Framer Analytics Exact Color Constants
 *
 * These colors are extracted directly from Framer's analytics page
 * and represent the exact values used in their implementation.
 */

// Chart line colors
export const FRAMER_CHART_COLORS = {
  // Primary line (Blue)
  primaryLine: 'rgb(25, 125, 255)',
  primaryLineHex: '#197dff',

  // Secondary line (Purple)
  secondaryLine: 'rgb(173, 133, 255)',
  secondaryLineHex: '#ad85ff',
} as const;

// Chart gradient colors
export const FRAMER_GRADIENT_COLORS = {
  // Primary gradient (Blue) - for area fill
  primary: {
    start: 'rgba(0, 81, 255, 0.45)',
    end: 'rgba(0, 153, 255, 0)',
  },

  // Secondary gradient (Purple) - for area fill
  secondary: {
    start: 'rgba(154, 105, 245, 0.5)',
    end: 'rgba(157, 102, 253, 0)',
  },
} as const;

// Background colors
export const FRAMER_BG_COLORS = {
  page: 'rgba(0, 0, 0, 1)',
  card: 'rgb(18, 18, 18)',
  cardHover: 'rgba(255, 255, 255, 0.05)',
  cardSelected: 'rgba(255, 255, 255, 0.1)',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  overlay: 'rgba(0, 0, 0, 0.7)',
} as const;

// Text colors
export const FRAMER_TEXT_COLORS = {
  primary: 'rgb(255, 255, 255)',
  secondary: 'rgb(153, 153, 153)',
  muted: 'rgb(140, 140, 140)',
  accent: 'rgb(0, 153, 255)',
  dark: 'rgb(34, 34, 34)',
} as const;

// Chart styling
export const FRAMER_CHART_STYLES = {
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  gridColor: 'rgba(255, 255, 255, 0.06)',
  axisColor: 'rgba(255, 255, 255, 0.35)',
} as const;

// Typography
export const FRAMER_TYPOGRAPHY = {
  heading: '"Euclid Circular A", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  body: '"Euclid Circular A", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

  // Font sizes
  sizes: {
    h1: '85px',
    h2: '22px',
    h6: '20px',
    label: '12px',
    body: '15px',
    small: '11px',
  },

  // Font weights
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

// Live indicator colors
export const FRAMER_LIVE_COLORS = {
  dot: 'rgb(34, 197, 94)', // Green
  pulse: 'rgba(34, 197, 94, 0.4)',
} as const;

// Combined export for convenience
export const FRAMER_ANALYTICS_COLORS = {
  chart: FRAMER_CHART_COLORS,
  gradient: FRAMER_GRADIENT_COLORS,
  background: FRAMER_BG_COLORS,
  text: FRAMER_TEXT_COLORS,
  styles: FRAMER_CHART_STYLES,
  typography: FRAMER_TYPOGRAPHY,
  live: FRAMER_LIVE_COLORS,
} as const;

// Default line configurations matching Framer
export const DEFAULT_LINE_CONFIGS = {
  primary: {
    dataKey: 'primary',
    label: 'Visitors',
    color: FRAMER_CHART_COLORS.primaryLine,
    gradientStart: FRAMER_GRADIENT_COLORS.primary.start,
    gradientEnd: FRAMER_GRADIENT_COLORS.primary.end,
  },
  secondary: {
    dataKey: 'secondary',
    label: 'Unique Visitors',
    color: FRAMER_CHART_COLORS.secondaryLine,
    gradientStart: FRAMER_GRADIENT_COLORS.secondary.start,
    gradientEnd: FRAMER_GRADIENT_COLORS.secondary.end,
  },
} as const;

// Creator color palette for chart lines (distinct colors on dark background)
export const CREATOR_COLORS = [
  '#22c55e', // Green
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#a855f7', // Purple
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#84cc16', // Lime
  '#f97316', // Orange
  '#14b8a6', // Teal
] as const;

// Get gradient colors from a creator color
export function getCreatorGradient(color: string) {
  // Extract RGB and create gradient
  const match = color.match(/[a-fA-F0-9]{2}/g);
  if (match && match.length >= 3) {
    const [r, g, b] = match.map((hex) => parseInt(hex, 16));
    return {
      start: `rgba(${r}, ${g}, ${b}, 0.3)`,
      end: `rgba(${r}, ${g}, ${b}, 0)`,
    };
  }
  return {
    start: 'rgba(34, 197, 94, 0.3)',
    end: 'rgba(34, 197, 94, 0)',
  };
}
