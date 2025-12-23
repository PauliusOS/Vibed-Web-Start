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
import {
  Users,
  Plus,
  Trash2,
  Building2,
  Mail,
  Calendar,
  Target,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Campaign {
  _id: Id<"campaigns">;
  name: string;
  status: string;
}

interface TestClientManagerProps {
  organizationId: Id<"organizations">;
  campaigns: Campaign[];
}

// Type for test client data from the query
interface TestClientData {
  _id: Id<"userRoles">;
  userId: string;
  role: string;
  assignedAt: number;
  campaigns: Array<{ id: Id<"campaigns">; name: string } | null>;
}

export function TestClientManager({
  organizationId,
  campaigns,
}: TestClientManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    campaignId: "",
    notes: "",
  });

  // Queries and mutations
  const testClients = useQuery(api.devTools.getTestClients, { organizationId });
  const createTestClient = useMutation(api.devTools.createTestClient);
  const deleteTestClient = useMutation(api.devTools.deleteTestClient);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createTestClient({
        organizationId,
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        assignToCampaignId: formData.campaignId
          ? (formData.campaignId as Id<"campaigns">)
          : undefined,
        notes: formData.notes || undefined,
      });

      toast.success(`Test client "${formData.name}" created successfully`);
      setIsDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        campaignId: "",
        notes: "",
      });
    } catch (error) {
      toast.error("Failed to create test client");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: string) => {
    setDeletingId(userId);
    try {
      await deleteTestClient({ userId, organizationId });
      toast.success("Test client deleted successfully");
    } catch (error) {
      toast.error("Failed to delete test client");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const isLoading = testClients === undefined;

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
                  <Users className="h-5 w-5 text-blue-500" />
                  Test Clients
                </CardTitle>
                <CardDescription>
                  Create and manage test client accounts for development
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Test Client
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>Create Test Client</DialogTitle>
                      <DialogDescription>
                        Create a new test client account for previewing the client
                        experience.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="John Smith"
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
                          placeholder="john@company.com"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({ ...formData, company: e.target.value })
                          }
                          placeholder="Acme Corp"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="campaign">Assign to Campaign</Label>
                        <Select
                          value={formData.campaignId}
                          onValueChange={(value) =>
                            setFormData({ ...formData, campaignId: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a campaign (optional)" />
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
                      <div className="grid gap-2">
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
                        {isSubmitting ? "Creating..." : "Create Client"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Empty State */}
            {!isLoading && testClients?.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium mb-1">No test clients yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Create your first test client to preview the client dashboard
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Test Client
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
            {!isLoading && testClients && testClients.length > 0 && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Campaigns</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {testClients.map((client: TestClientData, index: number) => (
                        <motion.tr
                          key={client._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="group"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Users className="h-4 w-4 text-blue-500" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {client.userId.substring(0, 25)}...
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Test Client
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {client.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {client.campaigns && client.campaigns.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {client.campaigns.map((campaign: { id: Id<"campaigns">; name: string } | null) => (
                                  <Badge
                                    key={campaign?.id}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    <Target className="h-3 w-3 mr-1" />
                                    {campaign?.name}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                None
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(client.assignedAt, "MMM d, yyyy")}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(client.userId)}
                                disabled={deletingId === client.userId}
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
