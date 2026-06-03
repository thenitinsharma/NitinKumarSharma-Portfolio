// Window types
export interface WindowState {
  id: string;
  appId: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  // For maintaining state
  data?: Record<string, any>;
}

export interface App {
  id: string;
  name: string;
  icon: string;
  color?: string;
  isOpen: boolean;
  window?: WindowState;
}

export interface DockItem {
  id: string;
  name: string;
  icon: string;
  color?: string;
  isOpen: boolean;
  isPersistent: boolean;
}

export interface MenuItem {
  label?: string;
  shortcut?: string;
  action?: () => void;
  submenu?: MenuItem[];
  separator?: boolean;
  checked?: boolean;
  disabled?: boolean;
}

export interface TerminalCommand {
  command: string;
  output: string[];
  isTyping?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  techStack: string[];
  thumbnail: string;
  link?: string;
  github?: string;
  features?: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string[];
  logo?: string;
}

export interface Skill {
  name: string;
  level: number;
  category: 'language' | 'framework' | 'tool' | 'database';
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: 'happy' | 'productive' | 'reflective' | 'excited' | 'challenging';
}

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'app';
  icon: string;
  color?: string;
  size?: string;
  modified?: string;
  children?: FileSystemItem[];
  content?: string;
  appId?: string;
}

export type Theme = 'dark' | 'light' | 'auto';

export interface SpotlightResult {
  id: string;
  name: string;
  icon: string;
  type: 'app' | 'file' | 'command';
  action: () => void;
}
