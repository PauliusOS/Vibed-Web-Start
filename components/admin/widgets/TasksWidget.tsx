"use client";

import { motion } from "motion/react";
import { ArrowRight, Circle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format, isToday, isTomorrow, isPast } from "date-fns";

type Priority = "high" | "medium" | "low";
type TaskStatus = "pending" | "in_progress" | "completed";

interface Task {
  id: string;
  title: string;
  dueDate: number;
  priority: Priority;
  status: TaskStatus;
  category?: string;
}

interface TasksWidgetProps {
  tasks: Task[];
  title?: string;
  className?: string;
  href?: string;
  maxItems?: number;
  onTaskToggle?: (taskId: string) => void;
}

const priorityConfig: Record<Priority, { color: string; bgColor: string; label: string }> = {
  high: { color: "bg-red-500", bgColor: "bg-red-500/10", label: "High" },
  medium: { color: "bg-orange-500", bgColor: "bg-orange-500/10", label: "Medium" },
  low: { color: "bg-green-500", bgColor: "bg-green-500/10", label: "Low" },
};

function formatDueDate(timestamp: number): { text: string; isOverdue: boolean } {
  const date = new Date(timestamp);
  const isOverdue = isPast(date) && !isToday(date);

  if (isToday(date)) {
    return { text: "Today", isOverdue: false };
  }
  if (isTomorrow(date)) {
    return { text: "Tomorrow", isOverdue: false };
  }
  if (isOverdue) {
    return { text: `Overdue - ${format(date, "MMM d")}`, isOverdue: true };
  }
  return { text: format(date, "MMM d"), isOverdue: false };
}

export function TasksWidget({
  tasks,
  title = "Upcoming Tasks",
  className,
  href,
  maxItems = 5,
  onTaskToggle,
}: TasksWidgetProps) {
  const displayedTasks = tasks
    .filter((t) => t.status !== "completed")
    .sort((a, b) => a.dueDate - b.dueDate)
    .slice(0, maxItems);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className={cn("h-full", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {href && (
            <Link href={href}>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayedTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No upcoming tasks
              </p>
            ) : (
              displayedTasks.map((task, index) => {
                const priority = priorityConfig[task.priority];
                const { text: dueText, isOverdue } = formatDueDate(task.dueDate);

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.6 + index * 0.1,
                    }}
                    className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => onTaskToggle?.(task.id)}
                  >
                    {/* Checkbox */}
                    <div className="relative mt-0.5">
                      <Circle
                        className={cn(
                          "h-5 w-5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors"
                        )}
                      />
                      <CheckCircle2
                        className={cn(
                          "absolute inset-0 h-5 w-5 text-green-500 opacity-0 group-hover:opacity-50 transition-opacity"
                        )}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium truncate">
                          {task.title}
                        </p>
                        <div
                          className={cn("h-2 w-2 rounded-full shrink-0", priority.color)}
                          title={priority.label}
                        />
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn(
                            "text-xs",
                            isOverdue
                              ? "text-red-500 font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {dueText}
                        </span>

                        {task.category && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-1.5 py-0 h-5"
                          >
                            {task.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Summary footer */}
          {tasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground"
            >
              <span>
                {tasks.filter((t) => t.priority === "high" && t.status !== "completed").length} high priority
              </span>
              <span>
                {tasks.filter((t) => isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate)) && t.status !== "completed").length} overdue
              </span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
