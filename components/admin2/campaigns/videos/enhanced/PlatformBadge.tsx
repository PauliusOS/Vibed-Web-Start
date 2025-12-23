import { Instagram } from "lucide-react";

interface PlatformBadgeProps {
  platform: "instagram" | "tiktok";
  variant?: "default" | "compact" | "icon";
  className?: string;
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

export function PlatformBadge({ platform, variant = "default", className = "" }: PlatformBadgeProps) {
  if (platform === "instagram") {
    if (variant === "icon") {
      return <Instagram className={`h-8 w-8 text-white/40 ${className}`} />;
    }

    if (variant === "compact") {
      return (
        <span
          className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 ${className}`}
          title="Instagram"
        >
          <Instagram className="h-2.5 w-2.5 text-white" />
        </span>
      );
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 ${className}`}
      >
        <Instagram className="h-3 w-3 text-white" aria-hidden="true" />
        <span className="text-xs font-medium text-white">Instagram</span>
      </span>
    );
  }

  // TikTok
  if (variant === "icon") {
    return <TikTokIcon className={`h-8 w-8 text-[#fe2c55]/40 ${className}`} />;
  }

  if (variant === "compact") {
    return (
      <span
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-black ${className}`}
        title="TikTok"
      >
        <TikTokIcon className="h-2.5 w-2.5 text-[#fe2c55]" />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-black border border-[#fe2c55]/20 ${className}`}
    >
      <TikTokIcon className="h-3 w-3 text-[#fe2c55]" />
      <span className="text-xs font-medium text-white">TikTok</span>
    </span>
  );
}
