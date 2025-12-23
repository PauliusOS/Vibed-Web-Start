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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CountAnimation } from "@/components/ui/count-animation";
import {
  Users,
  UserCircle,
  FlaskConical,
  Trash2,
  ExternalLink,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DevToolsOverviewProps {
  stats: {
    testClientCount: number;
    testCreatorCount: number;
    totalTestUsers: number;
  } | undefined;
  organizationId: Id<"organizations">;
}

const statCards = [
  {
    key: "testClientCount",
    title: "Test Clients",
    icon: Users,
    colorScheme: "blue",
    description: "Active test client accounts",
  },
  {
    key: "testCreatorCount",
    title: "Test Creators",
    icon: UserCircle,
    colorScheme: "cyan",
    description: "Active test creator accounts",
  },
  {
    key: "totalTestUsers",
    title: "Total Test Users",
    icon: FlaskConical,
    colorScheme: "green",
    description: "Combined test accounts",
  },
];

const colorConfig = {
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/20",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-500",
    border: "border-cyan-500/20",
  },
  green: {
    bg: "bg-green-500/10",
    text: "text-green-500",
    border: "border-green-500/20",
  },
};

export function DevToolsOverview({ stats, organizationId }: DevToolsOverviewProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteAllTestData = useMutation(api.devTools.deleteAllTestData);

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAllTestData({ organizationId });
      toast.success(
        `Deleted ${result.totalDeleted} test users (${result.deletedClients} clients, ${result.deletedCreators} creators)`
      );
    } catch (error) {
      toast.error("Failed to delete test data");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((card, index) => {
          const colors = colorConfig[card.colorScheme as keyof typeof colorConfig];
          const value = stats?.[card.key as keyof typeof stats] || 0;

          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className={cn("relative overflow-hidden", colors.border)}>
                {/* Gradient background */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-30",
                    colors.bg
                  )}
                />
                <CardContent className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {card.title}
                      </p>
                      <p className="text-4xl font-bold tracking-tight">
                        <CountAnimation value={value} duration={1.5} />
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        {card.description}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "h-14 w-14 rounded-xl flex items-center justify-center",
                        colors.bg
                      )}
                    >
                      <card.icon className={cn("h-7 w-7", colors.text)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common actions for managing test data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preview Links */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-dashed">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Preview Client Dashboard</p>
                      <p className="text-sm text-muted-foreground">
                        See how clients view their dashboard
                      </p>
                    </div>
                    <Link href="/client" target="_blank">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Preview Creator Dashboard</p>
                      <p className="text-sm text-muted-foreground">
                        See how creators view their dashboard
                      </p>
                    </div>
                    <Link href="/creator" target="_blank">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-red-500">Danger Zone</p>
                  <p className="text-sm text-muted-foreground">
                    Delete all test data from this organization
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting || (stats?.totalTestUsers || 0) === 0}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All Test Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all{" "}
                        <span className="font-semibold text-foreground">
                          {stats?.totalTestUsers || 0} test users
                        </span>{" "}
                        ({stats?.testClientCount || 0} clients and{" "}
                        {stats?.testCreatorCount || 0} creators) and all their
                        associated data. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAll}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        {isDeleting ? "Deleting..." : "Delete All"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>How Test Data Works</CardTitle>
            <CardDescription>
              Understanding the test data system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-500 font-bold">1</span>
                </div>
                <h4 className="font-medium">Create Test Users</h4>
                <p className="text-sm text-muted-foreground">
                  Use the Test Clients or Test Creators tabs to create individual
                  test accounts, or use Bulk Generate for multiple at once.
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <span className="text-cyan-500 font-bold">2</span>
                </div>
                <h4 className="font-medium">Assign to Campaigns</h4>
                <p className="text-sm text-muted-foreground">
                  Optionally assign test users to specific campaigns to test
                  different scenarios and user experiences.
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <span className="text-green-500 font-bold">3</span>
                </div>
                <h4 className="font-medium">Preview & Test</h4>
                <p className="text-sm text-muted-foreground">
                  Use the preview links to see how the dashboards appear. Test
                  users are isolated and can be deleted without affecting real data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
