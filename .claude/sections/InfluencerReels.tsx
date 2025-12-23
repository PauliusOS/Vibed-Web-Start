"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Heart, MessageCircle, Share2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Placeholder influencer data
const influencerReels = [
  {
    id: 1,
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
    influencer: "Sarah Johnson",
    niche: "Fashion",
    views: "2.4M",
    engagement: "12.5%",
  },
  {
    id: 2,
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    influencer: "Mike Chen",
    niche: "Tech",
    views: "1.8M",
    engagement: "15.2%",
  },
  {
    id: 3,
    thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
    influencer: "Emma Davis",
    niche: "Lifestyle",
    views: "3.1M",
    engagement: "14.8%",
  },
  {
    id: 4,
    thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
    influencer: "Alex Martinez",
    niche: "Fitness",
    views: "2.7M",
    engagement: "16.3%",
  },
  {
    id: 5,
    thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop",
    influencer: "Lisa Wang",
    niche: "Beauty",
    views: "4.2M",
    engagement: "18.1%",
  },
  {
    id: 6,
    thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop",
    influencer: "David Kim",
    niche: "Travel",
    views: "1.9M",
    engagement: "13.7%",
  },
  {
    id: 7,
    thumbnail: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop",
    influencer: "Jessica Lee",
    niche: "Food",
    views: "2.3M",
    engagement: "17.2%",
  },
  {
    id: 8,
    thumbnail: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop",
    influencer: "Tom Anderson",
    niche: "Gaming",
    views: "3.5M",
    engagement: "19.4%",
  },
  {
    id: 9,
    thumbnail: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
    influencer: "Nina Patel",
    niche: "Wellness",
    views: "1.6M",
    engagement: "14.5%",
  },
];

export function InfluencerReels() {
  const [selectedReel, setSelectedReel] = useState<typeof influencerReels[0] | null>(null);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Meet Our Influencers
          </h2>
          <p className="text-muted-foreground">
            500+ verified creators across every niche, ready to amplify your brand
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {influencerReels.map((reel) => (
            <Card
              key={reel.id}
              role="button"
              tabIndex={0}
              aria-label={`View ${reel.influencer}'s ${reel.niche} content`}
              className="group overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              onClick={() => setSelectedReel(reel)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedReel(reel);
                }
              }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[9/16] overflow-hidden bg-muted">
                <img
                  src={reel.thumbnail}
                  alt={`${reel.influencer} - ${reel.niche}`}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="rounded-full bg-background p-3">
                    <Play className="h-6 w-6 text-foreground" fill="currentColor" aria-hidden="true" />
                  </div>
                </div>

                {/* Niche Badge */}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary">{reel.niche}</Badge>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-base">{reel.influencer}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" aria-hidden="true" />
                    <span>{reel.views} views</span>
                  </div>
                  <div className="font-medium text-foreground">
                    {reel.engagement}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal for Full-Screen Video */}
        <Dialog open={!!selectedReel} onOpenChange={() => setSelectedReel(null)}>
          <DialogContent className="max-w-lg p-0 overflow-hidden">
            {selectedReel && (
              <div>
                <div className="relative aspect-[9/16] bg-muted">
                  <img
                    src={selectedReel.thumbnail}
                    alt={`${selectedReel.influencer} - ${selectedReel.niche}`}
                    className="h-full w-full object-cover"
                  />
                  {/* Placeholder for actual video player */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center text-white">
                      <Play className="h-16 w-16 mx-auto mb-2" aria-hidden="true" />
                      <p className="text-sm">Video player placeholder</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{selectedReel.influencer}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{selectedReel.niche} Influencer</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-primary" aria-hidden="true" />
                        <span>{selectedReel.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
                        <span>2.4K</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-4 w-4 text-primary" aria-hidden="true" />
                        <span>1.2K</span>
                      </div>
                    </div>
                    <div className="font-medium">
                      {selectedReel.engagement}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
