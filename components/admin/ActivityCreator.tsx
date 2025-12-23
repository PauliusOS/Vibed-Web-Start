"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconUserPlus,
  IconRocket,
  IconVideo,
  IconTrophy,
  IconPlus,
  IconCheck,
} from "@tabler/icons-react";
import { toast } from "sonner";

type ActivityType =
  | "creator_joined"
  | "campaign_launched"
  | "video_posted"
  | "milestone_reached";

const activityTypeConfig: Record<
  ActivityType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  creator_joined: {
    label: "Creator Joined",
    icon: <IconUserPlus className="h-4 w-4" />,
    color: "text-blue-500",
  },
  campaign_launched: {
    label: "Campaign Launched",
    icon: <IconRocket className="h-4 w-4" />,
    color: "text-purple-500",
  },
  video_posted: {
    label: "Video Posted",
    icon: <IconVideo className="h-4 w-4" />,
    color: "text-green-500",
  },
  milestone_reached: {
    label: "Milestone Reached",
    icon: <IconTrophy className="h-4 w-4" />,
    color: "text-amber-500",
  },
};

export function ActivityCreator() {
  const addActivity = useMutation(api.platformActivity.addActivity);

  const [activityType, setActivityType] = useState<ActivityType>("creator_joined");
  const [displayText, setDisplayText] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [creatorAvatar, setCreatorAvatar] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [videoCount, setVideoCount] = useState("");
  const [viewCount, setViewCount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justCreated, setJustCreated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayText.trim()) {
      toast.error("Display text is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await addActivity({
        activityType,
        displayText: displayText.trim(),
        creatorName: creatorName.trim() || undefined,
        creatorAvatar: creatorAvatar.trim() || undefined,
        metadata: {
          campaignName: campaignName.trim() || undefined,
          videoCount: videoCount ? parseInt(videoCount, 10) : undefined,
          viewCount: viewCount ? parseInt(viewCount, 10) : undefined,
        },
      });

      toast.success("Activity created successfully");
      setJustCreated(true);
      setTimeout(() => setJustCreated(false), 2000);

      // Reset form
      setDisplayText("");
      setCreatorName("");
      setCreatorAvatar("");
      setCampaignName("");
      setVideoCount("");
      setViewCount("");
    } catch (error) {
      toast.error("Failed to create activity");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setDisplayText("");
    setCreatorName("");
    setCreatorAvatar("");
    setCampaignName("");
    setVideoCount("");
    setViewCount("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Activity Type Selection */}
      <div className="space-y-2">
        <Label htmlFor="activity-type">Activity Type</Label>
        <Select value={activityType} onValueChange={(v) => setActivityType(v as ActivityType)}>
          <SelectTrigger id="activity-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(activityTypeConfig).map(([type, config]) => (
              <SelectItem key={type} value={type}>
                <div className="flex items-center gap-2">
                  <span className={config.color}>{config.icon}</span>
                  {config.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display Text */}
      <div className="space-y-2">
        <Label htmlFor="display-text">
          Display Text <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="display-text"
          value={displayText}
          onChange={(e) => setDisplayText(e.target.value)}
          placeholder="e.g., 'Sarah Johnson just joined the platform'"
          rows={3}
          required
        />
        <p className="text-xs text-muted-foreground">
          This text will appear in the activity feed on the homepage
        </p>
      </div>

      {/* Creator Information */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-semibold">Creator Information (Optional)</h3>

          <div className="space-y-2">
            <Label htmlFor="creator-name">Creator Name</Label>
            <Input
              id="creator-name"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="e.g., Sarah Johnson"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creator-avatar">Creator Avatar URL</Label>
            <Input
              id="creator-avatar"
              type="url"
              value={creatorAvatar}
              onChange={(e) => setCreatorAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-semibold">Additional Metadata (Optional)</h3>

          <div className="space-y-2">
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input
              id="campaign-name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g., Summer Collection 2024"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="video-count">Video Count</Label>
              <Input
                id="video-count"
                type="number"
                min="0"
                value={videoCount}
                onChange={(e) => setVideoCount(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="view-count">View Count</Label>
              <Input
                id="view-count"
                type="number"
                min="0"
                value={viewCount}
                onChange={(e) => setViewCount(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={isSubmitting || !displayText.trim()}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Creating...
            </>
          ) : justCreated ? (
            <>
              <IconCheck className="h-4 w-4 mr-2" />
              Created!
            </>
          ) : (
            <>
              <IconPlus className="h-4 w-4 mr-2" />
              Create Activity
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isSubmitting}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
