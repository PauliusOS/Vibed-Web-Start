"use client";

import { HeroV4 } from "@/components/v4/hero-v4";
import { TrustedByV4 } from "@/components/v4/trusted-by-v4";
import { HowItWorksV4 } from "@/components/v4/how-it-works-v4";
import { PlatformShowcaseV4Alt } from "@/components/v4/platform-showcase-v4-alt";
import { WhyChooseUsV4 } from "@/components/v4/why-choose-us-v4";
import { TestimonialsV4 } from "@/components/v4/testimonials-v4";
import { FinalCTAV4 } from "@/components/v4/final-cta-v4";
import { FooterV4 } from "@/components/v4/footer-v4";

export default function PageV4() {
  return (
    <>
      <HeroV4 />
      <TrustedByV4 />
      <HowItWorksV4 />
      <PlatformShowcaseV4Alt />
      <WhyChooseUsV4 />
      <TestimonialsV4 />

      {/* CTA + Footer with unified gradient background - glow from bottom */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse 120% 50% at 50% 100%, rgba(13, 61, 77, 0.4) 0%, rgba(10, 42, 53, 0.2) 30%, transparent 60%),
            radial-gradient(ellipse 80% 40% at 25% 95%, rgba(0, 77, 102, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 80% 40% at 75% 95%, rgba(0, 77, 102, 0.15) 0%, transparent 50%),
            linear-gradient(to top, #10131c 0%, #0a0d14 40%, #04070d 100%)
          `
        }}
      >
        <FinalCTAV4 />
        <FooterV4 />
      </div>

      {/* Bottom blur reveal effect */}
      <div
        className="fixed bottom-0 left-0 right-0 h-20 sm:h-24 pointer-events-none z-40 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(to top, rgba(4,7,13,0.6) 0%, rgba(4,7,13,0.3) 40%, transparent 100%)',
          maskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)'
        }}
      />
    </>
  );
}
