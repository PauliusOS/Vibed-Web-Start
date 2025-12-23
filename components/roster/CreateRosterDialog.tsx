"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface CreateRosterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: Id<"organizations">;
  onSuccess?: () => void;
}

// Common emojis for roster icons
const EMOJI_OPTIONS = ["📁", "⭐", "🎯", "🚀", "💼", "🎨", "🎭", "🎪", "🎬", "📊"];

// Color options for roster
const COLOR_OPTIONS = [
  { value: "#3b82f6", label: "Blue" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#ec4899", label: "Pink" },
  { value: "#10b981", label: "Green" },
  { value: "#f59e0b", label: "Orange" },
  { value: "#ef4444", label: "Red" },
];

export function CreateRosterDialog({
  open,
  onOpenChange,
  organizationId,
  onSuccess,
}: CreateRosterDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"private" | "clientele" | "organization">("private");
  const [selectedIcon, setSelectedIcon] = useState(EMOJI_OPTIONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createRoster = useMutation(api.creatorRosters.createRoster);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a roster name");
      return;
    }

    setIsSubmitting(true);

    try {
      await createRoster({
        organizationId,
        name: name.trim(),
        description: description.trim() || undefined,
        visibility,
        icon: selectedIcon,
        color: selectedColor,
      });

      toast.success("Roster created successfully");

      // Reset form
      setName("");
      setDescription("");
      setVisibility("private");
      setSelectedIcon(EMOJI_OPTIONS[0]);
      setSelectedColor(COLOR_OPTIONS[0].value);

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create roster");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Roster</DialogTitle>
            <DialogDescription>
              Create a new roster to organize and manage creators
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Roster Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Top Performers, Beauty Creators"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this roster..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Visibility */}
            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={visibility}
                onValueChange={(value: "private" | "clientele" | "organization") => setVisibility(value)}
              >
                <SelectTrigger id="visibility">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">
                    <div>
                      <div className="font-medium">Private</div>
                      <div className="text-xs text-muted-foreground">Only you can see this roster</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="clientele">
                    <div>
                      <div className="font-medium">Clientele</div>
                      <div className="text-xs text-muted-foreground">All admins in your organization can see</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="organization">
                    <div>
                      <div className="font-medium">Organization</div>
                      <div className="text-xs text-muted-foreground">Everyone in the organization can see</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="flex gap-2 flex-wrap">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedIcon(emoji)}
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl transition-all ${
                      selectedIcon === emoji
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      selectedColor === color.value
                        ? "border-primary scale-110"
                        : "border-border hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Roster"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
