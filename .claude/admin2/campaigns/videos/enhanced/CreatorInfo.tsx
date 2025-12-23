import { getInitials, getAvatarGradient, formatFollowerCount } from "@/lib/video-helpers";

interface CreatorInfoProps {
  username?: string;
  displayName?: string;
  followerCount?: number;
  profilePictureUrl?: string;
  variant?: "default" | "compact";
  className?: string;
}

export function CreatorInfo({
  username,
  displayName,
  followerCount,
  profilePictureUrl,
  variant = "default",
  className = "",
}: CreatorInfoProps) {
  const name = username || displayName || "Unknown Creator";
  const initials = getInitials(name);
  const gradientClass = getAvatarGradient(name);

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Avatar */}
        {profilePictureUrl ? (
          <img
            src={profilePictureUrl}
            alt={name}
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <div
            className={`h-6 w-6 rounded-full ${gradientClass} flex items-center justify-center`}
          >
            <span className="text-[10px] font-bold text-white">{initials}</span>
          </div>
        )}

        {/* Name only (no followers in compact) */}
        <span className="text-xs font-semibold text-white/90 truncate">
          {username ? `@${username}` : displayName}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Avatar */}
      {profilePictureUrl ? (
        <img
          src={profilePictureUrl}
          alt={name}
          className="h-8 w-8 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div
          className={`h-8 w-8 rounded-full ${gradientClass} flex items-center justify-center flex-shrink-0`}
        >
          <span className="text-xs font-bold text-white">{initials}</span>
        </div>
      )}

      {/* Name and followers */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white/90 truncate">
          {username ? `@${username}` : displayName}
        </p>
        {followerCount !== undefined && followerCount > 0 && (
          <p className="text-xs text-white/60 tabular-nums">
            {formatFollowerCount(followerCount)}
          </p>
        )}
      </div>
    </div>
  );
}
