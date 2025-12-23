"use client";

import {
  Zap,
  Target,
  Users,
  BarChart3,
  Shield,
  Sparkles,
  MessageSquare,
  Clock,
  Workflow
} from "lucide-react";

export function FeaturesGrid() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Setup",
      description: "Launch your first campaign in minutes, not weeks. Our intuitive platform gets you running instantly.",
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10"
    },
    {
      icon: Target,
      title: "Precision Targeting",
      description: "AI-powered matching connects you with creators whose audience perfectly aligns with your brand.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Users,
      title: "Vetted Creator Network",
      description: "Access 100K+ pre-screened influencers with verified audience data and authentic engagement.",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track every metric that matters with comprehensive dashboards and automated reporting.",
      color: "text-green-400",
      bgColor: "bg-green-400/10"
    },
    {
      icon: Workflow,
      title: "Automated Workflows",
      description: "From outreach to payment, automate repetitive tasks and focus on strategy.",
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10"
    },
    {
      icon: Shield,
      title: "Fraud Detection",
      description: "Advanced AI identifies fake followers, bots, and suspicious engagement patterns.",
      color: "text-red-400",
      bgColor: "bg-red-400/10"
    },
    {
      icon: MessageSquare,
      title: "Unified Communication",
      description: "Manage all creator conversations in one place with built-in chat and negotiation tools.",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10"
    },
    {
      icon: Clock,
      title: "Content Scheduling",
      description: "Plan, approve, and schedule posts across all platforms with centralized content calendar.",
      color: "text-orange-400",
      bgColor: "bg-orange-400/10"
    },
    {
      icon: Sparkles,
      title: "AI Content Assistant",
      description: "Generate campaign briefs, captions, and creative direction powered by GPT-4.",
      color: "text-pink-400",
      bgColor: "bg-pink-400/10"
    }
  ];

  return (
    <section className="relative py-24 lg:py-32 cobrand-navy-light overflow-hidden">
      <div className="container relative z-10 px-6 mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-headline-2 mb-6">
              Everything you need to
              <br />
              <span className="text-primary">scale influencer marketing</span>
            </h2>
            <p className="text-body-large max-w-2xl mx-auto">
              Powerful features designed for modern marketing teams who want to move fast without sacrificing quality.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card-base group hover:border-primary/40 transition-all duration-200"
                >
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-title-2 mb-3">{feature.title}</h3>
                  <p className="text-body-small leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom Note */}
          <div className="mt-16 text-center">
            <p className="text-body-small">
              And 40+ more features to streamline your workflow.{" "}
              <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors duration-200">
                See full feature list →
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
