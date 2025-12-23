import { Video, Plus } from "lucide-react";

interface VideoEmptyStateProps {
  onAddVideo?: () => void;
  className?: string;
}

export function VideoEmptyState({ onAddVideo, className = "" }: VideoEmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center mb-4">
        <Video className="h-8 w-8 text-white/40" />
      </div>

      {/* Heading */}
      <h3 className="text-xl font-semibold text-white mb-2">
        No videos yet
      </h3>

      {/* Description */}
      <p className="text-sm text-white/60 mb-6 max-w-md">
        Start tracking video performance by adding your first video to this campaign.
      </p>

      {/* CTA */}
      {onAddVideo && (
        <button
          onClick={onAddVideo}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/[0.06] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium text-white">Add First Video</span>
        </button>
      )}
    </div>
  );
}
