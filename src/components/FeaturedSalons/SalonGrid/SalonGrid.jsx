import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import SalonCard from "../../common/SalonCard/SalonCard";
import { getPublicSalons } from "../../../services/salonService";

export default function SalonGrid() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const scrollRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchFeaturedSalons = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPublicSalons();

        setSalons(data.salons || []);
      } catch (error) {
        console.error("Failed to fetch featured salons:", error);

        setError(
          error.response?.data?.message || "Failed to load featured salons.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedSalons();
  }, []);

  const updateScrollButtons = () => {
    const container = scrollRef.current;

    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    setCanScrollLeft(container.scrollLeft > 5);
    setCanScrollRight(container.scrollLeft < maxScrollLeft - 5);
  };

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    updateScrollButtons();

    const handleScroll = () => {
      updateScrollButtons();
    };

    const handleResize = () => {
      updateScrollButtons();
    };

    container.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [salons]);

  const scrollByCard = (direction) => {
    const container = scrollRef.current;

    if (!container) return;

    const firstCard = container.firstElementChild;

    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;

    const styles = window.getComputedStyle(container);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");

    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="flex w-full gap-3 overflow-hidden sm:gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="h-64 w-[calc((100%-0.75rem)/2)] min-w-[calc((100%-0.75rem)/2)] shrink-0 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 sm:h-72 md:w-[calc((100%-2rem)/3)] md:min-w-[calc((100%-2rem)/3)] lg:w-[calc((100%-5rem)/6)] lg:min-w-[calc((100%-5rem)/6)]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-center">
        <p className="text-sm font-medium text-red-600">{error}</p>
      </div>
    );
  }

  if (salons.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
        <p className="text-sm font-medium text-gray-500">
          No featured salons available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByCard("left")}
          aria-label="Previous salons"
          className="absolute left-1 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-purple-400 p-2 text-gray-700 shadow-md transition hover:bg-white hover:text-purple-600 md:flex"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Salon Carousel */}
      <div
        ref={scrollRef}
        className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto pb-1 scrollbar-hide sm:gap-4"
      >
        {salons.map((salon) => (
          <div
            key={salon._id}
            className="w-[calc((100%-0.75rem)/2)] min-w-[calc((100%-0.75rem)/2)] shrink-0 snap-start md:w-[calc((100%-2rem)/3)] md:min-w-[calc((100%-2rem)/3)] lg:w-[calc((100%-5rem)/6)] lg:min-w-[calc((100%-5rem)/6)]"
          >
            <SalonCard {...salon} id={salon._id} image={salon.profileImage} />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByCard("right")}
          aria-label="Next salons"
          className="absolute right-1 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-purple-400 p-2 text-gray-700 shadow-md transition hover:bg-white hover:text-purple-600 md:flex"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
