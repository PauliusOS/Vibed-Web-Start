"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery, useMutation } from "convex/react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  UserCircle,
  Plus,
  Trash2,
  Calendar,
  Target,
  DollarSign,
  Users,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  IconBrandInstagram,
  IconBrandTiktok,
} from "@tabler/icons-react";

interface Campaign {
  _id: Id<"campaigns">;
  name: string;
  status: string;
}

interface TestCreatorManagerProps {
  organizationId: Id<"organizations">;
  campaigns: Campaign[];
}

// Type for test creator campaign data
interface TestCreatorCampaign {
  id: Id<"campaigns">;
  name: string;
  flatRatePerVideo?: number;
  rpmRate?: number;
  requiredVideos: number;
  status: string;
}

// Type for test creator profile data
interface TestCreatorProfile {
  platform: "instagram" | "tiktok";
  username: string;
  followerCount: number;
}

// Type for test creator wallet data
interface TestCreatorWallet {
  flatRateBalance: number;
  rpmBalance: number;
}

// Type for test creator data from the query
interface TestCreatorData {
  _id: Id<"userRoles">;
  userId: string;
  role: string;
  assignedAt: number;
  profile: TestCreatorProfile | null;
  wallet: TestCreatorWallet | null;
  campaigns: Array<TestCreatorCampaign | null>;
}

export function TestCreatorManager({
  organizationId,
  campaigns,
}: TestCreatorManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    platform: "instagram" as "instagram" | "tiktok",
    username: "",
    followerCount: 50000,
    campaignId: "",
    flatRatePerVideo: 200,
    rpmRate: 5,
    requiredVideos: 1,
    notes: "",
  });

  // Queries and mutations
  const testCreators = useQuery(api.devTools.getTestCreators, { organizationId });
  const createTestCreator = useMutation(api.devTools.createTestCreator);
  const deleteTestCreator = useMutation(api.devTools.deleteTestCreator);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createTestCreator({
        organizationId,
        name: formData.name,
        email: formData.email,
        platform: formData.platform,
        username: formData.username,
        followerCount: formData.followerCount,
        assignToCampaignId: formData.campaignId && formData.campaignId !== "none"
          ? (formData.campaignId as Id<"campaigns">)
          : undefined,
        flatRatePerVideo: formData.flatRatePerVideo || undefined,
        rpmRate: formData.rpmRate || undefined,
        requiredVideos: formData.requiredVideos || undefined,
        notes: formData.notes || undefined,
      });

      toast.success(`Test creator "${formData.name}" created successfully`);
      setIsDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        platform: "instagram",
        username: "",
        followerCount: 50000,
        campaignId: "",
        flatRatePerVideo: 200,
        rpmRate: 5,
        requiredVideos: 1,
        notes: "",
      });
    } catch (error) {
      toast.error("Failed to create test creator");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: string) => {
    setDeletingId(userId);
    try {
      await deleteTestCreator({ userId, organizationId });
      toast.success("Test creator deleted successfully");
    } catch (error) {
      toast.error("Failed to delete test creator");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  const isLoading = testCreators === undefined;

  return (
    <div className="space-y-6">
      {/* Header Card with Create Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-purple-500" />
                  Test Creators
                </CardTitle>
                <CardDescription>
                  Create and manage test creator accounts with profiles and wallets
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Test Creator
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>Create Test Creator</DialogTitle>
                      <DialogDescription>
                        Create a new test creator with a profile, wallet, and optional
                        campaign assignment with deal terms.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Basic Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                              placeholder="Jane Creator"
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                              placeholder="jane@creator.com"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Profile Info */}
                      <div className="space-y-4 pt-4 border-t">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Social Profile
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="platform">Platform *</Label>
                            <Select
                              value={formData.platform}
                              onValueChange={(value: "instagram" | "tiktok") =>
                                setFormData({ ...formData, platform: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="instagram">
                                  <div className="flex items-center gap-2">
                                    <IconBrandInstagram className="h-4 w-4" />
                                    Instagram
                                  </div>
                                </SelectItem>
                                <SelectItem value="tiktok">
                                  <div className="flex items-center gap-2">
                                    <IconBrandTiktok className="h-4 w-4" />
                                    TikTok
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="username">Username *</Label>
                            <Input
                              id="username"
                              value={formData.username}
                              onChange={(e) =>
                                setFormData({ ...formData, username: e.target.value })
                              }
                              placeholder="@janecreator"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="followers">Follower Count</Label>
                          <Input
                            id="followers"
                            type="number"
                            value={formData.followerCount}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                followerCount: parseInt(e.target.value) || 0,
                              })
                            }
                            placeholder="50000"
                          />
                        </div>
                      </div>

                      {/* Campaign Assignment */}
                      <div className="space-y-4 pt-4 border-t">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Campaign Assignment (Optional)
                        </h4>
                        <div className="grid gap-2">
                          <Label htmlFor="campaign">Assign to Campaign</Label>
                          <Select
                            value={formData.campaignId}
                            onValueChange={(value) =>
                              setFormData({ ...formData, campaignId: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a campaign" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No campaign</SelectItem>
                              {campaigns.map((campaign) => (
                                <SelectItem
                                  key={campaign._id}
                                  value={campaign._id}
                                >
                                  {campaign.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {formData.campaignId && formData.campaignId !== "none" && (
                          <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="flatRate">Flat Rate/Video ($)</Label>
                              <Input
                                id="flatRate"
                                type="number"
                                value={formData.flatRatePerVideo}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    flatRatePerVideo: parseInt(e.target.value) || 0,
                                  })
                                }
                                placeholder="200"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="rpm">RPM Rate ($)</Label>
                              <Input
                                id="rpm"
                                type="number"
                                value={formData.rpmRate}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    rpmRate: parseInt(e.target.value) || 0,
                                  })
                                }
                                placeholder="5"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="videos">Required Videos</Label>
                              <Input
                                id="videos"
                                type="number"
                                value={formData.requiredVideos}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    requiredVideos: parseInt(e.target.value) || 1,
                                  })
                                }
                                placeholder="1"
                                min={1}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      <div className="grid gap-2 pt-4 border-t">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) =>
                            setFormData({ ...formData, notes: e.target.value })
                          }
                          placeholder="Any additional notes..."
                          rows={2}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Creator"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Empty State */}
            {!isLoading && testCreators?.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                  <UserCircle className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-lg font-medium mb-1">No test creators yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Create your first test creator to preview the creator dashboard
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Test Creator
                </Button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Table */}
            {!isLoading && testCreators && testCreators.length > 0 && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Creator</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Followers</TableHead>
                      <TableHead>Campaigns</TableHead>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {testCreators.map((creator: TestCreatorData, index: number) => (
                        <motion.tr
                          key={creator._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="group"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-purple-500/10 text-purple-500">
                                  {creator.profile?.username?.slice(0, 2).toUpperCase() || "TC"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">
                                  @{creator.profile?.username || "unknown"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {creator.userId.substring(0, 20)}...
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "capitalize",
                                creator.profile?.platform === "instagram"
                                  ? "border-pink-500/50 text-pink-500"
                                  : "border-cyan-500/50 text-cyan-500"
                              )}
                            >
                              {creator.profile?.platform === "instagram" ? (
                                <IconBrandInstagram className="h-3 w-3 mr-1" />
                              ) : (
                                <IconBrandTiktok className="h-3 w-3 mr-1" />
                              )}
                              {creator.profile?.platform || "unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">
                                {formatFollowers(creator.profile?.followerCount || 0)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {creator.campaigns && creator.campaigns.length > 0 ? (
                              <div className="space-y-1">
                                {creator.campaigns.map((campaign: TestCreatorCampaign | null) => (
                                  <div
                                    key={campaign?.id}
                                    className="flex items-center gap-2"
                                  >
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      <Target className="h-3 w-3 mr-1" />
                                      {campaign?.name}
                                    </Badge>
                                    {campaign?.flatRatePerVideo && (
                                      <span className="text-xs text-muted-foreground">
                                        ${campaign.flatRatePerVideo}/vid
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                None
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {creator.wallet ? (
                              <div className="flex items-center gap-1 text-sm">
                                <DollarSign className="h-3 w-3 text-green-500" />
                                <span>
                                  {(
                                    (creator.wallet.flatRateBalance || 0) +
                                    (creator.wallet.rpmBalance || 0)
                                  ).toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                N/A
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(creator.assignedAt, "MMM d, yyyy")}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(creator.userId)}
                                disabled={deletingId === creator.userId}
                                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
