'use client';

interface AnimatedWavesProps {
  className?: string;
}

export function AnimatedWaves({ className = '' }: AnimatedWavesProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="absolute w-[200%] h-full min-h-[600px]"
        viewBox="0 0 2400 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients for depth */}
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#f0f0f0" stopOpacity="0.7"/>
          </linearGradient>
          <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fafafa" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#e8e8e8" stopOpacity="0.5"/>
          </linearGradient>
          <linearGradient id="waveGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f5f5f5" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#e0e0e0" stopOpacity="0.3"/>
          </linearGradient>

          {/* Soft shadow filter */}
          <filter id="waveShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
            <feOffset dx="0" dy="4" result="offsetblur"/>
            <feFlood floodColor="#000000" floodOpacity="0.05"/>
            <feComposite in2="offsetblur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background base */}
        <rect width="2400" height="800" fill="#f4f4f4"/>

        {/* Wave Layer 3 - Back (slowest, most subtle) */}
        <g filter="url(#waveShadow)" className="animate-wave-slow">
          <path
            d="M0 400
               C150 350, 300 450, 450 400
               C600 350, 750 300, 900 350
               C1050 400, 1200 450, 1350 400
               C1500 350, 1650 300, 1800 350
               C1950 400, 2100 450, 2250 400
               C2400 350, 2550 300, 2700 350
               L2700 800 L0 800 Z"
            fill="url(#waveGrad3)"
          />
        </g>

        {/* Wave Layer 2 - Middle */}
        <g filter="url(#waveShadow)" className="animate-wave-medium">
          <path
            d="M0 450
               C200 400, 350 500, 550 450
               C750 400, 900 350, 1100 400
               C1300 450, 1450 500, 1650 450
               C1850 400, 2000 350, 2200 400
               C2400 450, 2550 500, 2700 450
               L2700 800 L0 800 Z"
            fill="url(#waveGrad2)"
          />
        </g>

        {/* Wave Layer 1 - Front (fastest, most prominent) */}
        <g filter="url(#waveShadow)" className="animate-wave-fast">
          <path
            d="M0 500
               C250 450, 400 550, 650 500
               C900 450, 1050 400, 1300 450
               C1550 500, 1700 550, 1950 500
               C2200 450, 2350 400, 2600 450
               L2700 800 L0 800 Z"
            fill="url(#waveGrad1)"
          />
        </g>

        {/* Highlight wave - adds shine effect */}
        <g className="animate-wave-fast">
          <path
            d="M0 520
               C250 480, 400 540, 650 510
               C900 480, 1050 450, 1300 480
               C1550 510, 1700 540, 1950 510
               C2200 480, 2350 450, 2600 480
               L2700 800 L0 800 Z"
            fill="white"
            opacity="0.4"
          />
        </g>
      </svg>

      <style jsx>{`
        @keyframes wave-slow {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes wave-medium {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes wave-fast {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-wave-slow {
          animation: wave-slow 40s linear infinite;
        }

        .animate-wave-medium {
          animation: wave-medium 30s linear infinite;
        }

        .animate-wave-fast {
          animation: wave-fast 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
