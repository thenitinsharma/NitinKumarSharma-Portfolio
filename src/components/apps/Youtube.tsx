import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface YoutubeProps {
  isDark: boolean;
}

export default function Youtube({ isDark }: YoutubeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`w-full h-full flex flex-col ${isDark ? "bg-[#121212]" : "bg-[#f5f5f5]"}`}
    >
      {/* Native macOS-style toolbar */}
      {/* <div
        className={`h-12 flex items-center px-4 border-b ${
          isDark ? "bg-[#181818] border-white/5" : "bg-white border-black/5"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#c40d0d]" />
          <span
            className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Youtube
          </span>
        </div>
        <div className="flex-1" />
        <a
          href="https://videotube-cyan.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            isDark
              ? "text-white/60 hover:text-white hover:bg-white/10"
              : "text-gray-600 hover:text-gray-900 hover:bg-black/5"
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open in Browser
        </a>
      </div> */}

      {/* Iframe Container - No borders, seamless integration */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center ${
              isDark ? "bg-[#121212]" : "bg-[#f5f5f5]"
            }`}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-8 h-8 text-[#1DB954]" />
            </motion.div>
            <p
              className={`mt-4 text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}
            >
              Loading Youtube...
            </p>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src="https://videotube-cyan.vercel.app/"
          className="w-full h-full"
          style={{
            border: "none",
            background: "transparent",
            opacity: isLoading ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
          allow="autoplay; encrypted-media"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          title="Youtube"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />

        {hasError && (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center ${
              isDark ? "bg-[#121212]" : "bg-[#f5f5f5]"
            }`}
          >
            <p
              className={`text-lg font-medium ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Unable to load Youtube
            </p>
            <p
              className={`mt-2 text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}
            >
              The service may be temporarily unavailable
            </p>
            <a
              href="https://videotube-cyan.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-4 py-2 bg-[#1DB954] text-white rounded-lg text-sm font-medium hover:bg-[#1ed760] transition-colors"
            >
              Open in New Tab
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
