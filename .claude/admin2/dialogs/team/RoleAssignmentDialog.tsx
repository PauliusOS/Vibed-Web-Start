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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Check, AlertCircle, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  currentRole: string;
}

interface RoleAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onAssign: (roleData: RoleData) => Promise<void>;
}

export interface RoleData {
  userId: string;
  newRole: string;
}

const roles = [
  {
    value: "admin",
    label: "Administrator",
    description: "Full system access with all permissions",
    color: "text-red-400",
    bg: "bg-red-500/20",
  },
  {
    value: "manager",
    label: "Manager",
    description: "Manage campaigns, creators, and team members",
    color: "text-blue-400",
    bg: "bg-blue-500/20",
  },
  {
    value: "analyst",
    label: "Analyst",
    description: "View and analyze data, create reports",
    color: "text-purple-400",
    bg: "bg-purple-500/20",
  },
  {
    value: "finance",
    label: "Finance",
    description: "Manage payments, invoices, and financial operations",
    color: "text-green-400",
    bg: "bg-green-500/20",
  },
  {
    value: "viewer",
    label: "Viewer",
    description: "View-only access to campaigns and analytics",
    color: "text-amber-400",
    bg: "bg-amber-500/20",
  },
];

const rolePermissions: Record<string, string[]> = {
  admin: [
    "Full system access",
    "Manage all campaigns",
    "Manage all creators and clients",
    "Process all payments",
    "Manage team members",
    "Configure system settings",
  ],
  manager: [
    "Manage campaigns",
    "Invite and manage creators",
    "Assign creators to campaigns",
    "View analytics",
    "Approve content",
  ],
  analyst: [
    "View all campaigns",
    "View all analytics",
    "Export reports",
    "Create dashboards",
    "View creator performance",
  ],
  finance: [
    "View financial data",
    "Process payments",
    "Create and manage invoices",
    "Approve withdrawals",
    "Export financial reports",
  ],
  viewer: [
    "View campaigns",
    "View basic analytics",
    "View creator profiles",
    "Limited export capabilities",
  ],
};

export function RoleAssignmentDialog({
  open,
  onOpenChange,
  user,
  onAssign,
}: RoleAssignmentDialogProps) {
  const [selectedRole, setSelectedRole] = useState(user.currentRole);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);

  const handleAssign = async () => {
    if (selectedRole === user.currentRole) {
      onOpenChange(false);
      return;
    }

    setIsAssigning(true);
    setAssignSuccess(false);

    try {
      await onAssign({
        userId: user._id,
        newRole: selectedRole,
      });
      setAssignSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setAssignSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to assign role:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const currentRoleConfig = roles.find((r) => r.value === user.currentRole);
  const newRoleConfig = roles.find((r) => r.value === selectedRole);
  const hasChanges = selectedRole !== user.currentRole;
  const isDowngrade =
    (user.currentRole === "admin" && selectedRole !== "admin") ||
    (user.currentRole === "manager" &&
      !["admin", "manager"].includes(selectedRole));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <DialogTitle>Assign User Role</DialogTitle>
              <DialogDescription className="mt-1">
                Change {user.name}'s role and permissions
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-2">
          {/* User Info */}
          <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-purple-500/20 text-purple-400">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-white/60 text-sm">{user.email}</p>
              </div>
              {currentRoleConfig && (
                <div
                  className={`ml-auto px-3 py-1 rounded ${currentRoleConfig.bg}`}
                >
                  <span className={`text-sm ${currentRoleConfig.color}`}>
                    Current: {currentRoleConfig.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-white/80">
              Select New Role *
            </Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="py-1">
                      <p className="font-medium">{role.label}</p>
                      <p className="text-xs text-white/60">{role.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Role Comparison */}
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="grid grid-cols-2 gap-4"
            >
              {/* Current Role */}
              <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${currentRoleConfig?.bg}`} />
                  <h4 className="text-white font-medium">Current Role</h4>
                </div>
                <p className="text-white/60 text-sm mb-3">
                  {currentRoleConfig?.description}
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-white/40 uppercase">Permissions:</p>
                  <ul className="space-y-1">
                    {rolePermissions[user.currentRole]?.map((permission) => (
                      <li
                        key={permission}
                        className="text-xs text-white/60 flex items-center gap-2"
                      >
                        <div className="w-1 h-1 rounded-full bg-white/40" />
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* New Role */}
              <div className="p-4 bg-white/[0.02] border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                  <h4 className="text-white font-medium">New Role</h4>
                </div>
                <p className="text-white/60 text-sm mb-3">
                  {newRoleConfig?.description}
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-white/40 uppercase">Permissions:</p>
                  <ul className="space-y-1">
                    {rolePermissions[selectedRole]?.map((permission) => (
                      <li
                        key={permission}
                        className="text-xs text-white/80 flex items-center gap-2"
                      >
                        <div className="w-1 h-1 rounded-full bg-blue-400" />
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Warning for Downgrades */}
          {isDowngrade && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="text-amber-400 font-medium mb-1">
                    Permission Downgrade Warning
                  </p>
                  <ul className="text-white/80 space-y-1">
                    <li>• This user will lose access to administrative features</li>
                    <li>• Current sessions will be terminated</li>
                    <li>• User will be notified of the role change</li>
                    <li>• This action can be reversed by reassigning the previous role</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success Preview */}
          {hasChanges && !isDowngrade && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="text-blue-400 font-medium mb-1">
                    Role Change Summary
                  </p>
                  <ul className="text-white/80 space-y-1">
                    <li>
                      • {user.name} will be assigned the {newRoleConfig?.label} role
                    </li>
                    <li>• New permissions will take effect immediately</li>
                    <li>• User will receive a notification about the change</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={isAssigning || !hasChanges}
            className={`${
              assignSuccess
                ? "bg-green-500 hover:bg-green-600"
                : isDowngrade
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isAssigning ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Assigning...
              </>
            ) : assignSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Assigned!
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                {isDowngrade ? "Confirm Downgrade" : "Assign Role"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
