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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Check, Lock, Eye, Edit2, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface Permissions {
  // Campaigns
  viewCampaigns: boolean;
  createCampaigns: boolean;
  editCampaigns: boolean;
  deleteCampaigns: boolean;
  archiveCampaigns: boolean;

  // Creators
  viewCreators: boolean;
  inviteCreators: boolean;
  editCreators: boolean;
  removeCreators: boolean;
  assignCreators: boolean;

  // Clients
  viewClients: boolean;
  addClients: boolean;
  editClients: boolean;
  removeClients: boolean;
  manageClientPermissions: boolean;

  // Finance
  viewFinance: boolean;
  createInvoices: boolean;
  processPayments: boolean;
  approveWithdrawals: boolean;
  exportFinancialReports: boolean;

  // Videos
  viewVideos: boolean;
  approveVideos: boolean;
  rejectVideos: boolean;
  requestRevisions: boolean;

  // Analytics
  viewAnalytics: boolean;
  createReports: boolean;
  exportReports: boolean;
  scheduleReports: boolean;

  // Team
  viewTeam: boolean;
  inviteUsers: boolean;
  editUsers: boolean;
  removeUsers: boolean;
  manageRoles: boolean;

  // Settings
  viewSettings: boolean;
  editSettings: boolean;
  manageIntegrations: boolean;
  manageBranding: boolean;
  manageAPIKeys: boolean;
}

interface PermissionEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  currentPermissions: Permissions;
  onSave: (permissions: Permissions) => Promise<void>;
}

const permissionGroups = {
  campaigns: {
    label: "Campaigns",
    icon: Edit2,
    color: "text-blue-400",
    permissions: [
      { key: "viewCampaigns", label: "View Campaigns" },
      { key: "createCampaigns", label: "Create Campaigns" },
      { key: "editCampaigns", label: "Edit Campaigns" },
      { key: "deleteCampaigns", label: "Delete Campaigns", dangerous: true },
      { key: "archiveCampaigns", label: "Archive Campaigns" },
    ],
  },
  creators: {
    label: "Creators",
    icon: Eye,
    color: "text-purple-400",
    permissions: [
      { key: "viewCreators", label: "View Creators" },
      { key: "inviteCreators", label: "Invite Creators" },
      { key: "editCreators", label: "Edit Creator Profiles" },
      { key: "removeCreators", label: "Remove Creators", dangerous: true },
      { key: "assignCreators", label: "Assign to Campaigns" },
    ],
  },
  clients: {
    label: "Clients",
    icon: Shield,
    color: "text-green-400",
    permissions: [
      { key: "viewClients", label: "View Clients" },
      { key: "addClients", label: "Add Clients" },
      { key: "editClients", label: "Edit Client Details" },
      { key: "removeClients", label: "Remove Clients", dangerous: true },
      { key: "manageClientPermissions", label: "Manage Permissions", dangerous: true },
    ],
  },
  finance: {
    label: "Finance",
    icon: Lock,
    color: "text-amber-400",
    permissions: [
      { key: "viewFinance", label: "View Financial Data" },
      { key: "createInvoices", label: "Create Invoices" },
      { key: "processPayments", label: "Process Payments", dangerous: true },
      { key: "approveWithdrawals", label: "Approve Withdrawals", dangerous: true },
      { key: "exportFinancialReports", label: "Export Reports" },
    ],
  },
  videos: {
    label: "Videos",
    icon: Eye,
    color: "text-pink-400",
    permissions: [
      { key: "viewVideos", label: "View Videos" },
      { key: "approveVideos", label: "Approve Videos" },
      { key: "rejectVideos", label: "Reject Videos" },
      { key: "requestRevisions", label: "Request Revisions" },
    ],
  },
  analytics: {
    label: "Analytics",
    icon: Eye,
    color: "text-cyan-400",
    permissions: [
      { key: "viewAnalytics", label: "View Analytics" },
      { key: "createReports", label: "Create Reports" },
      { key: "exportReports", label: "Export Reports" },
      { key: "scheduleReports", label: "Schedule Reports" },
    ],
  },
  team: {
    label: "Team Management",
    icon: Shield,
    color: "text-red-400",
    permissions: [
      { key: "viewTeam", label: "View Team" },
      { key: "inviteUsers", label: "Invite Users" },
      { key: "editUsers", label: "Edit User Details" },
      { key: "removeUsers", label: "Remove Users", dangerous: true },
      { key: "manageRoles", label: "Manage Roles", dangerous: true },
    ],
  },
  settings: {
    label: "Settings",
    icon: Lock,
    color: "text-orange-400",
    permissions: [
      { key: "viewSettings", label: "View Settings" },
      { key: "editSettings", label: "Edit Settings", dangerous: true },
      { key: "manageIntegrations", label: "Manage Integrations", dangerous: true },
      { key: "manageBranding", label: "Manage Branding" },
      { key: "manageAPIKeys", label: "Manage API Keys", dangerous: true },
    ],
  },
};

export function PermissionEditorDialog({
  open,
  onOpenChange,
  user,
  currentPermissions,
  onSave,
}: PermissionEditorDialogProps) {
  const [permissions, setPermissions] = useState<Permissions>(currentPermissions);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const togglePermission = (key: keyof Permissions) => {
    setPermissions({ ...permissions, [key]: !permissions[key] });
  };

  const selectAll = (groupKey: string) => {
    const group = permissionGroups[groupKey as keyof typeof permissionGroups];
    const updates: Partial<Permissions> = {};
    group.permissions.forEach((perm) => {
      updates[perm.key as keyof Permissions] = true;
    });
    setPermissions({ ...permissions, ...updates });
  };

  const deselectAll = (groupKey: string) => {
    const group = permissionGroups[groupKey as keyof typeof permissionGroups];
    const updates: Partial<Permissions> = {};
    group.permissions.forEach((perm) => {
      updates[perm.key as keyof Permissions] = false;
    });
    setPermissions({ ...permissions, ...updates });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await onSave(permissions);
      setSaveSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setSaveSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to save permissions:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate stats
  const totalPermissions = Object.keys(permissions).length;
  const enabledPermissions = Object.values(permissions).filter(Boolean).length;
  const dangerousEnabled = Object.entries(permissions).filter(([key, enabled]) => {
    if (!enabled) return false;
    return Object.values(permissionGroups).some((group) =>
      group.permissions.some((p) => p.key === key && p.dangerous)
    );
  }).length;

  const hasChanges = JSON.stringify(permissions) !== JSON.stringify(currentPermissions);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <DialogTitle>Edit Permissions</DialogTitle>
              <DialogDescription className="mt-1">
                Configure granular permissions for {user.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* User Info & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-purple-500/20 text-purple-400">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-white/60 text-sm">{user.email}</p>
              </div>
              <div className="ml-auto px-3 py-1 rounded bg-blue-500/20">
                <span className="text-sm text-blue-400 capitalize">{user.role}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-white">{enabledPermissions}</p>
                <p className="text-xs text-white/60">Enabled</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white/40">
                  {totalPermissions - enabledPermissions}
                </p>
                <p className="text-xs text-white/60">Disabled</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-400">{dangerousEnabled}</p>
                <p className="text-xs text-white/60">High-Risk</p>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="flex-1 overflow-y-auto space-y-4 py-2">
          {Object.entries(permissionGroups).map(([groupKey, group]) => {
            const GroupIcon = group.icon;
            const groupPermissions = group.permissions.filter((p) =>
              permissions.hasOwnProperty(p.key)
            );
            const enabledCount = groupPermissions.filter(
              (p) => permissions[p.key as keyof Permissions]
            ).length;

            return (
              <motion.div
                key={groupKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GroupIcon className={`w-5 h-5 ${group.color}`} />
                    <h3 className="text-white font-medium">{group.label}</h3>
                    <span className="text-xs text-white/60">
                      ({enabledCount}/{groupPermissions.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => selectAll(groupKey)}
                      className="text-xs h-7"
                    >
                      Select All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deselectAll(groupKey)}
                      className="text-xs h-7"
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.permissions.map((permission) => (
                    <div
                      key={permission.key}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        permissions[permission.key as keyof Permissions]
                          ? "border-blue-500/30 bg-blue-500/10"
                          : "border-white/[0.06] bg-white/[0.02]"
                      } ${permission.dangerous ? "border-red-500/20" : ""}`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Switch
                          checked={permissions[permission.key as keyof Permissions]}
                          onCheckedChange={() =>
                            togglePermission(permission.key as keyof Permissions)
                          }
                        />
                        <Label
                          htmlFor={permission.key}
                          className="text-sm text-white/80 cursor-pointer"
                        >
                          {permission.label}
                        </Label>
                      </div>
                      {permission.dangerous && (
                        <div className="px-2 py-0.5 rounded bg-red-500/20">
                          <span className="text-xs text-red-400">High-Risk</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={`${
              saveSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Save Permissions
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
