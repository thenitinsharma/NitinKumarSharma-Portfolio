"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Github,
  ArrowLeft,
  Layers,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  image: string;
  techStack: string[];
  category: string;
  year: string;
  github?: string;
  demo?: string;
  metrics: {
    label: string;
    value: string;
  }[];
  featured: boolean;
  highlights: string[];
  gradient: string;
  iconColor: string;
}

const PROJECTS: Project[] = [
  {
    id: "sukoon-ai",
    name: "SukoonAI",
    description: "AI-powered mental health platform using Google MedGemini and Grok API",
    longDescription:
      "SukoonAI is an empathetic, real-time conversational support platform built using Google MedGemini and Grok API. It is designed to provide responsive conversational support, emotional pattern recognition, and robust user authentication. Engineered as a full-stack Next.js 14 application with optimized server-side rendering and HIPAA-compliant authentication, the UI achieved a 98% accessibility score.",
    image: "/projects/Screenshot 2026-06-05 200823.png",
    techStack: [
      "Google MedGemini",
      "Grok API",
      "Next.js 14",
      "Shadcn UI",
      "TailwindCSS",
      "LLM Orchestration",
      "HIPAA Auth",
    ],
    category: "AI/ML",
    year: "2025",
    github: "https://github.com/thenitinsharma",
    demo: "",
    metrics: [
      { label: "Accessibility", value: "98%" },
      { label: "Architecture", value: "Multi-Model" },
    ],
    featured: true,
    highlights: [
      "Architected AI-powered mental health platform using Google MedGemini and Grok API for empathetic conversational support",
      "Engineered full-stack Next.js 14 application with server-side rendering, API optimization, and HIPAA-compliant authentication",
      "Designed responsive UI with Shadcn UI and TailwindCSS, achieving 98% accessibility score across all devices",
      "Implemented real-time conversation threading and emotional pattern recognition using multi-model LLM orchestration",
    ],
    gradient: "from-primary to-blue-500",
    iconColor: "text-primary",
  },
  {
    id: "protext-ai",
    name: "ProText-AI Chrome Extension",
    description: "Transform casual workplace communications into professional prose",
    longDescription:
      "ProText-AI is a privacy-first Chrome extension that transforms casual communications into professional prose using Google Gemini AI. Featuring universal text detection across platforms like Email and LinkedIn, the extension integrates seamlessly with a one-click conversion utility. Designed as a free, open-source tool, it utilizes user API keys for direct and secure client-side AI processing.",
    image: "/projects/Screenshot (1183).png",
    techStack: [
      "Google Gemini AI",
      "JavaScript",
      "Chrome Extension API",
      "Privacy-first",
    ],
    category: "AI/ML",
    year: "2025",
    github: "https://github.com/thenitinsharma",
    demo: "",
    metrics: [
      { label: "Integration", value: "One-Click" },
      { label: "Privacy", value: "User API Keys" },
    ],
    featured: true,
    highlights: [
      "Developed Chrome extension transforming casual workplace communications into professional prose using Google Gemini AI",
      "Implemented universal text detection across platforms (Email, LinkedIn) with one-click conversion functionality",
      "Engineered privacy-first architecture using user API keys, ensuring data security and published as free open-source tool",
    ],
    gradient: "from-rose-500 to-red-500",
    iconColor: "text-rose-500",
  },
  {
    id: "excuse-generator",
    name: "Intelligent Excuse Generator",
    description: "AI-driven context-aware excuse generator with believability scoring",
    longDescription:
      "Intelligent Excuse Generator is an AI-powered system that generates context-aware excuses with believability scoring based on situation, category, and tone inputs. Supports both text and voice input processing via Speech-to-Text APIs, and provides bilingual outputs in Hindi and English using advanced NLP techniques.",
    image: "/projects/Screenshot (1182).png",
    techStack: [
      "Python",
      "NLP",
      "Speech-to-Text",
      "AI/ML",
      "Believability Scoring",
    ],
    category: "AI/ML",
    year: "2025",
    github: "https://github.com/thenitinsharma",
    demo: "",
    metrics: [
      { label: "Languages", value: "Hindi & English" },
      { label: "Input Modes", value: "Text & Voice" },
    ],
    featured: false,
    highlights: [
      "Built AI-driven system generating context-aware excuses with believability scoring based on situation, category, and tone inputs",
      "Implemented text and voice input processing using Speech-to-Text APIs for enhanced accessibility",
      "Designed bilingual output (Hindi and English) using NLP and ML techniques for diverse audience reach",
    ],
    gradient: "from-orange-500 to-yellow-500",
    iconColor: "text-orange-500",
  },
  {
    id: "webgenie",
    name: "WebGenie CLI Generator",
    description: "CLI tool automating web project boilerplate creation",
    longDescription:
      "WebGenie is a Python-based Command Line Interface tool that automates the generation of web projects, setting up HTML, CSS, JavaScript, and database boilerplates in a single command. It reduces manual project setup time by 75%, allowing developers to focus immediately on core coding.",
    image: "/projects/Screenshot 2026-06-05 201821.png",
    techStack: [
      "Python",
      "CLI Development",
      "File Handling",
      "Boilerplate Automation",
    ],
    category: "CLI & Tools",
    year: "2024",
    github: "https://github.com/thenitinsharma",
    demo: "",
    metrics: [
      { label: "Setup Time", value: "-75%" },
      { label: "Interface", value: "CLI" },
    ],
    featured: false,
    highlights: [
      "Developed CLI tool automating web project creation with HTML, CSS, JavaScript, and database boilerplate in single command",
      "Improved developer productivity by reducing manual setup time by 75%, enabling immediate focus on core development",
    ],
    gradient: "from-accent to-purple-500",
    iconColor: "text-accent",
  },
];

const CATEGORIES = [
  "All",
  "Featured",
  "AI/ML",
  "CLI & Tools",
] as const;

function ProjectCard({
  project,
  onClick,
  index,
}: {
  project: Project;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group cursor-pointer glass-card-hover overflow-hidden flex flex-col h-full"
    >
      <div className="relative w-full aspect-video overflow-hidden rounded-t-lg bg-secondary">
        <img
          src={project.image || "/placeholder.svg"}
          alt={project.name}
          className="w-full h-full object-contain object-center transition-all duration-700 group-hover:scale-105 group-hover:brightness-105"
          loading="lazy"
        />

        {/* Lighter dark gradient overlay - starts from 60% down */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-60% via-black/30 to-black/50 transition-opacity duration-500 group-hover:to-black/60 pointer-events-none" />

        {/* Category badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-card/90 text-foreground backdrop-blur-sm border border-border/50">
            {project.category}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          <span className="text-xs text-muted-foreground">{project.year}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
          {project.description}
        </p>

        <div className="flex items-center gap-2 pt-4 border-t border-border/50">
          <Layers className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div className="flex gap-1.5 flex-wrap">
            {project.techStack.slice(0, 3).map((tech) => (
              <span key={tech} className="tech-badge text-xs py-1">
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectDetails({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={onClose}
            aria-label="Back to projects"
            className="p-2 rounded-xl hover:bg-secondary text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-foreground truncate">
            {project.name}
          </h2>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative  overflow-hidden mb-8 "
        >
          <img
            src={project.image}
            alt={project.name}
            className="w-full  border rounded-xl object-contain object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                About the Project
              </h3>
              <p className="text-base leading-relaxed text-foreground/80">
                {project.longDescription}
              </p>
            </section>

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Key Highlights
              </h3>
              <ul className="space-y-3">
                {project.highlights.map((highlight, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-success" />
                    <span className="text-foreground/80">{highlight}</span>
                  </motion.li>
                ))}
              </ul>
            </section>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex flex-col gap-3">
              {project.demo !== "" && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 cursor-pointer rounded-xl font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                  <ArrowUpRight className="w-3 h-3 ml-1 opacity-70" />
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm bg-secondary text-foreground hover:bg-secondary/80 border border-border transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Source Code
                </a>
              )}
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Metrics
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {project.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-muted-foreground">
                      {metric.label}
                    </span>
                    <span className="text-lg font-bold text-foreground">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-accent" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Technologies
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border/50">
              <span>{project.category}</span>
              <span>{project.year}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  const [activeCategory, setActiveCategory] =
    useState<(typeof CATEGORIES)[number]>("All");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((project) => {
      if (activeCategory === "All") return true;
      if (activeCategory === "Featured") return project.featured;
      return project.category === activeCategory;
    });
  }, [activeCategory]);

  const selectedProject = useMemo(() => {
    return PROJECTS.find((p) => p.id === selectedProjectId);
  }, [selectedProjectId]);

  const handleCloseDetails = useCallback(() => {
    setSelectedProjectId(null);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-auto">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glow-pulse" />
        <div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-success/5 rounded-full blur-3xl animate-glow-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {selectedProjectId && selectedProject ? (
          <ProjectDetails
            key="details"
            project={selectedProject}
            onClose={handleCloseDetails}
          />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
                      Projects
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      A selection of my recent work and side projects.
                    </p>
                  </div>
                  <span className="text-sm font-medium px-3 py-1.5 rounded-full bg-secondary text-muted-foreground border border-border">
                    {filteredProjects.length} projects
                  </span>
                </div>
              </motion.header>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide"
              >
                {CATEGORIES.map((category) => {
                  const isActive = activeCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    onClick={() => setSelectedProjectId(project.id)}
                  />
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  No projects found in this category.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Projects;
