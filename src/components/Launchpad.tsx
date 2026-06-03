import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface LaunchpadProps {
  isOpen: boolean;
  onClose: () => void;
  apps: { id: string; name: string; icon: string; color: string }[];
  onOpenApp: (appId: string) => void;
  isDark: boolean;
}

export function Launchpad({
  isOpen,
  onClose,
  apps,
  onOpenApp,
  isDark,
}: LaunchpadProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024); // Using 1024 for iPad support
    checkMobile();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };

    window.addEventListener("resize", checkMobile);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Circle;
  };

  const handleAppClick = (appId: string) => {
    onOpenApp(appId);
    onClose();
    setSearchQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[5000] overflow-hidden"
        >
          {/* --- BACKGROUND TAP-TO-CLOSE LAYER --- */}
          <div
            className="absolute inset-0 z-[5001]"
            onClick={() => {
              if (isMobile) onClose();
            }}
          >
            {/* Blurred Wallpaper */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url(/wallpaper.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(40px) brightness(0.7)",
                transform: "scale(1.1)",
              }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* --- CONTENT LAYER --- */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-[5002] h-full flex flex-col items-center justify-center p-8 pointer-events-none"
          >
            {/* Search Bar - Re-enable pointer events here */}
            <div className="mb-12 w-full max-w-md pointer-events-auto">
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                  isDark ? "bg-white/15" : "bg-white/25"
                } backdrop-blur-md`}
              >
                <Search className="w-5 h-5 text-white/70" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-white/50 text-lg"
                  autoFocus={!isMobile} // 🔥 NO AUTO-FOCUS ON MOBILE
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Apps Grid - Re-enable pointer events here */}
            <div
              className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-6 md:gap-8 max-w-5xl overflow-y-auto pointer-events-auto no-scrollbar pb-10"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {/* Internal style for Webkit Hide */}
              <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

              {filteredApps.map((app, index) => {
                const Icon = getIconComponent(app.icon);

                return (
                  <motion.button
                    key={app.id}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: index * 0.03,
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAppClick(app.id)}
                    className="flex flex-col items-center gap-2 group"
                  >
                    {/* App Icon */}
                    <div
                      className="w-16 h-16 md:w-24 md:h-24 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:shadow-2xl overflow-hidden"
                      style={{
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                      }}
                    >
                      <img
                        src={`/Icons/${app.icon}`}
                        alt={app.name}
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                      <Icon
                        className="w-8 h-8 md:w-12 md:h-12 text-white"
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* App Name */}
                    <span className="text-white text-[11px] md:text-sm font-medium text-center drop-shadow-lg">
                      {app.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Close Hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-8 text-white/50 text-sm font-medium"
            >
              {isMobile ? "Tap background to close" : "Press Esc to close"}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
