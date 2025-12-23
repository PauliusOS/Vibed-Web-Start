import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    href?: string;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a]">
      <CardContent className="flex flex-col items-center justify-center py-16 px-4">
        <Icon className="h-12 w-12 text-white/40 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/60 text-center max-w-sm mb-6">
          {description}
        </p>
        {action && (
          <Button
            onClick={action.onClick}
            className="bg-white text-black hover:bg-white/90"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
