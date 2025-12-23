"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconChartBar, IconActivity, IconEye, IconHistory } from "@tabler/icons-react";
import { MetricControl } from "./MetricControl";
import { ActivityCreator } from "./ActivityCreator";
import { CurrentStatsDisplay } from "./CurrentStatsDisplay";
import { RecentActivitiesList } from "./RecentActivitiesList";

export function SuperAdminControls() {
  const [activeTab, setActiveTab] = useState("stats");

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <IconChartBar className="h-4 w-4" />
            Platform Stats
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <IconActivity className="h-4 w-4" />
            Activity Feed
          </TabsTrigger>
        </TabsList>

        {/* Stats Editor Tab */}
        <TabsContent value="stats" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left Column: Stat Controls (60%) */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconChartBar className="h-5 w-5 text-primary" />
                    Edit Platform Metrics
                  </CardTitle>
                  <CardDescription>
                    Adjust each metric using sliders or direct input. Changes apply immediately.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <MetricControl
                    metricType="creatorsOnline"
                    label="Creators Online"
                    description="Number of creators currently online"
                    min={0}
                    max={2000}
                    step={10}
                    defaultValue={480}
                  />

                  <MetricControl
                    metricType="totalCreators"
                    label="Total Creators"
                    description="Total registered creators on the platform"
                    min={0}
                    max={10000}
                    step={50}
                    defaultValue={757}
                  />

                  <MetricControl
                    metricType="activeCampaigns"
                    label="Active Campaigns"
                    description="Number of currently running campaigns"
                    min={0}
                    max={100}
                    step={1}
                    defaultValue={24}
                  />

                  <MetricControl
                    metricType="totalViews"
                    label="Total Views"
                    description="Total video views across the platform"
                    min={0}
                    max={100000000}
                    step={100000}
                    defaultValue={6620000}
                    formatValue={(val) => {
                      if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M`;
                      if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                      return val.toString();
                    }}
                  />

                  <MetricControl
                    metricType="totalVideos"
                    label="Total Videos"
                    description="Total videos posted on the platform"
                    min={0}
                    max={10000}
                    step={10}
                    defaultValue={1248}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Live Preview (40%) */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconEye className="h-5 w-5 text-primary" />
                    Live Preview
                  </CardTitle>
                  <CardDescription>
                    See how stats appear on the homepage in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CurrentStatsDisplay />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Activity Feed Tab */}
        <TabsContent value="activity" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left Column: Activity Creator (60%) */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconActivity className="h-5 w-5 text-primary" />
                    Create Activity
                  </CardTitle>
                  <CardDescription>
                    Add new activities to the homepage feed manually
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityCreator />
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Recent Activities (40%) */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconHistory className="h-5 w-5 text-primary" />
                    Recent Activities
                  </CardTitle>
                  <CardDescription>
                    Manage and delete activities from the feed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentActivitiesList />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
