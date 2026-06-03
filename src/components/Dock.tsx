import { useRef } from "react";
import { motion } from "framer-motion";

interface DockItem {
  id: string;
  name: string;
  icon: string;
  color?: string;
  isOpen: boolean;
  isPersistent: boolean;
}

interface DockProps {
  items: DockItem[];
  onItemClick: (id: string) => void;
  isDark: boolean;
}

const maxAdditionalSize = 5;

export function Dock({ items, onItemClick, isDark }: DockProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleAppHover = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (!dockRef.current || isMobile) return;

    const mousePosition = ev.clientX;
    const iconPositionLeft = ev.currentTarget.getBoundingClientRect().left;
    const iconWidth = ev.currentTarget.getBoundingClientRect().width;

    const cursorDistance = (mousePosition - iconPositionLeft) / iconWidth;

    // Scale value function
    const scaleValue = (
      inputValue: number,
      inputRange: [number, number],
      outputRange: [number, number],
    ) => {
      const [inputMin, inputMax] = inputRange;
      const [outputMin, outputMax] = outputRange;

      const clampedInput = Math.min(Math.max(inputValue, inputMin), inputMax);
      const normalizedInput = (clampedInput - inputMin) / (inputMax - inputMin);
      return outputMin + normalizedInput * (outputMax - outputMin);
    };

    const offsetPixels = scaleValue(
      cursorDistance,
      [0, 1],
      [maxAdditionalSize * -1, maxAdditionalSize],
    );

    dockRef.current.style.setProperty(
      "--dock-offset-left",
      `${offsetPixels * -1}px`,
    );

    dockRef.current.style.setProperty(
      "--dock-offset-right",
      `${offsetPixels}px`,
    );
  };

  return (
    <>
      <style>{`
        .dock-app {
          width: 60px;
          height: 60px;
          transition: width 100ms cubic-bezier(0.25, 1, 0.5, 1),
                      height 100ms cubic-bezier(0.25, 1, 0.5, 1),
                      margin-top 100ms cubic-bezier(0.25, 1, 0.5, 1);
        }

        @media (min-width: 768px) {
          .dock-app:hover {
            width: 90px;
            height: 90px;
            margin-top: -30px;
          }

          /* Right side neighbors */
          .dock-app:hover + .dock-app {
            width: calc(80px + var(--dock-offset-right, 0px));
            height: calc(80px + var(--dock-offset-right, 0px));
            margin-top: calc(-20px + var(--dock-offset-right, 0px) * -1);
          }

          .dock-app:hover + .dock-app + .dock-app {
            width: calc(70px + var(--dock-offset-right, 0px));
            height: calc(70px + var(--dock-offset-right, 0px));
            margin-top: calc(-10px + var(--dock-offset-right, 0px) * -1);
          }

          /* Left side neighbors */
          .dock-app:has(+ .dock-app:hover) {
            width: calc(80px + var(--dock-offset-left, 0px));
            height: calc(80px + var(--dock-offset-left, 0px));
            margin-top: calc(-20px + var(--dock-offset-left, 0px) * -1);
          }

          .dock-app:has(+ .dock-app + .dock-app:hover) {
            width: calc(70px + var(--dock-offset-left, 0px));
            height: calc(70px + var(--dock-offset-left, 0px));
            margin-top: calc(-10px + var(--dock-offset-left, 0px) * -1);
          }
        }

        .dock-icon-button {
          transition: transform 100ms ease;
        }

        .dock-icon-button:active {
          transform: scale(0.95);
        }

        .dock-tooltip {
          transition: opacity 100ms ease-in;
        }

        @keyframes dock-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .dock-app:active {
          animation: dock-bounce 300ms ease-in-out;
        }

        /* Mobile scrollbar styling */
        .dock-scroll-container::-webkit-scrollbar {
          display: none;
        }
        
        .dock-scroll-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Fade edges on mobile */
        @media (max-width: 767px) {
          .dock-wrapper {
            position: relative;
          }
          
          .dock-wrapper::before,
          .dock-wrapper::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            width: 20px;
            pointer-events: none;
            z-index: 1;
          }
          
          .dock-wrapper::before {
            left: 0;
            background: linear-gradient(to right, 
              ${isDark ? "rgba(30, 30, 30, 0.8)" : "rgba(255, 255, 255, 0.1)"}, 
              transparent
            );
          }
          
          .dock-wrapper::after {
            right: 0;
            background: linear-gradient(to left, 
              ${isDark ? "rgba(30, 30, 30, 0.8)" : "rgba(255, 255, 255, 0.1)"}, 
              transparent
            );
          }
        }
      `}</style>

      <div
        className={`fixed ${isMobile ? "bottom-2" : "bottom-4"} ${
          isMobile ? "left-0 right-0" : "left-1/2 -translate-x-1/2"
        } ${isMobile ? "z-40" : "z-[999]"}`}
      >
        <div className={isMobile ? "dock-wrapper px-2" : ""}>
          <div
            className={`${
              isMobile
                ? "dock-scroll-container overflow-x-auto overflow-y-visible"
                : ""
            }`}
          >
            <div
              ref={dockRef}
              className={`flex items-end ${
                isMobile ? "justify-start" : "justify-center"
              } px-3 pb-2 pt-3 rounded-2xl ${isMobile ? "w-max mx-auto" : ""}`}
              style={{
                background: isDark
                  ? "linear-gradient(to bottom, rgba(30, 30, 30, 0.6), rgba(30, 30, 30, 0.8))"
                  : "linear-gradient(to bottom, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07))",
                backdropFilter: "blur(25px) saturate(180%)",
                WebkitBackdropFilter: "blur(25px) saturate(180%)",
                border: `1px solid ${
                  isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                }`,
                boxShadow: isDark
                  ? "0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05) inset"
                  : "0 10px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255,255,255,0.5) inset",
              }}
            >
              {items.slice(0, 9).map((item) => (
                <div
                  key={item.id}
                  className="dock-app relative group flex flex-col items-center"
                  onMouseMove={isMobile ? undefined : handleAppHover}
                >
                  {/* Tooltip */}
                  <div
                    className={`dock-tooltip absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none ${
                      isDark
                        ? "bg-[#2a2a2a] text-white"
                        : "bg-white text-gray-900"
                    }`}
                    style={{
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    {item.name}
                  </div>

                  {/* Icon Button */}
                  <button
                    onClick={() => onItemClick(item.id)}
                    className="dock-icon-button relative w-full h-full rounded-xl flex items-center justify-center"
                  >
                    <img
                      src={`/Icons/${item.icon}`}
                      alt={item.name}
                      className="w-full h-full object-contain pointer-events-none"
                      draggable="false"
                    />
                  </button>

                  {/* Open Indicator Dot */}
                  {item.isOpen && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-1 w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.6)"
                          : "rgba(0,0,0,0.4)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
