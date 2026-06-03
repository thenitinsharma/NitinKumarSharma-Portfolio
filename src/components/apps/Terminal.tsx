import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface TerminalProps {
  isDark: boolean;
}

interface Command {
  input: string;
  output: string[];
  isTyping?: boolean;
}

interface FileSystem {
  [key: string]: {
    type: "file" | "directory";
    content?: string;
    children?: string[];
  };
}

// Virtual file system based on Nitin Kumar Sharma's Resume
const FILE_SYSTEM: FileSystem = {
  "~": {
    type: "directory",
    children: [
      "about.txt",
      "projects",
      "skills",
      "experience",
      "contact",
      "resume.pdf",
      "README.md",
    ],
  },
  "~/about.txt": {
    type: "file",
    content: `Name: Nitin Kumar Sharma
Role: AI & ML Specialist & developer
Location: Lucknow, Uttar Pradesh, India
Education: B.Tech in CSE (AI & ML) - Sept 2023 - Sept 2027

Detail-oriented Computer Science Engineering student specializing
in AI & ML with expertise in Python, C, HTML, CSS, JavaScript,
and machine learning. Seeking internship or entry-level opportunities.`,
  },
  "~/README.md": {
    type: "file",
    content: `# Welcome to Nitin's Portfolio

## Quick Commands
- about       - Learn about me
- projects    - View my projects
- skills      - See my technical skills
- experience  - View work experience
- contact     - Get in touch
- resume      - Download my resume

## System Commands
- ls / dir    - List files
- cd [dir]    - Change directory
- pwd         - Print working directory
- clear       - Clear terminal
- help        - Show all commands
`,
  },
  "~/projects": {
    type: "directory",
    children: ["SukoonAI.txt", "ProTextAI.txt", "ExcuseGenerator.txt", "WebGenie.txt"],
  },
  "~/projects/SukoonAI.txt": {
    type: "file",
    content: `SukoonAI - Mental Health Support Platform (2025)
Tech: Google MedGemini, Grok API, Next.js, Shadcn UI
Features: Empathetic real-time support, conversation threading, emotional pattern recognition.`,
  },
  "~/projects/ProTextAI.txt": {
    type: "file",
    content: `ProText-AI - Chrome Extension (2025)
Tech: Google Gemini AI, JavaScript, Chrome Extension API
Features: Universal text detection, professional transformations, privacy-first user API keys.`,
  },
  "~/projects/ExcuseGenerator.txt": {
    type: "file",
    content: `Excuse Generator - Intelligent excuse generator (2025)
Tech: Python, NLP, Speech-to-Text, AI/ML
Features: Believability scoring, text and voice inputs, bilingual (Hindi & English).`,
  },
  "~/projects/WebGenie.txt": {
    type: "file",
    content: `WebGenie - CLI Project Generator (2024)
Tech: Python, CLI Development, File Handling
Features: Automatic HTML/CSS/JS boilerplate, reduces setup time by 75%.`,
  },
  "~/skills": {
    type: "directory",
    children: [
      "languages.txt",
      "webtech.txt",
      "aiframeworks.txt",
      "databases.txt",
      "tools.txt",
      "competencies.txt",
    ],
  },
  "~/skills/languages.txt": {
    type: "file",
    content: "Python, C++, JavaScript, SQL",
  },
  "~/skills/webtech.txt": {
    type: "file",
    content: "HTML, CSS, React.js, Node.js, Express.js, Three.js, GSAP",
  },
  "~/skills/aiframeworks.txt": {
    type: "file",
    content: "TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy",
  },
  "~/skills/databases.txt": {
    type: "file",
    content: "MySQL, MongoDB",
  },
  "~/skills/tools.txt": {
    type: "file",
    content: "Git, GitHub, VS Code",
  },
  "~/skills/competencies.txt": {
    type: "file",
    content: "Natural Language Processing, Chatbot Development, Full-Stack Development, Data Analysis, Competitive Programming",
  },
  "~/experience": {
    type: "directory",
    children: ["LaunchEd_Global.txt"],
  },
  "~/experience/LaunchEd_Global.txt": {
    type: "file",
    content: `AI & ML Training and Intern
LaunchEd Global | July 2025 - Sept 2025

- Designed AI-based Excuse Generator using Python & NLP.
- Collaborated with mentors to improve model accuracy.
- Gained hands-on experience in AI deployment.`,
  },
  "~/contact": { type: "directory", children: ["email.txt", "social.txt"] },
  "~/contact/email.txt": {
    type: "file",
    content: "nitin.175sharma@gmail.com",
  },
  "~/contact/social.txt": {
    type: "file",
    content:
      "GitHub: @thenitinsharma\nLinkedIn: /in/nitin-kumar-sharma-15a897247",
  },
  "~/resume.pdf": {
    type: "file",
    content: "[PDF Resume File ready for download]",
  },
};

const WELCOME_MESSAGE = [
  "Welcome to Nitin's Portfolio Terminal",
  'Type "help" to see available commands',
  "",
];

const COLOR_CODES: Record<string, string> = {
  "30": "color: #000000;",
  "31": "color: #ff5f56;",
  "32": "color: #27c93f;",
  "33": "color: #ffbd2e;",
  "34": "color: #007aff;",
  "35": "color: #af52de;",
  "36": "color: #5ac8fa;",
  "37": "color: #ffffff;",
  "90": "color: #8e8e93;",
  "1": "font-weight: bold;",
};

const parseAnsi = (text: string): { text: string; styles: string } => {
  const ansiRegex = /\x1b\[(\d+)m/g;
  let result = text;
  let styles = "";
  let match;

  while ((match = ansiRegex.exec(text)) !== null) {
    const code = match[1];
    if (COLOR_CODES[code]) {
      styles += COLOR_CODES[code];
    }
    result = result.replace(match[0], "");
  }

  return { text: result, styles };
};

export function Terminal({ isDark }: TerminalProps) {
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDir, setCurrentDir] = useState("~");
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const promptColor = "#34c759";

  useEffect(() => {
    setCommands([{ input: "", output: WELCOME_MESSAGE, isTyping: false }]);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  const getPath = (input: string): string => {
    if (input === ".") return currentDir;
    if (input === "..") {
      if (currentDir === "~") return "~";
      const parts = currentDir.split("/");
      return parts.length > 1 ? parts.slice(0, -1).join("/") : "~";
    }
    if (input.startsWith("~/")) return input;
    if (input.startsWith("/")) return "~" + input;
    if (input === "~") return "~";
    return currentDir === "~" ? `~/${input}` : `${currentDir}/${input}`;
  };

  const executeCommand = (input: string): string[] => {
    const parts = input.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case "help":
        return [
          "╔═══════════════════════════════════════════════════╗",
          "║               AVAILABLE COMMANDS                  ║",
          "╠═══════════════════════════════════════════════════╣",
          "\x1b[36m│ Navigation:                                       │\x1b[0m",
          "\x1b[90m│   ls, dir       - List directory contents         │\x1b[0m",
          "\x1b[90m│   cd [dir]      - Change directory                │\x1b[0m",
          "\x1b[90m│   pwd           - Print working directory         │\x1b[0m",
          "\x1b[36m│                                                   │\x1b[0m",
          "\x1b[36m│ Portfolio:                                        │\x1b[0m",
          "\x1b[90m│   about         - Learn about me                  │\x1b[0m",
          "\x1b[90m│   projects      - View my projects                │\x1b[0m",
          "\x1b[90m│   skills        - See my technical skills         │\x1b[0m",
          "\x1b[90m│   experience    - View work experience            │\x1b[0m",
          "\x1b[90m│   contact       - Get in touch                    │\x1b[0m",
          "\x1b[90m│   resume        - Download resume                 │\x1b[0m",
          "\x1b[36m│                                                   │\x1b[0m",
          "\x1b[36m│ System:                                           │\x1b[0m",
          "\x1b[90m│   open [app]    - Open Apps e.g.projects, journal │\x1b[0m",
          "\x1b[90m│   clear         - Clear terminal                  │\x1b[0m",
          "\x1b[90m│   whoami        - Display user info               │\x1b[0m",
          "\x1b[90m│   date          - Show current date/time          │\x1b[0m",
          "╚═══════════════════════════════════════════════════╝",
          "",
        ];

      case "ls":
      case "dir": {
        const path = getPath(args[0] || ".");
        const item = FILE_SYSTEM[path];
        if (!item)
          return [
            `\x1b[31mls: cannot access '${args[0]}': No such file or directory\x1b[0m`,
            "",
          ];
        if (item.type === "file") return [args[0]];
        const children = item.children || [];
        return [
          children
            .map((child) => {
              const childPath =
                path === "~" ? `~/${child}` : `${path}/${child}`;
              const childItem = FILE_SYSTEM[childPath];
              if (childItem?.type === "directory")
                return `\x1b[34m${child}/\x1b[0m`;
              if (child.endsWith(".txt") || child.endsWith(".md"))
                return `\x1b[32m${child}\x1b[0m`;
              return child;
            })
            .join("    "),
        ];
      }

      case "cd": {
        const target = args[0] || "~";
        const path = getPath(target);
        const item = FILE_SYSTEM[path];
        if (!item)
          return [
            `\x1b[31mcd: no such file or directory: ${target}\x1b[0m`,
            "",
          ];
        if (item.type !== "directory")
          return [`\x1b[31mcd: not a directory: ${target}\x1b[0m`, ""];
        setCurrentDir(path);
        return [];
      }

      case "pwd":
        return [`/home/nitin/${currentDir.replace("~", "")}`];

      case "about":
        return FILE_SYSTEM["~/about.txt"].content?.split("\n") || [];

      case "projects":
        return [
          "\x1b[33mNitin's Projects:\x1b[0m",
          "1. SukoonAI          - Mental Health Platform",
          "2. ProText-AI        - Chrome Extension",
          "3. Excuse Generator  - Believability Excuse System",
          "4. WebGenie          - CLI Boilerplate Builder",
          "",
          "Use 'cd projects' then 'ls' to explore.",
        ];

      case "skills":
        return [
          "\x1b[1mMy Stack:\x1b[0m",
          `\x1b[32mLanguages:\x1b[0m  ${FILE_SYSTEM["~/skills/languages.txt"].content}`,
          `\x1b[32mWeb Tech:\x1b[0m   ${FILE_SYSTEM["~/skills/webtech.txt"].content}`,
          `\x1b[32mAI/ML:\x1b[0m      ${FILE_SYSTEM["~/skills/aiframeworks.txt"].content}`,
          `\x1b[32mDatabases:\x1b[0m  ${FILE_SYSTEM["~/skills/databases.txt"].content}`,
          `\x1b[32mDev Tools:\x1b[0m  ${FILE_SYSTEM["~/skills/tools.txt"].content}`,
          `\x1b[32mCore:\x1b[0m       ${FILE_SYSTEM["~/skills/competencies.txt"].content}`,
        ];

      case "experience":
        return [
          "\x1b[1mWork Experience:\x1b[0m",
          "",
          "\x1b[33mLaunchEd Global\x1b[0m (AI & ML Intern)",
          "Designed AI-based Excuse Generator using Python, NLP, and prompt engineering.",
        ];

      case "contact":
        return FILE_SYSTEM["~/contact/social.txt"].content?.split("\n") || [];

      case "resume":
        const link = document.createElement("a");
        link.href = "/NITIN-KUMAR-SHARMA-RESUME.pdf";
        link.download = "Nitin_Kumar_Sharma_Resume.pdf";
        link.click();
        return ["\x1b[32m✓ Resumé download started!\x1b[0m", ""];

      case "open": {
        if (!args[0]) return ["\x1b[31mUsage: open [app_name]\x1b[0m", ""];
        const app = args[0].toLowerCase();
        window.dispatchEvent(new CustomEvent("openApp", { detail: app }));
        return [`\x1b[32mOpening ${app}...\x1b[0m`, ""];
      }

      case "clear":
        return ["__CLEAR__"];

      case "whoami":
        return ["nitin", "AI & ML Specialist & developer", "Lucknow, India", ""];

      case "date":
        return [new Date().toString(), ""];

      case "":
        return [];

      default:
        return [
          `\x1b[31mCommand not found: ${cmd}\x1b[0m`,
          'Type "help" for available commands',
          "",
        ];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const output = executeCommand(currentInput);

    if (output[0] === "__CLEAR__") {
      setCommands([]);
    } else {
      setCommands((prev) => [
        ...prev,
        { input: currentInput, output, isTyping: false },
      ]);
    }

    setHistory((prev) => [...prev, currentInput]);
    setHistoryIndex(-1);
    setCurrentInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setCurrentInput(history[history.length - 1 - nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setCurrentInput(history[history.length - 1 - nextIdx]);
      } else {
        setHistoryIndex(-1);
        setCurrentInput("");
      }
    }
  };

  return (
    <div
      ref={terminalRef}
      className={`w-full h-full p-4 font-mono text-sm overflow-auto ${isDark ? "bg-[#0c0c0c]" : "bg-white"}`}
      onClick={() => inputRef.current?.focus()}
      style={{ lineHeight: "1.6" }}
    >
      <div className="space-y-0.5">
        {commands.map((cmd, i) => (
          <div key={i}>
            {cmd.input && (
              <div
                className={`flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                <span style={{ color: promptColor }}>➜</span>
                <span className="text-[#5ac8fa] font-bold">{currentDir}</span>
                <span>{cmd.input}</span>
              </div>
            )}
            <div className="pb-1">
              {cmd.output.map((line, j) => {
                const { text, styles } = parseAnsi(line);
                const inlineStyles = styles
                  ? Object.fromEntries(
                      styles
                        .split(";")
                        .filter((s) => s)
                        .map((s) => s.split(":").map((v) => v.trim())),
                    )
                  : {};
                return (
                  <div
                    key={j}
                    className="whitespace-pre-wrap"
                    style={inlineStyles}
                  >
                    {text || "\u00A0"}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span style={{ color: promptColor }}>➜</span>
          <span className="text-[#5ac8fa] font-bold">{currentDir}</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 bg-transparent outline-none ${isDark ? "text-white" : "text-gray-900"}`}
            spellCheck={false}
            autoComplete="off"
          />
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{
              duration: 0.53,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className={`w-2 h-5 ${isDark ? "bg-white" : "bg-gray-900"}`}
          />
        </form>
      </div>
    </div>
  );
}
