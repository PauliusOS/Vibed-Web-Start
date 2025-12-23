/**
 * SVG Path Generator for Framer-style Charts
 *
 * Generates smooth monotone cubic bezier curves from data points,
 * matching Framer's exact chart rendering style.
 */

interface Point {
  x: number;
  y: number;
}

interface PathResult {
  linePath: string;
  areaPath: string;
}

/**
 * Scale a value from data space to SVG coordinate space
 */
function scaleValue(
  value: number,
  minValue: number,
  maxValue: number,
  minOutput: number,
  maxOutput: number
): number {
  if (maxValue === minValue) return minOutput;
  return minOutput + ((value - minValue) / (maxValue - minValue)) * (maxOutput - minOutput);
}

/**
 * Calculate control points for monotone cubic interpolation
 * This creates smooth curves that don't overshoot the data points
 */
function getMonotoneControlPoints(
  points: Point[]
): { cp1: Point; cp2: Point }[] {
  const n = points.length;
  if (n < 2) return [];

  const controlPoints: { cp1: Point; cp2: Point }[] = [];

  // Calculate tangents for each point
  const tangents: number[] = [];

  for (let i = 0; i < n; i++) {
    if (i === 0) {
      // First point: use forward difference
      tangents.push((points[1].y - points[0].y) / (points[1].x - points[0].x));
    } else if (i === n - 1) {
      // Last point: use backward difference
      tangents.push(
        (points[n - 1].y - points[n - 2].y) / (points[n - 1].x - points[n - 2].x)
      );
    } else {
      // Middle points: use central difference
      const d0 = (points[i].y - points[i - 1].y) / (points[i].x - points[i - 1].x);
      const d1 = (points[i + 1].y - points[i].y) / (points[i + 1].x - points[i].x);

      // Monotone adjustment: if signs differ, set tangent to 0
      if (d0 * d1 <= 0) {
        tangents.push(0);
      } else {
        // Use harmonic mean for monotonicity
        tangents.push((2 * d0 * d1) / (d0 + d1));
      }
    }
  }

  // Generate control points for each segment
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const dx = (p1.x - p0.x) / 3;

    controlPoints.push({
      cp1: {
        x: p0.x + dx,
        y: p0.y + tangents[i] * dx,
      },
      cp2: {
        x: p1.x - dx,
        y: p1.y - tangents[i + 1] * dx,
      },
    });
  }

  return controlPoints;
}

/**
 * Generate SVG path string from points using monotone cubic interpolation
 */
function generateSmoothLinePath(points: Point[]): string {
  if (points.length < 2) return '';

  const controlPoints = getMonotoneControlPoints(points);
  let path = `M ${points[0].x.toFixed(3)} ${points[0].y.toFixed(3)}`;

  for (let i = 0; i < controlPoints.length; i++) {
    const { cp1, cp2 } = controlPoints[i];
    const p = points[i + 1];
    path += ` C ${cp1.x.toFixed(3)} ${cp1.y.toFixed(3)} ${cp2.x.toFixed(3)} ${cp2.y.toFixed(3)} ${p.x.toFixed(3)} ${p.y.toFixed(3)}`;
  }

  return path;
}

/**
 * Generate SVG path string from points using linear interpolation (sharp lines)
 */
function generateLinearPath(points: Point[]): string {
  if (points.length < 2) return '';

  let path = `M ${points[0].x.toFixed(3)} ${points[0].y.toFixed(3)}`;

  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x.toFixed(3)} ${points[i].y.toFixed(3)}`;
  }

  return path;
}

/**
 * Generate SVG path string from points
 */
function generateLinePath(points: Point[], smooth: boolean = true): string {
  return smooth ? generateSmoothLinePath(points) : generateLinearPath(points);
}

/**
 * Generate SVG area path (closed path for gradient fill)
 */
function generateAreaPath(points: Point[], baselineY: number, smooth: boolean = true): string {
  if (points.length < 2) return '';

  const linePath = generateLinePath(points, smooth);
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];

  // Close the path by going down to baseline, across, and back up
  return `${linePath} L ${lastPoint.x.toFixed(3)} ${baselineY.toFixed(3)} L ${firstPoint.x.toFixed(3)} ${baselineY.toFixed(3)} Z`;
}

/**
 * Main function to generate chart paths from data
 */
export function generateChartPaths(
  data: number[],
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number } = {
    top: 10,
    right: 10,
    bottom: 20,
    left: 10,
  },
  smooth: boolean = true
): PathResult {
  if (data.length < 2) {
    return { linePath: '', areaPath: '' };
  }

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find min and max values with some padding
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const valueRange = maxValue - minValue;
  const paddedMin = minValue - valueRange * 0.05;
  const paddedMax = maxValue + valueRange * 0.05;

  // Convert data to points
  const points: Point[] = data.map((value, index) => ({
    x: padding.left + (index / (data.length - 1)) * chartWidth,
    y: padding.top + scaleValue(value, paddedMin, paddedMax, chartHeight, 0),
  }));

  const baselineY = height - padding.bottom;

  return {
    linePath: generateLinePath(points, smooth),
    areaPath: generateAreaPath(points, baselineY, smooth),
  };
}

/**
 * Generate dual chart paths (for two data series)
 */
export function generateDualChartPaths(
  primaryData: number[],
  secondaryData: number[],
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number } = {
    top: 10,
    right: 10,
    bottom: 20,
    left: 10,
  },
  smooth: boolean = true
): { primary: PathResult; secondary: PathResult } {
  if (primaryData.length < 2 || secondaryData.length < 2) {
    return {
      primary: { linePath: '', areaPath: '' },
      secondary: { linePath: '', areaPath: '' },
    };
  }

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find global min and max for consistent scaling
  const allValues = [...primaryData, ...secondaryData];
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const valueRange = maxValue - minValue;
  const paddedMin = minValue - valueRange * 0.05;
  const paddedMax = maxValue + valueRange * 0.05;

  // Convert data to points
  const primaryPoints: Point[] = primaryData.map((value, index) => ({
    x: padding.left + (index / (primaryData.length - 1)) * chartWidth,
    y: padding.top + scaleValue(value, paddedMin, paddedMax, chartHeight, 0),
  }));

  const secondaryPoints: Point[] = secondaryData.map((value, index) => ({
    x: padding.left + (index / (secondaryData.length - 1)) * chartWidth,
    y: padding.top + scaleValue(value, paddedMin, paddedMax, chartHeight, 0),
  }));

  const baselineY = height - padding.bottom;

  return {
    primary: {
      linePath: generateLinePath(primaryPoints, smooth),
      areaPath: generateAreaPath(primaryPoints, baselineY, smooth),
    },
    secondary: {
      linePath: generateLinePath(secondaryPoints, smooth),
      areaPath: generateAreaPath(secondaryPoints, baselineY, smooth),
    },
  };
}

/**
 * Generate Y-axis tick values
 */
export function generateYAxisTicks(
  data: number[],
  tickCount: number = 5
): number[] {
  if (data.length === 0) return [];

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue;

  // Round to nice values
  const step = range / (tickCount - 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(step)));
  const niceStep = Math.ceil(step / magnitude) * magnitude;

  const ticks: number[] = [];
  const niceMin = Math.floor(minValue / niceStep) * niceStep;

  for (let i = 0; i < tickCount; i++) {
    ticks.push(niceMin + i * niceStep);
  }

  return ticks;
}

/**
 * Format large numbers (e.g., 1000 -> 1K, 1000000 -> 1M)
 */
export function formatAxisValue(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
}
