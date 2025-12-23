"use client";

import { Icons } from "@/components/icons";
import { NavMenu } from "@/components/nav-menu";
import { cn } from "@/lib/utils";
import { useScroll } from "@/lib/contexts/ScrollContext";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import Link from "next/link";
import { useState } from "react";

const INITIAL_WIDTH = "64rem";
const MAX_WIDTH = "720px";

// Animation variants - Smoother
const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawerVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 300,
      staggerChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    y: 60,
    transition: { duration: 0.15 },
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

const navLinks = [
  { id: 1, name: "Home", href: "#hero" },
  { id: 2, name: "Proof", href: "#proof" },
  { id: 3, name: "Outcomes", href: "#outcomes" },
  { id: 4, name: "Creators", href: "#creators" },
  { id: 5, name: "Pricing", href: "#pricing" },
];

export function MagicNavbar() {
  const { hasScrolled, activeSection } = useScroll();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const handleOverlayClick = () => setIsDrawerOpen(false);

  return (
    <header
      className={cn(
        "sticky z-50 mx-4 flex justify-center transition-all duration-500 md:mx-0",
        hasScrolled ? "top-5" : "top-4 mx-0"
      )}
    >
      <motion.div
        initial={{ width: INITIAL_WIDTH }}
        animate={{ width: hasScrolled ? MAX_WIDTH : INITIAL_WIDTH }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={cn(
            "mx-auto max-w-6xl rounded-xl transition-all duration-500 xl:px-0",
            hasScrolled
              ? "px-3 border border-white/[0.06] backdrop-blur-xl bg-black/70"
              : "shadow-none px-6"
          )}
        >
          <div className="flex h-[52px] items-center justify-between p-3">
            <Link href="/" className="flex items-center gap-2.5">
              <Icons.logo className="h-8 w-8 md:h-9 md:w-9" />
              <p className="text-[15px] font-medium text-white/90">SylcRoad</p>
            </Link>

            <NavMenu />

            <div className="flex flex-row items-center gap-2 shrink-0">
              <div className="hidden md:flex items-center gap-2">
                <Link
                  className="h-8 flex items-center justify-center text-[13px] font-medium rounded-lg text-white/60 hover:text-white/90 transition-colors px-3"
                  href="/sign-in"
                >
                  Sign In
                </Link>
                <Link
                  className="bg-white h-8 flex items-center justify-center text-[13px] font-medium rounded-lg text-black w-fit px-4 hover:bg-white/90 transition-all"
                  href="/demo"
                >
                  Book a Demo
                </Link>
              </div>
              <button
                className="md:hidden border border-white/[0.08] size-8 rounded-lg cursor-pointer flex items-center justify-center hover:bg-white/[0.04] transition-colors"
                onClick={toggleDrawer}
              >
                {isDrawerOpen ? (
                  <X className="size-4 text-white/70" />
                ) : (
                  <Menu className="size-4 text-white/70" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Drawer - Premium */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              transition={{ duration: 0.25 }}
              onClick={handleOverlayClick}
            />

            <motion.div
              className="fixed inset-x-0 w-[94%] mx-auto bottom-4 bg-[#0A0A0A] border border-white/[0.06] p-5 rounded-xl"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={drawerVariants}
            >
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2.5">
                    <Icons.logo className="h-8 w-8" />
                    <p className="text-[15px] font-medium text-white/90">SylcRoad</p>
                  </Link>
                  <button
                    onClick={toggleDrawer}
                    className="border border-white/[0.08] rounded-lg p-1.5 cursor-pointer hover:bg-white/[0.04] transition-colors"
                  >
                    <X className="size-4 text-white/60" />
                  </button>
                </div>

                <motion.ul
                  className="flex flex-col text-[14px]"
                  variants={drawerMenuContainerVariants}
                >
                  <AnimatePresence>
                    {navLinks.map((item) => (
                      <motion.li
                        key={item.id}
                        className="py-3 border-b border-white/[0.04] last:border-b-0"
                        variants={drawerMenuVariants}
                      >
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(
                              item.href.substring(1)
                            );
                            element?.scrollIntoView({ behavior: "smooth" });
                            setIsDrawerOpen(false);
                          }}
                          className={`transition-colors ${
                            activeSection === item.href.substring(1)
                              ? "text-white font-medium"
                              : "text-white/50 hover:text-white/80"
                          }`}
                        >
                          {item.name}
                        </a>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>

                {/* Action buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href="/demo"
                    className="bg-white h-10 flex items-center justify-center text-[14px] font-medium rounded-lg text-black w-full hover:bg-white/90 transition-all active:scale-[0.98]"
                  >
                    Book a Demo
                  </Link>
                  <Link
                    href="/sign-in"
                    className="h-10 flex items-center justify-center text-[14px] font-medium rounded-lg text-white/70 border border-white/[0.08] hover:bg-white/[0.04] hover:text-white transition-all active:scale-[0.98] w-full"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
