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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Check,
  Eye,
  Users,
  BarChart3,
  FileText,
  Video,
  DollarSign,
  MessageSquare,
  Settings,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";

interface ClientPermissions {
  // View Permissions
  viewCampaigns: boolean;
  viewCreators: boolean;
  viewAnalytics: boolean;
  viewFinance: boolean;

  // Action Permissions
  approveBriefs: boolean;
  approveVideos: boolean;
  sendMessages: boolean;

  // Advanced Permissions
  editCampaigns: boolean;
  inviteCreators: boolean;
  managePayments: boolean;
}

interface ClientPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  currentPermissions: ClientPermissions;
  onSave: (permissions: ClientPermissions) => Promise<void>;
}

export function ClientPermissionsDialog({
  open,
  onOpenChange,
  clientName,
  currentPermissions,
  onSave,
}: ClientPermissionsDialogProps) {
  const [permissions, setPermissions] = useState<ClientPermissions>(currentPermissions);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const togglePermission = (key: keyof ClientPermissions) => {
    setPermissions({ ...permissions, [key]: !permissions[key] });
  };

  const enabledCount = Object.values(permissions).filter(Boolean).length;
  const totalCount = Object.keys(permissions).length;

  const permissionGroups = [
    {
      title: "View Permissions",
      description: "Control what the client can see",
      icon: Eye,
      color: "blue",
      permissions: [
        {
          key: "viewCampaigns" as keyof ClientPermissions,
          label: "View Campaigns",
          description: "Can view campaign details, status, and performance",
          icon: FileText,
        },
        {
          key: "viewCreators" as keyof ClientPermissions,
          label: "View Creators",
          description: "Can view creator profiles and contact information",
          icon: Users,
        },
        {
          key: "viewAnalytics" as keyof ClientPermissions,
          label: "View Analytics",
          description: "Can access performance reports and analytics dashboards",
          icon: BarChart3,
        },
        {
          key: "viewFinance" as keyof ClientPermissions,
          label: "View Finance",
          description: "Can view invoices, payments, and financial reports",
          icon: DollarSign,
        },
      ],
    },
    {
      title: "Action Permissions",
      description: "Control what actions the client can perform",
      icon: Settings,
      color: "purple",
      permissions: [
        {
          key: "approveBriefs" as keyof ClientPermissions,
          label: "Approve Briefs",
          description: "Can approve or request changes to campaign briefs",
          icon: FileText,
        },
        {
          key: "approveVideos" as keyof ClientPermissions,
          label: "Approve Videos",
          description: "Can approve videos or request revisions",
          icon: Video,
        },
        {
          key: "sendMessages" as keyof ClientPermissions,
          label: "Send Messages",
          description: "Can send messages to creators and team members",
          icon: MessageSquare,
        },
      ],
    },
    {
      title: "Advanced Permissions",
      description: "High-level permissions that allow modifications",
      icon: Shield,
      color: "amber",
      permissions: [
        {
          key: "editCampaigns" as keyof ClientPermissions,
          label: "Edit Campaigns",
          description: "Can modify campaign settings and details",
          icon: FileText,
          warning: true,
        },
        {
          key: "inviteCreators" as keyof ClientPermissions,
          label: "Invite Creators",
          description: "Can invite new creators to campaigns",
          icon: Users,
          warning: true,
        },
        {
          key: "managePayments" as keyof ClientPermissions,
          label: "Manage Payments",
          description: "Can process payments and manage invoices",
          icon: DollarSign,
          warning: true,
        },
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-500/20",
        text: "text-blue-400",
        border: "border-blue-500/30",
      },
      purple: {
        bg: "bg-purple-500/20",
        text: "text-purple-400",
        border: "border-purple-500/30",
      },
      amber: {
        bg: "bg-amber-500/20",
        text: "text-amber-400",
        border: "border-amber-500/30",
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <DialogTitle>Edit Permissions</DialogTitle>
              <DialogDescription className="mt-1">
                Manage access permissions for {clientName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-2">
          {/* Permission Summary */}
          <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-medium">Permission Overview</p>
                <p className="text-white/60 text-sm">
                  {enabledCount} of {totalCount} permissions enabled
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{enabledCount}</p>
                <p className="text-white/60 text-xs">Active</p>
              </div>
            </div>
            <div className="w-full bg-white/[0.05] rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(enabledCount / totalCount) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="bg-purple-500 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Permission Groups */}
          {permissionGroups.map((group, groupIndex) => {
            const GroupIcon = group.icon;
            const colorClasses = getColorClasses(group.color);

            return (
              <motion.div
                key={groupIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${colorClasses.bg} flex items-center justify-center`}>
                    <GroupIcon className={`w-4 h-4 ${colorClasses.text}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{group.title}</h3>
                    <p className="text-white/60 text-xs">{group.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {group.permissions.map((permission, index) => {
                    const PermissionIcon = permission.icon;
                    const isEnabled = permissions[permission.key];

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border transition-all ${
                          isEnabled
                            ? `${colorClasses.border} ${colorClasses.bg}`
                            : "border-white/[0.06] bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${
                            isEnabled ? colorClasses.bg : "bg-white/[0.05]"
                          } flex items-center justify-center`}>
                            <PermissionIcon className={`w-5 h-5 ${
                              isEnabled ? colorClasses.text : "text-white/40"
                            }`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <p className="text-white font-medium">
                                  {permission.label}
                                </p>
                                <p className="text-white/60 text-sm">
                                  {permission.description}
                                </p>
                                {permission.warning && isEnabled && (
                                  <div className="flex items-center gap-1.5 mt-2 text-amber-400 text-xs">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>Advanced permission - use with caution</span>
                                  </div>
                                )}
                              </div>
                              <Switch
                                checked={isEnabled}
                                onCheckedChange={() => togglePermission(permission.key)}
                                className="ml-3"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}

          {/* Warning for Advanced Permissions */}
          {(permissions.editCampaigns ||
            permissions.inviteCreators ||
            permissions.managePayments) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="text-amber-400 font-medium mb-1">
                    Advanced Permissions Active
                  </p>
                  <p className="text-white/80">
                    This client has been granted advanced permissions that allow them to
                    make significant changes. Ensure this is intentional and the client is
                    trusted.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="text-purple-400 font-medium mb-1">Summary:</p>
                <ul className="text-white/80 space-y-1">
                  <li>
                    • {enabledCount} permission{enabledCount !== 1 ? "s" : ""} will be
                    active
                  </li>
                  <li>• Changes will take effect immediately after saving</li>
                  <li>• Client will receive notification of permission changes</li>
                </ul>
              </div>
            </div>
          </motion.div>
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
            disabled={isSaving}
            className={`${
              saveSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-purple-500 hover:bg-purple-600"
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
