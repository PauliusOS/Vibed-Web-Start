import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ClientCardProps {
  userId: string;
  email?: string;
  name?: string;
  invitedAt: number;
  feedbackCount?: number;
  avatarUrl?: string;
}

export function ClientCard({
  userId,
  email,
  name,
  invitedAt,
  feedbackCount,
  avatarUrl,
}: ClientCardProps) {
  const displayName = name || email || userId;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a] hover:border-white/20 transition-all">
      <CardContent className="p-6 space-y-4">
        {/* Client Header */}
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 border-2 border-white/10">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <AvatarFallback className="bg-white/5 text-white text-lg">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {displayName}
            </h3>
            <Badge className={cn("text-xs mt-1 bg-blue-500/10 text-blue-500")}>
              Client
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          {/* Invited Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/60">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Invited</span>
            </div>
            <span className="text-sm text-white/80">
              {new Date(invitedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Feedback Count */}
          {feedbackCount !== undefined && feedbackCount > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/60">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">Feedback</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">
                {feedbackCount}
              </span>
            </div>
          )}
        </div>

        {/* Email (if different from name) */}
        {email && name && email !== name && (
          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-white/40 truncate">{email}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
