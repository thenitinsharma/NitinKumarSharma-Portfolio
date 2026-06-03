import { useState, Fragment, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  FolderOpen,
  FileText,
  Image,
  Music,
  Video,
  Code,
  Star,
  Clock,
  HardDrive,
  Cloud,
  Monitor,
  ChevronRight,
  Search,
  Menu,
  X, // Added for mobile close
} from "lucide-react";

interface FinderProps {
  isDark: boolean;
  onOpenProject?: (projectId: string) => void;
}

interface FolderItem {
  id: string;
  name: string;
  type: "folder" | "file";
  icon: string;
  size?: string;
  modified?: string;
  color?: string;
}

const SIDEBAR_ITEMS = [
  {
    section: "Favorites",
    items: [
      { id: "airdrop", name: "AirDrop", icon: "Monitor" },
      { id: "recents", name: "Recents", icon: "Clock" },
      { id: "applications", name: "Applications", icon: "Folder" },
      { id: "desktop", name: "Desktop", icon: "Monitor" },
      { id: "documents", name: "Documents", icon: "Folder" },
    ],
  },
  {
    section: "iCloud",
    items: [
      { id: "icloud", name: "iCloud Drive", icon: "Cloud" },
      { id: "photos", name: "Photos", icon: "Image" },
    ],
  },
  {
    section: "Locations",
    items: [
      { id: "macbook", name: "MacBook Pro", icon: "HardDrive" },
      { id: "network", name: "Network", icon: "Monitor" },
    ],
  },
];

const PROJECTS: FolderItem[] = [
  {
    id: "ecommerce",
    name: "E-Commerce Platform",
    type: "folder",
    icon: "ShoppingCart",
    size: "--",
    modified: "Today",
    color: "#007aff",
  },
  {
    id: "taskapp",
    name: "Task Management App",
    type: "folder",
    icon: "CheckSquare",
    size: "--",
    modified: "Yesterday",
    color: "#34c759",
  },
  {
    id: "ai-content",
    name: "AI Content Generator",
    type: "folder",
    icon: "Sparkles",
    size: "--",
    modified: "2 days ago",
    color: "#af52de",
  },
  {
    id: "portfolio",
    name: "Portfolio Website",
    type: "folder",
    icon: "Globe",
    size: "--",
    modified: "3 days ago",
    color: "#ff9500",
  },
  {
    id: "weather",
    name: "Weather Dashboard",
    type: "folder",
    icon: "Cloud",
    size: "--",
    modified: "1 week ago",
    color: "#5ac8fa",
  },
  {
    id: "chat",
    name: "Chat Application",
    type: "folder",
    icon: "MessageCircle",
    size: "--",
    modified: "2 weeks ago",
    color: "#ff3b30",
  },
];

export function Finder({ isDark }: FinderProps) {
  const [viewMode] = useState<"icon" | "list">("icon");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState(["Projects"]);
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle Logic States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredProjects = PROJECTS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleItemClick = (item: FolderItem) => {
    setSelectedItem(item.id);
  };

  const handleItemDoubleClick = (item: FolderItem) => {
    if (item.type === "folder") {
      setCurrentPath([...currentPath, item.name]);
    }
  };

  const getIconComponent = (iconName: string | undefined) => {
    if (!iconName) return Folder;
    const icons: Record<string, React.ElementType> = {
      Folder,
      FolderOpen,
      FileText,
      Image,
      Music,
      Video,
      Code,
      Star,
      Clock,
      HardDrive,
      Cloud,
      Monitor,
      ChevronRight,
      Search,
      Menu,
      ShoppingCart: Folder,
      CheckSquare: Folder,
      Sparkles: Folder,
      Globe: Folder,
      MessageCircle: Folder,
    };
    return icons[iconName] || Folder;
  };

  return (
    <div
      className={`w-full h-full flex relative overflow-hidden ${isDark ? "bg-[#1e1e1e]" : "bg-white"}`}
    >
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: isMobile ? (sidebarOpen ? 0 : "-100%") : 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`w-48 flex-shrink-0 border-r z-50 h-full fixed md:relative md:translate-x-0 ${
          isDark ? "border-white/10 bg-[#1e1e1e]" : "border-black/10 bg-gray-50"
        }`}
      >
        <div className="p-4 space-y-4">
          {/* Mobile Close Button */}
          <div className="flex md:hidden justify-end">
            <button
              onClick={() => setSidebarOpen(false)}
              className={isDark ? "text-white/40" : "text-black/40"}
            >
              <X size={18} />
            </button>
          </div>

          {SIDEBAR_ITEMS.map((section) => (
            <div key={section.section}>
              <h3
                className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-white/40" : "text-black/40"}`}
              >
                {section.section}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = getIconComponent(item.icon);
                  return (
                    <button
                      key={item.id}
                      onClick={() => isMobile && setSidebarOpen(false)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                        isDark
                          ? "hover:bg-white/10 text-white/80"
                          : "hover:bg-black/10 text-gray-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div
          className={`h-12 flex items-center justify-between px-4 border-b ${isDark ? "border-white/10" : "border-black/10"}`}
        >
          <div className="flex items-center gap-2">
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className={`p-1.5 rounded md:hidden ${isDark ? "hover:bg-white/10 text-white" : "hover:bg-black/10 text-gray-700"}`}
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-1">
              <button
                className={`p-1.5 rounded ${isDark ? "hover:bg-white/10" : "hover:bg-black/10"}`}
              >
                <ChevronRight
                  className={`w-4 h-4 rotate-180 ${isDark ? "text-white/60" : "text-gray-600"}`}
                />
              </button>
              <button
                className={`p-1.5 rounded ${isDark ? "hover:bg-white/10" : "hover:bg-black/10"}`}
              >
                <ChevronRight
                  className={`w-4 h-4 ${isDark ? "text-white/60" : "text-gray-600"}`}
                />
              </button>
            </div>
            <div
              className={`flex items-center gap-1 text-sm truncate ${isDark ? "text-white/60" : "text-gray-600"}`}
            >
              {currentPath.map((path, index) => (
                <Fragment key={index}>
                  {index > 0 && <ChevronRight className="w-3 h-3" />}
                  <span
                    className={
                      index === currentPath.length - 1 ? "font-medium" : ""
                    }
                  >
                    {path}
                  </span>
                </Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isDark ? "bg-white/10" : "bg-black/10"}`}
            >
              <Search
                className={`w-4 h-4 ${isDark ? "text-white/40" : "text-black/40"}`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className={`bg-transparent outline-none text-sm w-24 sm:w-32 ${isDark ? "text-white placeholder:text-white/40" : "text-gray-900 placeholder:text-black/40"}`}
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-auto">
          {viewMode === "icon" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProjects.map((item, index) => {
                const Icon = getIconComponent(item.icon);
                const isSelected = selectedItem === item.id;

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleItemClick(item)}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
                      isSelected
                        ? "bg-[#007aff]/20 ring-2 ring-[#007aff]"
                        : isDark
                          ? "hover:bg-white/10"
                          : "hover:bg-black/10"
                    }`}
                  >
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: item.color || "#007aff" }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <span
                      className={`text-sm text-center ${isDark ? "text-white/80" : "text-gray-700"}`}
                    >
                      {item.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}

          {viewMode === "list" && (
            <div
              className={`rounded-lg overflow-hidden border ${isDark ? "border-white/10" : "border-black/10"}`}
            >
              <table className="w-full">
                <thead className={isDark ? "bg-white/5" : "bg-black/5"}>
                  <tr
                    className={`text-left text-xs uppercase tracking-wider ${isDark ? "text-white/40" : "text-black/40"}`}
                  >
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Size</th>
                    <th className="px-4 py-2">Modified</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((item) => {
                    const Icon = getIconComponent(item.icon);
                    const isSelected = selectedItem === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        onDoubleClick={() => handleItemDoubleClick(item)}
                        className={`cursor-pointer transition-colors ${isSelected ? "bg-[#007aff]/20" : isDark ? "hover:bg-white/5" : "hover:bg-black/5"}`}
                      >
                        <td className="px-4 py-3 flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded flex items-center justify-center"
                            style={{ backgroundColor: item.color || "#007aff" }}
                          >
                            <Icon className="w-3 h-3 text-white" />
                          </div>
                          <span
                            className={
                              isDark ? "text-white/80" : "text-gray-700"
                            }
                          >
                            {item.name}
                          </span>
                        </td>
                        <td
                          className={`px-4 py-3 text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}
                        >
                          {item.size}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}
                        >
                          {item.modified}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div
          className={`h-6 flex items-center justify-between px-4 text-xs ${isDark ? "bg-white/5 text-white/40" : "bg-black/5 text-black/40"}`}
        >
          <span>{filteredProjects.length} items</span>
          <span>
            {filteredProjects.reduce(
              (acc, p) =>
                acc + (p.size === "--" || !p.size ? 0 : parseInt(p.size)),
              0,
            )}{" "}
            GB available
          </span>
        </div>
      </div>
    </div>
  );
}
