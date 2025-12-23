"use client";

import { HeroV2 } from "@/components/v2/hero-v2";
import { TrustedByV2 } from "@/components/v2/trusted-by-v2";
import { HowItWorksV2 } from "@/components/v2/how-it-works-v2";
import { PlatformShowcaseV2 } from "@/components/v2/platform-showcase-v2";
import { WhyChooseUsV2 } from "@/components/v2/why-choose-us-v2";
import { TestimonialsV2 } from "@/components/v2/testimonials-v2";
import { FinalCTAV2 } from "@/components/v2/final-cta-v2";
import { FooterV2 } from "@/components/v2/footer-v2";

export default function PageV2() {
  return (
    <>
      <HeroV2 />
      <TrustedByV2 />
      <HowItWorksV2 />
      <PlatformShowcaseV2 />
      <WhyChooseUsV2 />
      <TestimonialsV2 />
      <FinalCTAV2 />
      <FooterV2 />

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
