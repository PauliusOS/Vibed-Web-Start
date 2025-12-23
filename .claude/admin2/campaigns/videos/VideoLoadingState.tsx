import { TableRow, TableCell } from "@/components/ui/table";

interface VideoLoadingStateProps {
  view?: "grid" | "table";
  count?: number;
}

export function VideoLoadingState({ view = "grid", count = 6 }: VideoLoadingStateProps) {
  if (view === "table") {
    return (
      <>
        {[...Array(Math.min(count, 10))].map((_, i) => (
          <TableRow key={i} className="animate-pulse border-b border-white/[0.06]">
            <TableCell className="py-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-20 bg-white/[0.04] rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-white/[0.04] rounded w-3/4"></div>
                  <div className="h-2 bg-white/[0.04] rounded w-1/2"></div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="h-6 w-6 bg-white/[0.04] rounded-full"></div>
            </TableCell>
            <TableCell>
              <div className="h-6 w-20 bg-white/[0.04] rounded-full"></div>
            </TableCell>
            <TableCell>
              <div className="h-3 bg-white/[0.04] rounded w-16"></div>
            </TableCell>
            <TableCell>
              <div className="h-3 bg-white/[0.04] rounded w-16"></div>
            </TableCell>
            <TableCell>
              <div className="h-3 bg-white/[0.04] rounded w-12"></div>
            </TableCell>
            <TableCell>
              <div className="h-3 bg-white/[0.04] rounded w-12"></div>
            </TableCell>
            <TableCell>
              <div className="h-3 bg-white/[0.04] rounded w-12"></div>
            </TableCell>
            <TableCell>
              <div className="h-2 bg-white/[0.04] rounded w-16"></div>
            </TableCell>
            <TableCell>
              <div className="h-6 w-16 bg-white/[0.04] rounded"></div>
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden animate-pulse"
        >
          {/* Thumbnail skeleton */}
          <div className="aspect-video bg-white/[0.04]"></div>

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Creator info */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/[0.04]"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/[0.04] rounded w-2/3"></div>
                <div className="h-2 bg-white/[0.04] rounded w-1/2"></div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-3 bg-white/[0.04] rounded"></div>
              <div className="h-3 bg-white/[0.04] rounded w-4/5"></div>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="space-y-1">
                  <div className="h-4 w-4 bg-white/[0.04] rounded mx-auto"></div>
                  <div className="h-3 bg-white/[0.04] rounded"></div>
                  <div className="h-2 bg-white/[0.04] rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>

            {/* Engagement bar */}
            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <div className="h-2 bg-white/[0.04] rounded-full"></div>
              <div className="flex justify-between">
                <div className="h-2 bg-white/[0.04] rounded w-16"></div>
                <div className="h-2 bg-white/[0.04] rounded w-12"></div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              <div className="h-2 bg-white/[0.04] rounded w-20"></div>
              <div className="h-6 w-20 bg-white/[0.04] rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
