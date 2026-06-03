import { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Image as ImageIcon,
  X,
  Download,
  Trash2,
} from "lucide-react";

interface CameraProps {
  isDark: boolean;
}

interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
}

export default function CameraApp({ isDark }: CameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<CapturedPhoto | null>(
    null,
  );
  const [showGallery, setShowGallery] = useState(false);
  const [flash, setFlash] = useState(false);

  // Load saved photos
  useEffect(() => {
    const saved = localStorage.getItem("camera_photos");
    if (saved) {
      setPhotos(JSON.parse(saved));
    }
  }, []);

  // Save photos
  useEffect(() => {
    localStorage.setItem("camera_photos", JSON.stringify(photos));
  }, [photos]);

  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setFlash(true);
    setTimeout(() => setFlash(false), 150);

    const newPhoto: CapturedPhoto = {
      id: Date.now().toString(),
      dataUrl: imageSrc,
      timestamp: Date.now(),
    };

    setPhotos((prev) => [newPhoto, ...prev]);
  }, []);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const deletePhoto = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (selectedPhoto?.id === id) setSelectedPhoto(null);
  };

  const downloadPhoto = (photo: CapturedPhoto, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const link = document.createElement("a");
    link.href = photo.dataUrl;
    link.download = `photo_${photo.timestamp}.jpg`;
    link.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotos((prev) => [
        {
          id: Date.now().toString(),
          dataUrl: reader.result as string,
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`w-full h-full flex flex-col  ${isDark ? "bg-black" : "bg-gray-100"}`}
    >
      {/* Flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {showGallery ? (
        /* ================= GALLERY ================= */
        <div className="flex-1 p-4 grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
            >
              <img src={photo.dataUrl} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center gap-2">
                <button onClick={(e) => downloadPhoto(photo, e)}>
                  <Download className="text-white" />
                </button>
                <button onClick={(e) => deletePhoto(photo.id, e)}>
                  <Trash2 className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ================= CAMERA ================= */
        <div className="flex-1 relative bg-black">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode,
            }}
            className="w-full h-full object-cover"
          />

          {/* Controls */}
          <div className="absolute bottom-0 w-full px-6 py-5 bg-black/70 backdrop-blur-xl">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <button onClick={() => setShowGallery(true)}>
                <ImageIcon className="text-white/70" />
              </button>

              <button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center"
              >
                <div className="w-12 h-12 rounded-full bg-white" />
              </button>

              <button onClick={toggleCamera}>
                <RefreshCw className="text-white/70" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 flex items-center justify-center"
            onClick={() => setSelectedPhoto(null)}
          >
            <img
              src={selectedPhoto.dataUrl}
              className="max-h-[80vh] rounded-lg"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white"
            >
              <X />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
