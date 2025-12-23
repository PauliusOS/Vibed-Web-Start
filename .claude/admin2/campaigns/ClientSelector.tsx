"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building,
  Plus,
  X,
  Search,
  User,
  Loader2,
  AlertTriangle,
  Info,
} from "lucide-react";

interface ClientAssignment {
  _id: Id<"campaignClients">;
  clientId: string;
  invitedAt: number;
}

interface ClientSelectorProps {
  campaignId: Id<"campaigns">;
  organizationId: Id<"organizations">;
  assignedClients: ClientAssignment[];
}

export function ClientSelector({
  campaignId,
  organizationId,
  assignedClients,
}: ClientSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingClient, setAddingClient] = useState<string | null>(null);
  const [removingClient, setRemovingClient] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get all clients in organization
  const organizationClients = useQuery(api.clients.getOrganizationClients, {
    organizationId,
  });

  // Mutations
  const inviteClient = useMutation(api.campaigns.inviteClientToCampaign);
  const removeClient = useMutation(api.campaigns.removeClientFromCampaign);

  // Filter out already assigned clients
  const assignedClientIds = new Set(assignedClients.map((c) => c.clientId));

  const availableClients = (organizationClients || []).filter(
    (client) => !assignedClientIds.has(client.userId)
  );

  const filteredClients = availableClients.filter((client) =>
    client.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = async (clientId: string) => {
    setAddingClient(clientId);
    setError(null);
    try {
      await inviteClient({
        campaignId,
        clientId,
      });
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error adding client:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to add client. Clients can only be assigned to one campaign at a time."
      );
    } finally {
      setAddingClient(null);
    }
  };

  const handleRemoveClient = async (clientId: string) => {
    setRemovingClient(clientId);
    try {
      await removeClient({
        campaignId,
        clientId,
      });
    } catch (error) {
      console.error("Error removing client:", error);
    } finally {
      setRemovingClient(null);
    }
  };

  const getClientName = (clientId: string): string => {
    // Extract username from Clerk ID if possible
    const parts = clientId.split("|");
    return parts[1] || clientId.slice(0, 8) + "...";
  };

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Client</h3>
          {assignedClients.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
              Assigned
            </span>
          )}
        </div>

        {assignedClients.length === 0 && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Assign Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-[#0a0a0a] border-white/[0.06]">
              <DialogHeader>
                <DialogTitle className="text-white">Assign Client</DialogTitle>
              </DialogHeader>

              {/* Info */}
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-400 mt-0.5" />
                  <p className="text-xs text-blue-400/80">
                    Each client can only be assigned to one campaign. The client will
                    have read-only access to view campaign progress and provide
                    feedback.
                  </p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                    <p className="text-xs text-red-400">{error}</p>
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/[0.02] border-white/[0.06] text-white"
                />
              </div>

              {/* Client List */}
              <div className="max-h-[250px] overflow-y-auto space-y-2">
                {organizationClients === undefined ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-white/40" />
                  </div>
                ) : filteredClients.length === 0 ? (
                  <div className="text-center py-8 text-white/40">
                    <Building className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No available clients</p>
                    <p className="text-xs mt-1">
                      All clients are already assigned to campaigns
                    </p>
                  </div>
                ) : (
                  filteredClients.map((client) => (
                    <div
                      key={client.userId}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {getClientName(client.userId)}
                          </p>
                          <p className="text-xs text-white/40">
                            {client.campaignCount || 0} campaigns
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddClient(client.userId)}
                        disabled={addingClient === client.userId}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        {addingClient === client.userId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Assign"
                        )}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Assigned Client */}
      <div className="space-y-3">
        {assignedClients.length === 0 ? (
          <div className="text-center py-8 text-white/40">
            <Building className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No client assigned</p>
            <p className="text-xs mt-1">
              Assign a client to give them access to this campaign
            </p>
          </div>
        ) : (
          assignedClients.map((assignment) => (
            <div
              key={assignment._id}
              className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {getClientName(assignment.clientId)}
                  </p>
                  <p className="text-xs text-white/40">
                    Assigned {new Date(assignment.invitedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveClient(assignment.clientId)}
                disabled={removingClient === assignment.clientId}
                className="text-white/40 hover:text-red-400"
              >
                {removingClient === assignment.clientId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Info about client access */}
      {assignedClients.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5" />
            <p className="text-xs text-blue-400/80">
              The client has read-only access to view campaign progress, creator
              performance, and can provide feedback on content.
            </p>
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
