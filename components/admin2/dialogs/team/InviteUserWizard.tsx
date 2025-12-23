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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  Mail,
  User,
  Shield,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useWizard } from "@/lib/hooks/useWizard";

interface InviteUserWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (userData: UserData) => Promise<void>;
}

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  permissions: string[];
  message?: string;
}

const roles = [
  { value: "admin", label: "Administrator", description: "Full system access" },
  { value: "manager", label: "Manager", description: "Manage campaigns and creators" },
  { value: "analyst", label: "Analyst", description: "View analytics and reports" },
  { value: "finance", label: "Finance", description: "Manage payments and invoices" },
  { value: "viewer", label: "Viewer", description: "View-only access" },
];

const departments = [
  "Marketing",
  "Sales",
  "Finance",
  "Operations",
  "Creative",
  "Analytics",
  "Other",
];

const permissionGroups = {
  campaigns: ["view_campaigns", "edit_campaigns", "delete_campaigns"],
  creators: ["view_creators", "invite_creators", "manage_creators"],
  finance: ["view_finance", "process_payments", "manage_invoices"],
  analytics: ["view_analytics", "export_reports", "create_dashboards"],
  settings: ["view_settings", "edit_settings", "manage_team"],
};

export function InviteUserWizard({
  open,
  onOpenChange,
  onInvite,
}: InviteUserWizardProps) {
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const wizardSteps = [
    {
      id: "info",
      title: "User Information",
      description: "Enter basic user details",
    },
    {
      id: "role",
      title: "Role & Department",
      description: "Assign role and department",
    },
    {
      id: "permissions",
      title: "Permissions",
      description: "Configure access permissions",
    },
    {
      id: "review",
      title: "Review & Send",
      description: "Review and send invitation",
    },
  ];

  const wizard = useWizard(wizardSteps, {
    firstName: "",
    lastName: "",
    email: "",
    role: "viewer",
    department: "",
    permissions: [] as string[],
    message: "",
  });

  const handleInvite = async () => {
    setIsInviting(true);
    setInviteSuccess(false);

    try {
      await onInvite(wizard.data);
      setInviteSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setInviteSuccess(false);
        wizard.goToStep(0);
      }, 1500);
    } catch (error) {
      console.error("Failed to invite user:", error);
    } finally {
      setIsInviting(false);
    }
  };

  const togglePermission = (permission: string) => {
    const permissions = wizard.data.permissions || [];
    if (permissions.includes(permission)) {
      wizard.updateData({
        permissions: permissions.filter((p) => p !== permission),
      });
    } else {
      wizard.updateData({ permissions: [...permissions, permission] });
    }
  };

  const permissionLabels: Record<string, string> = {
    view_campaigns: "View Campaigns",
    edit_campaigns: "Edit Campaigns",
    delete_campaigns: "Delete Campaigns",
    view_creators: "View Creators",
    invite_creators: "Invite Creators",
    manage_creators: "Manage Creators",
    view_finance: "View Finance",
    process_payments: "Process Payments",
    manage_invoices: "Manage Invoices",
    view_analytics: "View Analytics",
    export_reports: "Export Reports",
    create_dashboards: "Create Dashboards",
    view_settings: "View Settings",
    edit_settings: "Edit Settings",
    manage_team: "Manage Team",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription className="mt-1">
                {wizard.currentStepData.description}
              </DialogDescription>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {wizardSteps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  className={`h-1 flex-1 rounded ${
                    index <= wizard.currentStep
                      ? "bg-blue-500"
                      : "bg-white/[0.06]"
                  }`}
                />
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <AnimatePresence mode="wait">
            {/* Step 1: User Information */}
            {wizard.currentStep === 0 && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white/80">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={wizard.data.firstName}
                      onChange={(e) =>
                        wizard.updateData({ firstName: e.target.value })
                      }
                      placeholder="John"
                      className="bg-white/[0.02] border-white/[0.06] text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white/80">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={wizard.data.lastName}
                      onChange={(e) =>
                        wizard.updateData({ lastName: e.target.value })
                      }
                      placeholder="Doe"
                      className="bg-white/[0.02] border-white/[0.06] text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      id="email"
                      type="email"
                      value={wizard.data.email}
                      onChange={(e) =>
                        wizard.updateData({ email: e.target.value })
                      }
                      placeholder="john.doe@company.com"
                      className="pl-10 bg-white/[0.02] border-white/[0.06] text-white"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-400 text-sm">
                    An invitation email will be sent to this address. The user
                    will need to accept the invitation to join the team.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Role & Department */}
            {wizard.currentStep === 1 && (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white/80">
                    User Role *
                  </Label>
                  <Select
                    value={wizard.data.role}
                    onValueChange={(value) => wizard.updateData({ role: value })}
                  >
                    <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div>
                            <p>{role.label}</p>
                            <p className="text-xs text-white/60">
                              {role.description}
                            </p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-white/80">
                    Department *
                  </Label>
                  <Select
                    value={wizard.data.department}
                    onValueChange={(value) =>
                      wizard.updateData({ department: value })
                    }
                  >
                    <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Role Description */}
                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <p className="text-white font-medium">Role Capabilities</p>
                  </div>
                  <p className="text-white/60 text-sm">
                    {roles.find((r) => r.value === wizard.data.role)?.description}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 3: Permissions */}
            {wizard.currentStep === 2 && (
              <motion.div
                key="permissions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-amber-400 text-sm">
                    Selected role ({roles.find((r) => r.value === wizard.data.role)?.label})
                    comes with default permissions. Customize as needed below.
                  </p>
                </div>

                {Object.entries(permissionGroups).map(([group, permissions]) => (
                  <div
                    key={group}
                    className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                  >
                    <h4 className="text-white font-medium capitalize mb-3">
                      {group}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {permissions.map((permission) => (
                        <label
                          key={permission}
                          className="flex items-center gap-2 cursor-pointer hover:bg-white/[0.02] p-2 rounded transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={(wizard.data.permissions || []).includes(
                              permission
                            )}
                            onChange={() => togglePermission(permission)}
                            className="rounded border-white/[0.06]"
                          />
                          <span className="text-white/80 text-sm">
                            {permissionLabels[permission]}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Step 4: Review & Send */}
            {wizard.currentStep === 3 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <h4 className="text-white font-medium mb-3">User Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Name:</span>
                      <span className="text-white">
                        {wizard.data.firstName} {wizard.data.lastName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Email:</span>
                      <span className="text-white">{wizard.data.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Role:</span>
                      <span className="text-white capitalize">
                        {roles.find((r) => r.value === wizard.data.role)?.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Department:</span>
                      <span className="text-white">{wizard.data.department}</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-white/60">Permissions:</span>
                      <span className="text-white text-right">
                        {(wizard.data.permissions || []).length} selected
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white/80">
                    Custom Message (Optional)
                  </Label>
                  <Textarea
                    id="message"
                    value={wizard.data.message}
                    onChange={(e) =>
                      wizard.updateData({ message: e.target.value })
                    }
                    placeholder="Add a personal message to the invitation email..."
                    className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 min-h-24"
                  />
                </div>

                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 text-sm">
                      <p className="text-green-400 font-medium mb-1">
                        Ready to Send Invitation
                      </p>
                      <p className="text-white/80">
                        An email will be sent to {wizard.data.email} with
                        instructions to join the team. They'll be able to access
                        the platform based on the permissions you've configured.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              onClick={wizard.goToPrevious}
              disabled={wizard.isFirstStep || isInviting}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {wizard.isLastStep ? (
              <Button
                onClick={handleInvite}
                disabled={
                  isInviting ||
                  !wizard.data.firstName ||
                  !wizard.data.lastName ||
                  !wizard.data.email ||
                  !wizard.data.department
                }
                className={`${
                  inviteSuccess
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                {isInviting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : inviteSuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Sent!
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={wizard.goToNext}
                disabled={
                  (wizard.currentStep === 0 &&
                    (!wizard.data.firstName ||
                      !wizard.data.lastName ||
                      !wizard.data.email)) ||
                  (wizard.currentStep === 1 && !wizard.data.department)
                }
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
