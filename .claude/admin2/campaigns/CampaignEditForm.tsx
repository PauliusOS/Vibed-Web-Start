"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
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
import { motion } from "motion/react";
import {
  Save,
  Loader2,
  Check,
  AlertCircle,
  Info,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Building,
  Settings,
  Bell,
  Archive,
} from "lucide-react";
import { BudgetEditor } from "./BudgetEditor";
import { CreatorSelector } from "./CreatorSelector";
import { ClientSelector } from "./ClientSelector";
import { useOrganization } from "@/lib/contexts/OrganizationContext";

type CampaignStatus = "draft" | "active" | "paused" | "completed" | "archived";

interface CampaignData {
  _id: Id<"campaigns">;
  name: string;
  budget: number;
  status: CampaignStatus;
  startDate?: number;
  endDate?: number;
  organizationId: Id<"organizations">;
}

interface CampaignEditFormProps {
  campaign: CampaignData;
}

interface FormData {
  name: string;
  description: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  budget: string;
}

export function CampaignEditForm({ campaign }: CampaignEditFormProps) {
  const router = useRouter();
  const { selectedOrganizationId } = useOrganization();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: campaign.name || "",
    description: "",
    status: campaign.status || "draft",
    startDate: campaign.startDate
      ? new Date(campaign.startDate).toISOString().split("T")[0]
      : "",
    endDate: campaign.endDate
      ? new Date(campaign.endDate).toISOString().split("T")[0]
      : "",
    budget: campaign.budget ? (campaign.budget / 100).toString() : "",
  });

  // Mutations
  const updateCampaign = useMutation(api.campaigns.updateCampaign);

  // Budget utilization query
  const budgetUtilization = useQuery(api.campaigns.getCampaignBudgetUtilization, {
    campaignId: campaign._id,
  });

  // Creators and clients
  const campaignCreators = useQuery(api.creators.getCampaignCreators, {
    campaignId: campaign._id,
  });

  const campaignClients = useQuery(api.clients.getCampaignClients, {
    campaignId: campaign._id,
  });

  // Track unsaved changes
  useEffect(() => {
    const originalData: FormData = {
      name: campaign.name || "",
      description: "",
      status: campaign.status || "draft",
      startDate: campaign.startDate
        ? new Date(campaign.startDate).toISOString().split("T")[0]
        : "",
      endDate: campaign.endDate
        ? new Date(campaign.endDate).toISOString().split("T")[0]
        : "",
      budget: campaign.budget ? (campaign.budget / 100).toString() : "",
    };

    const hasChanges =
      formData.name !== originalData.name ||
      formData.status !== originalData.status ||
      formData.startDate !== originalData.startDate ||
      formData.endDate !== originalData.endDate ||
      formData.budget !== originalData.budget;

    setHasUnsavedChanges(hasChanges);
  }, [formData, campaign]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setError(null);
    },
    []
  );

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Campaign name is required");
      return false;
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        setError("End date must be after start date");
        return false;
      }
    }

    const budget = parseFloat(formData.budget);
    if (formData.budget && (isNaN(budget) || budget < 0)) {
      setError("Budget must be a positive number");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setError(null);

    try {
      await updateCampaign({
        campaignId: campaign._id,
        name: formData.name,
        status: formData.status,
        startDate: formData.startDate
          ? new Date(formData.startDate).getTime()
          : undefined,
        endDate: formData.endDate
          ? new Date(formData.endDate).getTime()
          : undefined,
        budget: formData.budget
          ? Math.round(parseFloat(formData.budget) * 100)
          : undefined,
      });

      setSaved(true);
      setHasUnsavedChanges(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving campaign:", err);
      setError(err instanceof Error ? err.message : "Failed to save campaign");
    } finally {
      setSaving(false);
    }
  };

  const statusOptions: { value: CampaignStatus; label: string; color: string }[] = [
    { value: "draft", label: "Draft", color: "text-gray-400" },
    { value: "active", label: "Active", color: "text-emerald-400" },
    { value: "paused", label: "Paused", color: "text-amber-400" },
    { value: "completed", label: "Completed", color: "text-blue-400" },
    { value: "archived", label: "Archived", color: "text-red-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Sticky Save Bar */}
      <div className="sticky top-0 z-10 -mx-6 px-6 py-4 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 text-amber-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                Unsaved changes
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => router.push(`/admin2/campaigns/${campaign._id}`)}
              className="text-white/60 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !hasUnsavedChanges}
              className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Basic Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassPanel className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white/80 mb-2 block">
                Campaign Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter campaign name..."
                className="bg-white/[0.02] border-white/[0.06] text-white"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white/80 mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe your campaign objectives..."
                className="bg-white/[0.02] border-white/[0.06] text-white min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-white/80 mb-2 block">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => updateField("status", value as CampaignStatus)}
              >
                <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/[0.06]">
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className={option.color}>{option.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Dates Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassPanel className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Campaign Dates</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-white/80 mb-2 block">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
                className="bg-white/[0.02] border-white/[0.06] text-white"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-white/80 mb-2 block">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => updateField("endDate", e.target.value)}
                className="bg-white/[0.02] border-white/[0.06] text-white"
              />
            </div>
          </div>

          {formData.startDate && formData.endDate && (
            <div className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="text-sm text-purple-400">Campaign Duration</p>
                  <p className="text-xs text-purple-400/80 mt-1">
                    {Math.ceil(
                      (new Date(formData.endDate).getTime() -
                        new Date(formData.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </p>
                </div>
              </div>
            </div>
          )}
        </GlassPanel>
      </motion.div>

      {/* Budget Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <BudgetEditor
          budget={formData.budget}
          onBudgetChange={(value) => updateField("budget", value)}
          utilization={budgetUtilization}
        />
      </motion.div>

      {/* Team Management - Creators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <CreatorSelector
          campaignId={campaign._id}
          organizationId={campaign.organizationId}
          assignedCreators={campaignCreators || []}
        />
      </motion.div>

      {/* Team Management - Client */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ClientSelector
          campaignId={campaign._id}
          organizationId={campaign.organizationId}
          assignedClients={campaignClients || []}
        />
      </motion.div>

      {/* Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <GlassPanel className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-white">Settings</h3>
          </div>

          <div className="space-y-4">
            {/* Notification Preferences */}
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Notifications</p>
                    <p className="text-sm text-white/60">
                      Manage campaign notification settings
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/[0.06] text-white/60 hover:text-white"
                >
                  Configure
                </Button>
              </div>
            </div>

            {/* Auto-archive */}
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Archive className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-white font-medium">Auto-Archive</p>
                    <p className="text-sm text-white/60">
                      Automatically archive when campaign ends
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/[0.06] text-white/60 hover:text-white"
                >
                  Enable
                </Button>
              </div>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
