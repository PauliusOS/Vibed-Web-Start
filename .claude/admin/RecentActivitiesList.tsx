"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  IconUserPlus,
  IconRocket,
  IconVideo,
  IconTrophy,
  IconTrash,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const activityTypeConfig = {
  creator_joined: {
    icon: IconUserPlus,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  campaign_launched: {
    icon: IconRocket,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  video_posted: {
    icon: IconVideo,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  milestone_reached: {
    icon: IconTrophy,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
};

export function RecentActivitiesList() {
  const activities = useQuery(api.platformActivity.getRecentActivities, { limit: 50 });
  const deleteActivity = useMutation(api.platformActivity.deleteActivity);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Id<"platformActivity"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (activityId: Id<"platformActivity">) => {
    setActivityToDelete(activityId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!activityToDelete) return;

    setIsDeleting(true);
    try {
      await deleteActivity({ activityId: activityToDelete });
      toast.success("Activity deleted successfully");
      setDeleteDialogOpen(false);
      setActivityToDelete(null);
    } catch (error) {
      toast.error("Failed to delete activity");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (activities === undefined) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <IconVideo className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">No activities yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Create your first activity to see it here
        </p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-3">
          {activities.map((activity) => {
            const config = activityTypeConfig[activity.activityType];
            const Icon = config.icon;

            return (
              <div
                key={activity._id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${config.bgColor} shrink-0`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">
                    {activity.displayText}
                  </p>

                  {activity.creatorName && (
                    <p className="text-xs text-muted-foreground mt-1">
                      by {activity.creatorName}
                    </p>
                  )}

                  {activity.metadata && (
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      {activity.metadata.campaignName && (
                        <span>Campaign: {activity.metadata.campaignName}</span>
                      )}
                      {activity.metadata.viewCount !== undefined && (
                        <span>{activity.metadata.viewCount.toLocaleString()} views</span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDeleteClick(activity._id)}
                  className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Activity?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The activity will be permanently removed from
              the homepage feed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
