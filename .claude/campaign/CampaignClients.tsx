"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, UserPlus, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

interface ClientInvite {
  _id: Id<"campaignClients">;
  clientId: string;
  invitedAt: number;
  invitedBy: string;
}

interface CampaignClientsProps {
  campaignId: Id<"campaigns">;
  clients?: ClientInvite[];
  onInvite?: () => void;
}

function ClientCardSkeleton() {
  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a]">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ClientCard({ invite, onRemove }: { invite: ClientInvite; onRemove: () => void }) {
  const [isRemoving, setIsRemoving] = React.useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove();
    setIsRemoving(false);
  };

  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a] hover:border-white/20 transition-colors group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-white/80" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">
                {invite.clientId.split("|")[1] || "Client"}
              </h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500/10 text-blue-500 text-xs">
                    Client
                  </Badge>
                </div>
                <p className="text-xs text-white/40">
                  Invited {new Date(invite.invitedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={isRemoving}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-red-500 hover:bg-red-500/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function CampaignClients({ campaignId, clients, onInvite }: CampaignClientsProps) {
  const removeClient = useMutation(api.campaigns.removeClientFromCampaign);

  const handleRemove = async (clientId: string) => {
    try {
      await removeClient({ campaignId, clientId });
      toast.success("Client removed from campaign");
    } catch {
      toast.error("Failed to remove client");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Invited Clients {clients && `(${clients.length})`}
        </h2>
        {onInvite && (
          <Button
            onClick={onInvite}
            className="bg-white text-black hover:bg-white/90"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Client
          </Button>
        )}
      </div>

      {clients === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ClientCardSkeleton />
          <ClientCardSkeleton />
          <ClientCardSkeleton />
        </div>
      ) : clients.length === 0 ? (
        <Card className="bg-[#1a1a1a] border-[#3a3a3a]">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-white/40" />
              </div>
              <div>
                <p className="text-white font-medium mb-1">No clients invited</p>
                <p className="text-sm text-white/60">
                  Invite clients to view campaign performance and provide feedback
                </p>
              </div>
              {onInvite && (
                <Button
                  onClick={onInvite}
                  className="bg-white text-black hover:bg-white/90"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite First Client
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((invite) => (
            <ClientCard
              key={invite._id}
              invite={invite}
              onRemove={() => handleRemove(invite.clientId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
