import { useState } from "react";
import { Instagram } from "lucide-react";

interface VideoThumbnailProps {
  thumbnailUrl?: string | null;
  platform: "instagram" | "tiktok";
  aspectRatio?: "video" | "square";
  className?: string;
  overlayBadges?: React.ReactNode;
}

// Custom TikTok icon SVG
const TikTokIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export function VideoThumbnail({
  thumbnailUrl,
  platform,
  aspectRatio = "video",
  className = "",
  overlayBadges,
}: VideoThumbnailProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const hasValidThumbnail = thumbnailUrl && !imageError;

  const aspectClass = aspectRatio === "video" ? "aspect-video" : "aspect-square";

  // Fallback background based on platform
  const fallbackBg = platform === "instagram"
    ? "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500"
    : "bg-black";

  return (
    <div className={`relative ${aspectClass} rounded-lg overflow-hidden ${className}`}>
      {hasValidThumbnail ? (
        <>
          {/* Loading shimmer */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/[0.04] animate-pulse">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"></div>
              </div>
            </div>
          )}

          {/* Actual thumbnail */}
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setImageError(true);
              setIsLoading(false);
            }}
          />
        </>
      ) : (
        /* Fallback: Platform logo */
        <div className={`w-full h-full ${fallbackBg} flex items-center justify-center`}>
          {platform === "instagram" ? (
            <Instagram className="w-12 h-12 text-white opacity-40" />
          ) : (
            <TikTokIcon className="w-12 h-12 text-[#fe2c55] opacity-40" />
          )}
        </div>
      )}

      {/* Overlay badges (status, platform, etc.) */}
      {overlayBadges && (
        <div className="absolute inset-0 pointer-events-none">
          {overlayBadges}
        </div>
      )}
    </div>
  );
}

// Add shimmer keyframes to global CSS if not already present
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shimmer {
      100% {
        transform: translateX(100%);
      }
    }
  `;
  if (!document.querySelector("style[data-shimmer]")) {
    style.setAttribute("data-shimmer", "true");
    document.head.appendChild(style);
  }
}
