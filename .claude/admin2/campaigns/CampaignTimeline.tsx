"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id, Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Rocket,
  RefreshCcw,
  DollarSign,
  UserPlus,
  UserMinus,
  UserCheck,
  Video,
  CheckCircle,
  XCircle,
  FileText,
  CreditCard,
  Trophy,
  Filter,
  ChevronDown,
  ChevronRight,
  Clock,
  History,
} from "lucide-react";

// Event type configuration
type EventType = Doc<"campaignEvents">["eventType"];

interface EventConfig {
  icon: typeof Rocket;
  iconColor: string;
  bgColor: string;
  label: string;
}

const eventConfig: Record<EventType, EventConfig> = {
  campaign_created: {
    icon: Rocket,
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    label: "Created",
  },
  campaign_status_changed: {
    icon: RefreshCcw,
    iconColor: "text-purple-400",
    bgColor: "bg-purple-500/10",
    label: "Status Changed",
  },
  budget_updated: {
    icon: DollarSign,
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    label: "Budget Updated",
  },
  creator_added: {
    icon: UserPlus,
    iconColor: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    label: "Creator Added",
  },
  creator_removed: {
    icon: UserMinus,
    iconColor: "text-orange-400",
    bgColor: "bg-orange-500/10",
    label: "Creator Removed",
  },
  client_assigned: {
    icon: UserCheck,
    iconColor: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    label: "Client Assigned",
  },
  client_removed: {
    icon: UserMinus,
    iconColor: "text-rose-400",
    bgColor: "bg-rose-500/10",
    label: "Client Removed",
  },
  video_submitted: {
    icon: Video,
    iconColor: "text-violet-400",
    bgColor: "bg-violet-500/10",
    label: "Video Submitted",
  },
  video_approved: {
    icon: CheckCircle,
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    label: "Video Approved",
  },
  video_rejected: {
    icon: XCircle,
    iconColor: "text-red-400",
    bgColor: "bg-red-500/10",
    label: "Video Rejected",
  },
  brief_updated: {
    icon: FileText,
    iconColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
    label: "Brief Updated",
  },
  payment_processed: {
    icon: CreditCard,
    iconColor: "text-green-400",
    bgColor: "bg-green-500/10",
    label: "Payment",
  },
  milestone_reached: {
    icon: Trophy,
    iconColor: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    label: "Milestone",
  },
};

// Filter categories for grouping event types
const filterCategories = [
  {
    label: "Campaign",
    types: ["campaign_created", "campaign_status_changed", "budget_updated"] as EventType[],
  },
  {
    label: "People",
    types: ["creator_added", "creator_removed", "client_assigned", "client_removed"] as EventType[],
  },
  {
    label: "Videos",
    types: ["video_submitted", "video_approved", "video_rejected"] as EventType[],
  },
  {
    label: "Other",
    types: ["brief_updated", "payment_processed", "milestone_reached"] as EventType[],
  },
];

// Helper to format relative time
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0) {
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
  if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }
  return "Just now";
}

// Helper to format absolute date
function formatAbsoluteDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Group events by date
function groupEventsByDate(events: Doc<"campaignEvents">[]): Map<string, Doc<"campaignEvents">[]> {
  const groups = new Map<string, Doc<"campaignEvents">[]>();

  events.forEach((event) => {
    const date = new Date(event.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey: string;
    if (date.toDateString() === today.toDateString()) {
      dateKey = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = "Yesterday";
    } else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
      dateKey = date.toLocaleDateString("en-US", { weekday: "long" });
    } else {
      dateKey = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }

    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(event);
  });

  return groups;
}

// Get link for event metadata
function getEventLink(event: Doc<"campaignEvents">): string | null {
  const { metadata } = event;
  if (!metadata) return null;

  if (event.eventType === "video_submitted" || event.eventType === "video_approved" || event.eventType === "video_rejected") {
    if (metadata.videoId) {
      return `/admin2/campaigns/${event.campaignId}/videos`;
    }
  }

  if (event.eventType === "brief_updated" && metadata.briefId) {
    return `/admin2/campaigns/${event.campaignId}/briefs`;
  }

  if (event.eventType === "payment_processed" && metadata.paymentId) {
    return `/admin2/finance/payments`;
  }

  return null;
}

// Timeline Event Item Component
interface TimelineEventProps {
  event: Doc<"campaignEvents">;
  isLast: boolean;
}

function TimelineEvent({ event, isLast }: TimelineEventProps) {
  const config = eventConfig[event.eventType];
  const Icon = config.icon;
  const link = getEventLink(event);

  const content = (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex gap-4 pb-6",
        link && "cursor-pointer"
      )}
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[17px] top-10 bottom-0 w-px bg-white/[0.06]" />
      )}

      {/* Icon */}
      <div
        className={cn(
          "relative z-10 flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-transform",
          config.bgColor,
          link && "group-hover:scale-110"
        )}
      >
        <Icon className={cn("w-4 h-4", config.iconColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-sm text-white/90 leading-relaxed",
              link && "group-hover:text-white"
            )}>
              {event.description}
            </p>

            {/* Actor name if available */}
            {event.actorName && (
              <p className="text-xs text-white/40 mt-0.5">
                by {event.actorName}
              </p>
            )}
          </div>

          {/* Timestamp with tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex-shrink-0 text-xs text-white/40 whitespace-nowrap">
                  {formatRelativeTime(event.createdAt)}
                </span>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-zinc-900 border-white/10">
                <p className="text-xs">{formatAbsoluteDate(event.createdAt)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Metadata details */}
        {event.metadata && (
          <div className="mt-2 flex flex-wrap gap-2">
            {event.metadata.oldStatus && event.metadata.newStatus && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.04] text-xs text-white/60">
                <span className="capitalize">{event.metadata.oldStatus}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="capitalize text-white/80">{event.metadata.newStatus}</span>
              </span>
            )}
            {event.metadata.amount !== undefined && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-xs text-emerald-400">
                <DollarSign className="w-3 h-3" />
                ${(event.metadata.amount / 100).toLocaleString()}
              </span>
            )}
            {event.metadata.milestoneType && event.metadata.milestoneValue !== undefined && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/10 text-xs text-yellow-400">
                <Trophy className="w-3 h-3" />
                {event.metadata.milestoneValue.toLocaleString()} {event.metadata.milestoneType}
              </span>
            )}
            {event.metadata.targetUserName && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] text-xs text-white/60">
                {event.metadata.targetUserName}
              </span>
            )}
          </div>
        )}

        {/* Link indicator */}
        {link && (
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-purple-400 flex items-center gap-1">
              View details
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );

  return link ? (
    <Link href={link}>{content}</Link>
  ) : (
    content
  );
}

// Collapsible Date Section
interface DateSectionProps {
  dateLabel: string;
  events: Doc<"campaignEvents">[];
  defaultExpanded?: boolean;
}

function DateSection({ dateLabel, events, defaultExpanded = true }: DateSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 mb-3 text-xs font-medium text-white/50 hover:text-white/70 transition-colors"
      >
        <ChevronDown
          className={cn(
            "w-3 h-3 transition-transform",
            !isExpanded && "-rotate-90"
          )}
        />
        {dateLabel}
        <span className="text-white/30">({events.length})</span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {events.map((event, index) => (
              <TimelineEvent
                key={event._id}
                event={event}
                isLast={index === events.length - 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Loading skeleton
function TimelineSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="w-9 h-9 rounded-lg bg-white/5" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-3 w-24 bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty state
function EmptyTimeline() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mb-4">
        <History className="w-6 h-6 text-white/30" />
      </div>
      <p className="text-sm text-white/60 mb-1">No activity yet</p>
      <p className="text-xs text-white/40">
        Events will appear here as they happen
      </p>
    </div>
  );
}

// Main Timeline Component
interface CampaignTimelineProps {
  campaignId: Id<"campaigns">;
  className?: string;
  showFilters?: boolean;
  maxEvents?: number;
}

export function CampaignTimeline({
  campaignId,
  className,
  showFilters = true,
  maxEvents = 50,
}: CampaignTimelineProps) {
  const [selectedFilters, setSelectedFilters] = useState<EventType[]>([]);

  // Fetch events
  const events = useQuery(api.campaigns.getCampaignTimelineAll, {
    campaignId,
    eventTypeFilter: selectedFilters.length > 0 ? selectedFilters : undefined,
    limit: maxEvents,
  });

  // Fetch stats for filter badges
  const stats = useQuery(api.campaigns.getCampaignTimelineStats, {
    campaignId,
  });

  // Group events by date
  const groupedEvents = useMemo(() => {
    if (!events) return new Map();
    return groupEventsByDate(events);
  }, [events]);

  // Toggle filter
  const toggleFilter = (eventType: EventType) => {
    setSelectedFilters((prev) =>
      prev.includes(eventType)
        ? prev.filter((t) => t !== eventType)
        : [...prev, eventType]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters([]);
  };

  // Loading state
  if (events === undefined) {
    return (
      <GlassPanel className={cn("p-6", className)}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Activity Timeline
          </h3>
        </div>
        <TimelineSkeleton />
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className={cn("p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          Activity Timeline
          {stats && (
            <span className="text-sm font-normal text-white/40">
              ({stats.total})
            </span>
          )}
        </h3>

        {/* Filters */}
        {showFilters && stats && stats.total > 0 && (
          <div className="flex items-center gap-2">
            {selectedFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-white/60 hover:text-white"
              >
                Clear filters
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "border-white/[0.06] text-white/70",
                    selectedFilters.length > 0 && "border-purple-500/50 text-purple-400"
                  )}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                  {selectedFilters.length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-purple-500/20 text-xs">
                      {selectedFilters.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-zinc-900 border-white/10"
              >
                {filterCategories.map((category, categoryIndex) => (
                  <div key={category.label}>
                    {categoryIndex > 0 && <DropdownMenuSeparator className="bg-white/10" />}
                    <DropdownMenuLabel className="text-white/50 text-xs">
                      {category.label}
                    </DropdownMenuLabel>
                    {category.types.map((eventType) => {
                      const config = eventConfig[eventType];
                      const count = stats.byType[eventType] || 0;

                      return (
                        <DropdownMenuCheckboxItem
                          key={eventType}
                          checked={selectedFilters.includes(eventType)}
                          onCheckedChange={() => toggleFilter(eventType)}
                          className="text-white/80"
                          disabled={count === 0}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <config.icon className={cn("w-3.5 h-3.5", config.iconColor)} />
                            <span>{config.label}</span>
                          </div>
                          <span className="text-white/40 text-xs">{count}</span>
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Timeline content */}
      {events.length === 0 ? (
        <EmptyTimeline />
      ) : (
        <div className="max-h-[600px] overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {Array.from(groupedEvents.entries()).map(([dateLabel, dateEvents], index) => (
            <DateSection
              key={dateLabel}
              dateLabel={dateLabel}
              events={dateEvents}
              defaultExpanded={index < 3}
            />
          ))}
        </div>
      )}
    </GlassPanel>
  );
}
