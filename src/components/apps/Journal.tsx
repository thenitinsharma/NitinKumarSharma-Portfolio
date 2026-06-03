import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  Smile,
  Zap,
  Sun,
  CloudRain,
  BookOpen,
  Plus,
  Search,
  Menu,
  X,
} from "lucide-react";

// Mock Types - Replace with your actual import if available
export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: "happy" | "productive" | "reflective" | "excited" | "challenging";
}

interface JournalProps {
  isDark: boolean;
}

const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "1",
    date: "2025-01-28",
    title: "First Day at Nitya Consulting",
    content: `Today was my first day as a Full Stack Developer Intern at Nitya Consulting Services. I'm excited to work on AI-powered recruitment platforms using Next.js and Vapi AI. The team seems welcoming and the projects look challenging but rewarding. Looking forward to learning more about automated candidate screening and 3D AI agents.`,
    mood: "excited",
  },
  {
    id: "2",
    date: "2025-01-15",
    title: "DeployHub is Live!",
    content: `Finally deployed DeployHub - my one-click deployment platform! It was a challenging project involving AWS ECS, Kafka for real-time logs, and ClickHouse for analytics. Seeing it live and working smoothly is incredibly satisfying. The subdomain-based access feature is working perfectly.`,
    mood: "productive",
  },
  {
    id: "3",
    date: "2024-12-20",
    title: "End of Semester Reflections",
    content: `This semester has been intense. Balanced my B.Tech coursework with two internships and multiple projects. My CGPA is holding steady at 8.2, and I've learned so much about the MERN stack, cloud technologies, and AI integration.`,
    mood: "reflective",
  },
  {
    id: "4",
    date: "2024-11-10",
    title: "Hackathon Victory!",
    content: `Our team won the Code-Zen hackathon! I developed the official website for the event, and it was amazing to see it being used by hundreds of participants.`,
    mood: "happy",
  },
  {
    id: "5",
    date: "2024-10-05",
    title: "Learning Vapi AI",
    content: `Spent the weekend diving deep into Vapi AI for voice automation. The integration with n8n workflows is fascinating.`,
    mood: "productive",
  },
  {
    id: "6",
    date: "2024-09-15",
    title: "Challenging Week",
    content: `This week was tough. Had to debug a complex issue with WebSocket connections in the VideoTube project.`,
    mood: "challenging",
  },
];

const moodIcons = {
  happy: Smile,
  productive: Zap,
  reflective: BookOpen,
  excited: Sun,
  challenging: CloudRain,
};

const moodColors = {
  happy: "#34c759",
  productive: "#007aff",
  reflective: "#af52de",
  excited: "#ff9500",
  challenging: "#ff3b30",
};

export default function Journal({ isDark }: JournalProps) {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size to handle toggle logic
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const filteredEntries = JOURNAL_ENTRIES.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div
      className={`flex w-full h-screen overflow-hidden ${isDark ? "bg-[#0a0a0a]" : "bg-gray-50"}`}
    >
      {/* 1. MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40"
          />
        )}
      </AnimatePresence>

      {/* 2. SIDEBAR */}
      <motion.div
        initial={false}
        // Force x: 0 on desktop regardless of sidebarOpen state
        animate={{ x: isMobile ? (sidebarOpen ? 0 : "-100%") : 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`
          fixed inset-y-0 left-0 z-50 w-80 border-r flex flex-col
          md:relative md:translate-x-0 md:z-0
          ${isDark ? "border-white/10 bg-[#1e1e1e]" : "border-black/10 bg-white"}
        `}
      >
        {/* Sidebar Header */}
        <div
          className={`p-4 border-b ${isDark ? "border-white/10" : "border-black/10"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Journal
            </h2>
            <div className="flex items-center gap-1">
              <button
                className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-black/5 text-gray-600"}`}
              >
                <Plus className="w-5 h-5" />
              </button>
              {/* Close Button - Mobile Only */}
              <button
                onClick={() => setSidebarOpen(false)}
                className={`p-2 rounded-lg md:hidden ${isDark ? "text-white/70" : "text-gray-600"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl ${isDark ? "bg-white/5" : "bg-black/5"}`}
          >
            <Search
              className={`w-4 h-4 ${isDark ? "text-white/40" : "text-black/40"}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entries..."
              className={`flex-1 bg-transparent outline-none text-sm ${
                isDark
                  ? "text-white placeholder:text-white/30"
                  : "text-gray-900 placeholder:text-black/40"
              }`}
            />
          </div>
        </div>

        {/* Scrollable Entry List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredEntries.map((entry) => {
            const MoodIcon = moodIcons[entry.mood];
            const isSelected = selectedEntry?.id === entry.id;

            return (
              <button
                key={entry.id}
                onClick={() => handleSelectEntry(entry)}
                className={`w-full p-4 text-left border-b transition-all border-transparent ${
                  isDark ? "border-b-white/5" : "border-b-black/5"
                } ${
                  isSelected
                    ? isDark
                      ? "bg-white/10 border-l-4 border-l-blue-500"
                      : "bg-blue-50 border-l-4 border-l-blue-500"
                    : isDark
                      ? "hover:bg-white/5"
                      : "hover:bg-black/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${moodColors[entry.mood]}15` }}
                  >
                    <MoodIcon
                      className="w-5 h-5"
                      style={{ color: moodColors[entry.mood] }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3
                        className={`font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {entry.title}
                      </h3>
                    </div>
                    <p
                      className={`text-[11px] mt-0.5 font-medium uppercase tracking-wider ${isDark ? "text-white/40" : "text-gray-400"}`}
                    >
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p
                      className={`text-sm mt-2 line-clamp-2 leading-relaxed ${isDark ? "text-white/50" : "text-gray-600"}`}
                    >
                      {entry.content}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Header (Sticky) */}
        <div
          className={`flex items-center justify-between p-4 border-b md:hidden ${isDark ? "border-white/10 bg-[#0a0a0a]" : "border-black/10 bg-white"}`}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className={`p-2 rounded-lg ${isDark ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-black/5"}`}
          >
            <Menu className="w-6 h-6" />
          </button>
          <span
            className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {selectedEntry ? "Entry" : "Journal"}
          </span>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <AnimatePresence mode="wait">
            {selectedEntry ? (
              <motion.div
                key={selectedEntry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto"
              >
                {/* Back button for mobile navigation */}
                <button
                  onClick={() => setSelectedEntry(null)}
                  className={`md:hidden flex items-center gap-2 mb-6 text-sm font-medium ${isDark ? "text-white/60" : "text-gray-500"}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to List
                </button>

                <header className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${moodColors[selectedEntry.mood]}20`,
                      }}
                    >
                      {(() => {
                        const Icon = moodIcons[selectedEntry.mood];
                        return (
                          <Icon
                            className="w-7 h-7"
                            style={{ color: moodColors[selectedEntry.mood] }}
                          />
                        );
                      })()}
                    </div>
                    <div>
                      <h1
                        className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {selectedEntry.title}
                      </h1>
                      <div
                        className={`flex items-center gap-2 mt-1 text-sm ${isDark ? "text-white/40" : "text-gray-500"}`}
                      >
                        <Calendar className="w-4 h-4" />
                        {formatDate(selectedEntry.date)}
                      </div>
                    </div>
                  </div>
                </header>

                <article
                  className={`text-lg leading-relaxed whitespace-pre-wrap ${isDark ? "text-white/80" : "text-gray-700"}`}
                >
                  {selectedEntry.content}
                </article>

                <div className="mt-12 pt-8 border-t border-dashed border-gray-200 dark:border-white/10">
                  <span
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: `${moodColors[selectedEntry.mood]}20`,
                      color: moodColors[selectedEntry.mood],
                    }}
                  >
                    Feeling {selectedEntry.mood}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center"
              >
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${isDark ? "bg-white/5 text-white/20" : "bg-black/5 text-black/20"}`}
                >
                  <BookOpen className="w-10 h-10" />
                </div>
                <h3
                  className={`text-xl font-semibold ${isDark ? "text-white/60" : "text-gray-400"}`}
                >
                  Select an entry to start reading
                </h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
