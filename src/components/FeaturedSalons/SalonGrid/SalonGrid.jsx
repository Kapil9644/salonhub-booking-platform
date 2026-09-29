import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "../../../context/LocationContext";
import SalonCard from "../../common/SalonCard/SalonCard";
import { getPublicSalons } from "../../../services/salonService";
import { calculateDistance } from "../../../utils/distance";

export default function SalonGrid() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { location } = useLocation();

  const scrollRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // ==================================================
  // FETCH PUBLIC SALONS
  // ==================================================

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

  // ==================================================
  // LOCATION-BASED TOP PICKS
  //
  // Current location changes:
  // distance is recalculated
  // salons are reordered automatically.
  // ==================================================

  const salonsWithDistance = useMemo(() => {
    const processedSalons = salons.map((salon) => {
      const salonLatitude = salon?.location?.latitude;

      const salonLongitude = salon?.location?.longitude;

      // No usable location for either side
      if (
        location?.latitude == null ||
        location?.longitude == null ||
        salonLatitude == null ||
        salonLongitude == null
      ) {
        return {
          ...salon,
          calculatedDistance: null,
        };
      }

      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        salonLatitude,
        salonLongitude,
      );

      return {
        ...salon,
        calculatedDistance: distance,
      };
    });

    // ==================================================
    // If customer location is available:
    // nearest salons first.
    //
    // Salons without coordinates go after salons
    // with a calculated distance.
    // ==================================================

    if (location?.latitude != null && location?.longitude != null) {
      processedSalons.sort((a, b) => {
        if (a.calculatedDistance !== null && b.calculatedDistance !== null) {
          return a.calculatedDistance - b.calculatedDistance;
        }

        if (a.calculatedDistance !== null) {
          return -1;
        }

        if (b.calculatedDistance !== null) {
          return 1;
        }

        return 0;
      });
    }

    return processedSalons;
  }, [salons, location?.latitude, location?.longitude]);

  // ==================================================
  // SCROLL BUTTON STATE
  // ==================================================

  const updateScrollButtons = () => {
    const container = scrollRef.current;

    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    setCanScrollLeft(container.scrollLeft > 5);

    setCanScrollRight(container.scrollLeft < maxScrollLeft - 5);
  };

  // ==================================================
  // SCROLL LISTENERS
  // ==================================================

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    // Wait for newly sorted/rendered cards
    requestAnimationFrame(() => {
      updateScrollButtons();
    });

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
  }, [salonsWithDistance]);

  // ==================================================
  // SCROLL BY ONE CARD
  // ==================================================

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

  // ==================================================
  // LOADING
  // ==================================================

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

  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-center">
        <p className="text-sm font-medium text-red-600">{error}</p>
      </div>
    );
  }

  // ==================================================
  // EMPTY
  // ==================================================

  if (salons.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
        <p className="text-sm font-medium text-gray-500">
          No featured salons available right now.
        </p>
      </div>
    );
  }

  // ==================================================
  // CAROUSEL
  // ==================================================

  return (
    <div className="relative w-full">
      {/* ==========================================
          LEFT ARROW
          ========================================== */}

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

      {/* ==========================================
          SALON CAROUSEL
          ========================================== */}

      <div
        ref={scrollRef}
        className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto pb-1 scrollbar-hide sm:gap-4"
      >
        {salonsWithDistance.map((salon) => (
          <div
            key={salon._id}
            className="w-[calc((100%-0.75rem)/2)] min-w-[calc((100%-0.75rem)/2)] shrink-0 snap-start md:w-[calc((100%-2rem)/3)] md:min-w-[calc((100%-2rem)/3)] lg:w-[calc((100%-5rem)/6)] lg:min-w-[calc((100%-5rem)/6)]"
          >
            <SalonCard
              {...salon}
              id={salon._id}
              image={salon.profileImage}
              distance={
                salon.calculatedDistance != null
                  ? `${salon.calculatedDistance.toFixed(1)} km`
                  : salon.distance
              }
            />
          </div>
        ))}
      </div>

      {/* ==========================================
          RIGHT ARROW
          ========================================== */}

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
