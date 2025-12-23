"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { IconSparkles, IconGauge, IconUserCheck } from "@tabler/icons-react";
import Link from "next/link";

const proofStats = [
  { label: "Campaigns launched", value: "520+" },
  { label: "Median ROAS", value: "4.3x" },
  { label: "Avg. time to live", value: "6 days" },
];

const proofLogos = ["Everline", "Northbeam", "Allied Labs", "Nova Systems", "Parallel"];

export function ProofSection() {
  return (
    <section
      id="proof"
      className="relative w-full bg-background py-14 md:py-20"
    >
      <div className="relative z-10 container max-w-6xl space-y-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 px-6 md:px-0">
          <div className="space-y-3 max-w-3xl">
            <p className="text-sm font-semibold text-primary inline-flex items-center gap-2">
              <IconSparkles className="w-4 h-4" />
              Proven performance for growth teams
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              Same clarity and polish as the cobrand.com experience, built for creator marketing—not music.
            </h2>
            <p className="text-muted-foreground text-lg">
              We pair curated creators, rapid experiments, and transparent reporting. No guesswork—just lift.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/demo"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold border border-border hover:bg-primary/90 transition-colors"
              aria-label="Book a demo"
            >
              Book a demo
            </Link>
            <Link
              href="#outcomes"
              className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              What we solve
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 px-6 md:px-0">
          <Card className="border border-border/70 bg-background/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {proofStats.map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl bg-accent border border-border/60">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border/60 p-4 bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <IconGauge className="w-4 h-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">Creator fit score</p>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    We score creators on authority, cost, and likelihood to convert. Teams see the why—not just a list of names.
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 p-4 bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <IconUserCheck className="w-4 h-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">QA before launch</p>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Creative is reviewed against your brief, hooks are A/B tested, and approvals are centralized. No more screenshot chaos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card text-card-foreground">
            <CardContent className="p-6 flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                  Case study
                </p>
                <p className="text-lg font-semibold text-foreground mt-1">
                  DTC brand scaled creator spend 3.4x in 6 weeks
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-border/60 bg-white/5">
                  <p className="text-3xl font-bold gradient-text-blue">-38%</p>
                  <p className="text-xs text-muted-foreground">Cost per acquisition</p>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-white/5">
                  <p className="text-3xl font-bold gradient-text-purple">+64%</p>
                  <p className="text-xs text-muted-foreground">Conversion rate</p>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-white/5">
                  <p className="text-3xl font-bold gradient-text-cyan">4.1x</p>
                  <p className="text-xs text-muted-foreground">ROAS after optimization</p>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-white/5">
                  <p className="text-3xl font-bold text-foreground">12</p>
                  <p className="text-xs text-muted-foreground">Days to first live posts</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Brief intake, creator shortlists, creative QA, and reporting all shipped without adding headcount. Modeled after the cobrand polish—applied to creator growth.
              </p>
              <Link
                href="/demo"
                className="self-start inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
              >
                See the playbook →
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground px-6 md:px-0">
          <span className="text-foreground font-semibold">Trusted by teams shipping weekly launches</span>
          <div className="flex flex-wrap gap-3">
            {proofLogos.map((logo) => (
              <span
                key={logo}
                className="px-3 py-1.5 rounded-full border border-border/60 bg-background/60 text-foreground text-xs font-semibold"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
