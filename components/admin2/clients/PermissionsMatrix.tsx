"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  BarChart3,
  CheckCircle,
  DollarSign,
  MoreVertical,
  Settings,
  UserMinus,
  Shield,
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: string;
}

interface ClientPermissions {
  hasAllCampaignsAccess: boolean;
  allowedCampaignIds: string[];
  canViewAnalytics: boolean;
  canApproveVideos: boolean;
  canManagePayments: boolean;
}

interface Client {
  userId: string;
  role: string;
  assignedAt: number;
  permissions: ClientPermissions;
  assignedCampaigns: Campaign[];
}

interface PermissionsMatrixProps {
  clients: Client[] | undefined;
  campaigns: Campaign[] | undefined;
  isLoading?: boolean;
  onUpdatePermissions: (clientId: string, permissions: ClientPermissions) => void;
  onEditClient: (client: Client) => void;
}

export function PermissionsMatrix({
  clients,
  campaigns,
  isLoading,
  onUpdatePermissions,
  onEditClient,
}: PermissionsMatrixProps) {
  if (isLoading) {
    return (
      <GlassPanel className="p-6">
        <Skeleton className="h-6 w-48 mb-6" />
        <Skeleton className="h-[400px] w-full" />
      </GlassPanel>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <GlassPanel className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Client Permissions</h3>
        </div>
        <div className="h-[300px] flex flex-col items-center justify-center text-white/40">
          <Shield className="w-12 h-12 mb-4 opacity-30" />
          <p>No clients to manage</p>
          <p className="text-sm mt-1">Invite clients to campaigns to manage their permissions</p>
        </div>
      </GlassPanel>
    );
  }

  const getPermissionLevel = (permissions: ClientPermissions) => {
    if (permissions.hasAllCampaignsAccess && permissions.canApproveVideos && permissions.canManagePayments) {
      return { label: "Full Access", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
    }
    if (permissions.canApproveVideos) {
      return { label: "Approve Videos", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
    }
    if (permissions.canViewAnalytics) {
      return { label: "Analytics", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" };
    }
    return { label: "View Only", color: "bg-white/10 text-white/60 border-white/20" };
  };

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Client Permissions Matrix</h3>
        </div>
        <p className="text-sm text-white/60">{clients.length} clients</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-white/60">Client</TableHead>
              <TableHead className="text-white/60">Permission Level</TableHead>
              <TableHead className="text-white/60 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </div>
              </TableHead>
              <TableHead className="text-white/60 text-center">
                <div className="flex items-center justify-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </div>
              </TableHead>
              <TableHead className="text-white/60 text-center">
                <div className="flex items-center justify-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve</span>
                </div>
              </TableHead>
              <TableHead className="text-white/60 text-center">
                <div className="flex items-center justify-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>Payments</span>
                </div>
              </TableHead>
              <TableHead className="text-white/60">Campaigns</TableHead>
              <TableHead className="text-white/60 w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => {
              const permissionLevel = getPermissionLevel(client.permissions);
              return (
                <TableRow key={client.userId} className="border-white/5 hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-purple-600 text-white text-xs">
                          {client.userId.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {client.userId.slice(0, 12)}...
                        </p>
                        <p className="text-xs text-white/40">
                          Added {new Date(client.assignedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={permissionLevel.color}>
                      {permissionLevel.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={client.permissions.canViewAnalytics}
                      onCheckedChange={(checked) =>
                        onUpdatePermissions(client.userId, {
                          ...client.permissions,
                          canViewAnalytics: checked,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={client.permissions.canApproveVideos}
                      onCheckedChange={(checked) =>
                        onUpdatePermissions(client.userId, {
                          ...client.permissions,
                          canApproveVideos: checked,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={client.permissions.canManagePayments}
                      onCheckedChange={(checked) =>
                        onUpdatePermissions(client.userId, {
                          ...client.permissions,
                          canManagePayments: checked,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {client.permissions.hasAllCampaignsAccess ? (
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                        All Campaigns
                      </Badge>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {client.assignedCampaigns.slice(0, 2).map((campaign) => (
                          <Badge
                            key={campaign.id}
                            variant="outline"
                            className="border-white/20 text-white/80 text-xs"
                          >
                            {campaign.name.length > 12
                              ? campaign.name.slice(0, 12) + "..."
                              : campaign.name}
                          </Badge>
                        ))}
                        {client.assignedCampaigns.length > 2 && (
                          <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                            +{client.assignedCampaigns.length - 2}
                          </Badge>
                        )}
                        {client.assignedCampaigns.length === 0 && (
                          <span className="text-white/40 text-xs">None</span>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4 text-white/60" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-900 border-white/10">
                        <DropdownMenuItem
                          className="text-white/80 hover:text-white focus:text-white"
                          onClick={() => onEditClient(client)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Edit Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:text-red-300 focus:text-red-300">
                          <UserMinus className="w-4 h-4 mr-2" />
                          Remove Client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </GlassPanel>
  );
}
