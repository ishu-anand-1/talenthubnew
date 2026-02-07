import { useEffect, useState, useRef } from "react";

/* ===================== IMAGES ===================== */
const IMAGES = [
  "/ai-generated-8404740_1920.png",
  "/concert-8676557_1920.jpg",
  "/pexels-hatice-baran-153179658-30164912.jpg",
  "/pexels-mo3ath-photos-110226063-25540936.jpg",
  "/pexels-trayproductions-11963123.jpg",
];

const INTERVAL_TIME = 5000;

const BackgroundCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  /* ===================== HELPERS ===================== */
  const startCarousel = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, INTERVAL_TIME);
  };

  const stopCarousel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  /* ===================== EFFECT ===================== */
  useEffect(() => {
    startCarousel();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopCarousel();
      } else {
        startCarousel();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopCarousel();
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  /* ===================== UI ===================== */
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {IMAGES.map((image, index) => {
        const isActive = index === currentIndex;

        return (
          <div
            key={image}
            aria-hidden
            className={`
              absolute inset-0
              bg-cover bg-center
              transition-opacity transition-transform
              duration-[1200ms] ease-in-out
              will-change-[opacity,transform]
              ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-105"}
            `}
            style={{
              backgroundImage: `url(${image})`,
              filter: isActive
                ? "brightness(0.85) blur(1px)"
                : "brightness(0.7) blur(2px)",
            }}
          />
        );
      })}

      {/* ================= OVERLAY ================= */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 dark:from-black/60 dark:to-black/80" />
    </div>
  );
};

export default BackgroundCarousel;
