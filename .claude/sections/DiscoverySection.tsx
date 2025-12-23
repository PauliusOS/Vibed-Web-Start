"use client";

import { Search, Filter, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DiscoverySection() {
  return (
    <section className="relative py-24 lg:py-32 cobrand-navy-light overflow-hidden">
      <div className="container relative z-10 px-6 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
                <Search className="w-4 h-4" />
                <span className="font-medium">Influencer Discovery</span>
              </div>

              <h2 className="text-headline-2">
                Find the perfect creators
                <br />
                <span className="text-primary">for your brand</span>
              </h2>

              <p className="text-body-large">
                Discover impactful creators, super fans, and authentic voices for your campaigns—whether it's your product, a competitor's, or any niche in your industry.
              </p>

              {/* Feature List */}
              <ul className="space-y-4 pt-4">
                {[
                  "AI-powered matching algorithm",
                  "Audience demographics & authenticity scores",
                  "Historical performance data",
                  "Real-time availability & pricing"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-body">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-4"
              >
                Explore Creators
              </Button>
            </div>

            {/* Right: Discovery UI Preview */}
            <div className="relative">
              {/* Search Bar Card */}
              <div className="card-base mb-4">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search creators by niche, audience, or style..."
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-muted-foreground text-sm"
                    disabled
                  />
                  <Filter className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              {/* Creator Cards */}
              <div className="space-y-3">
                {[
                  { name: "Sarah Johnson", niche: "Beauty & Skincare", followers: "234K", engagement: "8.4%" },
                  { name: "Mike Chen", niche: "Tech Reviews", followers: "567K", engagement: "12.1%" },
                  { name: "Emma Rodriguez", niche: "Fashion & Lifestyle", followers: "892K", engagement: "9.8%" }
                ].map((creator, i) => (
                  <div key={i} className="card-base p-4 hover:border-primary/40 cursor-pointer transition-all duration-200">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-blue-400 flex-shrink-0" />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-body font-semibold text-white truncate">{creator.name}</h4>
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        </div>
                        <p className="text-caption truncate">{creator.niche}</p>
                      </div>

                      {/* Stats */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-white">{creator.followers}</p>
                        <p className="text-caption">{creator.engagement} ER</p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium text-white">4.9</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Button */}
              <div className="mt-4 text-center">
                <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200">
                  View 1,247 more creators →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
