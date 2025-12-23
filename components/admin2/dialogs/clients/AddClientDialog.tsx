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
  UserPlus,
  Check,
  Building2,
  Mail,
  Phone,
  Globe,
  Shield,
  Briefcase,
} from "lucide-react";
import { motion } from "motion/react";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (clientData: ClientData) => Promise<void>;
}

export interface ClientData {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  description?: string;
  permissions: {
    viewCampaigns: boolean;
    viewCreators: boolean;
    viewAnalytics: boolean;
    approveBriefs: boolean;
    approveVideos: boolean;
  };
  sendWelcomeEmail: boolean;
}

export function AddClientDialog({
  open,
  onOpenChange,
  onAdd,
}: AddClientDialogProps) {
  const [formData, setFormData] = useState<ClientData>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    description: "",
    permissions: {
      viewCampaigns: true,
      viewCreators: false,
      viewAnalytics: true,
      approveBriefs: false,
      approveVideos: true,
    },
    sendWelcomeEmail: true,
  });

  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone format";
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = "Website must start with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsAdding(true);
    setAddSuccess(false);

    try {
      await onAdd(formData);
      setAddSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setAddSuccess(false);
        // Reset form
        setFormData({
          companyName: "",
          contactName: "",
          email: "",
          phone: "",
          website: "",
          description: "",
          permissions: {
            viewCampaigns: true,
            viewCreators: false,
            viewAnalytics: true,
            approveBriefs: false,
            approveVideos: true,
          },
          sendWelcomeEmail: true,
        });
        setErrors({});
      }, 1500);
    } catch (error) {
      console.error("Failed to add client:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const updateField = (field: keyof ClientData, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const updatePermission = (permission: keyof ClientData["permissions"], value: boolean) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: value,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription className="mt-1">
                Create a new client account with access permissions
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-2">
          {/* Company Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-blue-400" />
              <h3 className="text-white font-medium">Company Information</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-white/80">
                Company Name *
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="e.g., Acme Corporation"
                className={`bg-white/[0.02] border-white/[0.06] text-white ${
                  errors.companyName ? "border-red-500" : ""
                }`}
              />
              {errors.companyName && (
                <p className="text-red-400 text-xs">{errors.companyName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName" className="text-white/80">
                  Contact Name *
                </Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => updateField("contactName", e.target.value)}
                  placeholder="e.g., John Smith"
                  className={`bg-white/[0.02] border-white/[0.06] text-white ${
                    errors.contactName ? "border-red-500" : ""
                  }`}
                />
                {errors.contactName && (
                  <p className="text-red-400 text-xs">{errors.contactName}</p>
                )}
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
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="john@acme.com"
                    className={`pl-10 bg-white/[0.02] border-white/[0.06] text-white ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white/80">
                  Phone Number (Optional)
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className={`pl-10 bg-white/[0.02] border-white/[0.06] text-white ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-xs">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-white/80">
                  Website (Optional)
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    placeholder="https://acme.com"
                    className={`pl-10 bg-white/[0.02] border-white/[0.06] text-white ${
                      errors.website ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.website && (
                  <p className="text-red-400 text-xs">{errors.website}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white/80">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Brief description of the client and their business..."
                className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 min-h-20"
              />
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-purple-400" />
              <h3 className="text-white font-medium">Access Permissions</h3>
            </div>

            <div className="space-y-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={() =>
                  updatePermission("viewCampaigns", !formData.permissions.viewCampaigns)
                }
              >
                <Checkbox
                  checked={formData.permissions.viewCampaigns}
                  onCheckedChange={(checked) =>
                    updatePermission("viewCampaigns", checked as boolean)
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">View Campaigns</p>
                  <p className="text-white/60 text-xs">
                    Allow viewing campaign details and status
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={() =>
                  updatePermission("viewCreators", !formData.permissions.viewCreators)
                }
              >
                <Checkbox
                  checked={formData.permissions.viewCreators}
                  onCheckedChange={(checked) =>
                    updatePermission("viewCreators", checked as boolean)
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">View Creators</p>
                  <p className="text-white/60 text-xs">
                    Allow viewing creator profiles and details
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={() =>
                  updatePermission("viewAnalytics", !formData.permissions.viewAnalytics)
                }
              >
                <Checkbox
                  checked={formData.permissions.viewAnalytics}
                  onCheckedChange={(checked) =>
                    updatePermission("viewAnalytics", checked as boolean)
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">View Analytics</p>
                  <p className="text-white/60 text-xs">
                    Allow viewing performance analytics and reports
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={() =>
                  updatePermission("approveBriefs", !formData.permissions.approveBriefs)
                }
              >
                <Checkbox
                  checked={formData.permissions.approveBriefs}
                  onCheckedChange={(checked) =>
                    updatePermission("approveBriefs", checked as boolean)
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Approve Briefs</p>
                  <p className="text-white/60 text-xs">
                    Allow approving campaign briefs and content guidelines
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={() =>
                  updatePermission("approveVideos", !formData.permissions.approveVideos)
                }
              >
                <Checkbox
                  checked={formData.permissions.approveVideos}
                  onCheckedChange={(checked) =>
                    updatePermission("approveVideos", checked as boolean)
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Approve Videos</p>
                  <p className="text-white/60 text-xs">
                    Allow approving or requesting revisions on videos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Email Option */}
          <div
            className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg cursor-pointer"
            onClick={() =>
              updateField("sendWelcomeEmail", !formData.sendWelcomeEmail)
            }
          >
            <Checkbox
              checked={formData.sendWelcomeEmail}
              onCheckedChange={(checked) =>
                updateField("sendWelcomeEmail", checked as boolean)
              }
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-blue-400" />
                <p className="text-white text-sm font-medium">Send Welcome Email</p>
              </div>
              <p className="text-white/60 text-xs">
                Send an email to the client with their account details and access
                instructions
              </p>
            </div>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="text-green-400 font-medium mb-1">Summary:</p>
                <ul className="text-white/80 space-y-1">
                  <li>• New client account will be created</li>
                  <li>
                    • {Object.values(formData.permissions).filter(Boolean).length} of 5
                    permissions enabled
                  </li>
                  {formData.sendWelcomeEmail && (
                    <li>• Welcome email will be sent to {formData.email || "client"}</li>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAdding}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isAdding}
            className={`${
              addSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Adding Client...
              </>
            ) : addSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Client Added!
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Client
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
