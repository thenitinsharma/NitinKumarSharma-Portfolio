import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsProps {
  onOpenSpotlight: () => void;
  onToggleTheme: () => void;
  onOpenApp: (appId: string) => void;
  onCloseWindow: () => void;
  onMinimizeWindow: () => void;
  activeWindowId: string | null;
}

export function useKeyboardShortcuts({
  onOpenSpotlight,
  onToggleTheme,
  onOpenApp,
  onCloseWindow,
  onMinimizeWindow,
  activeWindowId,
}: KeyboardShortcutsProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Cmd/Ctrl + Space: Spotlight
    if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
      e.preventDefault();
      onOpenSpotlight();
      return;
    }

    // Cmd/Ctrl + Shift + T: Toggle Theme
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 't') {
      e.preventDefault();
      onToggleTheme();
      return;
    }

    // Cmd/Ctrl + W: Close active window
    if ((e.metaKey || e.ctrlKey) && e.key === 'w' && activeWindowId) {
      e.preventDefault();
      onCloseWindow();
      return;
    }

    // Cmd/Ctrl + M: Minimize active window
    if ((e.metaKey || e.ctrlKey) && e.key === 'm' && activeWindowId) {
      e.preventDefault();
      onMinimizeWindow();
      return;
    }

    // Cmd/Ctrl + 1-9: Open specific apps
    if ((e.metaKey || e.ctrlKey) && /^[1-9]$/.test(e.key)) {
      e.preventDefault();
      const appMap: Record<string, string> = {
        '1': 'finder',
        '2': 'terminal',
        '3': 'about',
        '4': 'projects',
        '5': 'skills',
        '6': 'experience',
        '7': 'resume',
        '8': 'contact',
        '9': 'settings',
      };
      const appId = appMap[e.key];
      if (appId) {
        onOpenApp(appId);
      }
      return;
    }
  }, [onOpenSpotlight, onToggleTheme, onOpenApp, onCloseWindow, onMinimizeWindow, activeWindowId]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
