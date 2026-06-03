import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MenuBar } from "@/components/MenuBar";
import { Dock } from "@/components/Dock";
import { Window } from "@/components/Window";
import { Spotlight } from "@/components/Spotlight";
import { Desktop } from "@/components/Desktop";
import { Launchpad } from "@/components/Launchpad";
import {
  Terminal,
  Finder,
  About,
  Projects,
  Skills,
  Experience,
  Contact,
  Resume,
  Settings,
  Spotify,
  Journal,
  Gallery,
  Camera,
  Youtube,
} from "@/components/apps";
import { useWindowManager } from "@/hooks/useWindowManager";
import { useSpotlight } from "@/hooks/useSpotlight";
import { useTheme } from "@/hooks/useTheme";
import { useWallpaper } from "@/hooks/useWallpaper";

// Desktop icons configuration
const DESKTOP_ICONS = [
  {
    id: "about",
    name: "About Me",
    icon: "Folder.png",
    position: { x: 20, y: 20 },
  },
  {
    id: "projects",
    name: "Projects",
    icon: "Folder.png",
    position: { x: 20, y: 120 },
  },
  {
    id: "skills",
    name: "Skills",
    icon: "Folder.png",
    position: { x: 20, y: 220 },
  },
  {
    id: "experience",
    name: "Experience",
    icon: "Folder.png",
    position: { x: 20, y: 320 },
  },
  {
    id: "resume",
    name: "Resume",
    icon: "PDF.png",
    position: { x: 20, y: 420 },
  },
];

function App() {
  const {
    apps,
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowManager();

  const {
    wallpapers,
    selectedWallpaper,
    setSelectedWallpaper,
    getBackgroundStyle,
    addCustomWallpaper,
    solidColors,
  } = useWallpaper();

  const { isDark, toggleTheme } = useTheme();

  const [launchpadOpen, setLaunchpadOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"icon" | "list" | "column">("icon");
  const [bootComplete, setBootComplete] = useState(false);
  // Replace the old [isMobile, setIsMobile] state
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">(
    "desktop",
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType("mobile");
      } else if (width >= 768 && width < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const {
    isOpen: spotlightOpen,
    query: spotlightQuery,
    setQuery: setSpotlightQuery,
    results: spotlightResults,
    selectedIndex: spotlightSelectedIndex,
    setSelectedIndex: setSpotlightSelectedIndex,
    closeSpotlight,
    toggleSpotlight,
  } = useSpotlight({
    apps: apps.map((app) => ({
      id: app.id,
      name: app.name,
      icon: app.icon,
      color: app.color,
    })),
    onOpenApp: openWindow,
  });

  // Boot screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setBootComplete(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const isAnyWindowMaximized = windows.some(
    (w) => w.isMaximized && !w.isMinimized,
  );
  const [showDock, setShowDock] = useState(true);
  const [isHoveringDock, setIsHoveringDock] = useState(false);

  useEffect(() => {
    if (!isAnyWindowMaximized) {
      setShowDock(true);
      return;
    }

    let hideTimeout: ReturnType<typeof setTimeout>;

    const handleMouseMove = (e: MouseEvent) => {
      const threshold = 100; // px from bottom - increased for better UX
      const isNearBottom = window.innerHeight - e.clientY <= threshold;

      if (isNearBottom || isHoveringDock) {
        clearTimeout(hideTimeout);
        setShowDock(true);
      } else {
        // Add a small delay before hiding to prevent flickering
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
          if (!isHoveringDock) {
            setShowDock(false);
          }
        }, 300);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(hideTimeout);
    };
  }, [isAnyWindowMaximized, isHoveringDock]);

  // Listen for menu bar events
  useEffect(() => {
    const handleOpenApp = (e: CustomEvent) => {
      const appId = e.detail;
      if (appId) openWindow(appId);
    };

    const handleCloseActiveWindow = () => {
      if (activeWindowId) closeWindow(activeWindowId);
    };

    const handleMinimizeActiveWindow = () => {
      if (activeWindowId) minimizeWindow(activeWindowId);
    };

    const handleMaximizeActiveWindow = () => {
      if (activeWindowId) maximizeWindow(activeWindowId);
    };

    window.addEventListener("openApp", handleOpenApp as EventListener);
    window.addEventListener("closeActiveWindow", handleCloseActiveWindow);
    window.addEventListener("minimizeActiveWindow", handleMinimizeActiveWindow);
    window.addEventListener("maximizeActiveWindow", handleMaximizeActiveWindow);

    return () => {
      window.removeEventListener("openApp", handleOpenApp as EventListener);
      window.removeEventListener("closeActiveWindow", handleCloseActiveWindow);
      window.removeEventListener(
        "minimizeActiveWindow",
        handleMinimizeActiveWindow,
      );
      window.removeEventListener(
        "maximizeActiveWindow",
        handleMaximizeActiveWindow,
      );
    };
  }, [openWindow, closeWindow, minimizeWindow, maximizeWindow, activeWindowId]);

  // Keyboard shortcuts - Cross platform (Windows/Mac)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const metaKey = isMac ? e.metaKey : e.ctrlKey;

      // Spotlight: Cmd/Ctrl + Space
      if (metaKey && e.key === " ") {
        e.preventDefault();
        toggleSpotlight();
        return;
      }

      // Theme Toggle: Cmd/Ctrl + Shift + T
      if (metaKey && e.shiftKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        toggleTheme();
        return;
      }

      // Launchpad: Cmd/Ctrl + A
      if (metaKey && e.key.toLowerCase() === "a" && !e.shiftKey) {
        e.preventDefault();
        setLaunchpadOpen(true);
        return;
      }

      // Close Window: Cmd/Ctrl + W
      if (metaKey && e.key.toLowerCase() === "w" && activeWindowId) {
        e.preventDefault();
        closeWindow(activeWindowId);
        return;
      }

      // Minimize Window: Cmd/Ctrl + M
      if (metaKey && e.key.toLowerCase() === "m" && activeWindowId) {
        e.preventDefault();
        minimizeWindow(activeWindowId);
        return;
      }

      // Open Apps: Cmd/Ctrl + 1-9
      if (metaKey && /^[1-9]$/.test(e.key)) {
        e.preventDefault();
        const appMap: Record<string, string> = {
          "1": "finder",
          "2": "terminal",
          "3": "about",
          "4": "projects",
          "5": "skills",
          "6": "experience",
          "7": "resume",
          "8": "contact",
          "9": "settings",
        };
        const appId = appMap[e.key];
        if (appId) {
          openWindow(appId);
        }
        return;
      }

      // View Modes: Cmd/Ctrl + 1/2/3
      if (metaKey && ["1", "2", "3"].includes(e.key)) {
        const modes: ("icon" | "list" | "column")[] = [
          "icon",
          "list",
          "column",
        ];
        const modeIndex = parseInt(e.key) - 1;
        if (modes[modeIndex]) {
          setViewMode(modes[modeIndex]);
        }
      }

      // Escape to close Launchpad or Spotlight
      if (e.key === "Escape") {
        if (launchpadOpen) {
          setLaunchpadOpen(false);
        }
        if (spotlightOpen) {
          closeSpotlight();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    toggleSpotlight,
    toggleTheme,
    activeWindowId,
    closeWindow,
    minimizeWindow,
    openWindow,
    launchpadOpen,
    spotlightOpen,
    closeSpotlight,
  ]);

  // Get active app name for menu bar
  const activeAppName = activeWindowId
    ? windows.find((w) => w.id === activeWindowId)?.title || "Finder"
    : "Finder";

  // Handle desktop icon click
  const handleDesktopIconClick = useCallback(
    (id: string) => {
      openWindow(id);
    },
    [openWindow],
  );

  // Handle dock item click
  const handleDockItemClick = useCallback(
    (id: string) => {
      openWindow(id);
    },
    [openWindow],
  );

  // CRITICAL FIX: Memoize renderAppContent to prevent re-renders
  const renderAppContent = useCallback(
    (appId: string) => {
      switch (appId) {
        case "terminal":
          return <Terminal isDark={isDark} />;
        case "finder":
          return <Finder isDark={isDark} />;
        case "about":
          return <About isDark={isDark} />;
        case "gallery":
          return <Gallery isDark={isDark} />;
        case "projects":
          return <Projects />;
        case "skills":
          return <Skills />;
        case "experience":
          return <Experience />;
        case "contact":
          return <Contact isDark={isDark} />;
        case "resume":
          return <Resume isDark={isDark} />;
        case "settings":
          return (
            <Settings
              isDark={isDark}
              onToggleTheme={toggleTheme}
              wallpapers={wallpapers}
              selectedWallpaper={selectedWallpaper}
              onSelectWallpaper={setSelectedWallpaper}
              onAddCustomWallpaper={addCustomWallpaper}
              solidColors={solidColors}
              deviceType={deviceType}
            />
          );
        case "spotify":
          return <Spotify isDark={isDark} />;
        case "youtube":
          return <Youtube isDark={isDark} />;
        case "journal":
          return <Journal isDark={isDark} />;
        case "camera":
          return <Camera isDark={isDark} />;
        default:
          return (
            <div className={`p-8 ${isDark ? "text-white" : "text-gray-900"}`}>
              App not found
            </div>
          );
      }
    },
    [
      isDark,
      toggleTheme,
      wallpapers,
      selectedWallpaper,
      setSelectedWallpaper,
      addCustomWallpaper,
      solidColors,
    ], // Only re-create when these change
  );

  return (
    <div
      className="h-screen w-screen overflow-hidden fixed inset-0 touch-none"
      style={getBackgroundStyle(deviceType)}
    >
      {/* Wallpaper Overlay */}
      <div
        className="fixed inset-0"
        style={{
          backgroundColor: isDark
            ? "rgba(0,0,0,0.02)"
            : "rgba(255,255,255,0.01)",
        }}
      />

      {/* Menu Bar */}
      <MenuBar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenSpotlight={toggleSpotlight}
        onOpenLaunchpad={() => setLaunchpadOpen(true)}
        activeAppName={activeAppName}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
      />

      {/* Desktop Area */}
      <div className="relative w-full h-screen pt-0 pb-20">
        {/* Desktop Icons */}
        <Desktop
          icons={DESKTOP_ICONS}
          onIconClick={handleDesktopIconClick}
          isDark={isDark}
        />

        {/* Windows */}
        <AnimatePresence mode="popLayout">
          {windows.map((window) => (
            <Window
              key={window.id}
              window={window}
              isActive={window.id === activeWindowId}
              isDark={isDark}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onMaximize={() => maximizeWindow(window.id)}
              onFocus={() => focusWindow(window.id)}
              onPositionChange={(position) =>
                updateWindowPosition(window.id, position)
              }
              onSizeChange={(size) => updateWindowSize(window.id, size)}
            >
              {renderAppContent(window.appId)}
            </Window>
          ))}
        </AnimatePresence>
      </div>

      {/* Dock */}
      <AnimatePresence>
        {showDock && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999]"
            onMouseEnter={() => setIsHoveringDock(true)}
            onMouseLeave={() => setIsHoveringDock(false)}
          >
            <Dock
              items={apps.map((app) => ({
                id: app.id,
                name: app.name,
                icon: app.icon,
                color: app.color,
                isOpen: app.isOpen,
                isPersistent: true,
              }))}
              onItemClick={handleDockItemClick}
              isDark={isDark}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spotlight - Centered */}
      <Spotlight
        isOpen={spotlightOpen}
        query={spotlightQuery}
        setQuery={setSpotlightQuery}
        results={spotlightResults}
        selectedIndex={spotlightSelectedIndex}
        setSelectedIndex={setSpotlightSelectedIndex}
        onClose={closeSpotlight}
        isDark={isDark}
      />

      {/* Launchpad */}
      <Launchpad
        isOpen={launchpadOpen}
        onClose={() => setLaunchpadOpen(false)}
        apps={apps.map((app) => ({
          id: app.id,
          name: app.name,
          icon: app.icon,
          color: app.color || "#007aff",
        }))}
        onOpenApp={openWindow}
        isDark={isDark}
      />

      {/* Boot Screen */}
      <BootScreen isComplete={bootComplete} />
    </div>
  );
}

// Boot Screen Component
function BootScreen({ isComplete }: { isComplete: boolean }) {
  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundColor: "#000" }}
        >
          {/* Apple Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-24 h-24 text-white"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-48 h-1 rounded-full overflow-hidden bg-white/20">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
