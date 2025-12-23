"use client";

import { ArrowUpRight, TrendingUp } from "lucide-react";

export function CaseStudiesSection() {
  const caseStudies = [
    {
      company: "TechFlow Inc.",
      campaign: "Product Launch Campaign",
      industry: "Tech & Software",
      metrics: [
        { label: "Total Sign Ups", value: "12K+", highlight: true },
        { label: "Impressions", value: "45M" },
        { label: "Engagement Rate", value: "14.2%" },
        { label: "Conversion Rate", value: "8.7%" }
      ],
      result: "#1 Product of the Week on Product Hunt",
      roi: "+425%",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      company: "StyleHub",
      campaign: "Summer Collection Launch",
      industry: "Fashion & Retail",
      metrics: [
        { label: "Revenue Generated", value: "$2.4M", highlight: true },
        { label: "UGC Videos", value: "8.9K" },
        { label: "New Customers", value: "34K" },
        { label: "Avg. Order Value", value: "$127" }
      ],
      result: "Best Performing Campaign of 2024",
      roi: "+380%",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      company: "FitLife Nutrition",
      campaign: "Brand Awareness Drive",
      industry: "Health & Wellness",
      metrics: [
        { label: "Brand Mentions", value: "156K+", highlight: true },
        { label: "Social Reach", value: "67M" },
        { label: "Website Traffic", value: "+289%" },
        { label: "App Downloads", value: "94K" }
      ],
      result: "Top 3 Brand in Category",
      roi: "+512%",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="relative py-24 lg:py-32 cobrand-navy overflow-hidden">
      <div className="container relative z-10 px-6 mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-headline-2 mb-6">
              Real campaigns.
              <br />
              <span className="text-primary">Real results.</span>
            </h2>
            <p className="text-body-large max-w-2xl mx-auto">
              See how leading brands achieved breakthrough results with data-driven influencer marketing.
            </p>
          </div>

          {/* Case Studies Grid */}
          <div className="space-y-8">
            {caseStudies.map((study, index) => (
              <div
                key={index}
                className="card-base group hover:scale-[1.01] cursor-pointer"
              >
                <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12">
                  {/* Left: Company Info & Metrics */}
                  <div className="space-y-6">
                    {/* Company Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${study.gradient}`} />
                          <div>
                            <h3 className="text-title-2">{study.company}</h3>
                            <p className="text-caption">{study.industry}</p>
                          </div>
                        </div>
                        <h4 className="text-body-large font-semibold text-white mt-3">
                          {study.campaign}
                        </h4>
                      </div>
                      <ArrowUpRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {study.metrics.map((metric, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-xl ${
                            metric.highlight
                              ? 'bg-primary/10 border border-primary/20'
                              : 'bg-cobrand-navy-lighter'
                          }`}
                        >
                          <p className="text-caption mb-1">{metric.label}</p>
                          <p className={`text-2xl font-bold ${
                            metric.highlight ? 'text-primary' : 'text-white'
                          }`}>
                            {metric.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Result Tag */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400 font-medium">{study.result}</span>
                    </div>
                  </div>

                  {/* Right: ROI Highlight */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-center lg:justify-start gap-2 lg:gap-3">
                    <div className="text-center lg:text-right">
                      <p className="text-caption mb-1">Return on Investment</p>
                      <p className="text-5xl lg:text-6xl font-bold text-primary">
                        {study.roi}
                      </p>
                      <p className="text-caption text-green-400 mt-1">ROI</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <p className="text-body mb-4">
              Join over 500+ brands achieving exceptional results
            </p>
            <button className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200 inline-flex items-center gap-2">
              View all case studies
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
