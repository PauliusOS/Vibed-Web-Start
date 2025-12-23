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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Users,
  Check,
  Mail,
  Briefcase,
  Archive,
  Trash2,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Creator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

type BulkAction = "assign" | "notify" | "archive" | "delete" | "add-to-roster";

interface BulkActionConfig {
  id: BulkAction;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  variant: "default" | "destructive";
}

const bulkActions: BulkActionConfig[] = [
  {
    id: "assign",
    label: "Assign to Campaign",
    description: "Assign selected creators to one or more campaigns",
    icon: Briefcase,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    variant: "default",
  },
  {
    id: "notify",
    label: "Send Notification",
    description: "Send an email notification to selected creators",
    icon: Mail,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    variant: "default",
  },
  {
    id: "add-to-roster",
    label: "Add to Roster",
    description: "Add selected creators to a custom roster",
    icon: UserPlus,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    variant: "default",
  },
  {
    id: "archive",
    label: "Archive Creators",
    description: "Archive selected creators (can be restored)",
    icon: Archive,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    variant: "default",
  },
  {
    id: "delete",
    label: "Delete Creators",
    description: "Permanently delete selected creators",
    icon: Trash2,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    variant: "destructive",
  },
];

interface BulkActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCreators: Creator[];
  onExecute: (action: BulkAction) => Promise<void>;
}

export function BulkActionsDialog({
  open,
  onOpenChange,
  selectedCreators,
  onExecute,
}: BulkActionsDialogProps) {
  const [selectedAction, setSelectedAction] = useState<BulkAction | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executeSuccess, setExecuteSuccess] = useState(false);

  const handleExecute = async () => {
    if (!selectedAction) return;

    setIsExecuting(true);
    setExecuteSuccess(false);

    try {
      await onExecute(selectedAction);
      setExecuteSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setExecuteSuccess(false);
        setSelectedAction(null);
      }, 1500);
    } catch (error) {
      console.error("Bulk action failed:", error);
    } finally {
      setIsExecuting(false);
    }
  };

  const selectedConfig = selectedAction
    ? bulkActions.find((a) => a.id === selectedAction)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <DialogTitle>Bulk Actions</DialogTitle>
              <DialogDescription className="mt-1">
                Perform an action on {selectedCreators.length} selected creator
                {selectedCreators.length !== 1 ? "s" : ""}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-2">
          {/* Selected Creators */}
          <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-white">
                Selected Creators ({selectedCreators.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCreators.slice(0, 10).map((creator) => (
                <div
                  key={creator.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg"
                >
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={creator.avatar} />
                    <AvatarFallback className="bg-purple-500/20 text-purple-400 text-xs">
                      {creator.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-white">{creator.name}</span>
                </div>
              ))}
              {selectedCreators.length > 10 && (
                <div className="px-3 py-1.5 bg-white/[0.05] border border-white/[0.1] rounded-lg text-sm text-white/60">
                  +{selectedCreators.length - 10} more
                </div>
              )}
            </div>
          </div>

          {/* Action Selection */}
          <div className="space-y-3">
            <Label className="text-white/80">Select Action</Label>
            <RadioGroup
              value={selectedAction || ""}
              onValueChange={(value) => setSelectedAction(value as BulkAction)}
            >
              <div className="space-y-2">
                {bulkActions.map((action) => {
                  const Icon = action.icon;
                  const isSelected = selectedAction === action.id;

                  return (
                    <div
                      key={action.id}
                      className={`relative flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-purple-500/50 bg-purple-500/10"
                          : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                      onClick={() => setSelectedAction(action.id)}
                    >
                      <RadioGroupItem
                        value={action.id}
                        id={action.id}
                        className="mt-1"
                      />

                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${action.color}`} />
                      </div>

                      <div className="flex-1">
                        <label
                          htmlFor={action.id}
                          className="text-sm font-medium text-white cursor-pointer block mb-1"
                        >
                          {action.label}
                        </label>
                        <p className="text-xs text-white/60">
                          {action.description}
                        </p>
                      </div>

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Warning for destructive actions */}
          {selectedAction === "delete" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="text-red-400 font-medium mb-1">Warning!</p>
                  <p className="text-white/80">
                    This action will permanently delete {selectedCreators.length}{" "}
                    creator{selectedCreators.length !== 1 ? "s" : ""} and all associated
                    data. This action cannot be undone.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {selectedAction === "archive" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="text-amber-400 font-medium mb-1">Note</p>
                  <p className="text-white/80">
                    Archived creators can be restored later. They will not appear in
                    active creator lists but their data will be preserved.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Summary */}
          {selectedAction && selectedConfig && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="text-purple-400 font-medium mb-1">
                    Action Summary:
                  </p>
                  <ul className="text-white/80 space-y-1">
                    <li>
                      • {selectedCreators.length} creator
                      {selectedCreators.length !== 1 ? "s" : ""} will be affected
                    </li>
                    <li>• Action: {selectedConfig.label}</li>
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
            disabled={isExecuting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExecute}
            disabled={isExecuting || !selectedAction}
            variant={selectedConfig?.variant}
            className={
              selectedConfig?.variant !== "destructive"
                ? `${
                    executeSuccess
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-purple-500 hover:bg-purple-600"
                  } text-white`
                : ""
            }
          >
            {isExecuting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Executing...
              </>
            ) : executeSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Done!
              </>
            ) : selectedConfig ? (
              <>
                <selectedConfig.icon className="w-4 h-4 mr-2" />
                {selectedConfig.label}
              </>
            ) : (
              "Execute"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
