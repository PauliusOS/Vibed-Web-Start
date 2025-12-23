"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

// Placeholder client logos (in production, use real logo images)
const clients = [
  { name: "TechCorp", logo: "TC" },
  { name: "FashionHub", logo: "FH" },
  { name: "FitLife", logo: "FL" },
  { name: "BeautyBox", logo: "BB" },
  { name: "TravelCo", logo: "TV" },
  { name: "FoodieApp", logo: "FA" },
  { name: "EcoGoods", logo: "EG" },
  { name: "GameZone", logo: "GZ" },
  { name: "WellnessHub", logo: "WH" },
  { name: "StyleLab", logo: "SL" },
  { name: "UrbanFit", logo: "UF" },
  { name: "PetPal", logo: "PP" },
];

const testimonials = [
  {
    quote: "VIBED transformed our influencer strategy. Instead of spray-and-pray posting, they built a data-driven campaign that delivered 3x ROI.",
    author: "Sarah Mitchell",
    role: "CMO",
    company: "TechCorp",
    rating: 5,
  },
  {
    quote: "Finally, an agency that actually understands strategy. They didn't just find influencers—they matched us with creators who genuinely resonated with our audience.",
    author: "David Chen",
    role: "Marketing Director",
    company: "FashionHub",
    rating: 5,
  },
  {
    quote: "The automation is incredible. Real-time tracking, automatic reporting, and seamless payment processing. It's like having a full marketing team on autopilot.",
    author: "Emily Rodriguez",
    role: "Brand Manager",
    company: "BeautyBox",
    rating: 5,
  },
];

export function ClientLogos() {
  return (
    <section className="py-16 bg-background" role="region" aria-label="Client testimonials">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Trusted by Leading Brands
          </h2>
          <p className="text-muted-foreground">
            Join hundreds of companies achieving real results with VIBED
          </p>
        </div>

        {/* Client Logos Grid */}
        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {clients.map((client) => (
            <div
              key={client.name}
              aria-label={`${client.name} logo`}
              className="flex items-center justify-center rounded-lg border border-border bg-card p-6 transition-colors duration-200 hover:bg-muted/50"
            >
              <div className="text-xl font-bold text-muted-foreground">
                {client.logo}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-6 space-y-4">
                {/* Rating */}
                <div className="flex items-center gap-1" aria-label={`${testimonial.rating} star rating`}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-sm leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2">
                  {/* Avatar Placeholder */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary" aria-hidden="true">
                    {testimonial.author.charAt(0)}
                  </div>

                  {/* Info */}
                  <div>
                    <div className="text-sm font-semibold">
                      {testimonial.author}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
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
