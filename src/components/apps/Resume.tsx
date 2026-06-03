import {
  Download,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  CheckCircle,
} from "lucide-react";

/* =========================
   Types
========================= */

interface ResumeProps {
  isDark: boolean;
}

type ResumeListItem = {
  heading: string;
  subHeading: string;
  period: string;
  location?: string;
  bullets?: string[];
};

type ResumeSection =
  | {
      id: string;
      title: string;
      type: "text";
      content: string;
    }
  | {
      id: string;
      title: string;
      type: "list";
      items: ResumeListItem[];
    }
  | {
      id: string;
      title: string;
      type: "skills";
      categories: { label: string; value: string }[];
    }
  | {
      id: string;
      title: string;
      type: "bullets";
      bullets: string[];
    };

/* =========================
   Resume Data
========================= */

const RESUME_DATA: ResumeSection[] = [
  {
    id: "summary",
    title: "Professional Summary",
    type: "text",
    content:
      "Detail-oriented Computer Science Engineering student specializing in AI & ML with expertise in Python, C, HTML, CSS, JavaScript, and machine learning. Proven track record developing innovative AI-powered solutions and productivity tools. Strong academic foundation combined with hands-on experience in full-stack development, artificial intelligence, and web technologies. Seeking internship or entry-level opportunities in AI, software development, or web technologies.",
  },
  {
    id: "education",
    title: "Education",
    type: "list",
    items: [
      {
        heading: "Dr. A.P.J. Abdul Kalam Technical University",
        subHeading: "Bachelor of Technology in Computer Science (AI & ML)",
        period: "Sept 2023 - Sept 2027",
        location: "Lucknow, Uttar Pradesh, India",
        bullets: [
          "Specialization: Artificial Intelligence & Machine Learning",
          "Relevant Coursework: Data Structures & Algorithms, Machine Learning, Natural Language Processing, Database Management Systems, Web Development"
        ],
      },
    ],
  },
  {
    id: "skills",
    title: "Technical Skills",
    type: "skills",
    categories: [
      { label: "Programming Languages", value: "Python, C++, JavaScript, SQL" },
      {
        label: "Web Technologies",
        value: "HTML, CSS, React.js, Node.js, Express.js, Three.js, GSAP",
      },
      {
        label: "AI/ML Frameworks",
        value: "TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy",
      },
      {
        label: "Databases",
        value: "MySQL, MongoDB",
      },
      {
        label: "Developer Tools",
        value: "Git, GitHub, VS Code",
      },
      {
        label: "Core Competencies",
        value: "Natural Language Processing, Chatbot Development, Full-Stack Development, Data Analysis, Competitive Programming",
      },
    ],
  },
  {
    id: "experience",
    title: "Professional Experience",
    type: "list",
    items: [
      {
        heading: "AI & ML Training and Intern",
        subHeading: "LaunchEd Global",
        period: "July 2025 - Sept 2025",
        location: "Remote",
        bullets: [
          "Designed AI-based Excuse Generator using Python, NLP, and prompt engineering to create context-aware outputs tailored to different situations",
          "Collaborated with mentors to improve model accuracy and user experience through iterative testing and feedback integration",
          "Gained hands-on exposure to AI model deployment, agile development practices, and professional teamwork methodologies",
        ],
      },
    ],
  },
  {
    id: "projects",
    title: "Projects",
    type: "list",
    items: [
      {
        heading: "SukoonAI - Mental Health Support Platform",
        subHeading: "Google MedGemini, Grok API, Next.js, Shadcn UI",
        period: "2025",
        bullets: [
          "Architected AI-powered mental health platform using Google MedGemini and Grok API for empathetic, real-time conversational support",
          "Engineered full-stack Next.js 14 application with server-side rendering, API optimization, and HIPAA-compliant authentication",
          "Designed responsive UI with Shadcn UI and TailwindCSS, achieving 98% accessibility score across all devices",
          "Implemented real-time conversation threading and emotional pattern recognition using multi-model LLM orchestration",
        ],
      },
      {
        heading: "ProText-AI Chrome Extension",
        subHeading: "Google Gemini AI, JavaScript, Chrome Extension API",
        period: "2025",
        bullets: [
          "Developed Chrome extension transforming casual workplace communications into professional prose using Google Gemini AI",
          "Implemented universal text detection across platforms (Email, LinkedIn) with one-click conversion functionality",
          "Engineered privacy-first architecture using user API keys, ensuring data security and published as free open-source tool",
        ],
      },
      {
        heading: "Intelligent Excuse Generator",
        subHeading: "Python, NLP, Speech-to-Text, AI/ML",
        period: "2025",
        bullets: [
          "Built AI-driven system generating context-aware excuses with believability scoring based on situation, category, and tone inputs",
          "Implemented text and voice input processing using Speech-to-Text APIs for enhanced accessibility",
          "Designed bilingual output (Hindi and English) using NLP and ML techniques for diverse audience reach",
        ],
      },
      {
        heading: "WebGenie - CLI Project Generator",
        subHeading: "Python, CLI Development, File Handling",
        period: "2024",
        bullets: [
          "Developed CLI tool automating web project creation with HTML, CSS, JavaScript, and database boilerplate in single command",
          "Improved developer productivity by reducing manual setup time by 75%, enabling immediate focus on core development",
        ],
      },
    ],
  },
  {
    id: "achievements",
    title: "Achievements & Certifications",
    type: "bullets",
    bullets: [
      "AWS Solutions Architecture Job Simulation - Completed hands-on AWS architecture scenarios",
      "Tata GenAI-Powered Data Analytics Job Simulation - Applied AI techniques to real-world analytics problems",
      "5-Day AI Agents Intensive Course with Google - Learned advanced AI agent development methodologies",
      "Strategy Storm 2026 & Web Sprint Challenge (UDTech) - Competed in competitive strategy and web development events",
      "Coding and Debugging - Achieved 2nd rank in this challenge",
      "Prism Expo - Achieved 2nd rank in this project expo showcasing my project SukoonAI",
    ],
  },
  {
    id: "languages",
    title: "Languages",
    type: "skills",
    categories: [
      { label: "English", value: "Professional working proficiency" },
      { label: "Hindi", value: "Native or bilingual proficiency" },
      { label: "Japanese", value: "Elementary proficiency" },
    ],
  },
];

/* =========================
   Component
   ========================= */

export function Resume({ isDark }: ResumeProps) {
  return (
    <div
      className={`w-full h-full overflow-auto pb-20 ${
        isDark ? "bg-[#0a0a0a] text-gray-300" : "bg-white text-gray-800"
      }`}
    >
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        {/* Header */}
        <header className="mb-12 border-b border-current/10 pb-10">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold">Nitin Kumar Sharma</h1>
              <p className="text-xl mt-2 font-medium text-blue-600">
                AI & ML Specialist & developer
              </p>
            </div>
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/NITIN-KUMAR-SHARMA-RESUME.pdf";
                link.download = "Nitin_Kumar_Sharma_Resume.pdf";
                link.click();
              }}
              className="flex items-center h-fit w-fit gap-2 px-4 py-2 border rounded-lg  text-sm font-semibold"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 mt-8 text-sm opacity-80">
            <a
              href="mailto:nitin.175sharma@gmail.com"
              className="flex gap-2"
            >
              <Mail className="w-4 h-4" />
              nitin.175sharma@gmail.com
            </a>
            <div className="flex gap-2">
              <Phone className="w-4 h-4" />
              +91 7905329347
            </div>
            <div className="flex gap-2">
              <MapPin className="w-4 h-4" />
              Lucknow, Uttar Pradesh, India
            </div>
            <a href="https://www.linkedin.com/in/nitin-kumar-sharma-15a897247" target="_blank" rel="noopener noreferrer" className="flex gap-2 text-blue-500">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a href="https://github.com/thenitinsharma" target="_blank" rel="noopener noreferrer" className="flex gap-2 text-blue-500">
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </header>

        {/* Sections */}
        <div className="space-y-12">
          {RESUME_DATA.map((section) => (
            <section
              key={section.id}
              className="grid grid-cols-1 md:grid-cols-4 gap-8"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">
                {section.title}
              </h3>

              <div className="md:col-span-3">
                {section.type === "text" && (
                  <p className="leading-relaxed">{section.content}</p>
                )}

                {section.type === "list" &&
                  section.items.map((item, i) => (
                    <div key={i} className="mb-8">
                      <div className="flex justify-between">
                        <h4 className="font-bold">{item.heading}</h4>
                        <span className="text-xs opacity-50">
                          {item.period}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <p className="text-blue-600 font-semibold">
                          {item.subHeading}
                        </p>
                        {item.location && (
                          <span className="text-xs italic opacity-50">
                            {item.location}
                          </span>
                        )}
                      </div>
                      {item.bullets && (
                        <ul className="space-y-2">
                          {item.bullets.map((bullet, j) => (
                            <li key={j} className="flex gap-3 text-sm">
                              <span className="w-1.5 h-1.5 mt-2 bg-current rounded-full opacity-40" />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                {section.type === "skills" &&
                  section.categories.map((cat, i) => (
                    <div key={i} className="mb-6">
                      <p className="text-xs uppercase opacity-50">
                        {cat.label}
                      </p>
                      <p>{cat.value}</p>
                    </div>
                  ))}

                {section.type === "bullets" && (
                  <ul className="space-y-3">
                    {section.bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
