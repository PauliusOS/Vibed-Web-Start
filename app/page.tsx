"use client";

import { Hero } from "@/components/hero";
import { TrustedBy } from "@/components/trusted-by";
import { HowItWorks } from "@/components/how-it-works";
import { PlatformShowcase } from "@/components/platform-showcase";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Testimonials } from "@/components/testimonials";
import { FinalCTA } from "@/components/final-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <HowItWorks />
      <PlatformShowcase />
      <WhyChooseUs />
      <Testimonials />
      <FinalCTA />
      <Footer />

      {/* Bottom blur reveal effect */}
      <div
        className="fixed bottom-0 left-0 right-0 h-20 sm:h-24 pointer-events-none z-40 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(to top, rgba(244,244,244,0.6) 0%, rgba(244,244,244,0.3) 40%, transparent 100%)',
          maskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)'
        }}
      />
    </>
  );
}

