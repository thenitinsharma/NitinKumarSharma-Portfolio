import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Database,
  Wrench,
  Palette,
  Terminal,
  Cpu,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Skill {
  name: string;
}

interface SkillCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
  skills: Skill[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "languages",
    name: "Programming Languages",
    icon: Code2,
    gradient: "from-primary to-blue-500",
    iconColor: "text-primary",
    skills: [
      { name: "Python" },
      { name: "C++" },
      { name: "JavaScript" },
      { name: "SQL" },
    ],
  },
  {
    id: "web-tech",
    name: "Web Technologies",
    icon: Palette,
    gradient: "from-accent to-pink-500",
    iconColor: "text-accent",
    skills: [
      { name: "HTML" },
      { name: "CSS" },
      { name: "React.js" },
      { name: "Node.js" },
      { name: "Express.js" },
      { name: "Three.js" },
      { name: "GSAP" },
    ],
  },
  {
    id: "ai-frameworks",
    name: "AI/ML Frameworks",
    icon: Cpu,
    gradient: "from-rose-500 to-red-500",
    iconColor: "text-rose-500",
    skills: [
      { name: "TensorFlow" },
      { name: "PyTorch" },
      { name: "Scikit-learn" },
      { name: "Pandas" },
      { name: "NumPy" },
    ],
  },
  {
    id: "databases",
    name: "Databases",
    icon: Database,
    gradient: "from-warning to-orange-400",
    iconColor: "text-warning",
    skills: [
      { name: "MySQL" },
      { name: "MongoDB" },
    ],
  },
  {
    id: "tools",
    name: "Developer Tools",
    icon: Wrench,
    gradient: "from-slate-400 to-slate-500",
    iconColor: "text-slate-400",
    skills: [
      { name: "Git" },
      { name: "GitHub" },
      { name: "VS Code" },
    ],
  },
  {
    id: "competencies",
    name: "Core Competencies",
    icon: Terminal,
    gradient: "from-success to-emerald-400",
    iconColor: "text-success",
    skills: [
      { name: "Natural Language Processing" },
      { name: "Chatbot Development" },
      { name: "Full-Stack Development" },
      { name: "Data Analysis" },
      { name: "Competitive Programming" },
    ],
  },
];

export function Skills() {
  const [activeCategory, setActiveCategory] = useState("languages");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeCategoryData = SKILL_CATEGORIES.find(
    (c) => c.id === activeCategory,
  );

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSidebarOpen(false);
  };

  return (
    <div className="h-full bg-background overflow-y-auto">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-glow-pulse" />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-glow-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Category Navigation (Desktop) */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 hidden lg:block"
          >
            <div className="glass-card py-4 sticky top-6">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
                Categories
              </h2>
              <nav className="space-y-1">
                {SKILL_CATEGORIES.map((category, index) => {
                  const Icon = category.icon;
                  const isActive = activeCategory === category.id;

                  return (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl transition-all duration-300 group ${
                        isActive
                          ? "bg-secondary border border-border"
                          : "hover:bg-secondary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg bg-gradient-to-br ${category.gradient} p-0.5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"}`}
                        >
                          <div className="w-full h-full rounded-[6px] bg-card flex items-center justify-center">
                            <Icon className={`w-4 h-4 ${category.iconColor}`} />
                          </div>
                        </div>
                        <span
                          className={`text-sm font-medium transition-colors ${
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        >
                          {category.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {category.skills.length}
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 transition-all duration-300 ${
                            isActive
                              ? "text-primary translate-x-0 opacity-100"
                              : "text-muted-foreground -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
                          }`}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </motion.aside>

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                />

                {/* Mobile Sidebar */}
                <motion.aside
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="fixed top-0 right-0 bottom-0 w-80 z-50 lg:hidden"
                >
                  <div className="glass-card h-full flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-border">
                      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Categories
                      </h2>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <X className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                      {SKILL_CATEGORIES.map((category) => {
                        const Icon = category.icon;
                        const isActive = activeCategory === category.id;

                        return (
                          <button
                            key={category.id}
                            onClick={() => handleCategorySelect(category.id)}
                            className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${
                              isActive
                                ? "bg-secondary border border-border"
                                : "hover:bg-secondary/50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-lg bg-gradient-to-br ${category.gradient} p-0.5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"}`}
                              >
                                <div className="w-full h-full rounded-[6px] bg-card flex items-center justify-center">
                                  <Icon
                                    className={`w-4 h-4 ${category.iconColor}`}
                                  />
                                </div>
                              </div>
                              <span
                                className={`text-sm font-medium transition-colors ${
                                  isActive
                                    ? "text-foreground"
                                    : "text-muted-foreground group-hover:text-foreground"
                                }`}
                              >
                                {category.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                                  isActive
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {category.skills.length}
                              </span>
                              <ChevronRight
                                className={`w-4 h-4 transition-all duration-300 ${
                                  isActive
                                    ? "text-primary translate-x-0 opacity-100"
                                    : "text-muted-foreground -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
                                }`}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Main Content - Skills Display */}
          <div className="lg:col-span-8">
            {/* Mobile Menu Button */}
            <div className="lg:hidden mb-4 flex justify-end">
              <button
                onClick={() => setSidebarOpen(true)}
                className="glass-card p-3 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <Menu className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeCategoryData && (
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card p-6 sm:p-8"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeCategoryData.gradient} p-0.5`}
                    >
                      <div className="w-full h-full rounded-[14px] bg-card flex items-center justify-center">
                        <activeCategoryData.icon
                          className={`w-7 h-7 ${activeCategoryData.iconColor}`}
                        />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {activeCategoryData.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {activeCategoryData.skills.length} technologies
                      </p>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeCategoryData.skills.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="group relative p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-default"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full bg-gradient-to-br ${activeCategoryData.gradient}`}
                          />
                          <span className="text-sm font-medium text-foreground">
                            {skill.name}
                          </span>
                        </div>

                        {/* Hover glow effect */}
                        <div
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.05), transparent 70%)`,
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skills;
