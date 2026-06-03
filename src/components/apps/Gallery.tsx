import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, Image, Folder, MapPin, Users, Heart } from "lucide-react";

interface GalleryProps {
  isDark: boolean;
}

const SIDEBAR_ITEMS = [
  { id: "library", name: "Library", icon: Image },
  { id: "memories", name: "Memories", icon: Folder },
  { id: "places", name: "Places", icon: MapPin },
  { id: "people", name: "People", icon: Users },
  { id: "favorites", name: "Favorites", icon: Heart },
];

const GALLERY_IMAGES = [
  {
    id: 1,
    src: "/gallery/photo1.jpg",
    alt: "Profile photo",
  },
  {
    id: 2,
    src: "/gallery/photo2.jpg",
    alt: "Full standing pose",
  },
  {
    id: 3,
    src: "/gallery/photo3.jpg",
    alt: "Presentation slide pose",
  },
];

export function Gallery({ isDark }: GalleryProps) {
  const [selectedItem, setSelectedItem] = useState("library");
  const [selectedPhoto, setSelectedPhoto] = useState<
    (typeof GALLERY_IMAGES)[0] | null
  >(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleSidebarClick = (id: string) => {
    setSelectedItem(id);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <>
      <style>{`
        .photos-sidebar li { transition: all 0.2s ease; }
        .photos-sidebar li:hover { transform: translateX(4px); }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
          padding: 20px;
        }
        @media (max-width: 640px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); padding: 12px; }
        }
        .gallery-item {
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          background: ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
        }
        .gallery-item:hover { transform: scale(1.02); z-index: 1; }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
        .photo-popup-overlay { backdrop-filter: blur(20px); }
        .photo-popup-image { max-width: 90vw; max-height: 80vh; border-radius: 12px; }
      `}</style>

      <div className="flex flex-col h-full w-full overflow-hidden">
        {/* Mobile Header */}
        <div
          className={`flex items-center gap-3 p-4 border-b md:hidden ${isDark ? "border-white/10 bg-[#1e1e1e]" : "border-black/10 bg-white"}`}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className={`p-1 rounded-lg ${isDark ? "hover:bg-white/10" : "hover:bg-black/10"}`}
          >
            <Menu
              className={`w-6 h-6 ${isDark ? "text-white" : "text-gray-900"}`}
            />
          </button>
          <h2
            className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Photos
          </h2>
        </div>

        <div className="flex flex-1 w-full overflow-hidden relative">
          {/* Mobile Backdrop */}
          <AnimatePresence>
            {isMobile && sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/40 z-40 md:hidden"
              />
            )}
          </AnimatePresence>

          {/* Sidebar */}
          <motion.div
            initial={false}
            animate={{ x: isMobile ? (sidebarOpen ? 0 : "-100%") : 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`
              photos-sidebar w-48 flex-shrink-0 border-r h-full z-50
              fixed inset-y-0 left-0        /* Mobile */
              md:relative md:translate-x-0   /* Desktop */
              ${isDark ? "border-white/10 bg-[#1e1e1e]" : "border-black/10 bg-gray-50"}
            `}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-2xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Photos
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden"
                >
                  <X
                    className={`w-5 h-5 ${isDark ? "text-white/60" : "text-black/60"}`}
                  />
                </button>
              </div>
              <ul className="space-y-1">
                {SIDEBAR_ITEMS.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <button
                        onClick={() => handleSidebarClick(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                          selectedItem === item.id
                            ? isDark
                              ? "bg-blue-600 text-white"
                              : "bg-blue-500 text-white"
                            : isDark
                              ? "hover:bg-white/5 text-white/70"
                              : "hover:bg-black/5 text-gray-600"
                        }`}
                      >
                        <Icon className="w-5 h-5" />

                        <p className="text-sm font-medium">{item.name}</p>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>

          {/* Gallery Content */}
          <div
            className={`flex-1 overflow-auto ${isDark ? "bg-[#1e1e1e]" : "bg-white"}`}
          >
            <div className="gallery-grid">
              {GALLERY_IMAGES.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="gallery-item"
                  onClick={() => setSelectedPhoto(image)}
                >
                  <img src={image.src} alt={image.alt} loading="lazy" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Photo Popup Viewer */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="photo-popup-overlay fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{
              background: isDark ? "rgba(0, 0, 0, 0.95)" : "rgba(0, 0, 0, 0.9)",
            }}
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              className="photo-popup-image shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
