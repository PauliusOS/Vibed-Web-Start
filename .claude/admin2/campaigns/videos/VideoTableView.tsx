import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EnhancedVideoRow } from "./enhanced/EnhancedVideoRow";
import { SortField, SortDirection } from "@/hooks/useVideoSorting";

interface VideoTableViewProps {
  videos: any[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRefreshMetrics?: (id: string) => void;
  refreshingVideoId?: string | null;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleAll?: () => void;
  allSelected?: boolean;
  sortField?: SortField;
  sortDirection?: SortDirection;
  onSort?: (field: SortField) => void;
  className?: string;
}

export function VideoTableView({
  videos,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  onRefreshMetrics,
  refreshingVideoId,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  allSelected = false,
  sortField,
  sortDirection,
  onSort,
  className = "",
}: VideoTableViewProps) {
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-white/30" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 text-white/60" />
    ) : (
      <ArrowDown className="h-3 w-3 text-white/60" />
    );
  };

  const handleHeaderClick = (field: SortField) => {
    if (onSort) {
      onSort(field);
    }
  };

  return (
    <div className={`bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden ${className}`}>
      <Table>
        <TableHeader className="sticky top-0 bg-black/90 backdrop-blur-sm z-10">
          <TableRow className="border-b border-white/[0.06] hover:bg-transparent">
            {/* Selection Checkbox */}
            {onToggleSelect && onToggleAll && (
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  className="h-4 w-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                  aria-label="Select all videos"
                />
              </TableHead>
            )}

            {/* Video Info */}
            <TableHead className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              Video
            </TableHead>

            {/* Platform */}
            <TableHead className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              Platform
            </TableHead>

            {/* Status */}
            <TableHead
              className="text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
              onClick={() => handleHeaderClick("status")}
            >
              <div className="flex items-center gap-1">
                Status
                <SortIcon field="status" />
              </div>
            </TableHead>

            {/* Views */}
            <TableHead
              className="text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
              onClick={() => handleHeaderClick("views")}
            >
              <div className="flex items-center gap-1">
                Views
                <SortIcon field="views" />
              </div>
            </TableHead>

            {/* Likes */}
            <TableHead
              className="text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
              onClick={() => handleHeaderClick("likes")}
            >
              <div className="flex items-center gap-1">
                Likes
                <SortIcon field="likes" />
              </div>
            </TableHead>

            {/* Comments */}
            <TableHead
              className="text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
              onClick={() => handleHeaderClick("comments")}
            >
              <div className="flex items-center gap-1">
                Comments
                <SortIcon field="comments" />
              </div>
            </TableHead>

            {/* Shares */}
            <TableHead
              className="text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
              onClick={() => handleHeaderClick("shares")}
            >
              <div className="flex items-center gap-1">
                Shares
                <SortIcon field="shares" />
              </div>
            </TableHead>

            {/* Engagement */}
            <TableHead
              className="text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
              onClick={() => handleHeaderClick("engagementRate")}
            >
              <div className="flex items-center gap-1">
                Engagement
                <SortIcon field="engagementRate" />
              </div>
            </TableHead>

            {/* Added */}
            <TableHead
              className="text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
              onClick={() => handleHeaderClick("addedAt")}
            >
              <div className="flex items-center gap-1">
                Added
                <SortIcon field="addedAt" />
              </div>
            </TableHead>

            {/* Actions */}
            <TableHead className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {videos.map((video) => (
            <EnhancedVideoRow
              key={video._id}
              video={video}
              onApprove={onApprove}
              onReject={onReject}
              onEdit={onEdit}
              onDelete={onDelete}
              onRefreshMetrics={onRefreshMetrics}
              isRefreshing={refreshingVideoId === video._id}
              selected={selectedIds?.has(video._id)}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
