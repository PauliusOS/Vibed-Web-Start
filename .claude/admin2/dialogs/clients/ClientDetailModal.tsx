"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "motion/react";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  Edit,
  Trash2,
  Briefcase,
  BarChart3,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Shield,
  Eye,
  Video,
  FileText,
  Activity,
} from "lucide-react";

interface Client {
  _id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  description?: string;
  avatar?: string;
  createdAt: number;
  permissions: {
    viewCampaigns: boolean;
    viewCreators: boolean;
    viewAnalytics: boolean;
    approveBriefs: boolean;
    approveVideos: boolean;
  };
}

interface ClientDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ClientDetailModal({
  open,
  onOpenChange,
  client,
  onEdit,
  onDelete,
}: ClientDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for demonstration
  const stats = {
    campaigns: 8,
    activeCampaigns: 3,
    totalSpent: 45600,
    videosApproved: 42,
    briefsApproved: 12,
    messagesReceived: 28,
  };

  const campaigns = [
    {
      _id: "1",
      name: "Summer Launch 2024",
      status: "active",
      budget: 15000,
      creatorCount: 5,
      videoCount: 12,
      startDate: Date.now() - 15 * 24 * 60 * 60 * 1000,
    },
    {
      _id: "2",
      name: "Product Review Series",
      status: "active",
      budget: 8500,
      creatorCount: 3,
      videoCount: 8,
      startDate: Date.now() - 20 * 24 * 60 * 60 * 1000,
    },
    {
      _id: "3",
      name: "Brand Story Campaign",
      status: "completed",
      budget: 12000,
      creatorCount: 4,
      videoCount: 10,
      startDate: Date.now() - 45 * 24 * 60 * 60 * 1000,
    },
  ];

  const activities = [
    {
      id: "1",
      type: "video_approved",
      description: "Approved video from Sarah Johnson",
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      metadata: { videoTitle: "Product Review #3" },
    },
    {
      id: "2",
      type: "brief_approved",
      description: "Approved campaign brief for Summer Launch",
      timestamp: Date.now() - 5 * 60 * 60 * 1000,
    },
    {
      id: "3",
      type: "message_sent",
      description: "Sent message to campaign team",
      timestamp: Date.now() - 8 * 60 * 60 * 1000,
    },
    {
      id: "4",
      type: "video_revision",
      description: "Requested revision on video from Mike Chen",
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
      metadata: { reason: "Audio quality improvement needed" },
    },
  ];

  const messages = [
    {
      id: "1",
      from: "Admin",
      message: "Your campaign brief has been approved and is ready to go!",
      timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
      read: true,
    },
    {
      id: "2",
      from: client.contactName,
      message: "Thank you! When can we expect the first videos?",
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      read: true,
    },
    {
      id: "3",
      from: "Admin",
      message: "Creators are scheduled to submit videos by end of this week.",
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      read: true,
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "video_approved":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "video_revision":
        return <Clock className="w-4 h-4 text-amber-400" />;
      case "brief_approved":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "message_sent":
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
      default:
        return <Activity className="w-4 h-4 text-white/60" />;
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (60 * 60 * 1000));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

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
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={client.avatar} />
                <AvatarFallback className="bg-green-500/20 text-green-400 text-xl">
                  {client.companyName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{client.companyName}</DialogTitle>
                <DialogDescription className="mt-1">
                  {client.contactName} • {client.email}
                </DialogDescription>
                <div className="flex items-center gap-4 mt-2 text-xs text-white/60">
                  {client.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.website && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button onClick={onEdit} variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  onClick={onDelete}
                  variant="outline"
                  size="sm"
                  className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="bg-white/[0.02] border-b border-white/[0.06] rounded-none w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto py-4">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 m-0">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    <span className="text-white/60 text-sm">Total Campaigns</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.campaigns}</p>
                  <p className="text-xs text-green-400 mt-1">
                    {stats.activeCampaigns} active
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-white/60 text-sm">Total Spent</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    ${stats.totalSpent.toLocaleString()}
                  </p>
                  <p className="text-xs text-white/60 mt-1">Across all campaigns</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="w-4 h-4 text-purple-400" />
                    <span className="text-white/60 text-sm">Videos Approved</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {stats.videosApproved}
                  </p>
                  <p className="text-xs text-white/60 mt-1">Since account creation</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-white/60 text-sm">Briefs Approved</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {stats.briefsApproved}
                  </p>
                  <p className="text-xs text-white/60 mt-1">Campaign briefs</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-green-400" />
                    <span className="text-white/60 text-sm">Messages</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {stats.messagesReceived}
                  </p>
                  <p className="text-xs text-white/60 mt-1">Total messages</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-white/60 text-sm">Member Since</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-white/60 mt-1">Account created</p>
                </motion.div>
              </div>

              {/* Description */}
              {client.description && (
                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <h4 className="text-white font-medium mb-2">About</h4>
                  <p className="text-white/80 text-sm">{client.description}</p>
                </div>
              )}
            </TabsContent>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-4 m-0">
              {campaigns.map((campaign, index) => {
                const config = statusConfig[campaign.status as keyof typeof statusConfig];
                return (
                  <motion.div
                    key={campaign._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium mb-1">{campaign.name}</h4>
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded ${config.bg}`}>
                          <span className={`text-xs ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-white/60 text-xs mb-1">Budget</p>
                        <p className="text-white font-medium">
                          ${campaign.budget.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs mb-1">Creators</p>
                        <p className="text-white font-medium">
                          {campaign.creatorCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs mb-1">Videos</p>
                        <p className="text-white font-medium">{campaign.videoCount}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs mb-1">Started</p>
                        <p className="text-white font-medium">
                          {new Date(campaign.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-3 m-0">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">{activity.description}</p>
                    {activity.metadata && (
                      <p className="text-white/60 text-xs mt-1">
                        {JSON.stringify(activity.metadata)}
                      </p>
                    )}
                    <p className="text-white/40 text-xs mt-1">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions" className="m-0">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    {client.permissions.viewCampaigns ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-white/40" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">View Campaigns</p>
                    <p className="text-white/60 text-xs">
                      Can view campaign details and status
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    {client.permissions.viewCreators ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-white/40" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">View Creators</p>
                    <p className="text-white/60 text-xs">
                      Can view creator profiles and details
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    {client.permissions.viewAnalytics ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-white/40" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">View Analytics</p>
                    <p className="text-white/60 text-xs">
                      Can view performance analytics and reports
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    {client.permissions.approveBriefs ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-white/40" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Approve Briefs</p>
                    <p className="text-white/60 text-xs">
                      Can approve campaign briefs and content guidelines
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    {client.permissions.approveVideos ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-white/40" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Approve Videos</p>
                    <p className="text-white/60 text-xs">
                      Can approve or request revisions on videos
                    </p>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <Shield className="w-4 h-4 mr-2" />
                  Edit Permissions
                </Button>
              </div>
            </TabsContent>

            {/* Communication Tab */}
            <TabsContent value="communication" className="space-y-4 m-0">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${
                    message.from === client.contactName
                      ? "bg-blue-500/10 border-blue-500/30 ml-8"
                      : "bg-white/[0.02] border-white/[0.06] mr-8"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback
                        className={
                          message.from === client.contactName
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-purple-500/20 text-purple-400"
                        }
                      >
                        {message.from.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-medium text-sm">
                          {message.from}
                        </p>
                        <p className="text-white/40 text-xs">
                          {formatTimeAgo(message.timestamp)}
                        </p>
                      </div>
                      <p className="text-white/80 text-sm">{message.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send New Message
              </Button>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
