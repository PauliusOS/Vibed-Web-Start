"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Eye,
} from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  isPast,
  isBefore,
} from "date-fns";
import { BriefViewer } from "./BriefViewer";
import { SubmitToSlotDialog } from "./SubmitToSlotDialog";

interface CreatorCalendarViewProps {
  campaignId: Id<"campaigns">;
  creatorId?: string;
}

type ScheduledPost = {
  _id: Id<"scheduledPosts">;
  scheduledDate: number;
  scheduledTime?: string;
  assignmentType: string;
  status: string;
  briefId?: Id<"scheduledPostBriefs">;
  videoId?: Id<"videos">;
};

export function CreatorCalendarView({ campaignId, creatorId: propCreatorId }: CreatorCalendarViewProps) {
  const { user } = useUser();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [showBrief, setShowBrief] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Use prop creatorId or fall back to current user
  const creatorId = propCreatorId || user?.id;

  // Get creator's scheduled posts for this campaign
  const schedule = useQuery(
    api.contentCalendar.getCreatorSchedule,
    creatorId
      ? { campaignId, creatorId }
      : "skip"
  );

  // Calendar navigation
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  // Calendar days calculation
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Group posts by date
  const postsByDate = useMemo(() => {
    if (!schedule) return new Map();
    const map = new Map<string, ScheduledPost[]>();
    schedule.forEach((post) => {
      const dateKey = format(new Date(post.scheduledDate), "yyyy-MM-dd");
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(post as ScheduledPost);
    });
    return map;
  }, [schedule]);

  // Get posts for selected date
  const selectedDatePosts = useMemo((): ScheduledPost[] => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return postsByDate.get(dateKey) || [];
  }, [selectedDate, postsByDate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-blue-500/10 text-blue-400 border-0 text-[11px]">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "draft_submitted":
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border-0 text-[11px]">
            <Eye className="w-3 h-3 mr-1" />
            In Review
          </Badge>
        );
      case "revision_needed":
        return (
          <Badge className="bg-red-500/10 text-red-400 border-0 text-[11px]">
            <AlertCircle className="w-3 h-3 mr-1" />
            Needs Revision
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-0 text-[11px]">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-500/10 text-green-400 border-0 text-[11px]">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "missed":
        return (
          <Badge className="bg-white/10 text-white/40 border-0 text-[11px]">
            Missed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500";
      case "draft_submitted":
        return "bg-amber-500";
      case "revision_needed":
        return "bg-red-500";
      case "approved":
        return "bg-emerald-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-white/30";
    }
  };

  const canSubmit = (post: ScheduledPost) => {
    return post.status === "scheduled" || post.status === "revision_needed";
  };

  const isUpcoming = (post: ScheduledPost) => {
    return !isPast(new Date(post.scheduledDate)) || isToday(new Date(post.scheduledDate));
  };

  // Count upcoming deadlines
  const upcomingCount = useMemo(() => {
    if (!schedule) return 0;
    return schedule.filter((post: ScheduledPost) =>
      (post.status === "scheduled" || post.status === "revision_needed") &&
      isUpcoming(post)
    ).length;
  }, [schedule]);

  // Count pending reviews
  const pendingReviewCount = useMemo(() => {
    if (!schedule) return 0;
    return schedule.filter((post: ScheduledPost) => post.status === "draft_submitted").length;
  }, [schedule]);

  if (!schedule) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
          <p className="text-[12px] uppercase tracking-wider text-white/40 mb-1">
            Upcoming
          </p>
          <p className="text-xl font-semibold text-white">{upcomingCount}</p>
        </div>
        <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
          <p className="text-[12px] uppercase tracking-wider text-white/40 mb-1">
            In Review
          </p>
          <p className="text-xl font-semibold text-amber-400">{pendingReviewCount}</p>
        </div>
        <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
          <p className="text-[12px] uppercase tracking-wider text-white/40 mb-1">
            Total Posts
          </p>
          <p className="text-xl font-semibold text-white">{schedule.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-white">
                {format(currentMonth, "MMMM yyyy")}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="h-7 text-[11px] border-white/10 text-white/60 hover:bg-white/5"
              >
                Today
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousMonth}
                className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/5"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextMonth}
                className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/5"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-white/[0.03] rounded-lg overflow-hidden">
            {/* Weekday Headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="px-2 py-2 text-center text-[11px] font-medium text-white/40 bg-black"
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {calendarDays.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const dayPosts = postsByDate.get(dateKey) || [];
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isDeadline = dayPosts.some(
                (p: ScheduledPost) => p.status === "scheduled" || p.status === "revision_needed"
              );
              const isPastDate = isBefore(day, new Date()) && !isToday(day);

              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "relative min-h-[80px] p-2 text-left transition-colors bg-black",
                    isCurrentMonth ? "text-white" : "text-white/20",
                    isSelected && "ring-1 ring-white/30",
                    isToday(day) && "bg-white/[0.03]",
                    isPastDate && isCurrentMonth && "opacity-60",
                    "hover:bg-white/[0.05]"
                  )}
                >
                  <span
                    className={cn(
                      "text-[13px]",
                      isToday(day) &&
                        "bg-white text-black rounded-full w-6 h-6 flex items-center justify-center"
                    )}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Post Indicators */}
                  {dayPosts.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {dayPosts.slice(0, 2).map((post: ScheduledPost) => (
                        <div
                          key={post._id}
                          className={cn(
                            "h-1.5 rounded-full",
                            getStatusColor(post.status)
                          )}
                        />
                      ))}
                      {dayPosts.length > 2 && (
                        <span className="text-[10px] text-white/40">
                          +{dayPosts.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Deadline indicator */}
                  {isDeadline && !isPastDate && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
          {selectedDate ? (
            <>
              <div className="mb-4">
                <p className="text-[12px] text-white/40 uppercase tracking-wider">
                  {format(selectedDate, "EEEE")}
                </p>
                <p className="text-lg font-semibold text-white">
                  {format(selectedDate, "MMMM d, yyyy")}
                </p>
              </div>

              {selectedDatePosts.length === 0 ? (
                <div className="py-8 text-center">
                  <CalendarIcon className="w-8 h-8 mx-auto text-white/20 mb-3" />
                  <p className="text-[13px] text-white/40">
                    No posts scheduled
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDatePosts.map((post) => (
                    <div
                      key={post._id}
                      className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        {getStatusBadge(post.status)}
                        {post.scheduledTime && (
                          <span className="text-[12px] text-white/50">
                            {post.scheduledTime}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {post.briefId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPost(post);
                              setShowBrief(true);
                            }}
                            className="w-full h-8 text-[12px] border-white/10 text-white/70 hover:bg-white/5 justify-start"
                          >
                            <FileText className="w-3.5 h-3.5 mr-2" />
                            View Brief
                          </Button>
                        )}

                        {canSubmit(post) && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedPost(post);
                              setShowSubmitDialog(true);
                            }}
                            className="w-full h-8 text-[12px] bg-white text-black hover:bg-white/90 justify-start"
                          >
                            <Upload className="w-3.5 h-3.5 mr-2" />
                            {post.status === "revision_needed"
                              ? "Submit Revision"
                              : "Submit Draft"}
                          </Button>
                        )}

                        {post.status === "draft_submitted" && (
                          <p className="text-[11px] text-amber-400 text-center py-1">
                            Waiting for review...
                          </p>
                        )}

                        {post.status === "approved" && (
                          <p className="text-[11px] text-emerald-400 text-center py-1">
                            Ready to post!
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <CalendarIcon className="w-10 h-10 mx-auto text-white/20 mb-3" />
              <p className="text-[13px] text-white/40">
                Select a date to view details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Brief Viewer Dialog */}
      {selectedPost?.briefId && (
        <BriefViewer
          scheduledPostId={selectedPost._id}
          open={showBrief}
          onOpenChange={setShowBrief}
        />
      )}

      {/* Submit Dialog */}
      {selectedPost && (
        <SubmitToSlotDialog
          scheduledPostId={selectedPost._id}
          campaignId={campaignId}
          isRevision={selectedPost.status === "revision_needed"}
          open={showSubmitDialog}
          onOpenChange={setShowSubmitDialog}
          onSuccess={() => {
            setShowSubmitDialog(false);
            setSelectedPost(null);
          }}
        />
      )}
    </div>
  );
}
