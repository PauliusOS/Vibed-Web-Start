"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Info } from "lucide-react";

interface DropDetailsProps {
  description: string;
  customMessage?: string;
}

export function DropDetails({ description, customMessage }: DropDetailsProps) {
  const defaultRequirements = [
    "Create authentic content showcasing your experience",
    "Post content during campaign period",
    "Tag the brand and use campaign hashtags",
    "Submit content for approval before posting",
    "Meet minimum engagement requirements",
  ];

  const defaultBenefits = [
    "Compensation for approved content",
    "Access to exclusive brand resources",
    "Featured in campaign showcase",
    "Potential for ongoing partnerships",
    "Professional campaign management support",
  ];

  return (
    <div className="space-y-8">
      {/* Description Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          About This Opportunity
        </h2>
        <Card className="bg-[#1a1a1a] border-[#3a3a3a]">
          <CardContent className="p-6">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
            {customMessage && (
              <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white">{customMessage}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Requirements Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          What We're Looking For
        </h2>
        <Card className="bg-[#1a1a1a] border-[#3a3a3a]">
          <CardContent className="p-6">
            <ul className="space-y-3">
              {defaultRequirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{requirement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          What You'll Get
        </h2>
        <Card className="bg-[#1a1a1a] border-[#3a3a3a]">
          <CardContent className="p-6">
            <ul className="space-y-3">
              {defaultBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Process Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: "1",
              title: "Sign Up",
              description: "Submit your interest with your email",
            },
            {
              step: "2",
              title: "Get Contacted",
              description: "We'll reach out with more details",
            },
            {
              step: "3",
              title: "Create Content",
              description: "Produce content per campaign brief",
            },
            {
              step: "4",
              title: "Get Paid",
              description: "Receive compensation for approved content",
            },
          ].map((step, index) => (
            <Card
              key={index}
              className="bg-[#1a1a1a] border-[#3a3a3a] hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

