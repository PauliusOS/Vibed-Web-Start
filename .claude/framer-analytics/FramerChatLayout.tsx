"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { cn } from "@/lib/utils";
import { FramerChat } from "./FramerChat";
import { FRAMER_CHART_COLORS, FRAMER_TEXT_COLORS } from "./constants/colors";
import { MessageCircle } from "lucide-react";

// Corner positions for the floating button
type Corner = "bottom-right" | "bottom-left" | "top-right" | "top-left";

const CORNER_POSITIONS: Record<Corner, { bottom?: number; top?: number; left?: number; right?: number }> = {
  "bottom-right": { bottom: 24, right: 24 },
  "bottom-left": { bottom: 24, left: 24 },
  "top-right": { top: 24, right: 24 },
  "top-left": { top: 24, left: 24 },
};

// Chat context for global state management
interface ChatContextValue {
  isOpen: boolean;
  mode: "floating" | "sidebar" | "closed";
  openChat: () => void;
  closeChat: () => void;
  openSidebar: () => void;
  openFloating: () => void;
  toggleSidebar: () => void;
  sidebarWidth: number;
  buttonCorner: Corner;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatPanel() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatPanel must be used within FramerChatLayout");
  }
  return context;
}

interface FramerChatLayoutProps {
  children: ReactNode;
  /** Default sidebar width */
  sidebarWidth?: number;
  /** Initially open in sidebar mode */
  defaultSidebarOpen?: boolean;
  /** Show floating button when sidebar is closed */
  showFloatingButton?: boolean;
  /** Default corner for the floating button */
  defaultButtonCorner?: Corner;
}

/**
 * FramerChatLayout - Wrapper that provides split-screen chat sidebar
 * 
 * Wraps your page content and manages the chat sidebar state.
 * When sidebar opens, content smoothly resizes to make room.
 * The floating button can be dragged and snaps to corners.
 * 
 * Usage:
 * ```tsx
 * <FramerChatLayout>
 *   <YourPageContent />
 * </FramerChatLayout>
 * ```
 */
export function FramerChatLayout({
  children,
  sidebarWidth = 380,
  defaultSidebarOpen = false,
  showFloatingButton = true,
  defaultButtonCorner = "bottom-right",
}: FramerChatLayoutProps) {
  const [mode, setMode] = useState<"floating" | "sidebar" | "closed">(
    defaultSidebarOpen ? "sidebar" : "closed"
  );
  const [buttonCorner, setButtonCorner] = useState<Corner>(defaultButtonCorner);
  const [isHovering, setIsHovering] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isOpen = mode !== "closed";
  const isSidebar = mode === "sidebar";

  const openChat = useCallback(() => setMode("sidebar"), []);
  const closeChat = useCallback(() => setMode("closed"), []);
  const openSidebar = useCallback(() => setMode("sidebar"), []);
  const openFloating = useCallback(() => setMode("floating"), []);
  const toggleSidebar = useCallback(() => {
    setMode((prev) => (prev === "sidebar" ? "closed" : "sidebar"));
  }, []);

  // Calculate which corner to snap to based on final position
  const snapToCorner = useCallback((info: PanInfo) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const isLeft = centerX < windowWidth / 2;
    const isTop = centerY < windowHeight / 2;
    
    let newCorner: Corner;
    if (isTop && isLeft) newCorner = "top-left";
    else if (isTop && !isLeft) newCorner = "top-right";
    else if (!isTop && isLeft) newCorner = "bottom-left";
    else newCorner = "bottom-right";
    
    setButtonCorner(newCorner);
  }, []);

  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    snapToCorner(info);
  }, [snapToCorner]);

  // Get position style based on corner
  const getButtonStyle = () => {
    const pos = CORNER_POSITIONS[buttonCorner];
    return {
      ...(pos.bottom !== undefined && { bottom: pos.bottom }),
      ...(pos.top !== undefined && { top: pos.top }),
      ...(pos.left !== undefined && { left: pos.left }),
      ...(pos.right !== undefined && { right: pos.right }),
    };
  };

  const contextValue: ChatContextValue = {
    isOpen,
    mode,
    openChat,
    closeChat,
    openSidebar,
    openFloating,
    toggleSidebar,
    sidebarWidth,
    buttonCorner,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      <div className="relative min-h-screen flex">
        {/* Main Content - resizes when sidebar opens */}
        <motion.div
          className="flex-1 min-w-0"
          animate={{
            marginRight: isSidebar ? sidebarWidth : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          {children}
        </motion.div>

        {/* Sidebar Panel */}
        <AnimatePresence>
          {isSidebar && (
            <motion.div
              initial={{ x: sidebarWidth, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: sidebarWidth, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="fixed top-0 right-0 h-full z-40"
              style={{ width: sidebarWidth }}
            >
              <div
                className="w-full h-full flex flex-col"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.95)",
                  borderLeft: "1px solid rgba(25, 125, 255, 0.15)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <FramerChatSidebarContent onClose={closeChat} onUndock={openFloating} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Mode */}
        <AnimatePresence>
          {mode === "floating" && (
            <FramerChat
              mode="floating"
              defaultOpen={true}
              onModeChange={(newMode) => {
                if (newMode === "sidebar") setMode("sidebar");
                else if (newMode === "closed") setMode("closed");
              }}
            />
          )}
        </AnimatePresence>

        {/* Draggable Floating Button (when closed) */}
        <AnimatePresence>
          {showFloatingButton && mode === "closed" && (
            <motion.button
              ref={buttonRef}
              drag
              dragMomentum={false}
              dragSnapToOrigin
              onDragEnd={handleDragEnd}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileDrag={{ scale: 1.1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              onClick={openSidebar}
              className="fixed z-50 w-14 h-14 flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing"
              style={{
                ...getButtonStyle(),
                backgroundColor: FRAMER_CHART_COLORS.primaryLine,
                boxShadow: `0 0 20px ${FRAMER_CHART_COLORS.primaryLine}40, 0 4px 12px rgba(0, 0, 0, 0.3)`,
              }}
            >
              <MessageCircle className="w-6 h-6 text-white pointer-events-none" />
              
              {/* Hover ring indicator - fades in/out */}
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                initial={{ opacity: 0, scale: 1 }}
                animate={{ 
                  opacity: isHovering ? 1 : 0, 
                  scale: isHovering ? 1.4 : 1 
                }}
                transition={{ duration: 0.2 }}
                style={{
                  border: `2px solid ${FRAMER_CHART_COLORS.primaryLine}50`,
                }}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </ChatContext.Provider>
  );
}

// Internal sidebar content component
function FramerChatSidebarContent({
  onClose,
  onUndock,
}: {
  onClose: () => void;
  onUndock: () => void;
}) {
  return (
    <FramerChat
      mode="sidebar"
      defaultOpen={true}
      onModeChange={(newMode) => {
        if (newMode === "floating") onUndock();
        else if (newMode === "closed") onClose();
      }}
    />
  );
}

/**
 * ChatToggleButton - Button to toggle sidebar from anywhere
 */
export function ChatToggleButton({ className }: { className?: string }) {
  const { toggleSidebar, mode } = useChatPanel();
  
  return (
    <button
      onClick={toggleSidebar}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
        "hover:bg-white/10",
        className
      )}
      style={{ color: FRAMER_TEXT_COLORS.primary }}
    >
      <MessageCircle className="w-4 h-4" />
      <span className="text-sm">{mode === "sidebar" ? "Close Chat" : "Open Chat"}</span>
    </button>
  );
}

export default FramerChatLayout;
