"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FRAMER_TEXT_COLORS,
  FRAMER_CHART_COLORS,
} from "../constants/colors";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  List,
  Grid3X3,
  LayoutGrid,
  User,
  Users,
  UserPlus,
  MoreHorizontal,
  FileText,
  Trash2,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
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
  addWeeks,
  subWeeks,
} from "date-fns";

// Types
export type ViewMode = "month" | "week" | "list";
export type PostStatus =
  | "scheduled"
  | "draft_submitted"
  | "revision_needed"
  | "approved"
  | "completed"
  | "missed";

export type UserRole = "admin" | "creator" | "client";

export interface ScheduledPost {
  id: string;
  scheduledDate: number;
  scheduledTime?: string;
  status: PostStatus;
  assignmentType: "specific_creator" | "any_creator" | "multiple_creators";
  creatorId?: string;
  creatorInfo?: {
    username: string;
    displayName?: string;
    profilePictureUrl?: string;
  };
  brief?: {
    title: string;
    description?: string;
  };
  videoId?: string;
}

interface FramerCalendarProps {
  posts: ScheduledPost[];
  userRole: UserRole;
  currentUserId?: string;
  onCreatePost?: (date: Date) => void;
  onEditPost?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
  onViewPost?: (postId: string) => void;
  onEditBrief?: (postId: string) => void;
  className?: string;
}

// Status configuration
const STATUS_CONFIG: Record<
  PostStatus,
  { color: string; bgColor: string; label: string; icon: typeof CheckCircle2 }
> = {
  scheduled: {
    color: "rgb(59, 130, 246)",
    bgColor: "rgba(59, 130, 246, 0.15)",
    label: "Scheduled",
    icon: Clock,
  },
  draft_submitted: {
    color: "rgb(245, 158, 11)",
    bgColor: "rgba(245, 158, 11, 0.15)",
    label: "Pending Review",
    icon: AlertCircle,
  },
  revision_needed: {
    color: "rgb(249, 115, 22)",
    bgColor: "rgba(249, 115, 22, 0.15)",
    label: "Needs Revision",
    icon: AlertCircle,
  },
  approved: {
    color: "rgb(16, 185, 129)",
    bgColor: "rgba(16, 185, 129, 0.15)",
    label: "Approved",
    icon: CheckCircle2,
  },
  completed: {
    color: "rgb(34, 197, 94)",
    bgColor: "rgba(34, 197, 94, 0.15)",
    label: "Completed",
    icon: CheckCircle2,
  },
  missed: {
    color: "rgb(239, 68, 68)",
    bgColor: "rgba(239, 68, 68, 0.15)",
    label: "Missed",
    icon: XCircle,
  },
};

const ASSIGNMENT_ICONS = {
  specific_creator: User,
  any_creator: UserPlus,
  multiple_creators: Users,
};

export function FramerCalendar({
  posts,
  userRole,
  currentUserId,
  onCreatePost,
  onEditPost,
  onDeletePost,
  onViewPost,
  onEditBrief,
  className,
}: FramerCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  // Filter posts based on user role
  const filteredPosts = useMemo(() => {
    if (userRole === "admin") return posts;
    if (userRole === "creator" && currentUserId) {
      return posts.filter(
        (p) =>
          p.creatorId === currentUserId ||
          p.assignmentType === "any_creator"
      );
    }
    return posts; // Client sees all
  }, [posts, userRole, currentUserId]);

  // Navigation handlers
  const goToPrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const goToNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Get posts for a specific day
  const getPostsForDay = (day: Date) => {
    const dayStart = new Date(day).setHours(0, 0, 0, 0);
    const dayEnd = new Date(day).setHours(23, 59, 59, 999);
    return filteredPosts.filter(
      (post) => post.scheduledDate >= dayStart && post.scheduledDate <= dayEnd
    );
  };

  // Title based on view mode
  const getTitle = () => {
    if (viewMode === "month") {
      return format(currentDate, "MMMM yyyy");
    } else if (viewMode === "week") {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      if (isSameMonth(weekStart, weekEnd)) {
        return `${format(weekStart, "MMMM d")} - ${format(weekEnd, "d, yyyy")}`;
      }
      return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
    }
    return "All Posts";
  };

  return (
    <div 
      className={cn("rounded-xl border overflow-hidden", className)}
      style={{ 
        backgroundColor: "rgba(255, 255, 255, 0.01)",
        borderColor: "rgba(255, 255, 255, 0.06)" 
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/[0.05] rounded-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2
            className="text-base font-medium min-w-[180px] text-center tracking-tight"
            style={{ color: FRAMER_TEXT_COLORS.primary }}
          >
            {getTitle()}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/[0.05] rounded-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="h-7 px-3 text-[11px] text-white/50 hover:text-white hover:bg-white/[0.05] rounded-md ml-1"
          >
            Today
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
          >
            <TabsList className="h-8 bg-white/[0.03] border border-white/[0.06] p-0.5 rounded-lg">
              <TabsTrigger
                value="month"
                className="h-6 px-2.5 text-[11px] rounded-md data-[state=active]:bg-white/[0.08] data-[state=active]:shadow-none"
              >
                <Grid3X3 className="h-3.5 w-3.5 mr-1.5" />
                Month
              </TabsTrigger>
              <TabsTrigger
                value="week"
                className="h-6 px-2.5 text-[11px] rounded-md data-[state=active]:bg-white/[0.08] data-[state=active]:shadow-none"
              >
                <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
                Week
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="h-6 px-2.5 text-[11px] rounded-md data-[state=active]:bg-white/[0.08] data-[state=active]:shadow-none"
              >
                <List className="h-3.5 w-3.5 mr-1.5" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Create Button (Admin only) */}
          {userRole === "admin" && onCreatePost && (
            <Button
              size="sm"
              onClick={() => onCreatePost(selectedDate || new Date())}
              className="h-8 text-[12px] bg-white text-black hover:bg-white/90 rounded-lg"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Schedule Post
            </Button>
          )}
        </div>
      </div>

      {/* Calendar Views */}
      <AnimatePresence mode="wait">
        {viewMode === "month" && (
          <MonthView
            key="month"
            currentDate={currentDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            getPostsForDay={getPostsForDay}
            userRole={userRole}
            onCreatePost={onCreatePost}
            onEditPost={onEditPost}
            onDeletePost={onDeletePost}
            onViewPost={onViewPost}
            onEditBrief={onEditBrief}
          />
        )}
        {viewMode === "week" && (
          <WeekView
            key="week"
            currentDate={currentDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            getPostsForDay={getPostsForDay}
            userRole={userRole}
            onCreatePost={onCreatePost}
            onEditPost={onEditPost}
            onDeletePost={onDeletePost}
            onViewPost={onViewPost}
            onEditBrief={onEditBrief}
          />
        )}
        {viewMode === "list" && (
          <ListView
            key="list"
            posts={filteredPosts}
            userRole={userRole}
            onEditPost={onEditPost}
            onDeletePost={onDeletePost}
            onViewPost={onViewPost}
            onEditBrief={onEditBrief}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Month View Component
interface MonthViewProps {
  currentDate: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  getPostsForDay: (day: Date) => ScheduledPost[];
  userRole: UserRole;
  onCreatePost?: (date: Date) => void;
  onEditPost?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
  onViewPost?: (postId: string) => void;
  onEditBrief?: (postId: string) => void;
}

function MonthView({
  currentDate,
  selectedDate,
  onSelectDate,
  getPostsForDay,
  userRole,
  onCreatePost,
  onDeletePost,
  onViewPost,
  onEditBrief,
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(monthEnd),
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Weekday Headers */}
      <div className="grid grid-cols-7">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-medium py-3 tracking-widest"
            style={{ 
              color: FRAMER_TEXT_COLORS.muted,
              borderBottom: "1px solid rgba(255, 255, 255, 0.04)"
            }}
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
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(day)}
              className={cn(
                "min-h-[110px] p-2.5 transition-all flex flex-col items-start",
                "border-b border-r relative group",
                !isCurrentMonth && "opacity-25",
                isSelected && "bg-white/[0.04]",
                isPastDate && isCurrentMonth && "opacity-50",
                isWeekend && isCurrentMonth && "bg-white/[0.01]"
              )}
              style={{ borderColor: "rgba(255, 255, 255, 0.04)" }}
            >
              {/* Date number */}
              <div className="flex items-center justify-between w-full mb-2">
                <span
                  className={cn(
                    "text-[13px] w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                    isTodayDate && "bg-white text-black font-semibold",
                    !isTodayDate && "group-hover:bg-white/[0.06]"
                  )}
                  style={{
                    color: isTodayDate ? undefined : FRAMER_TEXT_COLORS.secondary,
                  }}
                >
                  {format(day, "d")}
                </span>
              </div>

              {/* Posts */}
              {dayPosts.length > 0 && (
                <div className="w-full space-y-1">
                  {dayPosts.slice(0, 3).map((post) => (
                    <PostPill
                      key={post.id}
                      post={post}
                      compact
                      userRole={userRole}
                      onDelete={onDeletePost}
                      onView={onViewPost}
                      onEditBrief={onEditBrief}
                    />
                  ))}
                  {dayPosts.length > 3 && (
                    <div
                      className="text-[10px] px-1 mt-0.5"
                      style={{ color: FRAMER_TEXT_COLORS.muted }}
                    >
                      +{dayPosts.length - 3} more
                    </div>
                  )}
                </div>
              )}
              
              {/* Hover add indicator for admin */}
              {userRole === "admin" && onCreatePost && dayPosts.length === 0 && (
                <div 
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreatePost(day);
                  }}
                >
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.06)" }}
                  >
                    <Plus className="w-3 h-3" style={{ color: FRAMER_TEXT_COLORS.muted }} />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// Week View Component
interface WeekViewProps {
  currentDate: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  getPostsForDay: (day: Date) => ScheduledPost[];
  userRole: UserRole;
  onCreatePost?: (date: Date) => void;
  onEditPost?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
  onViewPost?: (postId: string) => void;
  onEditBrief?: (postId: string) => void;
}

function WeekView({
  currentDate,
  selectedDate,
  onSelectDate,
  getPostsForDay,
  userRole,
  onCreatePost,
  onDeletePost,
  onViewPost,
  onEditBrief,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="p-4"
    >
      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const dayPosts = getPostsForDay(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[280px] rounded-xl p-3 transition-all cursor-pointer group",
                isSelected && "ring-1 ring-white/20"
              )}
              style={{
                backgroundColor: isTodayDate
                  ? "rgba(255, 255, 255, 0.04)"
                  : "rgba(255, 255, 255, 0.015)",
                border: `1px solid ${isTodayDate ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.04)"}`,
              }}
              onClick={() => onSelectDate(day)}
            >
              {/* Day Header */}
              <div className="flex flex-col items-center mb-4">
                <span
                  className="text-[10px] uppercase tracking-widest font-medium"
                  style={{ color: FRAMER_TEXT_COLORS.muted }}
                >
                  {format(day, "EEE")}
                </span>
                <span
                  className={cn(
                    "text-xl font-semibold mt-1 w-10 h-10 flex items-center justify-center rounded-full transition-colors",
                    isTodayDate && "bg-white text-black"
                  )}
                  style={{
                    color: isTodayDate ? undefined : FRAMER_TEXT_COLORS.primary,
                  }}
                >
                  {format(day, "d")}
                </span>
              </div>

              {/* Posts */}
              <div className="space-y-2">
                {dayPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    userRole={userRole}
                    onDelete={onDeletePost}
                    onView={onViewPost}
                    onEditBrief={onEditBrief}
                  />
                ))}
                {dayPosts.length === 0 && (
                  <div
                    className="text-center py-6 opacity-40"
                    style={{ color: FRAMER_TEXT_COLORS.muted }}
                  >
                    <span className="text-[11px]">No posts</span>
                  </div>
                )}
              </div>

              {/* Add Button (Admin only) */}
              {userRole === "admin" && onCreatePost && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreatePost(day);
                  }}
                  className="w-full mt-3 h-7 text-[11px] text-white/30 hover:text-white hover:bg-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// List View Component
interface ListViewProps {
  posts: ScheduledPost[];
  userRole: UserRole;
  onEditPost?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
  onViewPost?: (postId: string) => void;
  onEditBrief?: (postId: string) => void;
}

function ListView({
  posts,
  userRole,
  onDeletePost,
  onViewPost,
  onEditBrief,
}: ListViewProps) {
  // Group posts by date
  const groupedPosts = useMemo(() => {
    const groups: Record<string, ScheduledPost[]> = {};
    const sortedPosts = [...posts].sort(
      (a, b) => a.scheduledDate - b.scheduledDate
    );

    for (const post of sortedPosts) {
      const dateKey = format(new Date(post.scheduledDate), "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(post);
    }

    return groups;
  }, [posts]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="p-5 space-y-6"
    >
      {Object.entries(groupedPosts).map(([dateKey, datePosts]) => {
        const date = new Date(dateKey);
        const isTodayDate = isToday(date);

        return (
          <div key={dateKey}>
            {/* Date Header */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="text-[13px] font-medium"
                  style={{
                    color: isTodayDate ? "rgb(255, 255, 255)" : FRAMER_TEXT_COLORS.secondary,
                  }}
                >
                  {format(date, "EEEE, MMMM d")}
                </span>
                {isTodayDate && (
                  <span 
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ 
                      backgroundColor: "rgba(59, 130, 246, 0.15)",
                      color: "rgb(96, 165, 250)"
                    }}
                  >
                    Today
                  </span>
                )}
              </div>
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}
              />
              <span
                className="text-[11px]"
                style={{ color: FRAMER_TEXT_COLORS.muted }}
              >
                {datePosts.length}
              </span>
            </div>

            {/* Posts */}
            <div className="space-y-2">
              {datePosts.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  userRole={userRole}
                  onDelete={onDeletePost}
                  onView={onViewPost}
                  onEditBrief={onEditBrief}
                />
              ))}
            </div>
          </div>
        );
      })}

      {Object.keys(groupedPosts).length === 0 && (
        <div className="text-center py-16">
          <div 
            className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}
          >
            <CalendarIcon className="h-5 w-5" style={{ color: FRAMER_TEXT_COLORS.muted }} />
          </div>
          <p className="text-[14px] font-medium" style={{ color: FRAMER_TEXT_COLORS.secondary }}>
            No scheduled posts
          </p>
          <p className="text-[12px] mt-1" style={{ color: FRAMER_TEXT_COLORS.muted }}>
            Create your first scheduled post to get started
          </p>
        </div>
      )}
    </motion.div>
  );
}

// Post Pill (compact for month view)
interface PostPillProps {
  post: ScheduledPost;
  compact?: boolean;
  userRole: UserRole;
  onDelete?: (postId: string) => void;
  onView?: (postId: string) => void;
  onEditBrief?: (postId: string) => void;
}

function PostPill({ post, userRole, onDelete, onView, onEditBrief }: PostPillProps) {
  const statusConfig = STATUS_CONFIG[post.status];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] truncate cursor-pointer hover:bg-white/[0.08] transition-colors"
          style={{
            backgroundColor: statusConfig.bgColor,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: statusConfig.color }}
          />
          <span
            className="truncate font-medium"
            style={{ color: FRAMER_TEXT_COLORS.secondary }}
          >
            {post.creatorInfo?.displayName || post.creatorInfo?.username || post.scheduledTime || "Unassigned"}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-40 bg-[#0a0a0a] border-white/[0.08] rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {onView && (
          <DropdownMenuItem
            onClick={() => onView(post.id)}
            className="text-[12px] text-white/70 hover:text-white cursor-pointer rounded-md"
          >
            <Eye className="w-3 h-3 mr-2" />
            View Details
          </DropdownMenuItem>
        )}
        {userRole === "admin" && onEditBrief && (
          <DropdownMenuItem
            onClick={() => onEditBrief(post.id)}
            className="text-[12px] text-white/70 hover:text-white cursor-pointer rounded-md"
          >
            <FileText className="w-3 h-3 mr-2" />
            {post.brief ? "Edit Brief" : "Add Brief"}
          </DropdownMenuItem>
        )}
        {userRole === "admin" && onDelete && (
          <DropdownMenuItem
            onClick={() => onDelete(post.id)}
            className="text-[12px] text-red-400 hover:text-red-300 cursor-pointer rounded-md"
          >
            <Trash2 className="w-3 h-3 mr-2" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Post Card (for week view)
interface PostCardProps {
  post: ScheduledPost;
  userRole: UserRole;
  onDelete?: (postId: string) => void;
  onView?: (postId: string) => void;
  onEditBrief?: (postId: string) => void;
}

function PostCard({ post, userRole, onDelete, onView, onEditBrief }: PostCardProps) {
  const statusConfig = STATUS_CONFIG[post.status];
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className="p-2.5 rounded-lg transition-all hover:scale-[1.02]"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <div className="flex items-start justify-between gap-1 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {post.creatorInfo?.profilePictureUrl ? (
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.creatorInfo.profilePictureUrl} />
              <AvatarFallback className="text-[9px] bg-white/10">
                {post.creatorInfo.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.06)" }}
            >
              <User className="w-3 h-3" style={{ color: FRAMER_TEXT_COLORS.muted }} />
            </div>
          )}
          <span
            className="text-[11px] font-medium truncate"
            style={{ color: FRAMER_TEXT_COLORS.primary }}
          >
            {post.creatorInfo?.displayName ||
              post.creatorInfo?.username ||
              "Unassigned"}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-white/30 hover:text-white rounded-md"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 bg-[#0a0a0a] border-white/[0.08] rounded-lg"
          >
            {onView && (
              <DropdownMenuItem
                onClick={() => onView(post.id)}
                className="text-[12px] text-white/70 hover:text-white cursor-pointer rounded-md"
              >
                <Eye className="w-3 h-3 mr-2" />
                View Details
              </DropdownMenuItem>
            )}
            {userRole === "admin" && onEditBrief && (
              <DropdownMenuItem
                onClick={() => onEditBrief(post.id)}
                className="text-[12px] text-white/70 hover:text-white cursor-pointer rounded-md"
              >
                <FileText className="w-3 h-3 mr-2" />
                {post.brief ? "Edit Brief" : "Add Brief"}
              </DropdownMenuItem>
            )}
            {userRole === "admin" && onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(post.id)}
                className="text-[12px] text-red-400 hover:text-red-300 cursor-pointer rounded-md"
              >
                <Trash2 className="w-3 h-3 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div 
        className="flex items-center gap-1.5 px-2 py-1 rounded-md w-fit"
        style={{ backgroundColor: statusConfig.bgColor }}
      >
        <StatusIcon className="w-2.5 h-2.5" style={{ color: statusConfig.color }} />
        <span className="text-[9px] font-medium" style={{ color: statusConfig.color }}>
          {statusConfig.label}
        </span>
      </div>

      {post.scheduledTime && (
        <div className="flex items-center gap-1 mt-2">
          <Clock className="w-2.5 h-2.5" style={{ color: FRAMER_TEXT_COLORS.muted }} />
          <span className="text-[10px]" style={{ color: FRAMER_TEXT_COLORS.muted }}>
            {post.scheduledTime}
          </span>
        </div>
      )}
    </div>
  );
}

// Post Row (for list view)
interface PostRowProps {
  post: ScheduledPost;
  userRole: UserRole;
  onDelete?: (postId: string) => void;
  onView?: (postId: string) => void;
  onEditBrief?: (postId: string) => void;
}

function PostRow({ post, userRole, onDelete, onView, onEditBrief }: PostRowProps) {
  const statusConfig = STATUS_CONFIG[post.status];
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/[0.02] transition-all group"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.015)",
        border: "1px solid rgba(255, 255, 255, 0.04)",
      }}
    >
      {/* Time */}
      <div className="w-14 flex-shrink-0">
        <span className="text-[13px] font-medium tabular-nums" style={{ color: FRAMER_TEXT_COLORS.primary }}>
          {post.scheduledTime || "--:--"}
        </span>
      </div>

      {/* Status */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
        style={{ backgroundColor: statusConfig.bgColor }}
      >
        <StatusIcon className="w-3 h-3" style={{ color: statusConfig.color }} />
        <span className="text-[10px] font-medium" style={{ color: statusConfig.color }}>
          {statusConfig.label}
        </span>
      </div>

      {/* Creator */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {post.creatorInfo?.profilePictureUrl ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.creatorInfo.profilePictureUrl} />
            <AvatarFallback className="text-[10px] bg-white/10">
              {post.creatorInfo.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.06)" }}
          >
            <User className="w-4 h-4" style={{ color: FRAMER_TEXT_COLORS.muted }} />
          </div>
        )}
        <div className="min-w-0">
          <p
            className="text-[13px] font-medium truncate"
            style={{ color: FRAMER_TEXT_COLORS.primary }}
          >
            {post.creatorInfo?.displayName ||
              post.creatorInfo?.username ||
              (post.assignmentType === "any_creator" ? "Any Creator" : "Unassigned")}
          </p>
          {post.creatorInfo?.username && post.creatorInfo?.displayName && (
            <p className="text-[11px] truncate" style={{ color: FRAMER_TEXT_COLORS.muted }}>
              @{post.creatorInfo.username}
            </p>
          )}
        </div>
      </div>

      {/* Brief indicator */}
      {post.brief && (
        <div 
          className="flex items-center gap-1.5 px-2 py-1 rounded-md"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}
        >
          <FileText className="w-3 h-3" style={{ color: FRAMER_TEXT_COLORS.muted }} />
          <span className="text-[10px] font-medium truncate max-w-[120px]" style={{ color: FRAMER_TEXT_COLORS.secondary }}>
            {post.brief.title}
          </span>
        </div>
      )}

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white/30 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 bg-[#0a0a0a] border-white/[0.08] rounded-lg">
          {onView && (
            <DropdownMenuItem
              onClick={() => onView(post.id)}
              className="text-[12px] text-white/70 hover:text-white cursor-pointer rounded-md"
            >
              <Eye className="w-3 h-3 mr-2" />
              View Details
            </DropdownMenuItem>
          )}
          {userRole === "admin" && onEditBrief && (
            <DropdownMenuItem
              onClick={() => onEditBrief(post.id)}
              className="text-[12px] text-white/70 hover:text-white cursor-pointer rounded-md"
            >
              <FileText className="w-3 h-3 mr-2" />
              {post.brief ? "Edit Brief" : "Add Brief"}
            </DropdownMenuItem>
          )}
          {userRole === "admin" && onDelete && (
            <DropdownMenuItem
              onClick={() => onDelete(post.id)}
              className="text-[12px] text-red-400 hover:text-red-300 cursor-pointer rounded-md"
            >
              <Trash2 className="w-3 h-3 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}

export default FramerCalendar;
