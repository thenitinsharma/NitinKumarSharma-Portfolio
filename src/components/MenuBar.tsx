import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi,
  Battery,
  BatteryCharging,
  BatteryMedium,
  BatteryLow,
  Search,
  Sun,
  Moon,
  Bluetooth,
  ChevronRight,
  Check,
  Power,
  RefreshCw,
  Lock,
  FilePlus,
  Moon as MoonIcon,
} from "lucide-react";
import { format } from "date-fns";

interface MenuBarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSpotlight: () => void;
  onOpenLaunchpad: () => void;
  activeAppName: string;
  onViewModeChange?: (mode: "icon" | "list" | "column") => void;
  viewMode?: "icon" | "list" | "column";
}

interface MenuItem {
  label?: string;
  shortcut?: string;
  action?: () => void;
  submenu?: MenuItem[];
  separator?: boolean;
  checked?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function MenuBar({
  isDark,
  onToggleTheme,
  onOpenSpotlight,
  onOpenLaunchpad,
  activeAppName,
  onViewModeChange,
  viewMode = "icon",
}: MenuBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showWifiPanel, setShowWifiPanel] = useState(false);
  const [showBluetoothPanel, setShowBluetoothPanel] = useState(false);
  const [showPowerDialog, setShowPowerDialog] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        battery.addEventListener("levelchange", () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener("chargingchange", () => {
          setIsCharging(battery.charging);
        });
      });
    }
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
        setShowWifiPanel(false);
        setShowBluetoothPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getBatteryIcon = () => {
    if (isCharging) return BatteryCharging;
    if (batteryLevel > 60) return Battery;
    if (batteryLevel > 30) return BatteryMedium;
    return BatteryLow;
  };

  const BatteryIcon = getBatteryIcon();

  // System actions
  const handleSleep = useCallback(() => {
    setIsLocked(true);
    setActiveMenu(null);
  }, []);

  const handleRestart = useCallback(() => {
    window.location.reload();
  }, []);

  const handleShutdown = useCallback(() => {
    setShowPowerDialog(true);
    setActiveMenu(null);
  }, []);

  const handleLock = useCallback(() => {
    setIsLocked(true);
    setActiveMenu(null);
  }, []);

  const handleNewFile = useCallback(() => {
    // Create a new text file in Finder
    window.dispatchEvent(new CustomEvent("newFile"));
    setActiveMenu(null);
  }, []);

  const appleMenuItems: MenuItem[] = [
    {
      label: "About This Mac",
      action: () =>
        window.dispatchEvent(new CustomEvent("openApp", { detail: "about" })),
    },
    { separator: true },
    {
      label: "System Settings...",
      shortcut: "⌘,",
      action: () =>
        window.dispatchEvent(
          new CustomEvent("openApp", { detail: "settings" }),
        ),
    },
    { label: "App Store...", action: () => {} },
    { separator: true },
    {
      label: "Recent Items",
      submenu: [
        {
          label: "DeployHub Project",
          action: () =>
            window.dispatchEvent(
              new CustomEvent("openApp", { detail: "projects" }),
            ),
        },
        {
          label: "Resume.pdf",
          action: () =>
            window.dispatchEvent(
              new CustomEvent("openApp", { detail: "resume" }),
            ),
        },
        { label: "Clear Menu", action: () => {} },
      ],
    },
    { separator: true },
    { label: "Force Quit...", shortcut: "⌘⌥⎋", action: () => {} },
    { separator: true },
    {
      label: "Sleep",
      icon: <MoonIcon className="w-4 h-4" />,
      action: handleSleep,
    },
    {
      label: "Restart...",
      icon: <RefreshCw className="w-4 h-4" />,
      action: handleRestart,
    },
    {
      label: "Shut Down...",
      icon: <Power className="w-4 h-4" />,
      action: handleShutdown,
    },
    { separator: true },
    {
      label: "Lock Screen",
      shortcut: "⌘⌃Q",
      icon: <Lock className="w-4 h-4" />,
      action: handleLock,
    },
    { label: "Log Out Nitin...", shortcut: "⇧⌘Q", action: () => {} },
  ];

  const fileMenuItems: MenuItem[] = [
    {
      label: "New Finder Window",
      shortcut: "⌘N",
      action: () =>
        window.dispatchEvent(new CustomEvent("openApp", { detail: "finder" })),
    },
    { label: "New Folder", shortcut: "⇧⌘N", action: () => {} },
    {
      label: "New File",
      shortcut: "⌘T",
      icon: <FilePlus className="w-4 h-4" />,
      action: handleNewFile,
    },
    {
      label: "New Folder with Selection",
      shortcut: "⌃⌘N",
      action: () => {},
      disabled: true,
    },
    { label: "New Smart Folder", action: () => {} },
    { separator: true },
    { label: "Open", shortcut: "⌘O", action: () => {}, disabled: true },
    {
      label: "Open With",
      submenu: [
        { label: "Default", checked: true },
        { label: "TextEdit" },
        { label: "VS Code" },
      ],
    },
    { separator: true },
    {
      label: "Close Window",
      shortcut: "⌘W",
      action: () => window.dispatchEvent(new CustomEvent("closeActiveWindow")),
    },
    { label: "Get Info", shortcut: "⌘I", action: () => {} },
    { separator: true },
    { label: "Share", action: () => {}, disabled: true },
  ];

  const editMenuItems: MenuItem[] = [
    { label: "Undo", shortcut: "⌘Z", action: () => {}, disabled: true },
    { label: "Redo", shortcut: "⇧⌘Z", action: () => {}, disabled: true },
    { separator: true },
    { label: "Cut", shortcut: "⌘X", action: () => {}, disabled: true },
    { label: "Copy", shortcut: "⌘C", action: () => {}, disabled: true },
    { label: "Paste", shortcut: "⌘V", action: () => {}, disabled: true },
    { label: "Select All", shortcut: "⌘A", action: () => {} },
    { separator: true },
    { label: "Show Clipboard", action: () => {} },
    { separator: true },
    { label: "Start Dictation...", shortcut: "Fn Fn", action: () => {} },
    { label: "Emoji & Symbols", shortcut: "⌃⌘Space", action: () => {} },
  ];

  const viewMenuItems: MenuItem[] = [
    {
      label: "as Icons",
      shortcut: "⌘1",
      checked: viewMode === "icon",
      action: () => onViewModeChange?.("icon"),
    },
    {
      label: "as List",
      shortcut: "⌘2",
      checked: viewMode === "list",
      action: () => onViewModeChange?.("list"),
    },
    {
      label: "as Columns",
      shortcut: "⌘3",
      checked: viewMode === "column",
      action: () => onViewModeChange?.("column"),
    },
    { separator: true },
    { label: "Show Preview", action: () => {} },
    { label: "Show Path Bar", action: () => {} },
    { label: "Show Status Bar", checked: true, action: () => {} },
    { separator: true },
    { label: "Show Toolbar", shortcut: "⌥⌘T", checked: true, action: () => {} },
    { label: "Customize Toolbar...", action: () => {} },
  ];

  const goMenuItems: MenuItem[] = [
    { label: "Back", shortcut: "⌘[", action: () => {} },
    { label: "Forward", shortcut: "⌘]", action: () => {} },
    { label: "Enclosing Folder", shortcut: "⌘↑", action: () => {} },
    { separator: true },
    { label: "Home", shortcut: "⇧⌘H", action: () => {} },
    { label: "Documents", shortcut: "⇧⌘O", action: () => {} },
    { label: "Desktop", shortcut: "⇧⌘D", action: () => {} },
    { label: "Downloads", shortcut: "⌥⌘L", action: () => {} },
    { separator: true },
    { label: "Applications", shortcut: "⇧⌘A", action: onOpenLaunchpad },
    { label: "Utilities", shortcut: "⇧⌘U", action: () => {} },
  ];

  const windowMenuItems: MenuItem[] = [
    {
      label: "Minimize",
      shortcut: "⌘M",
      action: () =>
        window.dispatchEvent(new CustomEvent("minimizeActiveWindow")),
    },
    {
      label: "Zoom",
      action: () =>
        window.dispatchEvent(new CustomEvent("maximizeActiveWindow")),
    },
    { label: "Show Previous Tab", shortcut: "⇧⌃⇥", action: () => {} },
    { label: "Show Next Tab", shortcut: "⌃⇥", action: () => {} },
    { label: "Move Tab to New Window", action: () => {} },
    { separator: true },
    { label: "Bring All to Front", action: () => {} },
  ];

  const helpMenuItems: MenuItem[] = [
    {
      label: "Portfolio Help",
      action: () => window.open("/rules.txt", "_blank"),
    },
    { separator: true },
    {
      label: "Keyboard Shortcuts",
      action: () => window.open("/rules.txt", "_blank"),
    },
    { label: "What's New", action: () => {} },
  ];

  const renderMenu = (items: MenuItem[], menuName: string) => (
    <AnimatePresence>
      {activeMenu === menuName && (
        <motion.div
          initial={{ opacity: 0, y: -5, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -5, scale: 0.98 }}
          transition={{ duration: 0.1 }}
          className={`absolute top-full left-0 mt-1 min-w-[220px] rounded-lg overflow-hidden shadow-2xl ${
            isDark ? "bg-[#1e1e1e]/95" : "bg-white/95"
          }`}
          style={{
            backdropFilter: "blur(20px) saturate(180%)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          }}
        >
          {items.map((item, index) =>
            item.separator ? (
              <div
                key={index}
                className={`h-px my-1 mx-2 ${isDark ? "bg-white/10" : "bg-black/10"}`}
              />
            ) : item.submenu ? (
              <div key={index} className="relative group">
                <button
                  className={`w-full px-4 py-1.5 text-left text-sm flex items-center justify-between ${
                    isDark
                      ? "hover:bg-[#007aff] hover:text-white text-white/90"
                      : "hover:bg-[#007aff] hover:text-white text-gray-800"
                  } ${item.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </span>
                  <ChevronRight className="w-3 h-3" />
                </button>
                {/* Submenu */}
                <div
                  className={`absolute left-full top-0 ml-0.5 min-w-[180px] rounded-lg overflow-hidden shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all ${
                    isDark ? "bg-[#1e1e1e]" : "bg-white"
                  }`}
                >
                  {item.submenu.map((subItem, subIndex) => (
                    <button
                      key={subIndex}
                      onClick={subItem.action}
                      className={`w-full px-4 py-1.5 text-left text-sm flex items-center justify-between ${
                        isDark
                          ? "hover:bg-[#007aff] hover:text-white text-white/90"
                          : "hover:bg-[#007aff] hover:text-white text-gray-800"
                      }`}
                    >
                      <span>{subItem.label}</span>
                      {subItem.checked && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                key={index}
                onClick={() => {
                  item.action?.();
                  setActiveMenu(null);
                }}
                disabled={item.disabled}
                className={`w-full px-4 py-1.5 text-left text-sm flex items-center justify-between ${
                  isDark
                    ? "hover:bg-[#007aff] hover:text-white text-white/90"
                    : "hover:bg-[#007aff] hover:text-white text-gray-800"
                } ${item.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <span className="flex items-center gap-2">
                  {item.icon}
                  {item.checked && <Check className="w-3 h-3" />}
                  {item.label}
                </span>
                {item.shortcut && (
                  <span className="text-xs opacity-60 ml-4">
                    {item.shortcut}
                  </span>
                )}
              </button>
            ),
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.div
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        ref={menuRef}
        className="fixed top-0 left-0 right-0 h-8 z-[1000] flex items-center justify-between px-3"
        style={{
          background: isDark
            ? "rgba(30, 30, 30, 0.75)"
            : "rgba(255, 255, 255, 0.55)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        }}
      >
        {/* Left Side */}
        <div className="flex items-center gap-1">
          {/* Apple Logo */}
          <div className="relative">
            <button
              onClick={() =>
                setActiveMenu(activeMenu === "apple" ? null : "apple")
              }
              className={`p-1.5 rounded transition-colors ${
                activeMenu === "apple"
                  ? isDark
                    ? "bg-white/20"
                    : "bg-black/10"
                  : isDark
                    ? "hover:bg-white/10"
                    : "hover:bg-black/10"
              }`}
            >
              {/* <Apple className="w-4 h-4" /> */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"></path>
              </svg>
            </button>
            {renderMenu(appleMenuItems, "apple")}
          </div>

          {/* Active App Name */}
          <span
            className={`text-sm font-semibold ml-2 ${
              isDark ? "text-white" : "text-gray-950"
            }`}
          >
            {activeAppName || "Finder"}
          </span>

          {/* Menu Items */}
          {[
            { label: "File", menu: "file", items: fileMenuItems },
            { label: "Edit", menu: "edit", items: editMenuItems },
            { label: "View", menu: "view", items: viewMenuItems },
            { label: "Go", menu: "go", items: goMenuItems },
            { label: "Window", menu: "window", items: windowMenuItems },
            { label: "Help", menu: "help", items: helpMenuItems },
          ].map(({ label, menu, items }) => (
            <div key={menu} className="relative hidden md:block">
              <button
                onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                className={`px-2 py-1 rounded text-sm transition-colors ${
                  activeMenu === menu
                    ? isDark
                      ? "bg-white/20 text-white"
                      : "bg-black/10 text-gray-900"
                    : isDark
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-gray-800 hover:text-gray-900 hover:bg-black/10"
                }`}
              >
                {label}
              </button>
              {renderMenu(items, menu)}
            </div>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-1.5 rounded transition-colors ${
              isDark ? "hover:bg-white/10" : "hover:bg-black/10"
            }`}
            title="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Spotlight */}

          <button
            onClick={isMobile ? onOpenLaunchpad : onOpenSpotlight} // 🔥 Change is here
            className={`p-1.5 rounded transition-colors ${
              isDark ? "hover:bg-white/10" : "hover:bg-black/10"
            }`}
            title={isMobile ? "Launchpad" : "Spotlight Search"}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* WiFi */}
          <div className="relative hidden md:block">
            <button
              onClick={() => {
                setShowWifiPanel(!showWifiPanel);
                setShowBluetoothPanel(false);
              }}
              className={`p-1.5 rounded transition-colors ${
                showWifiPanel
                  ? isDark
                    ? "bg-white/20"
                    : "bg-black/10"
                  : isDark
                    ? "hover:bg-white/10"
                    : "hover:bg-black/10"
              }`}
            >
              <Wifi className="w-4 h-4" />
            </button>

            {/* WiFi Panel */}
            <AnimatePresence>
              {showWifiPanel && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={`absolute top-full right-0 mt-2 w-72 rounded-xl overflow-hidden ${
                    isDark ? "bg-[#1e1e1e]/95" : "bg-white/95"
                  }`}
                  style={{
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        Wi-Fi
                      </span>
                      <div className="w-11 h-6 bg-[#34c759] rounded-full relative">
                        <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      {["Home WiFi", "Office Network", "iPhone Hotspot"].map(
                        (network, i) => (
                          <div
                            key={network}
                            className={`flex items-center justify-between p-2 rounded-lg ${
                              i === 0
                                ? isDark
                                  ? "bg-[#007aff]/20"
                                  : "bg-blue-50"
                                : isDark
                                  ? "hover:bg-white/5"
                                  : "hover:bg-black/5"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Wifi
                                className={`w-4 h-4 ${i === 0 ? "text-[#007aff]" : ""}`}
                              />
                              <span
                                className={
                                  isDark ? "text-white/90" : "text-gray-800"
                                }
                              >
                                {network}
                              </span>
                            </div>
                            {i === 0 && (
                              <Check className="w-4 h-4 text-[#007aff]" />
                            )}
                          </div>
                        ),
                      )}
                    </div>
                    <div
                      className={`mt-4 pt-3 border-t ${isDark ? "border-white/10" : "border-black/10"}`}
                    >
                      <button
                        className={`text-sm ${isDark ? "text-[#007aff]" : "text-blue-600"}`}
                      >
                        Network Preferences...
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bluetooth */}
          <div className="relative hidden md:block ">
            <button
              onClick={() => {
                setShowBluetoothPanel(!showBluetoothPanel);
                setShowWifiPanel(false);
              }}
              className={`p-1.5 rounded transition-colors ${
                showBluetoothPanel
                  ? isDark
                    ? "bg-white/20"
                    : "bg-black/10"
                  : isDark
                    ? "hover:bg-white/10"
                    : "hover:bg-black/10"
              }`}
            >
              <Bluetooth className="w-4 h-4" />
            </button>

            {/* Bluetooth Panel */}
            <AnimatePresence>
              {showBluetoothPanel && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={`absolute top-full right-0 mt-2 w-64 rounded-xl overflow-hidden ${
                    isDark ? "bg-[#1e1e1e]/95" : "bg-white/95"
                  }`}
                  style={{
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        Bluetooth
                      </span>
                      <div className="w-11 h-6 bg-[#34c759] rounded-full relative">
                        <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                      </div>
                    </div>
                    <div
                      className={`text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}
                    >
                      Now discoverable as "Nitin's MacBook Pro"
                    </div>
                    <div
                      className={`mt-4 pt-3 border-t ${isDark ? "border-white/10" : "border-black/10"}`}
                    >
                      <button
                        className={`text-sm ${isDark ? "text-[#007aff]" : "text-blue-600"} w-full text-left`}
                      >
                        Bluetooth Preferences...
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Battery */}
          <div className="flex items-center gap-1 px-1.5">
            <BatteryIcon className="w-5 h-5" />
            <span className="text-xs hidden sm:inline">{batteryLevel}%</span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 px-2">
            <span className="text-sm hidden md:block ">
              {format(currentTime, "EEE MMM d")}
            </span>
            <span className="text-sm font-medium">
              {format(currentTime, "h:mm a")}
            </span>
          </div>
        </div>
      </motion.div>
      {/* Lock Screen Overlay */}

      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-between py-12 px-6 cursor-pointer"
            style={{
              // background: isDark
              // ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
              // : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backdropFilter: "blur(40px) brightness(0.8)", // Enhanced blur for the "Glass" look
            }}
            onClick={() => setIsLocked(false)}
          >
            {/* Top Right Status Icons */}
            <div className="absolute top-6 right-8 flex items-center gap-3 text-white/90">
              <span className="text-[10px] font-bold tracking-tighter opacity-80">
                U.S.
              </span>
              <Wifi className="w-4 h-4" />
              <Battery className="w-5 h-5" />
            </div>

            {/* Top Center: Date and Time */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-center mt-10"
            >
              <div className="text-white/90 text-xl font-medium mb-1 drop-shadow-lg">
                {format(currentTime, "EEEE, MMMM d")}
              </div>
              <div className="text-white text-[90px] font-bold leading-none tracking-tight drop-shadow-2xl">
                {format(currentTime, "HH:mm")}
              </div>
            </motion.div>

            {/* Bottom Center: User Profile */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-transparent border-2 border-white/20 flex items-center justify-center shadow-xl">
                <span className="text-2xl">🐵</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <h2 className="text-sm font-semibold text-white drop-shadow-md">
                  Nitin Kumar Sharma
                </h2>
                <p className="text-[10px] text-white/70 font-medium">
                  Touch ID or Enter Password
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Power Dialog */}
      <AnimatePresence>
        {showPowerDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(10px)",
            }}
            onClick={() => setShowPowerDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`p-6 rounded-2xl ${isDark ? "bg-[#1e1e1e]" : "bg-white"}`}
              style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
            >
              <h3
                className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Are you sure you want to shut down?
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPowerDialog(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    isDark
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-black/10 text-gray-900 hover:bg-black/20"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-[#ff3b30] text-white hover:bg-[#ff3b30]/90"
                >
                  Shut Down
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
