"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const outcomes = [
  {
    title: "Predictable launches",
    description: "Structured briefs, creator approvals, and creative QA handled in one place so you launch in days—not weeks.",
    metric: "6 days",
    sub: "median time from brief to first post",
    highlight: "Launch-ready"
  },
  {
    title: "Creators that convert",
    description: "Shortlists are ranked by authority, cost, and likelihood to convert. No more guessing which niche to bet on.",
    metric: "34%",
    sub: "lift in click-to-conversion after rebalancing creator mix",
    highlight: "Better fit"
  },
  {
    title: "Revenue clarity",
    description: "See spend, ROAS, and CAC-to-LTV in one view with alerts when a placement trends or fatigues.",
    metric: "4.3x",
    sub: "average ROAS across top cohorts",
    highlight: "Live reporting"
  },
  {
    title: "Operational calm",
    description: "Approvals, revisions, and payments tracked automatically with audit trails for compliance and finance.",
    metric: "32%",
    sub: "average margin lift for agency partners",
    highlight: "Less chaos"
  }
];

export function OutcomeGridSection() {
  return (
    <section
      id="outcomes"
      className="w-full bg-background py-14 md:py-20"
    >
      <div className="container max-w-6xl space-y-10">
        <div className="space-y-3 text-center px-6 md:px-0">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">What changes</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            The cobrand-like polish, rebuilt for creator marketing outcomes
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Less abstract storytelling, more measurable lift. We solve the same clarity gap—just for creators instead of music.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 md:px-0">
          {outcomes.map((outcome, index) => (
            <motion.div
              key={outcome.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="h-full border border-border/70 bg-background/80">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-[0.15em]">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {outcome.highlight}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{outcome.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{outcome.description}</p>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-3xl font-bold gradient-text-blue">{outcome.metric}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      {outcome.sub}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 px-6 md:px-0">
          <Link
            href="/demo"
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold border border-border hover:bg-primary/90 transition-colors"
            aria-label="Book a demo"
          >
            Book a demo
          </Link>
          <Link
            href="#creators"
            className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
          >
            See creator roster
          </Link>
        </div>
      </div>
    </section>
  );
}
