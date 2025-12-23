'use client';

import Image from 'next/image';
import { MotionPreset } from '@/components/ui/motion-preset';

export function Testimonials() {
  const creators = [
    {
      name: 'Zaynelly',
      handle: '@zaynelly',
      image: '/creators/zaynelly.jpeg',
      socials: [
        { platform: 'tiktok', followers: '178.4K' },
        { platform: 'instagram', followers: '51.7K' },
      ],
    },
    {
      name: 'Kbte Ginger',
      handle: '@kbteginger',
      image: '/creators/kbteginger.jpg',
      socials: [
        { platform: 'tiktok', followers: '1.1M' },
        { platform: 'instagram', followers: '284K' },
        { platform: 'youtube', followers: '69K' },
      ],
    },
    {
      name: 'Doukdela',
      handle: '@doukdela',
      image: '/creators/doukdela.jpg',
      socials: [
        { platform: 'tiktok', followers: '228K' },
        { platform: 'instagram', followers: '17K' },
      ],
    },
    {
      name: 'Purpxii',
      handle: '@purpxii',
      image: '/creators/purpxii.png',
      socials: [
        { platform: 'tiktok', followers: '1.5M' },
      ],
    },
    {
      name: 'Greeninggg',
      handle: '@greeninggg',
      image: '/creators/greeninggg.png',
      socials: [
        { platform: 'tiktok', followers: '82K' },
      ],
    },
    {
      name: 'Echo Talks',
      handle: '@echotalks',
      image: '/creators/echotalks.jpeg',
      socials: [
        { platform: 'tiktok', followers: '82K' },
      ],
    },
    {
      name: 'Jetty Wetty',
      handle: '@jetty._wetty',
      image: '/creators/jetty-wetty.png',
      socials: [
        { platform: 'tiktok', followers: '275K' },
        { platform: 'instagram', followers: null },
      ],
    },
  ];

  // Duplicate creators for seamless infinite scroll
  const duplicatedCreators = [...creators, ...creators, ...creators, ...creators];

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
            <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section id="testimonials" className="relative py-20 sm:py-24 md:py-32 border-t border-black/5 overflow-hidden">
      {/* Gradient Overlays - Full width to page edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-48 md:w-64 bg-gradient-to-r from-[#f4f4f4] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-48 md:w-64 bg-gradient-to-l from-[#f4f4f4] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <MotionPreset
            fade
            slide={{ direction: 'up', offset: 30 }}
            delay={0}
          >
            <h2 className="text-[#16101e] text-4xl sm:text-5xl font-bold mb-4">
              Don't Listen to Us. Hear it from them.
            </h2>
          </MotionPreset>
          <MotionPreset
            fade
            slide={{ direction: 'up', offset: 20 }}
            delay={0.1}
          >
            <p className="text-[#16101e]/60 text-base sm:text-lg">
              Creators who worked with us and loved the results.
            </p>
          </MotionPreset>
        </div>
      </div>

      {/* Scrolling Creators - Full width */}
      <div className="flex animate-scroll-creators">
        {duplicatedCreators.map((creator, index) => (
          <div key={index} className="flex-shrink-0 w-64 mx-4">
            {/* Creator Photo */}
            <div
              className="relative aspect-[3/4] rounded-[24px] overflow-hidden mb-4"
              style={{
                backgroundColor: '#f4f4f4',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 4px 12px rgba(255, 255, 255, 0.95)'
              }}
            >
              {creator.image ? (
                <>
                  <Image
                    src={creator.image}
                    alt={creator.name}
                    fill
                    className="object-cover"
                  />
                  {/* Gradient overlay - darker at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#16101e]/20 text-sm">Photo</span>
                </div>
              )}
            </div>

            {/* Creator Info */}
            <div className="space-y-2">
              <h3 className="text-[#16101e] font-semibold text-base">
                {creator.name}
              </h3>

              {/* Social Stats */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {creator.socials.map((social, socialIndex) => (
                  social.followers && (
                    <div key={socialIndex} className="flex items-center gap-1.5">
                      <span className="text-[#16101e]/60">{getSocialIcon(social.platform)}</span>
                      <span className="text-[#16101e]/60">{social.followers}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll-creators {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .animate-scroll-creators {
          display: flex;
          width: max-content;
          animation: scroll-creators 70s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}
