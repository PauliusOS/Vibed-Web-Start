"use client";

import { TrendingUp, Users, Target, BarChart3 } from "lucide-react";

export function AnalyticsDashboard() {
  return (
    <section className="relative py-24 lg:py-32 cobrand-navy overflow-hidden">
      <div className="container relative z-10 px-6 mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-headline-2 mb-6">
              Decisions driven by data,
              <br />
              <span className="text-primary">not assumptions</span>
            </h2>
            <p className="text-body-large max-w-2xl mx-auto">
              Every campaign is powered by real-time analytics, comprehensive tracking, and actionable insights that help you optimize for maximum ROI.
            </p>
          </div>

          {/* Dashboard Preview Grid */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Main Dashboard Card */}
            <div className="lg:col-span-2 card-base p-0 overflow-hidden">
              <div className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-title-2">Campaign Performance</h3>
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>+24.5% vs last month</span>
                  </div>
                </div>

                {/* Simulated chart area */}
                <div className="h-64 bg-cobrand-navy-light rounded-xl flex items-end justify-around p-4 gap-2">
                  {[65, 45, 78, 92, 58, 83, 95, 72, 88, 70, 85, 98].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-primary to-blue-400 rounded-t transition-all duration-300 hover:opacity-80"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="card-base">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-body-small mb-1">Total Reach</p>
                  <p className="text-3xl font-bold mb-1">2.4M</p>
                  <p className="text-caption text-green-400">+18% this week</p>
                </div>
              </div>
            </div>

            <div className="card-base">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Target className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-body-small mb-1">Engagement Rate</p>
                  <p className="text-3xl font-bold mb-1">8.7%</p>
                  <p className="text-caption text-green-400">Above industry avg</p>
                </div>
              </div>
            </div>

            <div className="card-base">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-body-small mb-1">Conversions</p>
                  <p className="text-3xl font-bold mb-1">1,247</p>
                  <p className="text-caption text-green-400">+32% this month</p>
                </div>
              </div>
            </div>

            <div className="card-base">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-body-small mb-1">ROI</p>
                  <p className="text-3xl font-bold mb-1">347%</p>
                  <p className="text-caption text-green-400">Best performing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature List */}
          <div className="mt-12 lg:mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Real-time tracking", desc: "Monitor every post as it happens" },
              { title: "Custom reports", desc: "Generate insights that matter" },
              { title: "Competitor analysis", desc: "Stay ahead of the curve" },
              { title: "Predictive AI", desc: "Forecast campaign outcomes" }
            ].map((feature, i) => (
              <div key={i} className="space-y-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mb-3" />
                <h4 className="text-body font-semibold text-white">{feature.title}</h4>
                <p className="text-body-small">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
