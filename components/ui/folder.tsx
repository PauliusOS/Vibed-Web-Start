"use client";
import React, { useState, createContext, useContext, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FolderProps {
  color?: string;
  tabColor?: string;
  size?: "xxs" | "xs" | "sm" | "md";
  className?: string;
  children: ReactNode;
  isOpen?: boolean;
  isPeeking?: boolean;
  disableHoverPeek?: boolean;
  disableClick?: boolean;
  shakeOnHover?: boolean;
  shakeOnPeek?: boolean;
  idleShake?: boolean;
  floatEffect?: boolean;
  glowReflection?: boolean;
  glowColor?: string;
  onOpenChange?: (isOpen: boolean) => void;
}

interface FolderContentProps {
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}

interface FolderContextType {
  isOpen: boolean;
  isPeeking: boolean;
  disableHoverPeek: boolean;
  size: "xxs" | "xs" | "sm" | "md";
}

const FolderContext = createContext<FolderContextType>({
  isOpen: false,
  isPeeking: false,
  disableHoverPeek: false,
  size: "sm",
});

export const FolderContent: React.FC<FolderContentProps> = ({ className, children, style }) => {
  const { isOpen, isPeeking, disableHoverPeek, size } = useContext(FolderContext);
  const cardSizeClasses = {
    xxs: "w-32 h-24 md:w-40 md:h-28",
    xs: "w-40 h-28 md:w-48 md:h-32",
    sm: "w-52 h-36 md:w-60 md:h-40",
    md: "w-64 h-44 md:w-72 md:h-48",
  };
  const peekClasses = {
    xxs: !isOpen ? "-translate-y-1 md:translate-y-2 group-hover:-translate-y-6 md:group-hover:-translate-y-8 z-20" : "-translate-y-12 md:-translate-y-16 hover:scale-105 z-30",
    xs: !isOpen ? "-translate-y-2 md:translate-y-4 group-hover:-translate-y-8 md:group-hover:-translate-y-12 z-20" : "-translate-y-16 md:-translate-y-20 hover:scale-105 z-30",
    sm: !isOpen ? "-translate-y-2 md:translate-y-4 group-hover:-translate-y-8 md:group-hover:-translate-y-12 z-20" : "-translate-y-16 md:-translate-y-20 hover:scale-105 z-30",
    md: !isOpen ? "-translate-y-2 md:translate-y-4 group-hover:-translate-y-8 md:group-hover:-translate-y-12 z-20" : "-translate-y-16 md:-translate-y-20 hover:scale-105 z-30",
  };
  const bottomClasses = {
    xxs: "bottom-2 md:bottom-3",
    xs: "bottom-3 md:bottom-4",
    sm: "bottom-4 md:bottom-8",
    md: "bottom-6 md:bottom-10",
  };

  // Custom peek handling when disableHoverPeek is true
  const getPositionClasses = () => {
    if (isOpen) {
      return peekClasses[size].split(" ").filter(c => c.includes("translate-y-") && !c.includes("group-hover")).join(" ") + " hover:scale-105 z-30";
    }
    if (isPeeking) {
      // Peek position (same as group-hover would give)
      const peekPos = {
        xxs: "-translate-y-6 md:-translate-y-8 z-20",
        xs: "-translate-y-8 md:-translate-y-12 z-20",
        sm: "-translate-y-8 md:-translate-y-12 z-20",
        md: "-translate-y-8 md:-translate-y-12 z-20",
      };
      return peekPos[size];
    }
    if (disableHoverPeek) {
      // Hidden position, no group-hover
      const hiddenPos = {
        xxs: "-translate-y-1 md:translate-y-2 z-20",
        xs: "-translate-y-2 md:translate-y-4 z-20",
        sm: "-translate-y-2 md:translate-y-4 z-20",
        md: "-translate-y-2 md:translate-y-4 z-20",
      };
      return hiddenPos[size];
    }
    return peekClasses[size];
  };

  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 bg-card border border-border rounded-xl shadow-2xl transition-all duration-1000 ease-out flex items-center justify-center px-3 py-4",
        cardSizeClasses[size],
        bottomClasses[size],
        getPositionClasses(),
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

const Folder: React.FC<FolderProps> = ({
  color = "hsl(173, 80%, 70%)",
  tabColor = "hsl(173, 84%, 42%)",
  size = "sm",
  className,
  children,
  isOpen: controlledIsOpen,
  isPeeking = false,
  disableHoverPeek = false,
  disableClick = false,
  shakeOnHover = false,
  shakeOnPeek = false,
  idleShake = false,
  floatEffect = false,
  glowReflection = false,
  glowColor = "59, 130, 246",
  onOpenChange,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const handleClick = () => {
    if (disableClick) return;
    if (isControlled && onOpenChange) {
      onOpenChange(!isOpen);
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };
  const sizeClasses = {
    xxs: "w-40 h-28 md:w-48 md:h-32",
    xs: "w-48 h-32 md:w-56 md:h-36",
    sm: "w-64 h-44 md:w-72 md:h-48",
    md: "w-80 h-56 md:w-96 md:h-64",
  };

  const showGlow = glowReflection && (isPeeking || isOpen);

  return (
    <FolderContext.Provider value={{ isOpen, isPeeking, disableHoverPeek, size }}>
      <div className={cn("w-full max-w-2xl flex items-center justify-center", className)}>
        <div
          onClick={handleClick}
          className={cn(
            "group relative transition-all duration-200 ease-in",
            !disableClick && "cursor-pointer",
            !isOpen && !disableHoverPeek && "hover:-translate-y-1",
            shakeOnHover && "animate-hover-shake",
            shakeOnPeek && isPeeking && "animate-peek-shake",
            idleShake && "animate-idle-shake",
            floatEffect && "animate-float"
          )}
        >
          <style jsx>{`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-3px); }
            }
            .animate-float {
              animation: float 3s ease-in-out infinite;
            }
            @keyframes hover-shake {
              0%, 100% { transform: translateX(0) rotate(0deg); }
              25% { transform: translateX(-2px) rotate(-0.8deg); }
              50% { transform: translateX(2px) rotate(0.8deg); }
              75% { transform: translateX(-1px) rotate(-0.4deg); }
            }
            .animate-hover-shake:hover {
              animation: hover-shake 0.3s ease-in-out;
            }
            @keyframes peek-shake {
              0%, 100% { transform: translateX(0) rotate(0deg); }
              50% { transform: translateX(-0.5px) rotate(-0.3deg); }
            }
            .animate-peek-shake {
              animation: peek-shake 0.3s ease-out;
            }
            @keyframes idle-shake {
              0%, 90%, 100% { transform: translateX(0) rotate(0deg); }
              92% { transform: translateX(-2px) rotate(-1deg); }
              94% { transform: translateX(2px) rotate(1deg); }
              96% { transform: translateX(-2px) rotate(-0.5deg); }
              98% { transform: translateX(2px) rotate(0.5deg); }
            }
            .animate-idle-shake {
              animation: idle-shake 4.5s ease-in-out infinite;
            }
          `}</style>
          <div className={cn("relative", sizeClasses[size])}>
            {/* Main folder body SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225 171" className="absolute top-0 left-0 w-full h-full">
              <defs>
                <linearGradient id="folderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1a1a1a" />
                  <stop offset="100%" stopColor="#0f0f0f" />
                </linearGradient>
              </defs>
              <path d="M0.798828 10.9374C0.798828 5.39412 5.29256 0.900391 10.8358 0.900391H61.2051C65.7717 0.900391 70.2784 1.93905 74.3843 3.93778L89.013 11.0589C93.1189 13.0576 97.6257 14.0963 102.192 14.0963H214.762C220.305 14.0963 224.799 18.59 224.799 24.1333V153.17C224.799 162.871 216.935 170.735 207.234 170.735H18.3636C8.66286 170.735 0.798828 162.871 0.798828 153.17V10.9374Z" fill="url(#folderGradient)" />
            </svg>
            {/* Tab SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225 171" className="absolute top-0 left-0 w-full h-full pointer-events-none z-40" fill={tabColor}>
              <path d="M61.2051 0.900391C65.7717 0.900391 70.2784 1.93905 74.3843 3.93778L89.013 11.0589C93.1189 13.0576 97.6257 14.0963 102.192 14.0963H214.762C220.305 14.0963 224.799 18.59 224.799 24.1333V24.1333C224.799 18.59 220.305 14.0963 214.762 14.0963H102.192C97.6257 14.0963 93.1189 13.0576 89.013 11.0589L74.3843 3.93778C70.2784 1.93905 65.7717 0.900391 61.2051 0.900391H10.8358C5.29256 0.900391 0.798828 5.39412 0.798828 10.9374V10.9374C0.798828 5.39412 5.29256 0.900391 10.8358 0.900391H61.2051Z" />
            </svg>

            {/* Glow reflection overlay - only visual, doesn't affect animation */}
            {glowReflection && (
              <div
                className={cn(
                  "absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out rounded-[15px] z-[1]",
                  showGlow ? "opacity-100" : "opacity-0"
                )}
                style={{
                  background: `linear-gradient(to top, rgba(${glowColor}, 0.2) 0%, rgba(${glowColor}, 0.05) 40%, transparent 70%)`,
                }}
              />
            )}

            {/* Left panel - folder front flap */}
            <div
              className={cn(
                "absolute z-30 origin-bottom transition-all duration-1000 ease-out pointer-events-none top-[24px] h-[calc(100%-24px)] rounded-[5px_15px_15px_15px]",
                sizeClasses[size],
                (isOpen || isPeeking) ? "skew-x-12 scale-y-[0.6]" : (disableHoverPeek ? "" : "group-hover:skew-x-12 group-hover:scale-y-[0.6]")
              )}
              style={{ background: 'linear-gradient(to bottom, #1a1a1a, #0f0f0f)' }}
            ></div>
            {/* Right panel - folder front flap */}
            <div
              className={cn(
                "absolute z-30 origin-bottom transition-all duration-1000 ease-out pointer-events-none top-[24px] h-[calc(100%-24px)] rounded-[5px_15px_15px_15px]",
                sizeClasses[size],
                (isOpen || isPeeking) ? "-skew-x-12 scale-y-[0.6]" : (disableHoverPeek ? "" : "group-hover:-skew-x-12 group-hover:scale-y-[0.6]")
              )}
              style={{ background: 'linear-gradient(to bottom, #1a1a1a, #0f0f0f)' }}
            ></div>
            {children}
          </div>
        </div>
      </div>
    </FolderContext.Provider>
  );
};

export { Folder };
