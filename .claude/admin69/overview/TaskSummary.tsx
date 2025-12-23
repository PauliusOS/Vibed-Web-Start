"use client";

import { FramerCard } from "@/components/framer-analytics";
import { CheckCircle2, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TaskCounts {
  overdue: number;
  dueToday: number;
  upcoming: number;
  completed: number;
}

interface TaskSummaryProps {
  tasks: TaskCounts;
  onViewTasks?: () => void;
}

export function TaskSummary({ tasks, onViewTasks }: TaskSummaryProps) {
  const total = tasks.overdue + tasks.dueToday + tasks.upcoming;
  const completionRate = total > 0 ? Math.round((tasks.completed / (tasks.completed + total)) * 100) : 100;

  return (
    <FramerCard padding="none" className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Task Overview</h3>
        <Link
          href="/admin69/tasks"
          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-0.5"
        >
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="p-6 flex-1 space-y-5">
        {/* Completion Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50">Completion Rate</span>
            <span className="text-white font-medium">{completionRate}%</span>
          </div>
          <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Task Breakdown */}
        <div className="space-y-3">
          <TaskRow
            icon={<AlertTriangle className="w-4 h-4" />}
            label="Overdue"
            count={tasks.overdue}
            color="red"
          />
          <TaskRow
            icon={<Clock className="w-4 h-4" />}
            label="Due Today"
            count={tasks.dueToday}
            color="amber"
          />
          <TaskRow
            icon={<CheckCircle2 className="w-4 h-4" />}
            label="Upcoming"
            count={tasks.upcoming}
            color="blue"
          />
        </div>

        {/* Quick Stats */}
        <div className="pt-4 border-t border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Completed this week</span>
            <span className="text-sm font-medium text-emerald-400">{tasks.completed}</span>
          </div>
        </div>
      </div>
    </FramerCard>
  );
}

function TaskRow({
  icon,
  label,
  count,
  color
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: "red" | "amber" | "blue" | "emerald";
}) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-1.5 rounded-lg",
          color === "red" && "bg-red-500/10 text-red-400",
          color === "amber" && "bg-amber-500/10 text-amber-400",
          color === "blue" && "bg-blue-500/10 text-blue-400",
          color === "emerald" && "bg-emerald-500/10 text-emerald-400"
        )}>
          {icon}
        </div>
        <span className="text-sm text-white/70">{label}</span>
      </div>
      <span className={cn(
        "text-sm font-medium px-2 py-0.5 rounded",
        color === "red" && count > 0 && "bg-red-500/10 text-red-400",
        color === "amber" && count > 0 && "bg-amber-500/10 text-amber-400",
        color === "blue" && "text-blue-400",
        color === "emerald" && "text-emerald-400",
        count === 0 && "text-white/30"
      )}>
        {count}
      </span>
    </div>
  );
}

export default TaskSummary;
