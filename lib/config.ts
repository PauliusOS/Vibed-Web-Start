import { Sparkles } from "lucide-react";
import { createElement } from "react";

export const siteConfig = {
  name: "SkyAgent",
  description: "AI-powered platform",

  nav: {
    links: [
      { id: "hero", name: "Home", href: "#hero" },
      { id: "features", name: "Features", href: "#features" },
      { id: "pricing", name: "Pricing", href: "#pricing" },
      { id: "testimonials", name: "Testimonials", href: "#testimonials" },
      { id: "faq", name: "FAQ", href: "#faq" },
    ],
  },

  hero: {
    badge: "Introducing SkyAgent",
    badgeIcon: createElement(Sparkles, { className: "size-4" }),
    title: "Transform Your Workflow with AI",
    description:
      "Experience the future of automation. Our AI-powered platform helps you work smarter, not harder.",
    cta: {
      primary: {
        text: "Get Started",
        href: "#",
      },
      secondary: {
        text: "Learn More",
        href: "#features",
      },
    },
  },

  companyShowcase: {
    title: "Trusted by Industry Leaders",
    companies: [],
  },

  featureSection: {
    title: "Powerful Features",
    description: "Everything you need to supercharge your workflow",
    items: [],
  },

  bentoSection: {
    title: "Built for Scale",
    description: "Designed to grow with your needs",
    items: [],
  },

  growthSection: {
    title: "Accelerate Growth",
    description: "Drive results with intelligent automation",
    items: [],
  },

  pricingSection: {
    title: "Simple Pricing",
    description: "Choose the plan that fits your needs",
    plans: [],
  },

  testimonials: {
    title: "Loved by Teams",
    description: "See what our customers have to say",
    items: [],
  },

  faqSection: {
    title: "Frequently Asked Questions",
    description: "Find answers to common questions",
    items: [],
  },

  quoteSection: {
    quote: "",
    author: "",
    role: "",
    image: "",
  },

  ctaSection: {
    title: "Ready to Get Started?",
    description: "Join thousands of teams already using our platform",
    cta: {
      text: "Start Free Trial",
      href: "#",
    },
  },

  footer: {
    links: [],
    socials: [],
  },
};
