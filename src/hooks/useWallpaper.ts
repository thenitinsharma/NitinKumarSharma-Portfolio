import { useState, useEffect, useCallback } from "react";

export interface WallpaperOption {
  id: string;
  name: string;
  thumbnail: string;
  url: string;
  category: "default" | "nature" | "abstract" | "solid";
  deviceType: "mobile" | "tablet" | "desktop" | "all";
}

const DEFAULT_WALLPAPERS: WallpaperOption[] = [
  // Desktop Wallpapers
  {
    id: "macbook-m3",
    name: "macOS Sonoma",
    thumbnail: "/macbook-m3.jpg",
    url: "/macbook-m3.jpg",
    category: "default",
    deviceType: "desktop",
  },
  {
    id: "solid-purple",
    name: "Purple Gradient",
    thumbnail: "/macbook02.jpg",
    url: "/macbook02.jpg",
    category: "abstract",
    deviceType: "desktop",
  },
  {
    id: "solid-teal",
    name: "Teal Wave",
    thumbnail: "/macbook4.jpg",
    url: "/macbook4.jpg",
    category: "abstract",
    deviceType: "desktop",
  },
  {
    id: "solid-orange",
    name: "Warm Sunset",
    thumbnail: "/wallpaper.jpg",
    url: "/wallpaper.jpg",
    category: "nature",
    deviceType: "desktop",
  },

  // Mobile Wallpapers
  {
    id: "download2",
    name: "Mobile Default",
    thumbnail: "/download2.jfif",
    url: "/download2.jfif",
    category: "default",
    deviceType: "mobile",
  },
  {
    id: "solid-dark",
    name: "Dark Mode",
    thumbnail: "/download3.jfif",
    url: "/download3.jfif",
    category: "solid",
    deviceType: "mobile",
  },
  {
    id: "solid-blue",
    name: "Ocean Blue",
    thumbnail: "/download4.jfif",
    url: "/download4.jfif",
    category: "abstract",
    deviceType: "mobile",
  },

  // Tablet Wallpapers
  {
    id: "download5",
    name: "Tablet Default",
    thumbnail: "/download5.jfif",
    url: "/download5.jfif",
    category: "default",
    deviceType: "tablet",
  },
];

const SOLID_COLORS: Record<string, string> = {
  "solid-dark": "#1a1a2e",
  "solid-blue": "#0a1628",
  "solid-purple": "#2d1b69",
  "solid-teal": "#0d3b3e",
  "solid-orange": "#3b1a0a",
};

export type DeviceType = "mobile" | "tablet" | "desktop";

export function useWallpaper() {
  const [wallpapers] = useState<WallpaperOption[]>(DEFAULT_WALLPAPERS);
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");
  const [selectedWallpaper, setSelectedWallpaper] = useState<string>(() => {
    return localStorage.getItem("selected-wallpaper") || "macbook-m3";
  });
  const [customWallpapers, setCustomWallpapers] = useState<WallpaperOption[]>(
    () => {
      const saved = localStorage.getItem("custom-wallpapers");
      return saved ? JSON.parse(saved) : [];
    },
  );

  // Detect device type based on screen width
  useEffect(() => {
    const detectDeviceType = (): DeviceType => {
      const width = window.innerWidth;
      if (width < 768) return "mobile";
      if (width < 1024) return "tablet";
      return "desktop";
    };

    const updateDeviceType = () => {
      const newDeviceType = detectDeviceType();
      setDeviceType(newDeviceType);

      // Auto-select appropriate wallpaper for device if current wallpaper doesn't match
      const currentWallpaper = allWallpapers.find(
        (w) => w.id === selectedWallpaper,
      );
      if (
        currentWallpaper &&
        currentWallpaper.deviceType !== "all" &&
        currentWallpaper.deviceType !== newDeviceType
      ) {
        const defaultForDevice = allWallpapers.find(
          (w) => w.deviceType === newDeviceType && w.category === "default",
        );
        if (defaultForDevice) {
          setSelectedWallpaper(defaultForDevice.id);
        }
      }
    };

    updateDeviceType();
    window.addEventListener("resize", updateDeviceType);
    return () => window.removeEventListener("resize", updateDeviceType);
  }, []);

  useEffect(() => {
    localStorage.setItem("selected-wallpaper", selectedWallpaper);
  }, [selectedWallpaper]);

  useEffect(() => {
    localStorage.setItem("custom-wallpapers", JSON.stringify(customWallpapers));
  }, [customWallpapers]);

  const allWallpapers = [...wallpapers, ...customWallpapers];

  // Filter wallpapers based on current device type
  const getFilteredWallpapers = useCallback(() => {
    return allWallpapers.filter(
      (wp) => wp.deviceType === deviceType || wp.deviceType === "all",
    );
  }, [allWallpapers, deviceType]);

  const getBackgroundStyle = useCallback(
    (forDeviceType?: DeviceType): React.CSSProperties => {
      const targetDevice = forDeviceType || deviceType;
      const wp = allWallpapers.find((w) => w.id === selectedWallpaper);

      if (!wp) {
        // Fallback to device-based defaults
        const defaultUrls: Record<string, string> = {
          mobile: "/download2.jfif",
          tablet: "/download5.jfif",
          desktop: "/macbook-m3.jpg",
        };
        return {
          backgroundImage: `url('${defaultUrls[targetDevice]}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        };
      }

      if (wp.category === "solid") {
        return {
          backgroundColor: SOLID_COLORS[wp.id] || "#1a1a2e",
          backgroundImage: "none",
        };
      }

      return {
        backgroundImage: `url('${wp.url}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    },
    [selectedWallpaper, allWallpapers, deviceType],
  );

  const addCustomWallpaper = useCallback(
    (name: string, url: string) => {
      const id = `custom-${Date.now()}`;
      const newWp: WallpaperOption = {
        id,
        name,
        thumbnail: url,
        url,
        category: "nature",
        deviceType: deviceType, // Assign to current device type
      };
      setCustomWallpapers((prev) => [...prev, newWp]);
      setSelectedWallpaper(id);
    },
    [deviceType],
  );

  return {
    wallpapers: getFilteredWallpapers(),
    allWallpapers,
    selectedWallpaper,
    setSelectedWallpaper,
    getBackgroundStyle,
    addCustomWallpaper,
    solidColors: SOLID_COLORS,
    deviceType,
  };
}
