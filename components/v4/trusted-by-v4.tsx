'use client';

import Image from 'next/image';
import { motion } from 'motion/react';

export function TrustedByV4() {
  const logos = [
    { name: 'Ryne', src: '/logos/ryne.png' },
    { name: 'StealthGBT', src: '/logos/stealthgbt.png' },
    { name: 'Overcomer', src: '/logos/overcomer.png' },
    { name: 'Romans Road', src: '/logos/romans-road.png' },
  ];

  // Duplicate logos multiple times for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden bg-[#0a0d14]">
      {/* Side Gradient Overlays - Full width to page edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-48 md:w-64 bg-gradient-to-r from-[#0a0d14] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-48 md:w-64 bg-gradient-to-l from-[#0a0d14] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-lg sm:text-xl font-medium text-center mb-10 sm:mb-12 text-[#d5dbe6]/50 uppercase tracking-widest"
        >
          Trusted by Leading Brands
        </motion.h2>
      </div>

      {/* Scrolling Logos - Full width */}
      <div className="flex animate-scroll">
        {duplicatedLogos.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 mx-12 w-40 h-20 flex items-center justify-center opacity-60 hover:opacity-90 transition-opacity"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={logo.src}
                alt={logo.name}
                width={160}
                height={80}
                className="object-contain invert opacity-80"
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 45s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}
