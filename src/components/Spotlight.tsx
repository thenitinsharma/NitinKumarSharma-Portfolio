import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { SpotlightResult } from "@/types";

interface SpotlightProps {
  isOpen: boolean;
  query: string;
  setQuery: (query: string) => void;
  results: SpotlightResult[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onClose: () => void;
  isDark: boolean;
}

export function Spotlight({
  isOpen,
  query,
  setQuery,
  results,
  selectedIndex,
  setSelectedIndex,
  onClose,
  isDark,
}: SpotlightProps) {
  // const getIconComponent = (iconName: string) => {
  //   const Icon = (LucideIcons as any)[iconName];
  //   return Icon || LucideIcons.Circle;
  // };

  console.log("results", results);

  const handleResultClick = (result: SpotlightResult) => {
    result.action();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[2000] bg-black/35"
          />

          {/* SPOTLIGHT PANEL */}
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="
              fixed 
           
              top-[20%] 
              z-[2001]
              w-[600px] 
              max-w-[92vw]
               inset-x-0 mx-auto 

            "
          >
            <div
              className={`rounded-xl overflow-hidden ${
                isDark ? "bg-[#1f1f1fcc]" : "bg-white/90"
              }`}
              style={{
                backdropFilter: "blur(30px)",
                WebkitBackdropFilter: "blur(30px)",
                boxShadow:
                  "0 40px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              {/* SEARCH BAR */}
              <div className="px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <LucideIcons.Search
                    className={`w-5 h-5 ${
                      isDark ? "text-white/40" : "text-black/40"
                    }`}
                  />

                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedIndex(0);
                    }}
                    placeholder="Spotlight Search"
                    autoFocus
                    className={`flex-1 bg-transparent outline-none text-lg ${
                      isDark
                        ? "text-white placeholder:text-white/30"
                        : "text-black placeholder:text-black/30"
                    }`}
                  />

                  <div
                    className={`text-[11px] px-2 py-[2px] rounded ${
                      isDark
                        ? "bg-white/10 text-white/50"
                        : "bg-black/10 text-black/50"
                    }`}
                  >
                    ⌘ Space
                  </div>
                </div>
              </div>

              {/* RESULTS */}
              <div className="max-h-[420px] overflow-y-auto py-2">
                {results.length === 0 ? (
                  <div
                    className={`px-6 py-10 text-center ${
                      isDark ? "text-white/40" : "text-black/40"
                    }`}
                  >
                    No results
                  </div>
                ) : (
                  results.map((result, index) => {
                    // const Icon = getIconComponent(result.icon);
                    const isSelected = index === selectedIndex;

                    return (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center gap-3 px-5 py-3 text-left transition ${
                          isSelected
                            ? isDark
                              ? "bg-white/10"
                              : "bg-black/10"
                            : ""
                        }`}
                      >
                        <img
                          src={`/Icons/${result.icon}`}
                          className="w-[36px] h-[36px] opacity-80"
                          alt={result.name}
                        />
                        {/* <Icon className="w-[20px] h-[20px] opacity-80" /> */}

                        <div className="flex-1">
                          <div className="text-[15px] font-medium">
                            {result.name}
                          </div>
                          <div
                            className={`text-xs ${
                              isDark ? "text-white/40" : "text-black/40"
                            }`}
                          >
                            {result.type === "app" ? "Application" : "Command"}
                          </div>
                        </div>

                        {isSelected && (
                          <LucideIcons.CornerDownLeft className="w-4 h-4 opacity-60" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* FOOTER */}
              <div
                className={`px-5 py-2 text-xs ${
                  isDark
                    ? "border-t border-white/10 text-white/40"
                    : "border-t border-black/10 text-black/40"
                }`}
              >
                ↑↓ Navigate · Enter Open · Esc Close
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
