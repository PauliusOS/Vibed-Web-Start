/**
 * Framer Analytics Component Types
 *
 * TypeScript interfaces for all Framer Analytics components
 */

// Data point for chart rendering
export interface DataPoint {
  date: string;
  value: number;
  [key: string]: string | number;
}

// Dual line chart data point
export interface DualDataPoint {
  date: string;
  primary: number;
  secondary: number;
}

// Line configuration for charts
export interface LineConfig {
  dataKey: string;
  label: string;
  color: string;
  gradientStart?: string;
  gradientEnd?: string;
}

// Metric item for metrics row
export interface MetricItem {
  label: string;
  value: number | string;
  isLive?: boolean;
  suffix?: string;
  prefix?: string;
}

// Country data for breakdown list
export interface CountryData {
  code: string;
  name: string;
  flag: string;
  visitors: number;
  percentage: number;
}

// Device data for breakdown list
export interface DeviceData {
  type: 'desktop' | 'mobile' | 'tablet' | 'other';
  name: string;
  icon: string;
  visitors: number;
  percentage: number;
}

// Date range option
export interface DateRangeOption {
  value: string;
  label: string;
  days: number;
}

// Chart dimensions
export interface ChartDimensions {
  width: number;
  height: number;
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

// SVG path data
export interface PathData {
  linePath: string;
  areaPath: string;
}

// Animation config
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
}

// Chart props
export interface FramerChartProps {
  data: DataPoint[];
  lines?: [LineConfig, LineConfig];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showYAxis?: boolean;
  showXAxis?: boolean;
  animate?: boolean;
  className?: string;
}

// Metrics row props
export interface FramerMetricsProps {
  metrics: MetricItem[];
  className?: string;
  animate?: boolean;
}

// Card props
export interface FramerCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

// Date selector props
export interface FramerDateSelectorProps {
  value?: string;
  onChange?: (value: string, days: number) => void;
  options?: DateRangeOption[];
  className?: string;
}

// Country list props
export interface FramerCountryListProps {
  data: CountryData[];
  title?: string;
  className?: string;
}

// Device list props
export interface FramerDeviceListProps {
  data: DeviceData[];
  title?: string;
  className?: string;
}

// Dashboard props
export interface FramerDashboardProps {
  chartData: DataPoint[];
  countryData: CountryData[];
  deviceData: DeviceData[];
  metrics?: MetricItem[];
  liveVisitors?: number;
  className?: string;
}
