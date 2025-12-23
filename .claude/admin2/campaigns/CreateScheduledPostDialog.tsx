"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, User, Users, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Creator {
  creatorId: string;
  username: string;
  displayName?: string;
  profilePictureUrl?: string;
  platform?: string;
}

interface CreateScheduledPostDialogProps {
  campaignId: Id<"campaigns">;
  creators: Creator[];
  defaultDate?: Date | null;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

type AssignmentType = "specific_creator" | "any_creator" | "multiple_creators";

export function CreateScheduledPostDialog({
  campaignId,
  creators,
  defaultDate,
  onSuccess,
  trigger,
}: CreateScheduledPostDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(defaultDate || undefined);
  const [time, setTime] = useState<string>("");
  const [assignmentType, setAssignmentType] = useState<AssignmentType>("specific_creator");
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");
  const [maxCreators, setMaxCreators] = useState<number>(3);

  const createPost = useMutation(api.contentCalendar.createScheduledPost);

  const handleSubmit = async () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    if (assignmentType === "specific_creator" && !selectedCreatorId) {
      toast.error("Please select a creator");
      return;
    }

    setIsLoading(true);
    try {
      await createPost({
        campaignId,
        scheduledDate: date.getTime(),
        scheduledTime: time || undefined,
        assignmentType,
        creatorId: assignmentType === "specific_creator" ? selectedCreatorId : undefined,
        maxCreators: assignmentType === "multiple_creators" ? maxCreators : undefined,
      });
      toast.success("Post scheduled successfully");
      setOpen(false);
      resetForm();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to schedule post");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDate(undefined);
    setTime("");
    setAssignmentType("specific_creator");
    setSelectedCreatorId("");
    setMaxCreators(3);
  };

  const getAssignmentIcon = (type: AssignmentType) => {
    switch (type) {
      case "specific_creator":
        return User;
      case "any_creator":
        return UserPlus;
      case "multiple_creators":
        return Users;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="h-8 text-[12px]">
            Schedule Post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-black border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Schedule New Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="text-[12px] text-white/60">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-white/10",
                    !date && "text-white/40"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-black border-white/10" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time (Optional) */}
          <div className="space-y-2">
            <Label className="text-[12px] text-white/60">Time (Optional)</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border-white/10 bg-transparent text-white"
              placeholder="HH:MM"
            />
          </div>

          {/* Assignment Type */}
          <div className="space-y-2">
            <Label className="text-[12px] text-white/60">Assignment Type</Label>
            <Select
              value={assignmentType}
              onValueChange={(value: AssignmentType) => setAssignmentType(value)}
            >
              <SelectTrigger className="border-white/10 bg-transparent text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10">
                <SelectItem value="specific_creator" className="text-white">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Specific Creator
                  </div>
                </SelectItem>
                <SelectItem value="any_creator" className="text-white">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Any Creator Can Claim
                  </div>
                </SelectItem>
                <SelectItem value="multiple_creators" className="text-white">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Multiple Creators
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-white/40">
              {assignmentType === "specific_creator" &&
                "Assign to a specific creator from your campaign"}
              {assignmentType === "any_creator" &&
                "Any creator in the campaign can claim this slot"}
              {assignmentType === "multiple_creators" &&
                "Multiple creators can post on this date"}
            </p>
          </div>

          {/* Creator Selection (for specific_creator) */}
          {assignmentType === "specific_creator" && (
            <div className="space-y-2">
              <Label className="text-[12px] text-white/60">Select Creator</Label>
              <Select
                value={selectedCreatorId}
                onValueChange={setSelectedCreatorId}
              >
                <SelectTrigger className="border-white/10 bg-transparent text-white">
                  <SelectValue placeholder="Choose a creator" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  {creators.length === 0 ? (
                    <div className="px-2 py-4 text-center text-[12px] text-white/40">
                      No creators in this campaign
                    </div>
                  ) : (
                    creators.map((creator) => (
                      <SelectItem
                        key={creator.creatorId}
                        value={creator.creatorId}
                        className="text-white"
                      >
                        <div className="flex items-center gap-2">
                          {creator.profilePictureUrl ? (
                            <img
                              src={creator.profilePictureUrl}
                              alt=""
                              className="w-5 h-5 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                              <User className="w-3 h-3 text-white/40" />
                            </div>
                          )}
                          <span>
                            {creator.displayName || `@${creator.username}`}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Max Creators (for multiple_creators) */}
          {assignmentType === "multiple_creators" && (
            <div className="space-y-2">
              <Label className="text-[12px] text-white/60">
                Maximum Creators
              </Label>
              <Input
                type="number"
                min={2}
                max={20}
                value={maxCreators}
                onChange={(e) => setMaxCreators(parseInt(e.target.value) || 3)}
                className="border-white/10 bg-transparent text-white"
              />
              <p className="text-[11px] text-white/40">
                Up to {maxCreators} creators can post on this date
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-white/10 text-white/70"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-white text-black hover:bg-white/90"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Schedule Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
