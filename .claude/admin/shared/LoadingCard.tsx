import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingCardProps {
  showIcon?: boolean;
  showTrend?: boolean;
}

export function LoadingCard({ showIcon = true, showTrend = false }: LoadingCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          {showIcon && (
            <Skeleton className="h-10 w-10 rounded-lg" />
          )}
          {showTrend && (
            <Skeleton className="h-6 w-16 rounded" />
          )}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      </CardContent>
    </Card>
  );
}
