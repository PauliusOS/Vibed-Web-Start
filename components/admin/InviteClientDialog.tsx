"use client";

import { UserPlus, Mail } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@/lib/contexts/OrganizationContext";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function InviteClientDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedOrganizationId } = useOrganization();

  // Query existing clients
  const clients = useQuery(
    api.clients.getOrganizationClients,
    selectedOrganizationId ? { organizationId: selectedOrganizationId } : "skip"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    if (!selectedOrganizationId) {
      toast.error("Please select an organization first");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement the actual invitation logic
      // This would typically involve:
      // 1. Sending an invitation email
      // 2. Creating a pending invitation record
      // 3. Giving the client access to the organization

      toast.success(`Invitation sent to ${email}`);
      setEmail("");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to send invitation");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="transition-colors duration-200">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-semibold text-foreground">
            Invite Client
          </DialogTitle>
          <DialogDescription className="text-sm leading-6 text-muted-foreground">
            Invite clients to view and provide feedback on campaigns. They will receive
            an email with instructions to access their campaigns.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex w-full items-center space-x-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="inviteEmail"
                className="h-10 pl-9"
                placeholder="client@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" className="h-10" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Invite"}
            </Button>
          </div>
        </form>

        {clients && clients.length > 0 && (
          <>
            <h4 className="mt-4 text-sm font-medium text-foreground">
              Existing Clients ({clients.length})
            </h4>
            <div className="max-h-[300px] overflow-y-auto">
              <ul className="divide-y">
                {clients.map((client) => (
                  <li
                    key={client._id}
                    className="flex items-center justify-between py-2.5"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-blue-500/10 text-blue-500">
                          {client.userId.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {client.userId}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {client.campaignCount} {client.campaignCount === 1 ? 'campaign' : 'campaigns'}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-blue-500/10 text-blue-500 text-xs font-medium border-blue-500/20"
                    >
                      Client
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
