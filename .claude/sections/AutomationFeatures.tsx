import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BarChart3, Zap, DollarSign, Video, Network } from "lucide-react";

const features = [
  {
    title: "AI-Powered Matching",
    description: "Our algorithm analyzes millions of data points to find influencers with the perfect audience alignment for your brand.",
    icon: Sparkles,
  },
  {
    title: "Real-Time Analytics",
    description: "Track performance metrics as they happen. Views, engagement, conversions—all in one dashboard.",
    icon: BarChart3,
  },
  {
    title: "Automated Workflows",
    description: "From content approval to payment processing, everything runs on autopilot.",
    icon: Zap,
  },
  {
    title: "Smart Budget Allocation",
    description: "AI automatically optimizes your spend across influencers based on performance data.",
    icon: DollarSign,
  },
  {
    title: "Content Management",
    description: "Review, approve, and schedule all influencer content from a single platform.",
    icon: Video,
  },
  {
    title: "Multi-Platform Tracking",
    description: "Monitor campaigns across Instagram, TikTok, YouTube, and more—all in one place.",
    icon: Network,
  },
];

export function AutomationFeatures() {
  return (
    <section className="py-16 bg-background" role="region" aria-label="Automation features">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="mr-2 h-3 w-3" aria-hidden="true" />
            Powered by AI
          </Badge>
          <h2 className="text-3xl font-semibold mb-4">
            Everything You Need,{" "}
            <span className="text-primary">
              Fully Automated
            </span>
          </h2>
          <p className="text-muted-foreground">
            Our platform handles the heavy lifting so you can focus on strategy and results
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-6 space-y-4">
                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            With VIBED, you get enterprise-grade influencer marketing tools without the enterprise price tag or complexity.
          </p>
        </div>
      </div>
    </section>
  );
}
