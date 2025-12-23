"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Archive, Trash2, AlertTriangle } from "lucide-react";

interface Campaign {
  _id: string;
  name: string;
  status: string;
  budget: number;
  startDate?: number;
  endDate?: number;
}

interface CampaignSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign;
  onSave?: (updates: Partial<Campaign>) => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

export function CampaignSettingsDialog({
  open,
  onOpenChange,
  campaign,
  onSave,
  onArchive,
  onDelete,
}: CampaignSettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [name, setName] = useState(campaign.name);
  const [status, setStatus] = useState(campaign.status);
  const [budget, setBudget] = useState((campaign.budget / 100).toString());
  const [startDate, setStartDate] = useState(
    campaign.startDate ? new Date(campaign.startDate).toISOString().split("T")[0] : ""
  );
  const [endDate, setEndDate] = useState(
    campaign.endDate ? new Date(campaign.endDate).toISOString().split("T")[0] : ""
  );

  const handleSave = () => {
    if (onSave) {
      onSave({
        name,
        status,
        budget: parseFloat(budget) * 100,
        startDate: startDate ? new Date(startDate).getTime() : undefined,
        endDate: endDate ? new Date(endDate).getTime() : undefined,
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#0a0a0a] border-white/[0.06]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-400" />
            Campaign Settings
          </DialogTitle>
          <p className="text-white/60 text-sm mt-1">{campaign.name}</p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="w-full bg-white/[0.02] border border-white/[0.06]">
            <TabsTrigger
              value="general"
              className="flex-1 data-[state=active]:bg-white/[0.08]"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="danger"
              className="flex-1 data-[state=active]:bg-white/[0.08]"
            >
              Danger Zone
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-6">
            <div>
              <Label htmlFor="name" className="text-white">
                Campaign Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 bg-white/[0.02] border-white/[0.06] text-white"
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-white">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-2 bg-white/[0.02] border-white/[0.06] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/[0.06]">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budget" className="text-white">
                Total Budget
              </Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                  $
                </span>
                <Input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="pl-8 bg-white/[0.02] border-white/[0.06] text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-white">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2 bg-white/[0.02] border-white/[0.06] text-white"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-white">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-2 bg-white/[0.02] border-white/[0.06] text-white"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="danger" className="space-y-4 mt-6">
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <Archive className="w-5 h-5 text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-amber-400 mb-1">
                    Archive Campaign
                  </h4>
                  <p className="text-xs text-amber-400/80 mb-3">
                    Archived campaigns can be restored later. They won't appear in
                    active lists.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onArchive}
                    className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive This Campaign
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-400 mb-1">
                    Delete Campaign
                  </h4>
                  <p className="text-xs text-red-400/80 mb-3">
                    Permanently delete this campaign. This action cannot be undone.
                    All associated data will be lost.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDelete}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Permanently
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-white/60 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
