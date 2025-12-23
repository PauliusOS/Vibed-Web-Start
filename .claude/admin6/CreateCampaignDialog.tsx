"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2, Users } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId?: Id<"organizations">;
}

export function CreateCampaignDialog({
  open,
  onOpenChange,
  organizationId,
}: CreateCampaignDialogProps) {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState<"draft" | "active">("draft");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedRosters, setSelectedRosters] = useState<Set<Id<"creatorRosters">>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available rosters
  const rosters = useQuery(
    api.creatorRosters.getAllRosters,
    organizationId ? { organizationId } : "skip"
  );

  const createCampaign = useMutation(api.campaigns.createCampaign);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organizationId) {
      toast.error("Organization not found");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter a campaign name");
      return;
    }

    const budgetNumber = parseFloat(budget);
    if (!budget || isNaN(budgetNumber) || budgetNumber <= 0) {
      toast.error("Please enter a valid budget");
      return;
    }

    setIsLoading(true);

    try {
      const campaignId = await createCampaign({
        organizationId,
        name: name.trim(),
        budget: budgetNumber,
        status,
        startDate: startDate ? startDate.getTime() : undefined,
        endDate: endDate ? endDate.getTime() : undefined,
      });

      // TODO: If rosters are selected, we could add those creators to the campaign
      // This would require a separate mutation or extending the createCampaign mutation

      toast.success("Campaign created successfully!");
      
      // Reset form
      setName("");
      setBudget("");
      setStatus("draft");
      setStartDate(undefined);
      setEndDate(undefined);
      setSelectedRosters(new Set());
      
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create campaign");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRoster = (rosterId: Id<"creatorRosters">) => {
    const newSelection = new Set(selectedRosters);
    if (newSelection.has(rosterId)) {
      newSelection.delete(rosterId);
    } else {
      newSelection.add(rosterId);
    }
    setSelectedRosters(newSelection);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#0f0f0f] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold">
            Create New Campaign
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Set up a new campaign to start collaborating with creators
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Campaign Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white text-sm font-medium">
                Campaign Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Summer Product Launch"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black/40 border-white/10 text-white placeholder:text-white/40"
                required
              />
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-white text-sm font-medium">
                Budget ($)
              </Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                placeholder="10000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="bg-black/40 border-white/10 text-white placeholder:text-white/40"
                required
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-white text-sm font-medium">
                Initial Status
              </Label>
              <Select value={status} onValueChange={(val: "draft" | "active") => setStatus(val)}>
                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0f0f0f] border-white/10">
                  <SelectItem value="draft" className="text-white hover:bg-white/5">
                    Draft
                  </SelectItem>
                  <SelectItem value="active" className="text-white hover:bg-white/5">
                    Active
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium">Start Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-black/40 border-white/10 text-white hover:bg-white/5",
                        !startDate && "text-white/40"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#0f0f0f] border-white/10">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm font-medium">End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-black/40 border-white/10 text-white hover:bg-white/5",
                        !endDate && "text-white/40"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#0f0f0f] border-white/10">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="text-white"
                      disabled={(date) => startDate ? date < startDate : false}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Creator Rosters */}
            <div className="space-y-2">
              <Label className="text-white text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Select Creator Rosters (Optional)
              </Label>
              <p className="text-xs text-white/40">
                Choose rosters to associate with this campaign
              </p>
              
              {rosters === undefined ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-white/40" />
                </div>
              ) : rosters.length === 0 ? (
                <div className="text-center py-8 text-white/40 text-sm">
                  No rosters available. Create a roster first.
                </div>
              ) : (
                <ScrollArea className="h-[200px] rounded-md border border-white/10 bg-black/40 p-4">
                  <div className="space-y-3">
                    {rosters.map((roster) => (
                      <div
                        key={roster._id}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Checkbox
                          id={roster._id}
                          checked={selectedRosters.has(roster._id)}
                          onCheckedChange={() => toggleRoster(roster._id)}
                          className="mt-1"
                        />
                        <label
                          htmlFor={roster._id}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="text-white text-sm font-medium">
                            {roster.name}
                          </div>
                          {roster.description && (
                            <div className="text-white/50 text-xs mt-0.5">
                              {roster.description}
                            </div>
                          )}
                          <div className="text-white/40 text-xs mt-1">
                            {roster.creatorCount || 0} creators
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-white/10 text-white hover:bg-white/5"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Campaign"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
