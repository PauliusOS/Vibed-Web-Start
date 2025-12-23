"use client";

import { Icons } from "@/components/icons";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useScroll, type Variants } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const INITIAL_WIDTH = "70rem";
const MAX_WIDTH = "800px";

// Animation variants
const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawerVariants: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      type: "spring" as const,
      damping: 15,
      stiffness: 200,
      staggerChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    y: 100,
    transition: { duration: 0.1 },
  },
};

const drawerMenuContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerMenuVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function Navbar() {
  const { scrollY } = useScroll();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = siteConfig.nav.links.map((item) =>
        item.href.substring(1),
      );

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setHasScrolled(latest > 10);
    });
    return unsubscribe;
  }, [scrollY]);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const handleOverlayClick = () => setIsDrawerOpen(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.getElementById(href.substring(1));
    element?.scrollIntoView({ behavior: "smooth" });
    setIsDrawerOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky z-50 mx-4 flex justify-center transition-all duration-300 md:mx-0",
        hasScrolled ? "top-6" : "top-4 mx-0",
      )}
    >
      <motion.div
        initial={{ width: INITIAL_WIDTH }}
        animate={{ width: hasScrolled ? MAX_WIDTH : INITIAL_WIDTH }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div
          className={cn(
            "mx-auto max-w-7xl transition-all duration-300 xl:px-0",
            hasScrolled ? "px-2" : "px-7",
          )}
          style={{
            backgroundColor: hasScrolled ? "rgba(0, 0, 0, 0.85)" : "transparent",
            borderRadius: hasScrolled ? "9999px" : "16px",
            border: hasScrolled ? "1px solid rgba(0, 110, 255, 0.15)" : "none",
            boxShadow: hasScrolled
              ? "0 0 20px rgba(25, 125, 255, 0.08), 0 0 40px rgba(25, 125, 255, 0.04)"
              : "none",
            backdropFilter: hasScrolled ? "blur(20px)" : "none",
          }}
        >
          <div className="flex h-[56px] items-center justify-between p-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Icons.logo className="size-7 md:size-8" />
              <p className="text-lg font-semibold text-white">SkyAgent</p>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center gap-1"
              onMouseLeave={() => setHovered(null)}
            >
              {siteConfig.nav.links.map((item, idx) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  onMouseEnter={() => setHovered(idx)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors duration-200",
                    activeSection === item.href.substring(1)
                      ? "text-white"
                      : "text-white/60 hover:text-white",
                  )}
                >
                  {hovered === idx && (
                    <motion.div
                      layoutId="navbar-hover"
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </a>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex flex-row items-center gap-2 md:gap-3 shrink-0">
              <Link
                className="hidden md:flex items-center justify-center h-8 px-4 text-sm font-medium text-black bg-white rounded-full transition-all hover:bg-white/90 active:scale-95"
                style={{
                  boxShadow: "0 0 20px rgba(255, 255, 255, 0.15)",
                }}
                href="#"
              >
                Get Started
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden flex items-center justify-center size-9 rounded-full cursor-pointer transition-colors"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
                onClick={toggleDrawer}
              >
                {isDrawerOpen ? (
                  <X className="size-5 text-white" />
                ) : (
                  <Menu className="size-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              transition={{ duration: 0.2 }}
              onClick={handleOverlayClick}
            />

            <motion.div
              className="fixed inset-x-0 w-[95%] mx-auto bottom-3 p-4 rounded-2xl"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.95)",
                border: "1px solid rgba(0, 110, 255, 0.15)",
                boxShadow: "0 0 40px rgba(25, 125, 255, 0.1), 0 0 80px rgba(25, 125, 255, 0.05)",
                backdropFilter: "blur(20px)",
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={drawerVariants}
            >
              {/* Mobile menu content */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-3">
                    <Icons.logo className="size-7" />
                    <p className="text-lg font-semibold text-white">SkyAgent</p>
                  </Link>
                  <button
                    onClick={toggleDrawer}
                    className="flex items-center justify-center size-8 rounded-full cursor-pointer"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <X className="size-4 text-white" />
                  </button>
                </div>

                <motion.ul
                  className="flex flex-col text-sm"
                  variants={drawerMenuContainerVariants}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <AnimatePresence>
                    {siteConfig.nav.links.map((item, idx) => (
                      <motion.li
                        key={item.id}
                        className={cn(
                          "px-4 py-3",
                          idx !== siteConfig.nav.links.length - 1 &&
                            "border-b border-white/[0.06]"
                        )}
                        variants={drawerMenuVariants}
                      >
                        <a
                          href={item.href}
                          onClick={(e) => handleNavClick(e, item.href)}
                          className={cn(
                            "block transition-colors",
                            activeSection === item.href.substring(1)
                              ? "text-white font-medium"
                              : "text-white/60"
                          )}
                        >
                          {item.name}
                        </a>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>

                {/* Action button */}
                <Link
                  href="#"
                  className="flex items-center justify-center h-10 w-full text-sm font-medium text-black bg-white rounded-full transition-all hover:bg-white/90 active:scale-95"
                  style={{
                    boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
                  }}
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
