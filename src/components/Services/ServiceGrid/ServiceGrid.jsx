import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { services } from "../../../data/services";
import ServiceCard from "../ServiceCard/ServiceCard";

export default function ServiceGrid() {
  const scrollRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
  }, []);

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

  return (
    <div className="relative w-full">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByCard("left")}
          aria-label="Previous services"
          className="absolute left-1 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-purple-200 bg-purple-400 p-2 text-purple-700 shadow-md transition hover:bg-purple-200 hover:text-purple-800 md:flex"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Services Carousel */}
      <div
        ref={scrollRef}
        className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto pb-1 scrollbar-hide sm:gap-4"
      >
        {services.map((service) => (
          <div
            key={service.id}
            className="w-[calc((100%-1.5rem)/3)] min-w-[calc((100%-1.5rem)/3)] shrink-0 snap-start sm:w-[calc((100%-3rem)/4)] sm:min-w-[calc((100%-3rem)/4)] lg:w-[calc((100%-5rem)/6)] lg:min-w-[calc((100%-5rem)/6)]"
          >
            <ServiceCard
              title={service.title}
              description={service.description}
              icon={service.icon}
            />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByCard("right")}
          aria-label="Next services"
          className="absolute right-1 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-purple-200 bg-purple-400 p-2 text-purple-700 shadow-md transition hover:bg-purple-200 hover:text-purple-800 md:flex"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
