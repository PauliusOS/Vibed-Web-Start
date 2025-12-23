import { cn } from "@/lib/utils";

interface ProgressiveBlurProps {
  className?: string;
  blurAmount?: number; // Maximum blur in pixels (default: 10)
  direction?: "toBottom" | "toTop" | "toLeft" | "toRight";
}

export function ProgressiveBlur({ 
  className, 
  blurAmount = 10,
  direction = "toBottom" 
}: ProgressiveBlurProps) {
  // Calculate 8 blur layers with exponential progression (Framer technique)
  const layers = 8;
  const blurLayers = Array.from({ length: layers }, (_, i) => {
    // Each layer doubles: 0.039px → 0.078px → 0.156px → ... → 5px
    const blur = (blurAmount / 256) * Math.pow(2, i);
    
    // Each layer covers 25% height with 12.5% overlap
    const startPercent = (i * 12.5).toFixed(1);
    const fadeInStart = ((i + 1) * 12.5).toFixed(1);
    const fadeInEnd = ((i + 2) * 12.5).toFixed(1);
    const fadeOutStart = ((i + 3) * 12.5).toFixed(1);
    
    return {
      blur,
      zIndex: i + 1,
      maskGradient: getMaskGradient(direction, [
        [startPercent, 0],
        [fadeInStart, 1],
        [fadeInEnd, 1],
        [fadeOutStart, 0]
      ])
    };
  });

  return (
    <>
      {blurLayers.map((layer, index) => (
        <div
          key={index}
          className={cn("absolute inset-0 pointer-events-none", className)}
          style={{
            zIndex: layer.zIndex,
            backdropFilter: `blur(${layer.blur}px)`,
            WebkitBackdropFilter: `blur(${layer.blur}px)`,
            maskImage: layer.maskGradient,
            WebkitMaskImage: layer.maskGradient,
            borderRadius: 'inherit'
          }}
        />
      ))}
    </>
  );
}

function getMaskGradient(
  direction: "toBottom" | "toTop" | "toLeft" | "toRight",
  stops: [string, number][]
): string {
  const directionMap = {
    toBottom: 'to bottom',
    toTop: 'to top',
    toLeft: 'to left',
    toRight: 'to right'
  };
  
  const gradientStops = stops
    .map(([pos, alpha]) => `rgba(0,0,0,${alpha}) ${pos}%`)
    .join(', ');
  
  return `linear-gradient(${directionMap[direction]}, ${gradientStops})`;
}
