import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
} from "lucide-react";

interface AboutProps {
  isDark: boolean;
}

import { MacOSHero } from "./HeroSection";

const SOCIAL_LINKS = [
  {
    icon: Github,
    url: "https://github.com/thenitinsharma",
    label: "GitHub",
  },
  {
    icon: Linkedin,
    url: "https://www.linkedin.com/in/nitin-kumar-sharma-15a897247",
    label: "LinkedIn",
  },
  { icon: Mail, url: "mailto:nitin.175sharma@gmail.com", label: "Email" },
];

const STATS = [
  { label: "Projects", value: "4+" },
  { label: "Internships", value: "1" },
  { label: "Languages", value: "3" },
  { label: "Skills", value: "15+" },
];

export function About({ isDark }: AboutProps) {
  return (
    <div
      className={`w-full h-full overflow-auto ${isDark ? "bg-[#0a0a0a]" : "bg-gray-50"}`}
    >
      {/* Hero Section */}
      <div className="relative">
        <MacOSHero isDark={isDark} />

        {/* Profile Section */}
        <div className="px-6 pb-6">
          <div className="relative -mt-16 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`w-32 h-32 rounded-2xl border-4 ${
                isDark
                  ? "border-[#0a0a0a] bg-[#1e1e1e]"
                  : "border-gray-50 bg-white"
              } flex items-center justify-center overflow-hidden shadow-xl`}
            >
              <img
                src="/profile.jpg"
                alt="Nitin Kumar Sharma"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Name & Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1
              className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Nitin Kumar Sharma
            </h1>
            <p
              className={`text-lg ${isDark ? "text-white/60" : "text-gray-600"}`}
            >
              AI & ML Specialist & developer
            </p>
          </motion.div>

          {/* Location & Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-4 mt-3"
          >
            <div
              className={`flex items-center gap-1 text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}
            >
              <MapPin className="w-4 h-4" />
              <span>Lucknow, Uttar Pradesh, India</span>
            </div>
            <div
              className={`flex items-center gap-1 text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Open to opportunities</span>
            </div>
            <div
              className={`flex items-center gap-1 text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>B.Tech CSE (AI & ML)</span>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mt-4"
          >
            {SOCIAL_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                    isDark
                      ? "bg-white/10 hover:bg-white/20 text-white hover:scale-105"
                      : "bg-black/10 hover:bg-black/20 text-gray-700 hover:scale-105"
                  }`}
                  title={link.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`mt-6 p-5 rounded-2xl ${
              isDark ? "bg-white/5" : "bg-white"
            }`}
            style={{
              border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            }}
          >
            <h2
              className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              About Me
            </h2>
            <p
              className={`leading-relaxed ${isDark ? "text-white/70" : "text-gray-600"}`}
            >
              I am a detail-oriented Computer Science Engineering student specializing in Artificial Intelligence & Machine Learning. I have a strong foundation in Python, C, HTML, CSS, JavaScript, and machine learning, combined with hands-on experience in full-stack web development. I love building smart, AI-powered tools and user-centric applications.
            </p>
            <p
              className={`leading-relaxed mt-3 ${isDark ? "text-white/70" : "text-gray-600"}`}
            >
              With practical experience in frameworks like TensorFlow and PyTorch, database design, and web technology integrations, I have created platforms like SukoonAI (an AI-powered mental health chatbot) and ProText-AI (a professional text transformation extension). I am passionate about engineering smart solutions and seeking internship or entry-level opportunities to apply my skills.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className={`p-4 rounded-2xl text-center ${
                  isDark ? "bg-white/5" : "bg-white"
                }`}
                style={{
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                }}
              >
                <div
                  className={`text-2xl font-bold ${isDark ? "text-[#007aff]" : "text-blue-600"}`}
                >
                  {stat.value}
                </div>
                <div
                  className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-gray-500"}`}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`mt-6 p-5 rounded-2xl ${
              isDark ? "bg-white/5" : "bg-white"
            }`}
            style={{
              border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            }}
          >
            <h2
              className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Education
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isDark ? "bg-[#007aff]/20" : "bg-blue-100"
                  }`}
                >
                  <GraduationCap
                    className={`w-5 h-5 ${isDark ? "text-[#007aff]" : "text-blue-600"}`}
                  />
                </div>
                <div>
                  <h3
                    className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    B.Tech in Computer Science (AI & ML)
                  </h3>
                  <p
                    className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}
                  >
                    Dr. A.P.J. Abdul Kalam Technical University
                  </p>
                  <p
                    className={`text-sm ${isDark ? "text-white/40" : "text-gray-500"}`}
                  >
                    Lucknow, Uttar Pradesh, India | Sept 2023 - Sept 2027
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`mt-6 p-5 rounded-2xl ${
              isDark ? "bg-white/5" : "bg-white"
            }`}
            style={{
              border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            }}
          >
            <h2
              className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Achievements & Certifications
            </h2>
            <ul
              className={`space-y-3 ${isDark ? "text-white/70" : "text-gray-600"}`}
            >
              <li className="flex items-start gap-2">
                <span
                  className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-[#007aff]" : "bg-blue-500"}`}
                />
                <span>
                  AWS Solutions Architecture Job Simulation - Completed hands-on AWS architecture scenarios
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-[#007aff]" : "bg-blue-500"}`}
                />
                <span>
                  Tata GenAI-Powered Data Analytics Job Simulation - Applied AI techniques to real-world problems
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-[#007aff]" : "bg-blue-500"}`}
                />
                <span>
                  5-Day AI Agents Intensive Course with Google - Learned advanced AI agent development
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-[#007aff]" : "bg-blue-500"}`}
                />
                <span>
                  UDTech Strategy Storm 2026 & Web Challenge competitor
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-[#007aff]" : "bg-blue-500"}`}
                />
                <span>
                  Coding and Debugging - Achieved 2nd rank in this challenge
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-[#007aff]" : "bg-blue-500"}`}
                />
                <span>
                  Prism Expo - Achieved 2nd rank showing SukoonAI
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
