import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WindowState } from "@/types";

interface WindowProps {
  window: WindowState;
  isActive: boolean;
  isDark: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
  children: React.ReactNode;
}

export function Window({
  window: win,
  isActive,
  isDark,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  onSizeChange,
  children,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, windowX: 0, windowY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobileOrTablet(window.innerWidth <= 1024); // iPad landscape and below
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleMouseDown = useCallback(() => {
    onFocus();
  }, [onFocus]);

  const handleHeaderMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (win.isMaximized) return;
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        windowX: win.position.x,
        windowY: win.position.y,
      };
    },
    [win.position.x, win.position.y, win.isMaximized],
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: win.size.width,
        height: win.size.height,
      };
    },
    [win.size.width, win.size.height],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.current.x;
        const deltaY = e.clientY - dragStart.current.y;

        const newX = dragStart.current.windowX + deltaX;
        const newY = dragStart.current.windowY + deltaY;

        const menuBarHeight = 28;
        const dockHeight = 90;
        const padding = 6;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const maxX = screenWidth - win.size.width - padding;
        const maxY = screenHeight - dockHeight - win.size.height;

        const minX = padding;
        const minY = menuBarHeight;

        onPositionChange({
          x: Math.min(Math.max(newX, minX), maxX),
          y: Math.min(Math.max(newY, minY), maxY),
        });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        onSizeChange({
          width: Math.max(
            win.minSize.width,
            resizeStart.current.width + deltaX,
          ),
          height: Math.max(
            win.minSize.height,
            resizeStart.current.height + deltaY,
          ),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [
    isDragging,
    isResizing,
    onPositionChange,
    onSizeChange,
    win.minSize.width,
    win.minSize.height,
  ]);

  return (
    <AnimatePresence>
      {!win.isMinimized && (
        <motion.div
          ref={windowRef}
          initial={{
            opacity: 0,
            scale: 0.85,
            y: 50,
          }}
          animate={{
            opacity: 1,
            scale: win.isMaximized ? 1 : 1,
            y: win.position.y,
            x: win.position.x,
            width: win.size.width,
            height: win.size.height,
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
            y: 20,
            transition: { duration: 0.2 },
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 0.8,
          }}
          style={{
            position: "absolute",
            zIndex: win.zIndex,
            top: win.position.y,
          }}
          className="rounded-xl overflow-hidden"
          onMouseDown={handleMouseDown}
        >
          {/* Window Frame */}
          <div
            className={`w-full h-full flex flex-col ${
              isDark ? "bg-[#1e1e1e]" : "bg-white"
            }`}
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${
                isActive
                  ? isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0,0,0,0.1)"
                  : isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)"
              }`,
              boxShadow: isActive
                ? isDark
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08) inset, 0 0 30px rgba(0,0,0,0.3)"
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8) inset"
                : isDark
                  ? "0 10px 30px -10px rgba(0, 0, 0, 0.5)"
                  : "0 10px 30px -10px rgba(0, 0, 0, 0.15)",
            }}
          >
            {/* Title Bar */}
            <div
              className={`h-10 flex items-center px-4 select-none flex-shrink-0 ${
                isDark
                  ? "bg-gradient-to-b from-[#2d2d2d] to-[#252525]"
                  : "bg-gradient-to-b from-[#f0f0f0] to-[#e8e8e8]"
              }`}
              onMouseDown={handleHeaderMouseDown}
              style={{
                cursor: isDragging
                  ? "grabbing"
                  : win.isMaximized
                    ? "default"
                    : "grab",
              }}
            >
              {/* Traffic Lights */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57] flex items-center justify-center group transition-all"
                  style={{ boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.1)" }}
                >
                  <svg
                    className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    viewBox="0 0 8 8"
                    fill="none"
                  >
                    <path
                      d="M2 2L6 6M6 2L2 6"
                      stroke="#4a0000"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMinimize();
                  }}
                  className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e] flex items-center justify-center group transition-all"
                  style={{ boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.1)" }}
                >
                  <svg
                    className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    viewBox="0 0 8 8"
                    fill="none"
                  >
                    <path
                      d="M1 4H7"
                      stroke="#995700"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isMobileOrTablet) onMaximize(); // 👈 Disable click
                  }}
                  className={`w-3 h-3 rounded-full flex items-center justify-center group transition-all ${
                    isMobileOrTablet
                      ? "bg-gray-400 opacity-50 cursor-default"
                      : "bg-[#28c840] hover:bg-[#28c840]"
                  }`}
                  style={{ boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.1)" }}
                >
                  {!isMobileOrTablet && ( // 👈 Hide icon on mobile
                    <svg
                      className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      viewBox="0 0 8 8"
                      fill="none"
                    >
                      <path
                        d="M2 4L4 2L6 4M4 2V6"
                        stroke="#004d00"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Title */}
              <div className="flex-1 text-center">
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-white/90" : "text-gray-700"
                  }`}
                >
                  {win.title}
                </span>
              </div>

              {/* Spacer for balance */}
              <div className="w-16" />
            </div>

            {/* Content - Fixed to not shrink */}
            <div className="flex-1 overflow-auto min-h-0">{children}</div>

            {/* Resize Handle */}
            {!win.isMaximized && (
              <div
                className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize z-10"
                onMouseDown={handleResizeMouseDown}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  className={`absolute bottom-1.5 right-1.5 ${
                    isDark ? "text-white/20" : "text-black/20"
                  }`}
                >
                  <path
                    fill="currentColor"
                    d="M9 9v5h5v-5h-5zm0-4v4h5V5h-5zM5 9v5h4V9H5z"
                  />
                </svg>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
