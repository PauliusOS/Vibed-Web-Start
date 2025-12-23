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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Briefcase,
  Check,
  Search,
  DollarSign,
  Calendar,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Campaign {
  _id: string;
  name: string;
  status: "active" | "draft" | "completed";
  budget: number;
  startDate: number;
  endDate: number;
  creatorCount: number;
}

interface Creator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AssignToCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creators: Creator[];
  campaigns: Campaign[];
  onAssign: (data: {
    creatorIds: string[];
    campaignIds: string[];
    setDealTerms: boolean;
  }) => Promise<void>;
}

export function AssignToCampaignDialog({
  open,
  onOpenChange,
  creators,
  campaigns,
  onAssign,
}: AssignToCampaignDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState<Set<string>>(
    new Set()
  );
  const [setDealTerms, setSetDealTerms] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);

  const toggleCampaign = (campaignId: string) => {
    const newSelection = new Set(selectedCampaigns);
    if (newSelection.has(campaignId)) {
      newSelection.delete(campaignId);
    } else {
      newSelection.add(campaignId);
    }
    setSelectedCampaigns(newSelection);
  };

  const handleAssign = async () => {
    if (selectedCampaigns.size === 0) return;

    setIsAssigning(true);
    setAssignSuccess(false);

    try {
      await onAssign({
        creatorIds: creators.map((c) => c.id),
        campaignIds: Array.from(selectedCampaigns),
        setDealTerms,
      });
      setAssignSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setAssignSuccess(false);
        setSelectedCampaigns(new Set());
      }, 1500);
    } catch (error) {
      console.error("Assignment failed:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusConfig = {
    active: {
      label: "Active",
      color: "text-green-400",
      bg: "bg-green-500/20",
    },
    draft: {
      label: "Draft",
      color: "text-amber-400",
      bg: "bg-amber-500/20",
    },
    completed: {
      label: "Completed",
      color: "text-blue-400",
      bg: "bg-blue-500/20",
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <DialogTitle>Assign to Campaign</DialogTitle>
              <DialogDescription className="mt-1">
                Assign {creators.length} creator{creators.length !== 1 ? "s" : ""} to campaigns
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-2">
          {/* Creators Summary */}
          <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-white">
                Selected Creators ({creators.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {creators.map((creator) => (
                <div
                  key={creator.id}
                  className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg text-sm text-white"
                >
                  {creator.name}
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaigns..."
              className="pl-10 bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
            />
          </div>

          {/* Campaigns List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-white/80">
                Select Campaigns ({selectedCampaigns.size} selected)
              </Label>
              {selectedCampaigns.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCampaigns(new Set())}
                  className="text-xs"
                >
                  Clear Selection
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {filteredCampaigns.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 text-white/20" />
                    <p className="text-white/60 text-sm">
                      No campaigns found
                    </p>
                  </div>
                ) : (
                  filteredCampaigns.map((campaign, index) => {
                    const config = statusConfig[campaign.status];
                    const isSelected = selectedCampaigns.has(campaign._id);

                    return (
                      <motion.div
                        key={campaign._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => toggleCampaign(campaign._id)}
                        className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? "border-purple-500/50 bg-purple-500/10"
                            : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleCampaign(campaign._id)}
                          className="mt-1"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h4 className="text-white font-medium mb-1">
                                {campaign.name}
                              </h4>
                              <div
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded ${config.bg}`}
                              >
                                <span className={`text-xs ${config.color}`}>
                                  {config.label}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3 text-xs text-white/60">
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="w-3 h-3" />
                              <span>${campaign.budget.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3 h-3" />
                              <span>{campaign.creatorCount} creators</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(campaign.startDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center"
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
          </div>

          {/* Deal Terms Option */}
          <div
            className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg cursor-pointer hover:bg-white/[0.04] transition-colors"
            onClick={() => setSetDealTerms(!setDealTerms)}
          >
            <Checkbox
              checked={setDealTerms}
              onCheckedChange={setSetDealTerms}
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-400" />
                <label className="text-sm text-white cursor-pointer font-medium">
                  Set Deal Terms After Assignment
                </label>
              </div>
              <p className="text-xs text-white/60">
                Configure compensation and deliverables for each creator after
                assigning them to campaigns
              </p>
            </div>
          </div>

          {/* Summary */}
          {selectedCampaigns.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="text-purple-400 font-medium mb-1">
                    Assignment Summary:
                  </p>
                  <ul className="text-white/80 space-y-1">
                    <li>
                      • {creators.length} creator{creators.length !== 1 ? "s" : ""} will be assigned
                    </li>
                    <li>
                      • To {selectedCampaigns.size} campaign{selectedCampaigns.size !== 1 ? "s" : ""}
                    </li>
                    <li>
                      • Total {creators.length * selectedCampaigns.size} assignment
                      {creators.length * selectedCampaigns.size !== 1 ? "s" : ""}
                    </li>
                    {setDealTerms && (
                      <li>• Deal terms will be configured after assignment</li>
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
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={isAssigning || selectedCampaigns.size === 0}
            className={`${
              assignSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-purple-500 hover:bg-purple-600"
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
                <Briefcase className="w-4 h-4 mr-2" />
                Assign to {selectedCampaigns.size} Campaign
                {selectedCampaigns.size !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
