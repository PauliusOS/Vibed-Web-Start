"use client";

import { useState } from "react";
import { useWizard } from "@/lib/hooks/useWizard";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@/lib/contexts/OrganizationContext";
import { useToast } from "@/lib/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Info,
  DollarSign,
  Users,
  FileText,
  Building,
  Eye,
} from "lucide-react";

interface CampaignCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: (campaignId: string) => void;
}

const wizardSteps = [
  {
    id: "basic",
    title: "Basic Information",
    description: "Campaign name, description, and dates",
  },
  {
    id: "budget",
    title: "Budget Setup",
    description: "Set budget and allocation strategy",
  },
  {
    id: "creators",
    title: "Select Creators",
    description: "Choose creators and set deal terms",
  },
  {
    id: "brief",
    title: "Content Brief",
    description: "Create campaign brief and guidelines",
  },
  {
    id: "clients",
    title: "Assign Clients",
    description: "Grant client access and permissions",
  },
  {
    id: "review",
    title: "Review & Create",
    description: "Review all details before creating",
  },
];

export function CampaignCreationWizard({
  open,
  onOpenChange,
  onComplete,
}: CampaignCreationWizardProps) {
  const { selectedOrganizationId } = useOrganization();
  const { toast } = useToast();
  const createCampaign = useMutation(api.campaigns.create);
  const [isCreating, setIsCreating] = useState(false);

  const wizard = useWizard(wizardSteps, {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "draft",
    budget: "",
    allocationStrategy: "even",
    selectedCreators: [],
    brief: "",
    selectedClients: [],
  });

  const {
    currentStep,
    currentStepData,
    data,
    isFirstStep,
    isLastStep,
    goToNext,
    goToPrevious,
    updateData,
  } = wizard;

  const handleNext = async () => {
    // Add validation here if needed
    await goToNext();
  };

  const handleComplete = async () => {
    if (!selectedOrganizationId) return;

    setIsCreating(true);
    try {
      const campaignId = await createCampaign({
        organizationId: selectedOrganizationId,
        name: data.name,
        description: data.description,
        startDate: new Date(data.startDate).getTime(),
        endDate: new Date(data.endDate).getTime(),
        budget: Number(data.budget),
        status: data.status as any,
      });

      toast({
        title: "Campaign created",
        description: `${data.name} has been created successfully.`,
      });

      if (onComplete) {
        onComplete(campaignId);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create campaign:", error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case "basic":
        return Info;
      case "budget":
        return DollarSign;
      case "creators":
        return Users;
      case "brief":
        return FileText;
      case "clients":
        return Building;
      case "review":
        return Eye;
      default:
        return Info;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-white/[0.06]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Create New Campaign</DialogTitle>
          <p className="text-white/60 text-sm mt-1">
            Step {currentStep + 1} of {wizardSteps.length}
          </p>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between my-6">
          {wizardSteps.map((step, index) => {
            const StepIcon = getStepIcon(step.id);
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-white/[0.05] text-white/40"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-center mt-2 hidden md:block">
                    <p
                      className={`text-xs font-medium ${
                        isActive ? "text-white" : "text-white/60"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < wizardSteps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-all ${
                      isCompleted ? "bg-emerald-500" : "bg-white/[0.1]"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Step 1: Basic Information */}
              {currentStepData.id === "basic" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">
                      Campaign Name *
                    </Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => updateData({ name: e.target.value })}
                      placeholder="Enter campaign name..."
                      className="mt-2 bg-white/[0.02] border-white/[0.06] text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => updateData({ description: e.target.value })}
                      placeholder="Describe your campaign objectives..."
                      className="mt-2 bg-white/[0.02] border-white/[0.06] text-white min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate" className="text-white">
                        Start Date *
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={data.startDate}
                        onChange={(e) => updateData({ startDate: e.target.value })}
                        className="mt-2 bg-white/[0.02] border-white/[0.06] text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate" className="text-white">
                        End Date *
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={data.endDate}
                        onChange={(e) => updateData({ endDate: e.target.value })}
                        className="mt-2 bg-white/[0.02] border-white/[0.06] text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-white">
                      Initial Status
                    </Label>
                    <Select
                      value={data.status}
                      onValueChange={(value) => updateData({ status: value })}
                    >
                      <SelectTrigger className="mt-2 bg-white/[0.02] border-white/[0.06] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0a0a] border-white/[0.06]">
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Budget Setup */}
              {currentStepData.id === "budget" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="budget" className="text-white">
                      Total Budget *
                    </Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                        $
                      </span>
                      <Input
                        id="budget"
                        type="number"
                        value={data.budget}
                        onChange={(e) => updateData({ budget: e.target.value })}
                        placeholder="50000"
                        className="pl-8 bg-white/[0.02] border-white/[0.06] text-white"
                      />
                    </div>
                    <p className="text-xs text-white/40 mt-1">
                      Enter the total budget for this campaign
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="allocationStrategy" className="text-white">
                      Budget Allocation Strategy
                    </Label>
                    <Select
                      value={data.allocationStrategy}
                      onValueChange={(value) => updateData({ allocationStrategy: value })}
                    >
                      <SelectTrigger className="mt-2 bg-white/[0.02] border-white/[0.06] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0a0a] border-white/[0.06]">
                        <SelectItem value="even">Even Split</SelectItem>
                        <SelectItem value="performance">Performance-Based</SelectItem>
                        <SelectItem value="manual">Manual Allocation</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-white/40 mt-1">
                      How should the budget be distributed among creators
                    </p>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-400">Budget Allocation</p>
                        <p className="text-xs text-blue-400/80 mt-1">
                          You'll be able to set individual creator budgets in the next step
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Select Creators */}
              {currentStepData.id === "creators" && (
                <div className="space-y-4">
                  <div className="p-6 rounded-lg bg-white/[0.02] border border-white/[0.06] text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 text-purple-400 opacity-50" />
                    <p className="text-white/60">Creator selection interface</p>
                    <p className="text-sm text-white/40 mt-1">
                      Search and select creators, set deal terms
                    </p>
                    <p className="text-xs text-white/30 mt-2">
                      Will be implemented with creator search, deal terms input, and preview
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Content Brief */}
              {currentStepData.id === "brief" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="brief" className="text-white">
                      Campaign Brief
                    </Label>
                    <Textarea
                      id="brief"
                      value={data.brief}
                      onChange={(e) => updateData({ brief: e.target.value })}
                      placeholder="Provide detailed campaign guidelines, content requirements, brand voice, dos and don'ts..."
                      className="mt-2 bg-white/[0.02] border-white/[0.06] text-white min-h-[200px]"
                    />
                    <p className="text-xs text-white/40 mt-1">
                      This brief will be shared with all assigned creators
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-amber-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-400">Rich Text Editor</p>
                        <p className="text-xs text-amber-400/80 mt-1">
                          Full rich text editor with file attachments will be available in final version
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Assign Clients */}
              {currentStepData.id === "clients" && (
                <div className="space-y-4">
                  <div className="p-6 rounded-lg bg-white/[0.02] border border-white/[0.06] text-center">
                    <Building className="w-12 h-12 mx-auto mb-3 text-blue-400 opacity-50" />
                    <p className="text-white/60">Client assignment interface</p>
                    <p className="text-sm text-white/40 mt-1">
                      Select clients and configure their permissions
                    </p>
                    <p className="text-xs text-white/30 mt-2">
                      Will be implemented with client search and permission settings
                    </p>
                  </div>
                </div>
              )}

              {/* Step 6: Review */}
              {currentStepData.id === "review" && (
                <div className="space-y-4">
                  <div className="space-y-4">
                    {/* Basic Info */}
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                      <h4 className="text-sm font-semibold text-white mb-3">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/60">Name:</span>
                          <span className="text-white">{data.name || "Not set"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Status:</span>
                          <span className="text-white capitalize">{data.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Duration:</span>
                          <span className="text-white">
                            {data.startDate && data.endDate
                              ? `${data.startDate} to ${data.endDate}`
                              : "Not set"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                      <h4 className="text-sm font-semibold text-white mb-3">Budget</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/60">Total Budget:</span>
                          <span className="text-white">
                            ${data.budget ? Number(data.budget).toLocaleString() : "0"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Allocation:</span>
                          <span className="text-white capitalize">
                            {data.allocationStrategy.replace("-", " ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-emerald-400">Ready to Create</p>
                          <p className="text-xs text-emerald-400/80 mt-1">
                            Review the information above and click Create Campaign to proceed
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/[0.06]">
          <Button
            variant="ghost"
            onClick={goToPrevious}
            disabled={isFirstStep}
            className="text-white/60 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-white/60 hover:text-white"
            >
              Cancel
            </Button>
            {!isLastStep ? (
              <Button
                onClick={handleNext}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isCreating || !data.name || !data.startDate || !data.endDate}
                className="bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Create Campaign
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
