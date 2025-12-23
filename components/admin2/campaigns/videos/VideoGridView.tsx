import { CompactVideoCard } from "./enhanced/CompactVideoCard";

interface VideoGridViewProps {
  videos: any[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRefreshMetrics?: (id: string) => void;
  refreshingVideoId?: string | null;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  className?: string;
}

export function VideoGridView({
  videos,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  onRefreshMetrics,
  refreshingVideoId,
  selectedIds,
  onToggleSelect,
  className = "",
}: VideoGridViewProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 ${className}`}>
      {videos.map((video, index) => (
        <div
          key={video._id}
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}
        >
          <CompactVideoCard
            video={video}
            onApprove={onApprove}
            onReject={onReject}
            onDelete={onDelete}
            onRefreshMetrics={onRefreshMetrics}
            isRefreshing={refreshingVideoId === video._id}
            selected={selectedIds?.has(video._id)}
            onToggleSelect={onToggleSelect}
          />
        </div>
      ))}
    </div>
  );
}
