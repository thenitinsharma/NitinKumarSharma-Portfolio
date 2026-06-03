import { motion } from "framer-motion";

interface HeroSectionProps {
  isDark: boolean;
}

// Alternative: Modern macOS-style Hero
export function MacOSHero({ isDark }: HeroSectionProps) {
  return (
    <div className="relative h-40 overflow-hidden">
      {/* Dynamic Color Waves */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 400"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{
                stopColor: isDark ? "#007aff" : "#3b82f6",
                stopOpacity: 0.6,
              }}
            />
            <stop
              offset="50%"
              style={{
                stopColor: isDark ? "#5e5ce6" : "#8b5cf6",
                stopOpacity: 0.5,
              }}
            />
            <stop
              offset="100%"
              style={{
                stopColor: isDark ? "#af52de" : "#ec4899",
                stopOpacity: 0.6,
              }}
            />
          </linearGradient>
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{
                stopColor: isDark ? "#ff2d55" : "#f43f5e",
                stopOpacity: 0.4,
              }}
            />
            <stop
              offset="100%"
              style={{
                stopColor: isDark ? "#af52de" : "#a855f7",
                stopOpacity: 0.3,
              }}
            />
          </linearGradient>
        </defs>

        <motion.path
          d="M0,300 Q250,250 500,300 T1000,300 L1000,0 L0,0 Z"
          fill="url(#grad1)"
          initial={{ d: "M0,300 Q250,250 500,300 T1000,300 L1000,0 L0,0 Z" }}
          animate={{
            d: [
              "M0,300 Q250,250 500,300 T1000,300 L1000,0 L0,0 Z",
              "M0,320 Q250,280 500,320 T1000,320 L1000,0 L0,0 Z",
              "M0,300 Q250,250 500,300 T1000,300 L1000,0 L0,0 Z",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.path
          d="M0,350 Q250,320 500,350 T1000,350 L1000,0 L0,0 Z"
          fill="url(#grad2)"
          initial={{ d: "M0,350 Q250,320 500,350 T1000,350 L1000,0 L0,0 Z" }}
          animate={{
            d: [
              "M0,350 Q250,320 500,350 T1000,350 L1000,0 L0,0 Z",
              "M0,330 Q250,300 500,330 T1000,330 L1000,0 L0,0 Z",
              "M0,350 Q250,320 500,350 T1000,350 L1000,0 L0,0 Z",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </svg>

      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
            : "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
        }}
        animate={{
          x: [-1000, 1000],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
