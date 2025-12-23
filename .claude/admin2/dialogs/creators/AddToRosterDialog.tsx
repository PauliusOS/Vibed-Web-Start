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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  Plus,
  Check,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Roster {
  id: string;
  name: string;
  description?: string;
  creatorCount: number;
}

interface Creator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AddToRosterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creators: Creator[];
  existingRosters: Roster[];
  onAddToRoster: (rosterIds: string[]) => Promise<void>;
  onCreateRoster: (name: string, description: string, creatorIds: string[]) => Promise<void>;
}

export function AddToRosterDialog({
  open,
  onOpenChange,
  creators,
  existingRosters,
  onAddToRoster,
  onCreateRoster,
}: AddToRosterDialogProps) {
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [selectedRosters, setSelectedRosters] = useState<Set<string>>(new Set());
  const [newRosterName, setNewRosterName] = useState("");
  const [newRosterDescription, setNewRosterDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);

  const toggleRoster = (rosterId: string) => {
    const newSelection = new Set(selectedRosters);
    if (newSelection.has(rosterId)) {
      newSelection.delete(rosterId);
    } else {
      newSelection.add(rosterId);
    }
    setSelectedRosters(newSelection);
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    setProcessSuccess(false);

    try {
      if (mode === "existing") {
        await onAddToRoster(Array.from(selectedRosters));
      } else {
        await onCreateRoster(
          newRosterName,
          newRosterDescription,
          creators.map((c) => c.id)
        );
      }
      setProcessSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setProcessSuccess(false);
        setSelectedRosters(new Set());
        setNewRosterName("");
        setNewRosterDescription("");
        setMode("existing");
      }, 1500);
    } catch (error) {
      console.error("Failed to add to roster:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isValid =
    mode === "existing"
      ? selectedRosters.size > 0
      : newRosterName.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <DialogTitle>Add to Roster</DialogTitle>
              <DialogDescription className="mt-1">
                Add {creators.length} creator{creators.length !== 1 ? "s" : ""} to a
                roster
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-2">
          {/* Selected Creators */}
          <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">
                Selected Creators ({creators.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {creators.map((creator) => (
                <div
                  key={creator.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                >
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={creator.avatar} />
                    <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs">
                      {creator.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-white">{creator.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 p-1 bg-white/[0.02] rounded-lg">
            <button
              onClick={() => setMode("existing")}
              className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-colors ${
                mode === "existing"
                  ? "bg-blue-500 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <List className="w-4 h-4 inline mr-2" />
              Add to Existing Roster
            </button>
            <button
              onClick={() => setMode("new")}
              className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-colors ${
                mode === "new"
                  ? "bg-blue-500 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create New Roster
            </button>
          </div>

          {/* Existing Rosters */}
          {mode === "existing" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <Label className="text-white/80">
                Select Rosters ({selectedRosters.size} selected)
              </Label>
              <div className="space-y-2">
                <AnimatePresence>
                  {existingRosters.length === 0 ? (
                    <div className="text-center py-8">
                      <List className="w-12 h-12 mx-auto mb-3 text-white/20" />
                      <p className="text-white/60 text-sm mb-4">
                        No rosters created yet
                      </p>
                      <Button
                        onClick={() => setMode("new")}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Roster
                      </Button>
                    </div>
                  ) : (
                    existingRosters.map((roster, index) => {
                      const isSelected = selectedRosters.has(roster.id);
                      return (
                        <motion.div
                          key={roster.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={() => toggleRoster(roster.id)}
                          className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? "border-blue-500/50 bg-blue-500/10"
                              : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleRoster(roster.id)}
                            className="mt-1"
                          />

                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium mb-1">
                              {roster.name}
                            </h4>
                            {roster.description && (
                              <p className="text-sm text-white/60 mb-2">
                                {roster.description}
                              </p>
                            )}
                            <p className="text-xs text-white/40">
                              {roster.creatorCount} creator
                              {roster.creatorCount !== 1 ? "s" : ""}
                            </p>
                          </div>

                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* New Roster Form */}
          {mode === "new" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="roster-name" className="text-white/80">
                  Roster Name *
                </Label>
                <Input
                  id="roster-name"
                  value={newRosterName}
                  onChange={(e) => setNewRosterName(e.target.value)}
                  placeholder="e.g., Tech Reviewers, Beauty Creators"
                  className="bg-white/[0.02] border-white/[0.06] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roster-description" className="text-white/80">
                  Description (Optional)
                </Label>
                <Textarea
                  id="roster-description"
                  value={newRosterDescription}
                  onChange={(e) => setNewRosterDescription(e.target.value)}
                  placeholder="Describe the purpose of this roster..."
                  className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 min-h-20"
                />
              </div>
            </motion.div>
          )}

          {/* Summary */}
          {isValid && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="text-blue-400 font-medium mb-1">Summary:</p>
                  <ul className="text-white/80 space-y-1">
                    <li>
                      • {creators.length} creator{creators.length !== 1 ? "s" : ""}{" "}
                      will be added
                    </li>
                    {mode === "existing" ? (
                      <li>
                        • To {selectedRosters.size} roster
                        {selectedRosters.size !== 1 ? "s" : ""}
                      </li>
                    ) : (
                      <li>• New roster "{newRosterName}" will be created</li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isProcessing || !isValid}
            className={`${
              processSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                {mode === "existing" ? "Adding..." : "Creating..."}
              </>
            ) : processSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Done!
              </>
            ) : mode === "existing" ? (
              <>
                <Users className="w-4 h-4 mr-2" />
                Add to Roster
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Roster
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
