"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Users,
  UserCircle,
  Zap,
  Target,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Campaign {
  _id: Id<"campaigns">;
  name: string;
  status: string;
}

interface BulkDataGeneratorProps {
  organizationId: Id<"organizations">;
  campaigns: Campaign[];
}

export function BulkDataGenerator({
  organizationId,
  campaigns,
}: BulkDataGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    clientsCreated: number;
    creatorsCreated: number;
  } | null>(null);

  // Form state
  const [clientCount, setClientCount] = useState(5);
  const [creatorCount, setCreatorCount] = useState(10);
  const [campaignId, setCampaignId] = useState("");

  const bulkCreateTestData = useMutation(api.devTools.bulkCreateTestData);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setResult(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const data = await bulkCreateTestData({
        organizationId,
        clientCount,
        creatorCount,
        assignToCampaignId: campaignId && campaignId !== "none"
          ? (campaignId as Id<"campaigns">)
          : undefined,
      });

      clearInterval(progressInterval);
      setProgress(100);
      setResult({
        clientsCreated: data.clientsCreated,
        creatorsCreated: data.creatorsCreated,
      });

      toast.success(
        `Generated ${data.clientsCreated} clients and ${data.creatorsCreated} creators`
      );
    } catch (error) {
      toast.error("Failed to generate test data");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const totalUsers = clientCount + creatorCount;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Bulk Data Generator
            </CardTitle>
            <CardDescription>
              Quickly generate multiple test clients and creators with random data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Configuration */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column - Settings */}
              <div className="space-y-6">
                {/* Client Count */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      Test Clients
                    </Label>
                    <span className="text-2xl font-bold">{clientCount}</span>
                  </div>
                  <Slider
                    value={[clientCount]}
                    onValueChange={([value]) => setClientCount(value)}
                    min={0}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Create {clientCount} test client accounts with random names and
                    emails
                  </p>
                </div>

                {/* Creator Count */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4 text-purple-500" />
                      Test Creators
                    </Label>
                    <span className="text-2xl font-bold">{creatorCount}</span>
                  </div>
                  <Slider
                    value={[creatorCount]}
                    onValueChange={([value]) => setCreatorCount(value)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Create {creatorCount} test creator accounts with random profiles
                    and wallets
                  </p>
                </div>

                {/* Campaign Assignment */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    Assign to Campaign
                  </Label>
                  <Select value={campaignId} onValueChange={setCampaignId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a campaign (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No campaign</SelectItem>
                      {campaigns.map((campaign) => (
                        <SelectItem key={campaign._id} value={campaign._id}>
                          {campaign.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Optionally assign all generated users to a specific campaign
                  </p>
                </div>
              </div>

              {/* Right Column - Preview */}
              <div className="space-y-6">
                {/* Preview Card */}
                <Card className="border-dashed">
                  <CardContent className="p-6">
                    <h4 className="text-sm font-medium mb-4">Generation Preview</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-muted-foreground">Test Clients</span>
                        <span className="font-medium">{clientCount}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-muted-foreground">Test Creators</span>
                        <span className="font-medium">{creatorCount}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-muted-foreground">Campaign</span>
                        <span className="font-medium">
                          {campaignId && campaignId !== "none"
                            ? campaigns.find((c) => c._id === campaignId)?.name
                            : "None"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="font-medium">Total Users</span>
                        <span className="text-2xl font-bold text-primary">
                          {totalUsers}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* What will be created */}
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium mb-3">
                      Each test user includes:
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Random name from preset list
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Auto-generated email
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        User role and permissions
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        (Creators) Social profile with random followers
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        (Creators) Wallet with $0 balance
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        (If campaign) Deal terms with random rates
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Progress Bar */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span>Generating test data...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </motion.div>
            )}

            {/* Result */}
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-lg bg-green-500/10 border border-green-500/20 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-green-500">
                      Generation Complete!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created {result.clientsCreated} clients and{" "}
                      {result.creatorsCreated} creators
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Generate Button */}
            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating || totalUsers === 0}
                className="min-w-[200px]"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate {totalUsers} Users
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="border-dashed">
          <CardContent className="p-6">
            <h4 className="font-medium mb-4">Tips for Testing</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-500 font-bold text-sm">1</span>
                </div>
                <p className="text-sm font-medium">Start Small</p>
                <p className="text-xs text-muted-foreground">
                  Generate 5-10 users first to test your workflows before scaling up
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <span className="text-purple-500 font-bold text-sm">2</span>
                </div>
                <p className="text-sm font-medium">Use Campaigns</p>
                <p className="text-xs text-muted-foreground">
                  Assign to campaigns to test the full user journey and deal flows
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <span className="text-green-500 font-bold text-sm">3</span>
                </div>
                <p className="text-sm font-medium">Clean Up</p>
                <p className="text-xs text-muted-foreground">
                  Use the Overview tab to delete all test data when done testing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
