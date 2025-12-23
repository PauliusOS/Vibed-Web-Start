"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateRosterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: Id<"organizations">;
  onSuccess?: (rosterId: Id<"creatorRosters">) => void;
}

const ROSTER_COLORS = [
  "#00BFFF", // Cyan
  "#FF1493", // Deep Pink
  "#32CD32", // Lime Green
  "#FF8C00", // Dark Orange
  "#9370DB", // Medium Purple
  "#FFD700", // Gold
  "#FF69B4", // Hot Pink
  "#00CED1", // Dark Turquoise
];

const ROSTER_ICONS = ["🎬", "⭐", "🔥", "💎", "🚀", "🎯", "💫", "🏆"];

export function CreateRosterDialog({
  open,
  onOpenChange,
  organizationId,
  onSuccess,
}: CreateRosterDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(ROSTER_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ROSTER_ICONS[0]);
  const [visibility, setVisibility] = useState<"private" | "organization">("private");
  const [isCreating, setIsCreating] = useState(false);

  const createRoster = useMutation(api.rosters.createRoster);

  const handleCreate = async () => {
    if (!name.trim()) return;

    setIsCreating(true);

    try {
      const rosterId = await createRoster({
        organizationId,
        name: name.trim(),
        description: description.trim() || undefined,
        color: selectedColor,
        icon: selectedIcon,
        visibility,
        tags: [],
      });

      onSuccess?.(rosterId);
      onOpenChange(false);
      
      // Reset form
      setName("");
      setDescription("");
      setSelectedColor(ROSTER_COLORS[0]);
      setSelectedIcon(ROSTER_ICONS[0]);
      setVisibility("private");
    } catch (err: any) {
      console.error("Failed to create roster:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f0f0f] border-white/10 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            Create New Roster
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Organize your creators into custom rosters for better management
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="roster-name" className="text-white/70">
              Roster Name
            </Label>
            <Input
              id="roster-name"
              placeholder="e.g., Summer Campaign Creators"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isCreating}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="roster-desc" className="text-white/70">
              Description (Optional)
            </Label>
            <Textarea
              id="roster-desc"
              placeholder="Describe this roster..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isCreating}
              rows={3}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
            />
          </div>

          {/* Color & Icon */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/70">Color</Label>
              <div className="grid grid-cols-4 gap-2">
                {ROSTER_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "w-full aspect-square rounded-lg border-2 transition-all hover:scale-110",
                      selectedColor === color
                        ? "border-white ring-2 ring-white/30"
                        : "border-white/10 hover:border-white/30"
                    )}
                    style={{ backgroundColor: color }}
                    disabled={isCreating}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/70">Icon</Label>
              <div className="grid grid-cols-4 gap-2">
                {ROSTER_ICONS.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setSelectedIcon(icon)}
                    className={cn(
                      "w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 flex items-center justify-center text-2xl",
                      selectedIcon === icon
                        ? "border-cyan-500 bg-cyan-500/20"
                        : "border-white/10 hover:border-white/30 bg-white/5"
                    )}
                    disabled={isCreating}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label className="text-white/70">Visibility</Label>
            <Select
              value={visibility}
              onValueChange={(val: any) => setVisibility(val)}
              disabled={isCreating}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10">
                <SelectItem value="private">Private - Only me</SelectItem>
                <SelectItem value="organization">Organization - All team members</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: selectedColor + "33" }}
              >
                {selectedIcon}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {name.trim() || "Roster Name"}
                </p>
                <p className="text-xs text-white/50">0 creators</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
            className="border-white/10 text-white hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || isCreating}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Create Roster
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
