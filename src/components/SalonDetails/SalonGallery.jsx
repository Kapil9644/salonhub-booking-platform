import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";

export default function SalonGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const galleryRef = useRef(null);
  const touchStartX = useRef(null);

  const galleryImages = images.filter((image) => image?.url);

  const closeViewer = () => setActiveIndex(null);

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === null
        ? current
        : current === 0
          ? galleryImages.length - 1
          : current - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === null
        ? current
        : current === galleryImages.length - 1
          ? 0
          : current + 1,
    );
  };

  const scrollGallery = (direction) => {
    if (!galleryRef.current) return;

    galleryRef.current.scrollBy({
      left: direction * galleryRef.current.clientWidth * 0.75,
      behavior: "smooth",
    });
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0].clientX;
    const difference = touchStartX.current - touchEndX;

    touchStartX.current = null;

    if (Math.abs(difference) < 50 || galleryImages.length < 2) {
      return;
    }

    if (difference > 0) {
      showNext();
    } else {
      showPrevious();
    }
  };

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeViewer();

      if (event.key === "ArrowLeft") showPrevious();

      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, galleryImages.length]);

  if (galleryImages.length === 0) return null;

  return (
    <>
      {/* Normal Gallery Carousel */}
      <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:mt-6 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <Images size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Salon Gallery
              </h2>
              <p className="text-sm text-gray-500">
                Explore photos of this salon
              </p>
            </div>
          </div>

          <span className="shrink-0 text-sm text-gray-500">
            {galleryImages.length} photos
          </span>
        </div>

        <div className="relative">
          {/* Desktop/tablet left arrow; hidden on mobile */}
          {galleryImages.length > 3 && (
            <button
              type="button"
              onClick={() => scrollGallery(-1)}
              aria-label="Scroll gallery left"
              className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/30 bg-gradient-to-br from-purple-600 to-fuchsia-600 p-2.5 text-white shadow-lg shadow-purple-900/25 transition-all duration-200 hover:scale-110 hover:from-purple-700 hover:to-fuchsia-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 sm:flex"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          <div
            ref={galleryRef}
            className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {galleryImages.map((image, index) => (
              <button
                key={image._id || image.publicId || image.url}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View salon photo ${index + 1}`}
                className="group relative w-[72%] shrink-0 snap-start overflow-hidden rounded-xl bg-gray-100 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 sm:w-[40%] lg:w-[24%]"
              >
                <img
                  src={image.url}
                  alt={`Salon gallery photo ${index + 1}`}
                  loading="lazy"
                  draggable="false"
                  className="h-36 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-40 lg:h-44"
                />

                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/55 via-transparent to-transparent p-3 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                  <span className="text-sm font-medium text-white">
                    View photo
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Desktop/tablet right arrow; hidden on mobile */}
          {galleryImages.length > 3 && (
            <button
              type="button"
              onClick={() => scrollGallery(1)}
              aria-label="Scroll gallery right"
              className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/30 bg-gradient-to-br from-purple-600 to-fuchsia-600 p-2.5 text-white shadow-lg shadow-purple-900/25 transition-all duration-200 hover:scale-110 hover:from-purple-700 hover:to-fuchsia-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 sm:flex"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>

        <p className="mt-1 text-xs text-gray-400 sm:hidden">
          Swipe to explore more photos
        </p>
      </section>

      {/* Fullscreen Image Viewer */}
      {activeIndex !== null && galleryImages[activeIndex] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 sm:p-6"
          onClick={closeViewer}
          role="dialog"
          aria-modal="true"
          aria-label="Salon photo viewer"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeViewer}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 z-20 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          >
            <X size={24} />
          </button>

          {/* Fullscreen previous button */}
          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              aria-label="Previous photo"
              className="absolute left-2 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 sm:left-5"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Swipe-enabled image area */}
          <div
            className="flex max-h-[90vh] max-w-6xl flex-col items-center touch-pan-y"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={galleryImages[activeIndex].url}
              alt={`Salon gallery photo ${activeIndex + 1}`}
              draggable="false"
              className="max-h-[78vh] max-w-full rounded-lg object-contain select-none"
            />

            <p className="mt-3 text-sm text-white/80">
              Photo {activeIndex + 1} of {galleryImages.length}
            </p>
          </div>

          {/* Fullscreen next button */}
          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              aria-label="Next photo"
              className="absolute right-2 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 sm:right-5"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
