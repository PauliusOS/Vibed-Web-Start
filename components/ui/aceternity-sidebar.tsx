"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarTransitions, SIDEBAR_DURATION, SIDEBAR_EASING, SIDEBAR_STAGGER } from "@/lib/animations/sidebar";

interface LinkItem {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface LinkGroup {
  label: string;
  icon: React.JSX.Element | React.ReactNode;
  subLinks: LinkItem[];
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(true);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const AceternitySidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const AceternitySidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  const isMobile = useIsMobile();

  // Don't render desktop sidebar on mobile
  if (isMobile) return null;

  return (
    <motion.div
      className={cn(
        "h-full py-4 hidden md:flex md:flex-col bg-black w-[300px] shrink-0 border-r border-white/10 relative z-40",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
        paddingLeft: animate ? (open ? "16px" : "8px") : "16px",
        paddingRight: animate ? (open ? "16px" : "8px") : "16px",
      }}
      transition={sidebarTransitions.desktopWidth}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  const isMobile = useIsMobile();

  // Don't render mobile sidebar on desktop
  if (!isMobile) return null;

  return (
    <>
      <div
        className={cn(
          "h-16 px-4 flex flex-row md:hidden items-center justify-between bg-black w-full border-b border-white/10"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-[#3B82F6] h-6 w-6 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={sidebarTransitions.mobileBackdrop}
                onClick={() => setOpen(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              {/* Sidebar content */}
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={sidebarTransitions.mobileSlide}
                className={cn(
                  "fixed h-full w-[280px] left-0 top-0 bg-black p-6 z-50 flex flex-col justify-between border-r border-white/10",
                  className
                )}
              >
                <div
                  className="absolute right-6 top-6 z-[60] text-[#3B82F6] cursor-pointer hover:text-[#60A5FA] transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <IconX className="h-6 w-6" />
                </div>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.3,
                      },
                    },
                  }}
                  className="flex flex-col h-full"
                >
                  {children}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: LinkItem;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  const pathname = usePathname();
  const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

  return (
    <Link
      href={link.href}
      className={cn(
        "group/sidebar rounded-lg transition-all duration-200 block",
        isActive ? "bg-blue-500/20 text-white" : "hover:bg-white/10 hover:text-[#60A5FA] text-[#3B82F6]",
        className
      )}
      {...props}
    >
      <div
        className="flex items-center gap-3 py-2.5"
        style={{
          justifyContent: animate ? (open ? "flex-start" : "center") : "flex-start",
          paddingLeft: animate ? (open ? "12px" : "0") : "12px",
          paddingRight: animate ? (open ? "12px" : "0") : "12px",
        }}
      >
        <motion.div
          animate={open ? "expanded" : "collapsed"}
          variants={{
            collapsed: { scale: 1, opacity: 1 },
            expanded: { scale: 1.05, opacity: 1 },
          }}
          transition={{
            duration: SIDEBAR_DURATION.icon,
            ease: SIDEBAR_EASING.dramatic,
          }}
        >
          {link.icon}
        </motion.div>
        <AnimatePresence mode="wait">
          {(animate ? open : true) && (
            <motion.span
              key={`link-text-${link.href}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={sidebarTransitions.navText}
              className="text-sm whitespace-pre inline-block !p-0 !m-0"
            >
              {link.label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
};

export const SidebarLinkGroup = ({
  group,
  className,
}: {
  group: LinkGroup;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  const pathname = usePathname();

  // Check if any sublink is active
  const isAnySubLinkActive = group.subLinks.some(
    (subLink) => pathname === subLink.href || pathname.startsWith(subLink.href + "/")
  );

  return (
    <div className={cn("", className)}>
      {/* Parent item - non-clickable label */}
      <div
        className={cn(
          "flex items-center gap-3 py-2.5 rounded-lg text-[#3B82F6] font-medium",
          isAnySubLinkActive && "text-[#60A5FA]"
        )}
        style={{
          justifyContent: animate ? (open ? "flex-start" : "center") : "flex-start",
          paddingLeft: animate ? (open ? "12px" : "0") : "12px",
          paddingRight: animate ? (open ? "12px" : "0") : "12px",
        }}
      >
        {group.icon}
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="text-sm font-medium whitespace-pre inline-block !p-0 !m-0"
        >
          {group.label}
        </motion.span>
      </div>

      {/* Sublinks - only show when open */}
      <AnimatePresence mode="wait">
        {(animate ? open : true) && (
          <motion.div
            key="sublinks-container"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0, height: 0 },
              visible: {
                opacity: 1,
                height: "auto",
                transition: {
                  height: {
                    duration: SIDEBAR_DURATION.text,
                    ease: SIDEBAR_EASING.elegant,
                  },
                  opacity: {
                    duration: SIDEBAR_DURATION.text * 0.8,
                    ease: SIDEBAR_EASING.calm,
                  },
                  staggerChildren: SIDEBAR_STAGGER.groupChildren,
                  delayChildren: 0.05,
                },
              },
              exit: {
                opacity: 0,
                height: 0,
                transition: {
                  duration: SIDEBAR_DURATION.text * 0.7,
                  ease: SIDEBAR_EASING.dramatic,
                },
              },
            }}
            className="ml-6 pl-4 border-l border-neutral-700/50 space-y-1 mt-1"
          >
            {group.subLinks.map((subLink, idx) => {
              const isActive = pathname === subLink.href || pathname.startsWith(subLink.href + "/");
              return (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={subLink.href}
                    className={cn(
                      "flex items-center gap-2 py-2 px-3 rounded-lg transition-all duration-200 text-xs",
                      isActive ? "bg-[#3B82F6]/20 text-[#3B82F6]" : "hover:bg-white/10 hover:text-[#60A5FA] text-[#3B82F6]/80"
                    )}
                  >
                    <span className="[&>svg]:h-4 [&>svg]:w-4">{subLink.icon}</span>
                    <span>{subLink.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
