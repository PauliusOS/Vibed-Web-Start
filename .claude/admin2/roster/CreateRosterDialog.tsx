"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ROSTER_COLORS,
  ICON_EMOJI_MAP,
  type RosterFormData,
} from "./types";

interface CreateRosterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateEmpty?: (data: RosterFormData) => void;
  onCreateAndAddCreators?: (data: RosterFormData) => void;
  isSubmitting?: boolean;
}

// Available emoji icons for selection
const EMOJI_OPTIONS = Object.entries(ICON_EMOJI_MAP);

export function CreateRosterDialog({
  open,
  onOpenChange,
  onCreateEmpty,
  onCreateAndAddCreators,
  isSubmitting = false,
}: CreateRosterDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>(ROSTER_COLORS[0].value);
  const [selectedIcon, setSelectedIcon] = useState(ICON_EMOJI_MAP.star);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setName("");
      setDescription("");
      setSelectedColor(ROSTER_COLORS[0].value);
      setSelectedIcon(ICON_EMOJI_MAP.star);
      setTags([]);
      setTagInput("");
    }
    onOpenChange(open);
  };

  // Add tag from input
  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  // Handle tag input key press
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "," || e.key === " ") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Get form data
  const getFormData = (): RosterFormData => ({
    name: name.trim(),
    description: description.trim(),
    icon: selectedIcon,
    color: selectedColor,
    tags,
  });

  // Validate form
  const isValid = name.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg bg-[#0a0a0a] border-white/[0.06]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Create New Roster
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Organize creators into custom lists for easy management.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Roster Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Top Performers Q4"
              className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
              disabled={isSubmitting}
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this roster..."
              className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 min-h-[80px] resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Icon & Color Selection Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Icon Selection */}
            <div className="space-y-2">
              <Label className="text-white">Icon</Label>
              <div className="flex flex-wrap gap-2 p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                {EMOJI_OPTIONS.map(([key, emoji]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedIcon(emoji)}
                    disabled={isSubmitting}
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-lg transition-all ${
                      selectedIcon === emoji
                        ? "bg-white/[0.15] ring-2 ring-purple-500"
                        : "bg-white/[0.02] hover:bg-white/[0.08]"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <Label className="text-white">Color</Label>
              <div className="flex flex-wrap gap-2 p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                {ROSTER_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    disabled={isSubmitting}
                    className={`w-8 h-8 rounded-md transition-all ${
                      selectedColor === color.value
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a]"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label className="text-white">Preview</Label>
            <div
              className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg"
              style={{ borderLeftWidth: "4px", borderLeftColor: selectedColor }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: `${selectedColor}20` }}
              >
                {selectedIcon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">
                  {name || "Roster Name"}
                </p>
                <p className="text-sm text-white/60">
                  {description || "No description"}
                </p>
              </div>
            </div>
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-white">
              Tags
            </Label>
            <div className="flex flex-wrap gap-2 p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg min-h-[46px]">
              <AnimatePresence>
                {tags.map((tag) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge
                      variant="secondary"
                      className="bg-purple-500/20 text-purple-300 border-0 gap-1 pr-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        disabled={isSubmitting}
                        className="hover:bg-purple-500/30 rounded p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
                placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
                className="flex-1 min-w-[120px] bg-transparent border-0 p-0 h-6 text-white placeholder:text-white/40 focus-visible:ring-0"
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-white/40">
              Press Enter or comma to add tags
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/[0.06]">
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
            className="text-white/60 hover:text-white"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => onCreateEmpty?.(getFormData())}
              disabled={!isValid || isSubmitting}
              className="border-white/[0.1] text-white hover:bg-white/[0.05]"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Create Empty
            </Button>
            <Button
              onClick={() => onCreateAndAddCreators?.(getFormData())}
              disabled={!isValid || isSubmitting}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Users className="h-4 w-4 mr-2" />
              )}
              Create & Add Creators
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
