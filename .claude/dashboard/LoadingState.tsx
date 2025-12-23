import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCardSkeleton() {
  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-5 bg-white/5" />
          <Skeleton className="h-5 w-16 bg-white/5" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-white/5" />
          <Skeleton className="h-8 w-32 bg-white/5" />
          <Skeleton className="h-3 w-20 bg-white/5" />
        </div>
      </CardContent>
    </Card>
  );
}

export function CampaignCardSkeleton() {
  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-48 bg-white/5" />
            <Skeleton className="h-4 w-32 bg-white/5" />
          </div>
          <Skeleton className="h-5 w-16 bg-white/5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-16 bg-white/5" />
              <Skeleton className="h-6 w-20 bg-white/5" />
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-full bg-white/5" />
      </CardContent>
    </Card>
  );
}

export function ClientCampaignCardSkeleton() {
  return (
    <Card className="bg-card border-border shadow-sm">
      <div className="p-6 space-y-4">
        {/* Header Skeleton */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <Skeleton className="h-6 w-48 bg-muted" />
            <Skeleton className="h-4 w-32 bg-muted/50" />
          </div>
          <Skeleton className="h-6 w-16 bg-muted" />
        </div>

        {/* Metrics Grid Skeleton */}
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-16 bg-muted/50" />
              <Skeleton className="h-6 w-20 bg-muted" />
            </div>
          ))}
        </div>

        {/* Button Skeleton */}
        <Skeleton className="h-10 w-full bg-muted/50" />
      </div>
    </Card>
  );
}

export function VideoCardSkeleton() {
  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a] overflow-hidden">
      <Skeleton className="aspect-video w-full bg-white/5" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-32 bg-white/5" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 bg-white/5" />
          ))}
        </div>
        <Skeleton className="h-4 w-full bg-white/5" />
      </CardContent>
    </Card>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-[#1a1a1a] border border-[#3a3a3a]">
          <Skeleton className="h-12 w-12 rounded bg-white/5" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-3 w-2/3 bg-white/5" />
          </div>
          <Skeleton className="h-8 w-24 bg-white/5" />
        </div>
      ))}
    </div>
  );
}
