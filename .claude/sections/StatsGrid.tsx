import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Target, Award } from "lucide-react";

const stats = [
  {
    label: "Influencers in Network",
    value: "500+",
    description: "Across all niches and platforms",
    icon: Users,
  },
  {
    label: "Collective Reach",
    value: "50M+",
    description: "Combined follower count",
    icon: TrendingUp,
  },
  {
    label: "Successful Campaigns",
    value: "10K+",
    description: "Delivered with measurable ROI",
    icon: Target,
  },
  {
    label: "Client Satisfaction",
    value: "98%",
    description: "Would recommend us",
    icon: Award,
  },
];

export function StatsGrid() {
  return (
    <section className="py-16 bg-muted/30" role="region" aria-label="Platform statistics">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Trusted by Brands Worldwide
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our network connects you with the perfect influencers for your brand
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-6 space-y-4">
                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>

                  {/* Value */}
                  <div className="text-3xl font-semibold">
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="text-sm font-medium">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
