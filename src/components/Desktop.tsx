import { motion } from "framer-motion";

interface DesktopIcon {
  id: string;
  name: string;
  icon: string;
  position: { x: number; y: number };
}

interface DesktopProps {
  icons: DesktopIcon[];
  onIconClick: (id: string) => void;
  isDark: boolean;
}

export function Desktop({ icons, onIconClick, isDark }: DesktopProps) {
  return (
    <div className="fixed inset-0 pt-7 pb-24 px-4 pointer-events-none">
      <div className="relative w-full h-full">
        {icons.map((icon, index) => {
          return (
            <motion.button
              key={icon.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.5 + index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              onClick={() => onIconClick(icon.id)}
              className="absolute flex flex-col items-center gap-1 p-2 rounded-lg  hover:bg-[#007aff]/30 pointer-events-auto group"
              style={{
                left: icon.position.x,
                top: icon.position.y,
              }}
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center  transition-all duration-200 `}
              >
                <img
                  className="w-10 h-10 text-[#007aff]"
                  src={`/Icons/${icon.icon}`}
                  alt={icon.name}
                />
                {/* <Icon className="w-7 h-7 text-[#007aff]" /> */}
              </div>
              <span
                className={`text-xs text-center max-w-[80px] truncate px-1 rounded ${
                  isDark ? "text-white/80" : "text-white "
                }`}
              >
                {icon.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
