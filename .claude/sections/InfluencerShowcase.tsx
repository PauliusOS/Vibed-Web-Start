"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const influencers = [
  {
    name: "Sarah Johnson",
    handle: "@sarahjstyle",
    followers: "2.4M",
    category: "Fashion",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    name: "Marcus Chen",
    handle: "@marcusfitness",
    followers: "1.8M",
    category: "Fitness",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
  },
  {
    name: "Emma Rodriguez",
    handle: "@emmaeats",
    followers: "3.2M",
    category: "Food",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  },
  {
    name: "Alex Turner",
    handle: "@alextech",
    followers: "1.5M",
    category: "Tech",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    name: "Olivia Parker",
    handle: "@oliviabeauty",
    followers: "2.9M",
    category: "Beauty",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
  },
  {
    name: "James Wilson",
    handle: "@jamestravel",
    followers: "2.1M",
    category: "Travel",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
];

export function InfluencerShowcase() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4">
            Top Influencers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with verified creators across all major platforms
          </p>
        </div>

        {/* Influencer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {influencers.map((influencer, idx) => (
            <Card key={idx} className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 p-0.5">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                    <img
                      src={influencer.image}
                      alt={influencer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {influencer.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {influencer.handle}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="font-medium text-foreground">
                      {influencer.followers}
                    </span>
                    <Badge variant="secondary">{influencer.category}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
