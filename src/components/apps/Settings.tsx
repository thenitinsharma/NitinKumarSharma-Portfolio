import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Moon,
  Sun,
  Volume2,
  Bell,
  Wifi,
  Bluetooth,
  Battery,
  User,
  Shield,
  Keyboard,
  Menu,
  X,
  Image,
  Smartphone,
  Tablet,
  Laptop,
  ChevronRight,
} from "lucide-react";
import type { WallpaperOption } from "@/hooks/useWallpaper";

interface SettingsProps {
  isDark: boolean;
  onToggleTheme: () => void;
  wallpapers: WallpaperOption[];
  selectedWallpaper: string;
  onSelectWallpaper: (id: string) => void;
  onAddCustomWallpaper: (name: string, url: string) => void;
  solidColors: Record<string, string>;
  deviceType: "mobile" | "tablet" | "desktop";
}

interface SettingSection {
  id: string;
  title: string;
  icon: string;
  settings: {
    id: string;
    label: string;
    type: "toggle" | "select" | "button";
    value?: boolean;
    options?: string[];
  }[];
}

const SETTING_SECTIONS: SettingSection[] = [
  {
    id: "general",
    title: "General",
    icon: "Monitor",
    settings: [
      {
        id: "language",
        label: "Language",
        type: "select",
        options: ["English", "Spanish", "French", "German"],
      },
      {
        id: "autoUpdate",
        label: "Automatic Updates",
        type: "toggle",
        value: true,
      },
    ],
  },
  {
    id: "appearance",
    title: "Appearance",
    icon: "Sun",
    settings: [
      {
        id: "theme",
        label: "Appearance",
        type: "select",
        options: ["Auto", "Light", "Dark"],
      },
      {
        id: "accentColor",
        label: "Accent Color",
        type: "select",
        options: ["Blue", "Purple", "Pink", "Red", "Orange", "Yellow", "Green"],
      },
      {
        id: "transparency",
        label: "Reduce Transparency",
        type: "toggle",
        value: false,
      },
    ],
  },
  {
    id: "desktop",
    title: "Desktop & Dock",
    icon: "Laptop",
    settings: [
      {
        id: "showIcons",
        label: "Show Items on Desktop",
        type: "toggle",
        value: true,
      },
      {
        id: "magnification",
        label: "Magnification",
        type: "toggle",
        value: true,
      },
      {
        id: "autoHide",
        label: "Automatically Hide Dock",
        type: "toggle",
        value: false,
      },
    ],
  },
  {
    id: "wallpaper",
    title: "Wallpaper",
    icon: "Image",
    settings: [],
  },
  {
    id: "sound",
    title: "Sound",
    icon: "Volume2",
    settings: [
      {
        id: "soundEffects",
        label: "Play Sound Effects",
        type: "toggle",
        value: true,
      },
      {
        id: "userInterfaceSounds",
        label: "Play User Interface Sounds",
        type: "toggle",
        value: true,
      },
      {
        id: "feedbackVolume",
        label: "Play Feedback on Volume Change",
        type: "toggle",
        value: true,
      },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: "Bell",
    settings: [
      {
        id: "showPreviews",
        label: "Show Previews",
        type: "select",
        options: ["Always", "When Unlocked", "Never"],
      },
      {
        id: "allowNotifications",
        label: "Allow Notifications",
        type: "toggle",
        value: true,
      },
      {
        id: "badges",
        label: "Badge App Icon",
        type: "toggle",
        value: true,
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    icon: "Shield",
    settings: [
      {
        id: "locationServices",
        label: "Location Services",
        type: "toggle",
        value: true,
      },
      {
        id: "analytics",
        label: "Share Analytics",
        type: "toggle",
        value: false,
      },
      {
        id: "fileVault",
        label: "FileVault",
        type: "toggle",
        value: true,
      },
    ],
  },
];

const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ElementType> = {
    Monitor,
    Moon,
    Sun,
    Volume2,
    Bell,
    Wifi,
    Bluetooth,
    Battery,
    User,
    Shield,
    Keyboard,
    Image,
    Smartphone,
    Tablet,
    Laptop,
  };
  return icons[iconName] || Monitor;
};

const getDeviceIcon = (deviceType: "mobile" | "tablet" | "desktop") => {
  const icons = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor,
  };
  return icons[deviceType];
};

export function Settings({
  isDark,
  onToggleTheme,
  wallpapers,
  selectedWallpaper,
  onSelectWallpaper,
  onAddCustomWallpaper,
  solidColors,
  deviceType,
}: SettingsProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const [isMobile, setIsMobile] = useState(false);
  const [customUrl, setCustomUrl] = useState("");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    if (isMobile) setSidebarOpen(false);
  };

  const DeviceIcon = getDeviceIcon(deviceType);

  return (
    <div
      className={`w-full h-full flex relative overflow-hidden ${isDark ? "bg-[#1e1e1e]" : "bg-[#f5f5f7]"}`}
    >
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - macOS Style */}
      <motion.div
        initial={false}
        animate={{ x: isMobile ? (sidebarOpen ? 0 : "-100%") : 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={`w-64 flex-shrink-0 h-full z-50 fixed inset-y-0 left-0 md:relative md:translate-x-0 ${
          isDark
            ? "bg-[#2a2a2a] border-r border-white/10"
            : "bg-[#f5f5f7] border-r border-black/10"
        }`}
        style={{
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
        }}
      >
        <div className="p-3 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 px-2 pt-1">
            <h2
              className={`text-[13px] font-semibold tracking-tight ${
                isDark ? "text-white/90" : "text-[#1d1d1f]"
              }`}
            >
              System Settings
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`p-1.5 rounded-md md:hidden ${
                isDark
                  ? "hover:bg-white/10 text-white/70"
                  : "hover:bg-black/5 text-gray-600"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-0.5 overflow-y-auto flex-1">
            {SETTING_SECTIONS.map((section) => {
              const Icon = getIconComponent(section.icon);
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-all group ${
                    isActive
                      ? isDark
                        ? "bg-[#3a3a3a] text-white"
                        : "bg-white/60 text-[#1d1d1f] shadow-sm"
                      : isDark
                        ? "text-white/70 hover:bg-white/5 hover:text-white"
                        : "text-gray-700 hover:bg-white/40"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : isDark
                          ? "bg-white/10 text-white/70 group-hover:bg-white/15"
                          : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-[13px]">
                    {section.title}
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 ml-auto opacity-40 ${isActive ? "opacity-60" : ""}`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Footer - Device Info */}
          <div
            className={`mt-4 pt-3 border-t ${isDark ? "border-white/10" : "border-black/10"}`}
          >
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                isDark ? "bg-white/5" : "bg-white/40"
              }`}
            >
              <DeviceIcon
                className={`w-4 h-4 ${isDark ? "text-white/50" : "text-gray-500"}`}
              />
              <span
                className={`text-xs font-medium ${isDark ? "text-white/60" : "text-gray-600"}`}
              >
                {deviceType === "mobile"
                  ? "iPhone"
                  : deviceType === "tablet"
                    ? "iPad"
                    : "MacBook Pro"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div
          className={`flex items-center gap-3 px-4 py-3 border-b md:hidden sticky top-0 z-30 ${
            isDark
              ? "border-white/10 bg-[#1e1e1e]/95"
              : "border-black/10 bg-[#f5f5f7]/95"
          }`}
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className={`p-2 rounded-lg ${
              isDark
                ? "hover:bg-white/10 text-white"
                : "hover:bg-black/5 text-gray-900"
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2
            className={`font-semibold text-[15px] ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {SETTING_SECTIONS.find((s) => s.id === activeSection)?.title ||
              "Settings"}
          </h2>
        </div>

        <div className="p-4 sm:p-6 max-w-5xl mx-auto">
          {/* Profile Card - macOS Style */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-xl mb-6 flex items-center gap-4 ${
              isDark
                ? "bg-[#2a2a2a] border border-white/10"
                : "bg-white border border-black/5 shadow-sm"
            }`}
          >
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                  isDark
                    ? "bg-gradient-to-br from-blue-500 to-blue-600"
                    : "bg-gradient-to-br from-blue-400 to-blue-500"
                } text-white shadow-md`}
              >
                NS
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1">
              <h3
                className={`text-[17px] font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Nitin Kumar Sharma
              </h3>
              <p
                className={`text-[13px] mt-0.5 ${
                  isDark ? "text-white/50" : "text-gray-500"
                }`}
              >
                nitin.175sharma@gmail.com
              </p>
              <p
                className={`text-[11px] mt-1 ${
                  isDark ? "text-white/40" : "text-gray-400"
                }`}
              >
                Apple ID Settings
              </p>
            </div>
            <ChevronRight
              className={`w-5 h-5 ${isDark ? "text-white/30" : "text-gray-400"}`}
            />
          </motion.div>

          {/* Dynamic Sections - macOS Style */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {SETTING_SECTIONS.filter((s) => s.id === activeSection).map(
                (section) => (
                  <div key={section.id} className="space-y-6">
                    {/* Section Header */}
                    <div>
                      <h2
                        className={`text-2xl font-bold mb-1 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {section.title}
                      </h2>
                      <p
                        className={`text-sm ${
                          isDark ? "text-white/50" : "text-gray-500"
                        }`}
                      >
                        {section.id === "wallpaper"
                          ? `Customize your ${deviceType === "mobile" ? "iPhone" : deviceType === "tablet" ? "iPad" : "Mac"} wallpaper`
                          : `Configure ${section.title.toLowerCase()} settings`}
                      </p>
                    </div>

                    {/* Wallpaper Section */}
                    {section.id === "wallpaper" ? (
                      <div
                        className={`rounded-xl overflow-hidden ${
                          isDark
                            ? "bg-[#2a2a2a] border border-white/10"
                            : "bg-white border border-black/5 shadow-sm"
                        }`}
                      >
                        <div
                          className={`px-5 py-4 border-b ${
                            isDark ? "border-white/10" : "border-black/5"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3
                                className={`font-semibold text-[15px] ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                Choose Wallpaper
                              </h3>
                              <p
                                className={`text-xs mt-0.5 ${
                                  isDark ? "text-white/50" : "text-gray-500"
                                }`}
                              >
                                {wallpapers.length} wallpapers available for{" "}
                                {deviceType}
                              </p>
                            </div>
                            <div
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium ${
                                isDark
                                  ? "bg-white/10 text-white/70"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              <DeviceIcon className="w-3.5 h-3.5" />
                              {deviceType.charAt(0).toUpperCase() +
                                deviceType.slice(1)}
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          {/* Wallpaper Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                            {wallpapers.map((wp) => (
                              <button
                                key={wp.id}
                                onClick={() => onSelectWallpaper(wp.id)}
                                className={`relative aspect-[9/16] sm:aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                                  selectedWallpaper === wp.id
                                    ? "border-blue-500 ring-4 ring-blue-500/20 scale-[0.98]"
                                    : isDark
                                      ? "border-white/10 hover:border-white/30"
                                      : "border-black/5 hover:border-black/20 hover:shadow-md"
                                }`}
                                style={
                                  wp.category === "solid"
                                    ? {
                                        backgroundColor:
                                          solidColors[wp.id] || "#1a1a2e",
                                      }
                                    : {
                                        backgroundImage: `url('${wp.thumbnail}')`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                      }
                                }
                              >
                                {selectedWallpaper === wp.id && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                                      <svg
                                        className="w-4 h-4 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                )}
                                <div
                                  className={`absolute bottom-0 inset-x-0 px-2 py-1.5 text-[10px] font-medium truncate backdrop-blur-md ${
                                    isDark
                                      ? "bg-black/60 text-white"
                                      : "bg-white/80 text-gray-900"
                                  }`}
                                >
                                  {wp.name}
                                </div>
                              </button>
                            ))}
                          </div>

                          {/* Add Custom Wallpaper */}
                          <div
                            className={`p-4 rounded-lg ${
                              isDark ? "bg-white/5" : "bg-gray-50"
                            }`}
                          >
                            <label
                              className={`block text-xs font-medium mb-2 ${
                                isDark ? "text-white/70" : "text-gray-600"
                              }`}
                            >
                              Add Custom Wallpaper
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Paste image URL..."
                                value={customUrl}
                                onChange={(e) => setCustomUrl(e.target.value)}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm outline-none border ${
                                  isDark
                                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500"
                                    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                                }`}
                              />
                              <button
                                onClick={() => {
                                  if (customUrl.trim()) {
                                    onAddCustomWallpaper(
                                      "Custom",
                                      customUrl.trim(),
                                    );
                                    setCustomUrl("");
                                  }
                                }}
                                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors shadow-sm"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Other Settings Sections */
                      <div
                        className={`rounded-xl overflow-hidden ${
                          isDark
                            ? "bg-[#2a2a2a] border border-white/10"
                            : "bg-white border border-black/5 shadow-sm"
                        }`}
                      >
                        {section.settings.map((setting, idx) => (
                          <div
                            key={setting.id}
                            className={`flex items-center justify-between px-5 py-4 ${
                              idx !== section.settings.length - 1
                                ? isDark
                                  ? "border-b border-white/10"
                                  : "border-b border-black/5"
                                : ""
                            }`}
                          >
                            <span
                              className={`font-medium text-[15px] ${
                                isDark ? "text-white/90" : "text-gray-900"
                              }`}
                            >
                              {setting.label}
                            </span>
                            {setting.type === "toggle" && (
                              <button
                                className={`w-12 h-7 rounded-full transition-all relative ${
                                  setting.value
                                    ? "bg-green-500"
                                    : isDark
                                      ? "bg-white/20"
                                      : "bg-gray-300"
                                }`}
                              >
                                <div
                                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all ${
                                    setting.value
                                      ? "translate-x-[22px]"
                                      : "translate-x-0.5"
                                  }`}
                                />
                              </button>
                            )}
                            {setting.type === "select" && (
                              <select
                                onChange={(e) => {
                                  if (
                                    setting.id === "theme" &&
                                    (e.target.value === "Light" ||
                                      e.target.value === "Dark")
                                  ) {
                                    onToggleTheme();
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium outline-none border ${
                                  isDark
                                    ? "bg-white/5 border-white/10 text-white"
                                    : "bg-gray-50 border-gray-200 text-gray-900"
                                }`}
                              >
                                {setting.options?.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Additional Info Cards */}
                    {section.id === "privacy" && (
                      <div
                        className={`p-4 rounded-xl flex items-start gap-3 ${
                          isDark
                            ? "bg-blue-500/10 border border-blue-500/20"
                            : "bg-blue-50 border border-blue-100"
                        }`}
                      >
                        <Shield
                          className={`w-5 h-5 mt-0.5 ${
                            isDark ? "text-blue-400" : "text-blue-600"
                          }`}
                        />
                        <div>
                          <h4
                            className={`font-semibold text-sm ${
                              isDark ? "text-blue-400" : "text-blue-900"
                            }`}
                          >
                            Privacy Protection
                          </h4>
                          <p
                            className={`text-xs mt-1 ${
                              isDark ? "text-blue-300/70" : "text-blue-700"
                            }`}
                          >
                            Your data is encrypted and protected with
                            industry-leading security measures.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ),
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
