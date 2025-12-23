"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Eye,
  BarChart3,
  CheckCircle,
  DollarSign,
  Folder,
  Sparkles,
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: string;
}

interface ClientPermissions {
  hasAllCampaignsAccess: boolean;
  allowedCampaignIds: string[];
  canViewAnalytics: boolean;
  canApproveVideos: boolean;
  canManagePayments: boolean;
}

interface Client {
  userId: string;
  role: string;
  permissions: ClientPermissions;
  assignedCampaigns: Campaign[];
}

interface PermissionPreset {
  id: string;
  name: string;
  description: string;
  permissions: Partial<ClientPermissions>;
}

interface EditPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  campaigns: Campaign[];
  presets: PermissionPreset[];
  onSave: (clientId: string, permissions: ClientPermissions, campaignIds: string[]) => void;
}

export function EditPermissionsDialog({
  open,
  onOpenChange,
  client,
  campaigns,
  presets,
  onSave,
}: EditPermissionsDialogProps) {
  const [permissions, setPermissions] = useState<ClientPermissions>({
    hasAllCampaignsAccess: false,
    allowedCampaignIds: [],
    canViewAnalytics: false,
    canApproveVideos: false,
    canManagePayments: false,
  });
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);

  // Reset state when client changes
  useEffect(() => {
    if (client) {
      setPermissions(client.permissions);
      setSelectedCampaigns(client.assignedCampaigns.map((c) => c.id));
    }
  }, [client]);

  const handlePresetSelect = (preset: PermissionPreset) => {
    setPermissions((prev) => ({
      ...prev,
      ...preset.permissions,
    }));
  };

  const handleCampaignToggle = (campaignId: string) => {
    setSelectedCampaigns((prev) =>
      prev.includes(campaignId)
        ? prev.filter((id) => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleSelectAllCampaigns = () => {
    if (selectedCampaigns.length === campaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(campaigns.map((c) => c.id));
    }
  };

  const handleSave = () => {
    if (client) {
      onSave(client.userId, permissions, selectedCampaigns);
      onOpenChange(false);
    }
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-white/10 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            Edit Client Permissions
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Manage access and permissions for this client
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="permissions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5">
            <TabsTrigger
              value="permissions"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              Permissions
            </TabsTrigger>
            <TabsTrigger
              value="campaigns"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Folder className="w-4 h-4 mr-2" />
              Campaign Access
            </TabsTrigger>
          </TabsList>

          <TabsContent value="permissions" className="mt-4 space-y-6">
            {/* Presets */}
            <div className="space-y-3">
              <Label className="text-white/80 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Quick Presets
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className="p-3 rounded-lg border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 text-left transition-all"
                  >
                    <p className="text-white font-medium text-sm">{preset.name}</p>
                    <p className="text-white/40 text-xs mt-1">{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Permission Toggles */}
            <div className="space-y-4">
              <Label className="text-white/80">Feature Access</Label>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">View Campaigns</p>
                      <p className="text-white/40 text-xs">Always enabled for clients</p>
                    </div>
                  </div>
                  <Switch checked disabled />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">View Analytics</p>
                      <p className="text-white/40 text-xs">Access performance metrics</p>
                    </div>
                  </div>
                  <Switch
                    checked={permissions.canViewAnalytics}
                    onCheckedChange={(checked) =>
                      setPermissions((prev) => ({ ...prev, canViewAnalytics: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Approve Videos</p>
                      <p className="text-white/40 text-xs">Approve or reject video submissions</p>
                    </div>
                  </div>
                  <Switch
                    checked={permissions.canApproveVideos}
                    onCheckedChange={(checked) =>
                      setPermissions((prev) => ({ ...prev, canApproveVideos: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Manage Payments</p>
                      <p className="text-white/40 text-xs">View and process creator payments</p>
                    </div>
                  </div>
                  <Switch
                    checked={permissions.canManagePayments}
                    onCheckedChange={(checked) =>
                      setPermissions((prev) => ({ ...prev, canManagePayments: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="mt-4 space-y-4">
            {/* All Campaigns Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white text-sm font-medium">Access All Campaigns</p>
                  <p className="text-white/40 text-xs">
                    Grant access to all current and future campaigns
                  </p>
                </div>
              </div>
              <Switch
                checked={permissions.hasAllCampaignsAccess}
                onCheckedChange={(checked) =>
                  setPermissions((prev) => ({ ...prev, hasAllCampaignsAccess: checked }))
                }
              />
            </div>

            {!permissions.hasAllCampaignsAccess && (
              <>
                <div className="flex items-center justify-between">
                  <Label className="text-white/80">
                    Select Campaigns ({selectedCampaigns.length} selected)
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAllCampaigns}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    {selectedCampaigns.length === campaigns.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>

                <ScrollArea className="h-[250px] rounded-lg border border-white/10 p-3">
                  <div className="space-y-2">
                    {campaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={campaign.id}
                            checked={selectedCampaigns.includes(campaign.id)}
                            onCheckedChange={() => handleCampaignToggle(campaign.id)}
                          />
                          <Label
                            htmlFor={campaign.id}
                            className="text-white text-sm cursor-pointer"
                          >
                            {campaign.name}
                          </Label>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            campaign.status === "active"
                              ? "border-emerald-500/30 text-emerald-400"
                              : campaign.status === "completed"
                              ? "border-blue-500/30 text-blue-400"
                              : "border-white/20 text-white/60"
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-white/60"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
