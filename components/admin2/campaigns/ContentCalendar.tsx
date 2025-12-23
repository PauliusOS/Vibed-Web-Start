"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  User,
  Users,
  UserPlus,
  MoreHorizontal,
  FileText,
  Trash2,
  Edit,
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
} from "date-fns";
import { CreateScheduledPostDialog } from "./CreateScheduledPostDialog";
import { BriefEditorDialog } from "@/components/admin2/dialogs/campaigns/BriefEditorDialog";
import { toast } from "sonner";

interface ContentCalendarProps {
  campaignId: Id<"campaigns">;
}

type PostStatus =
  | "scheduled"
  | "draft_submitted"
  | "revision_needed"
  | "approved"
  | "completed"
  | "missed";

const STATUS_CONFIG: Record<
  PostStatus,
  { color: string; bgColor: string; label: string }
> = {
  scheduled: {
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    label: "Scheduled",
  },
  draft_submitted: {
    color: "text-amber-500",
    bgColor: "bg-amber-500",
    label: "Pending Review",
  },
  revision_needed: {
    color: "text-orange-500",
    bgColor: "bg-orange-500",
    label: "Needs Revision",
  },
  approved: {
    color: "text-emerald-500",
    bgColor: "bg-emerald-500",
    label: "Approved",
  },
  completed: {
    color: "text-green-500",
    bgColor: "bg-green-500",
    label: "Completed",
  },
  missed: {
    color: "text-red-500",
    bgColor: "bg-red-500",
    label: "Missed",
  },
};

const ASSIGNMENT_ICONS = {
  specific_creator: User,
  any_creator: UserPlus,
  multiple_creators: Users,
};

export function ContentCalendar({ campaignId }: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [briefDialogOpen, setBriefDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<Id<"scheduledPosts"> | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Queries
  const scheduledPosts = useQuery(api.contentCalendar.getCalendarForCampaign, {
    campaignId,
    startDate: startOfWeek(monthStart).getTime(),
    endDate: endOfWeek(monthEnd).getTime(),
  });

  const creators = useQuery(api.contentCalendar.getCampaignCreatorsForAssignment, {
    campaignId,
  });

  // Mutations
  const deletePost = useMutation(api.contentCalendar.deleteScheduledPost);
  const reschedulePost = useMutation(api.contentCalendar.reschedulePost);

  // Get all days in current month view (including padding)
  const calendarDays = useMemo(() => {
    const start = startOfWeek(monthStart);
    const end = endOfWeek(monthEnd);
    return eachDayOfInterval({ start, end });
  }, [monthStart, monthEnd]);

  // Get posts for a specific day
  const getPostsForDay = (day: Date) => {
    if (!scheduledPosts) return [];
    const dayStart = new Date(day).setHours(0, 0, 0, 0);
    const dayEnd = new Date(day).setHours(23, 59, 59, 999);
    return scheduledPosts.filter((post) => {
      return post.scheduledDate >= dayStart && post.scheduledDate <= dayEnd;
    });
  };

  // Posts for selected date
  const selectedDatePosts = selectedDate ? getPostsForDay(selectedDate) : [];

  // Navigation
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Handle delete
  const handleDelete = async (postId: Id<"scheduledPosts">) => {
    try {
      await deletePost({ postId });
      toast.success("Scheduled post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  // Handle create for selected date
  const handleCreateForDate = (date: Date) => {
    setSelectedDate(date);
    setCreateDialogOpen(true);
  };

  // Handle brief edit
  const handleEditBrief = (postId: Id<"scheduledPosts">) => {
    setSelectedPostId(postId);
    setBriefDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMonth}
            className="h-8 w-8 border-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold text-white">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
            className="h-8 w-8 border-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="h-8 text-[12px] border-white/10"
          >
            Today
          </Button>
          <CreateScheduledPostDialog
            campaignId={campaignId}
            creators={creators || []}
            defaultDate={selectedDate}
            onSuccess={() => setCreateDialogOpen(false)}
            trigger={
              <Button size="sm" className="h-8 text-[12px] bg-white text-black hover:bg-white/90">
                <Plus className="w-4 h-4 mr-1" />
                Schedule Post
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-white/[0.06]">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-[11px] font-medium text-white/40 py-3 uppercase tracking-wider"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const dayPosts = getPostsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);
                const isPastDate = isPast(day) && !isToday(day);

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "min-h-[100px] p-2 border-b border-r border-white/[0.04] hover:bg-white/[0.02] transition-colors",
                      "flex flex-col items-start gap-1",
                      !isCurrentMonth && "opacity-30",
                      isSelected && "bg-white/[0.05] ring-1 ring-white/20 ring-inset",
                      isPastDate && isCurrentMonth && "opacity-60"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={cn(
                          "text-[13px] w-7 h-7 flex items-center justify-center rounded-full",
                          isTodayDate && "bg-white text-black font-semibold",
                          !isTodayDate && "text-white/60"
                        )}
                      >
                        {format(day, "d")}
                      </span>
                      {dayPosts.length > 0 && (
                        <span className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
                          {dayPosts.length}
                        </span>
                      )}
                    </div>
                    {dayPosts.length > 0 && (
                      <div className="w-full space-y-1 mt-1">
                        {dayPosts.slice(0, 3).map((post) => {
                          const AssignmentIcon =
                            ASSIGNMENT_ICONS[post.assignmentType] || User;
                          return (
                            <div
                              key={post._id}
                              className={cn(
                                "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] truncate",
                                "bg-white/5 border-l-2",
                                post.status === "scheduled" && "border-blue-500",
                                post.status === "draft_submitted" && "border-amber-500",
                                post.status === "revision_needed" && "border-orange-500",
                                post.status === "approved" && "border-emerald-500",
                                post.status === "completed" && "border-green-500",
                                post.status === "missed" && "border-red-500"
                              )}
                            >
                              <AssignmentIcon className="w-3 h-3 text-white/40 flex-shrink-0" />
                              <span className="truncate text-white/70">
                                {post.creatorInfo?.username || post.scheduledTime || "Any"}
                              </span>
                            </div>
                          );
                        })}
                        {dayPosts.length > 3 && (
                          <div className="text-[10px] text-white/40 px-1.5">
                            +{dayPosts.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4">
            <span className="text-[11px] text-white/40">Status:</span>
            {Object.entries(STATUS_CONFIG).map(([status, config]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className={cn("h-2 w-2 rounded-full", config.bgColor)} />
                <span className="text-[11px] text-white/50">{config.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Details */}
        <div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[14px] font-medium text-white">
                  {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                </h3>
                <p className="text-[12px] text-white/40">
                  {selectedDatePosts.length} scheduled post
                  {selectedDatePosts.length !== 1 ? "s" : ""}
                </p>
              </div>
              {selectedDate && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCreateForDate(selectedDate)}
                  className="h-7 text-[11px] border-white/10"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              )}
            </div>

            {selectedDatePosts.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-8 w-8 text-white/20 mx-auto mb-2" />
                <p className="text-[13px] text-white/40">No posts scheduled</p>
                {selectedDate && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCreateForDate(selectedDate)}
                    className="mt-2 text-[12px] text-white/50 hover:text-white"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Schedule a post
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDatePosts.map((post) => {
                  const AssignmentIcon =
                    ASSIGNMENT_ICONS[post.assignmentType] || User;
                  const statusConfig = STATUS_CONFIG[post.status as PostStatus];

                  return (
                    <div
                      key={post._id}
                      className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              "bg-white/5"
                            )}
                          >
                            {post.creatorInfo?.profilePictureUrl ? (
                              <img
                                src={post.creatorInfo.profilePictureUrl}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <AssignmentIcon className="w-4 h-4 text-white/40" />
                            )}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-white">
                              {post.creatorInfo?.displayName ||
                                post.creatorInfo?.username ||
                                (post.assignmentType === "any_creator"
                                  ? "Any Creator"
                                  : "Unassigned")}
                            </p>
                            {post.scheduledTime && (
                              <p className="text-[11px] text-white/40">
                                {post.scheduledTime}
                              </p>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-white/40 hover:text-white"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-40 bg-black border-white/10"
                          >
                            <DropdownMenuItem
                              onClick={() => handleEditBrief(post._id)}
                              className="text-[12px] text-white/70 hover:text-white cursor-pointer"
                            >
                              <FileText className="w-3 h-3 mr-2" />
                              {post.brief ? "Edit Brief" : "Add Brief"}
                            </DropdownMenuItem>
                            {post.video && (
                              <DropdownMenuItem className="text-[12px] text-white/70 hover:text-white cursor-pointer">
                                <Eye className="w-3 h-3 mr-2" />
                                View Video
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDelete(post._id)}
                              className="text-[12px] text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] px-1.5 py-0 h-5",
                            statusConfig?.color,
                            "bg-white/5"
                          )}
                        >
                          {statusConfig?.label}
                        </Badge>
                        {post.brief && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-5 border-white/10 text-white/50"
                          >
                            <FileText className="w-2.5 h-2.5 mr-1" />
                            Brief
                          </Badge>
                        )}
                      </div>

                      {post.brief && (
                        <p className="text-[11px] text-white/40 mt-2 line-clamp-2">
                          {post.brief.title}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          {scheduledPosts && scheduledPosts.length > 0 && (
            <div className="mt-4 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
              <h4 className="text-[12px] font-medium text-white/60 mb-3">
                This Month
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[20px] font-semibold text-white">
                    {scheduledPosts.filter((p) => p.status === "scheduled").length}
                  </p>
                  <p className="text-[11px] text-white/40">Scheduled</p>
                </div>
                <div>
                  <p className="text-[20px] font-semibold text-amber-400">
                    {scheduledPosts.filter((p) => p.status === "draft_submitted").length}
                  </p>
                  <p className="text-[11px] text-white/40">Pending Review</p>
                </div>
                <div>
                  <p className="text-[20px] font-semibold text-emerald-400">
                    {scheduledPosts.filter((p) => p.status === "approved" || p.status === "completed").length}
                  </p>
                  <p className="text-[11px] text-white/40">Approved</p>
                </div>
                <div>
                  <p className="text-[20px] font-semibold text-orange-400">
                    {scheduledPosts.filter((p) => p.status === "revision_needed").length}
                  </p>
                  <p className="text-[11px] text-white/40">Needs Revision</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Brief Editor Dialog */}
      {selectedPostId && (
        <BriefEditorDialog
          scheduledPostId={selectedPostId}
          open={briefDialogOpen}
          onOpenChange={setBriefDialogOpen}
        />
      )}
    </div>
  );
}
