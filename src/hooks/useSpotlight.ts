import { useState, useCallback, useEffect } from "react";
import type { SpotlightResult } from "@/types";

interface UseSpotlightProps {
  apps: { id: string; name: string; icon: string; color?: string }[];
  onOpenApp: (appId: string) => void;
}

export function useSpotlight({ apps, onOpenApp }: UseSpotlightProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const results: SpotlightResult[] = [
    ...apps.map((app) => ({
      id: app.id,
      name: app.name,
      icon: app.icon,
      type: "app" as const,
      action: () => onOpenApp(app.id),
    })),
    {
      id: "github",
      name: "Open GitHub",
      icon: "Github.png",
      type: "command" as const,
      action: () => window.open("https://github.com", "_blank"),
    },
    {
      id: "linkedin",
      name: "Open LinkedIn",
      icon: "Linkedin.png",
      type: "command" as const,
      action: () => window.open("https://linkedin.com", "_blank"),
    },
    {
      id: "theme",
      name: "Toggle Theme",
      icon: "Toggle.png",
      type: "command" as const,
      action: () => {},
    },
  ].filter(
    (item) =>
      query === "" || item.name.toLowerCase().includes(query.toLowerCase()),
  );

  const openSpotlight = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const closeSpotlight = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  const toggleSpotlight = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.metaKey && e.key === " ") {
        e.preventDefault();
        toggleSpotlight();
        return;
      }

      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          closeSpotlight();
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + results.length) % results.length,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            results[selectedIndex].action();
            closeSpotlight();
          }
          break;
      }
    },
    [isOpen, results, selectedIndex, toggleSpotlight, closeSpotlight],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return {
    isOpen,
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    openSpotlight,
    closeSpotlight,
    toggleSpotlight,
  };
}
