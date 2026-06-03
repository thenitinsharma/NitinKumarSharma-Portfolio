import { useState, useCallback, useRef } from "react";
import type { WindowState, App } from "@/types";

export const INITIAL_APPS: App[] = [
  {
    id: "finder",
    name: "Finder",
    icon: "Finder.png",
    color: "#007aff",
    isOpen: false,
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: "Terminal.png",
    color: "#34c759",
    isOpen: false,
  },

  {
    id: "gallery",
    name: "Photos",
    icon: "Photo.png",
    color: "#ff9500",
    isOpen: false,
  },

  {
    id: "contact",
    name: "Contact",
    icon: "Contact.png",
    color: "#007aff",
    isOpen: false,
  },
  {
    id: "settings",
    name: "Settings",
    icon: "Setting.png",
    color: "#8e8e93",
    isOpen: false,
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: "Spotify.png",
    color: "#1db954",
    isOpen: false,
  },
  {
    id: "youtube",
    name: "Youtube",
    icon: "Youtube.png",
    color: "#1db954",
    isOpen: false,
  },

  {
    id: "journal",
    name: "Journal",
    icon: "journal.png",
    color: "#ff6b35",
    isOpen: false,
  },
  {
    id: "camera",
    name: "Camera",
    icon: "Camera.png",
    color: "#8e8e93",
    isOpen: false,
  },
  {
    id: "resume",
    name: "Resume",
    icon: "PDF.png",
    color: "#1db954",
    isOpen: false,
  },
  {
    id: "about",
    name: "About Me",
    icon: "Folder.png",
    color: "#ff9500",
    isOpen: false,
  },
  {
    id: "projects",
    name: "Projects",
    icon: "Folder.png",
    color: "#af52de",
    isOpen: false,
  },
  {
    id: "skills",
    name: "Skills",
    icon: "Folder.png",
    color: "#ff3b30",
    isOpen: false,
  },
  {
    id: "experience",
    name: "Experience",
    icon: "Folder.png",
    color: "#5ac8fa",
    isOpen: false,
  },
];

// Change 768 to 1024 to cover most iPads in portrait/landscape
const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth <= 1024;
// const MOBILE_DOCK_HEIGHT = 90;

const createWindowState = (app: App, zIndex: number): WindowState => {
  const defaultSizes: Record<string, { width: number; height: number }> = {
    finder: { width: 850, height: 500 },
    terminal: { width: 750, height: 500 },
    about: { width: 700, height: 500 },
    gallery: { width: 700, height: 500 },
    projects: { width: 750, height: 500 },
    skills: { width: 800, height: 500 },
    experience: { width: 800, height: 500 },
    resume: { width: 900, height: 500 },
    contact: { width: 800, height: 500 },
    settings: { width: 700, height: 500 },
    spotify: { width: 850, height: 500 },
    youtube: { width: 1100, height: 500 },
    journal: { width: 900, height: 500 },
    camera: { width: 600, height: 500 },
  };

  const size = defaultSizes[app.id] || { width: 600, height: 400 };

  // Center the window on screen with proper calculations
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 800;
  const menuBarHeight = 28;
  const dockHeight = 80;

  const centerX = Math.max(20, (screenWidth - size.width) / 2);
  const centerY = Math.max(
    menuBarHeight + 10,
    (screenHeight - size.height - dockHeight) / 2,
  );

  const mobile = isMobile();

  return {
    id: `window-${app.id}-${Date.now()}`,
    appId: app.id,
    title: app.name,
    isOpen: true,
    isMinimized: false,
    isMaximized: mobile, // 👈 FORCE MAX ON MOBILE
    zIndex,
    position: mobile ? { x: 0, y: 17 } : { x: centerX, y: centerY },
    size: mobile
      ? {
          width: screenWidth,
          height: screenHeight - 28,
        }
      : { ...size },
    defaultSize: { ...size },
    minSize: { width: 400, height: 350 },
    data: {},
  };
};

export function useWindowManager() {
  const [apps, setApps] = useState<App[]>(INITIAL_APPS);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const zIndexCounter = useRef(100);

  const openWindow = useCallback(
    (appId: string) => {
      const existingWindow = windows.find((w) => w.appId === appId);

      if (existingWindow) {
        if (existingWindow.isMinimized) {
          const mobile = isMobile();

          setWindows((prev) =>
            prev.map((w) =>
              w.id === existingWindow.id
                ? {
                    ...w,
                    isMinimized: false,
                    isMaximized: mobile ? true : w.isMaximized,
                    position: mobile ? { x: 0, y: 17 } : w.position,
                    size: mobile
                      ? {
                          width: window.innerWidth,
                          height: window.innerHeight - 28,
                        }
                      : w.size,
                    zIndex: ++zIndexCounter.current,
                  }
                : w,
            ),
          );
        }

        setActiveWindowId(existingWindow.id);
        setApps((prev) =>
          prev.map((app) =>
            app.id === appId ? { ...app, isOpen: true } : app,
          ),
        );
        return;
      }

      const app = apps.find((a) => a.id === appId);
      if (!app) return;

      const newWindow = createWindowState(app, ++zIndexCounter.current);
      setWindows((prev) => [...prev, newWindow]);
      setActiveWindowId(newWindow.id);
      setApps((prev) =>
        prev.map((a) => (a.id === appId ? { ...app, isOpen: true } : a)),
      );
    },
    [apps, windows],
  );

  const closeWindow = useCallback(
    (windowId: string) => {
      const window = windows.find((w) => w.id === windowId);
      setWindows((prev) => prev.filter((w) => w.id !== windowId));
      if (window) {
        setApps((prev) =>
          prev.map((app) =>
            app.id === window.appId ? { ...app, isOpen: false } : app,
          ),
        );
      }
      if (activeWindowId === windowId) {
        const remaining = windows.filter(
          (w) => w.id !== windowId && !w.isMinimized,
        );
        setActiveWindowId(
          remaining.length > 0 ? remaining[remaining.length - 1].id : null,
        );
      }
    },
    [windows, activeWindowId],
  );

  const minimizeWindow = useCallback(
    (windowId: string) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w)),
      );
      const remaining = windows.filter(
        (w) => w.id !== windowId && !w.isMinimized,
      );
      setActiveWindowId(
        remaining.length > 0 ? remaining[remaining.length - 1].id : null,
      );
    },
    [windows],
  );

  const maximizeWindow = useCallback((windowId: string) => {
    const menuBarHeight = 15;
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== windowId) return w;
        if (w.isMaximized) {
          // Restore to default size
          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;
          return {
            ...w,
            isMaximized: false,
            size: { ...w.defaultSize },
            position: {
              x: Math.max(20, (screenWidth - w.defaultSize.width) / 2),
              y: Math.max(
                menuBarHeight + 20,
                (screenHeight - w.defaultSize.height - 100) / 2,
              ),
            },
          };
        }
        // Full screen without any gaps

        return {
          ...w,
          isMaximized: true,
          position: { x: 0, y: menuBarHeight },
          size: {
            width: window.innerWidth,
            height: window.innerHeight - menuBarHeight,
          },
        };
      }),
    );
  }, []);

  const focusWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId ? { ...w, zIndex: ++zIndexCounter.current } : w,
      ),
    );
    setActiveWindowId(windowId);
  }, []);

  const updateWindowPosition = useCallback(
    (windowId: string, position: { x: number; y: number }) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, position } : w)),
      );
    },
    [],
  );

  // const updateWindowSize = useCallback(
  //   (windowId: string, size: { width: number; height: number }) => {
  //     setWindows((prev) =>
  //       prev.map((w) => (w.id === windowId ? { ...w, size } : w)),
  //     );
  //   },
  //   [],
  // );

  const updateWindowSize = useCallback(
    (windowId: string, size: { width: number; height: number }) => {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== windowId) return w;

          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;
          const dockHeight = 80;

          const maxX = screenWidth - size.width;
          const maxY = screenHeight - dockHeight - size.height;

          return {
            ...w,
            size,
            position: {
              x: Math.min(w.position.x, maxX),
              y: Math.min(w.position.y, maxY),
            },
          };
        }),
      );
    },
    [],
  );

  const updateWindowData = useCallback(
    (windowId: string, data: Record<string, any>) => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === windowId ? { ...w, data: { ...w.data, ...data } } : w,
        ),
      );
    },
    [],
  );

  const getAppById = useCallback(
    (appId: string) => {
      return apps.find((app) => app.id === appId);
    },
    [apps],
  );

  const getWindowById = useCallback(
    (windowId: string) => {
      return windows.find((w) => w.id === windowId);
    },
    [windows],
  );

  return {
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
    updateWindowData,
    getAppById,
    getWindowById,
  };
}
