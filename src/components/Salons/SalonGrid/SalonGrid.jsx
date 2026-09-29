import { useEffect, useMemo, useState } from "react";
import SalonCard from "../../common/SalonCard/SalonCard.jsx";
import { calculateDistance } from "../../../utils/distance";
import {
  getSalonSearchScore,
  normalizeText,
  salonMatchesPriceRange,
} from "../../../utils/salonFilters";

const getSalonDistance = (salon, userLocation) => {
  if (
    userLocation?.latitude == null ||
    userLocation?.longitude == null ||
    salon?.location?.latitude == null ||
    salon?.location?.longitude == null
  ) {
    return null;
  }

  return calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    salon.location.latitude,
    salon.location.longitude,
  );
};

export default function SalonGrid({
  salons = [],
  minimumRating = 0,
  priceRange = "Any Price",
  sortBy = "Nearest",
  searchText = "",
  selectedLocation = "",
  selectedPincode = "",
  userLocation = null,
  openNow = false,
  setTotalSalons,
  onResetFilters,
  onStartNewSearch,
}) {
  // ==================================================
  // ROW SIZE
  // Mobile = 2
  // Tablet/Desktop = 3
  // ==================================================

  const getRowSize = () => {
    if (typeof window === "undefined") {
      return 3;
    }

    return window.innerWidth < 640 ? 2 : 3;
  };

  const [rowSize, setRowSize] = useState(getRowSize);

  // ==================================================
  // LOAD STATE
  // ==================================================

  const [loadState, setLoadState] = useState(() => ({
    key: "",
    count: getRowSize(),
  }));

  // ==================================================
  // RESPONSIVE ROW SIZE
  // ==================================================

  useEffect(() => {
    const handleResize = () => {
      const nextRowSize = getRowSize();

      setRowSize((currentRowSize) => {
        if (currentRowSize === nextRowSize) {
          return currentRowSize;
        }

        return nextRowSize;
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ==================================================
  // FILTER KEY
  // Any search/filter/sort/location change
  // starts the grid from the first row again.
  // ==================================================

  const filterKey = useMemo(() => {
    return JSON.stringify({
      searchText: searchText.trim(),
      selectedLocation: selectedLocation.trim(),
      selectedPincode: selectedPincode.trim(),
      minimumRating,
      priceRange,
      sortBy,
      openNow,
      latitude: userLocation?.latitude ?? null,
      longitude: userLocation?.longitude ?? null,
    });
  }, [
    searchText,
    selectedLocation,
    selectedPincode,
    minimumRating,
    priceRange,
    sortBy,
    openNow,
    userLocation?.latitude,
    userLocation?.longitude,
  ]);

  // ==================================================
  // PROCESS SALONS
  // ==================================================

  const processedSalons = useMemo(() => {
    let results = salons.map((salon) => ({
      ...salon,
      calculatedDistance: getSalonDistance(salon, userLocation),
      searchScore: getSalonSearchScore(salon, searchText),
    }));

    // ==================================================
    // SEARCH
    // ==================================================

    if (searchText.trim()) {
      results = results.filter((salon) => salon.searchScore >= 0);
    }

    // ==================================================
    // LOCATION / PINCODE SEARCH
    // ==================================================

    const normalizedSelectedLocation = normalizeText(selectedLocation);

    const normalizedSelectedPincode = normalizeText(selectedPincode);

    if (normalizedSelectedLocation || normalizedSelectedPincode) {
      results = results.filter((salon) => {
        const location = salon?.location || {};

        const locationParts = [
          location.address,
          location.area,
          location.city,
          location.state,
        ]
          .filter(Boolean)
          .map(normalizeText);

        const pincode = normalizeText(
          location.pincode || location.postcode || "",
        );

        const locationTerms = normalizedSelectedLocation
          .split(/\s+/)
          .filter(Boolean);

        const locationMatches =
          !normalizedSelectedLocation ||
          locationParts.some((part) =>
            part.includes(normalizedSelectedLocation),
          ) ||
          locationTerms.every((term) =>
            locationParts.some((part) => part.includes(term)),
          );

        const pincodeMatches =
          !normalizedSelectedPincode || pincode === normalizedSelectedPincode;

        return locationMatches && pincodeMatches;
      });
    }

    // ==================================================
    // OPEN NOW
    // ==================================================

    if (openNow) {
      results = results.filter((salon) => salon.isOpen === true);
    }

    // ==================================================
    // MINIMUM RATING
    // ==================================================

    if (minimumRating > 0) {
      results = results.filter(
        (salon) => Number(salon.rating || 0) >= minimumRating,
      );
    }

    // ==================================================
    // SERVICE PRICE
    // Checks actual service prices.
    // ==================================================

    if (priceRange !== "Any Price") {
      results = results.filter((salon) =>
        salonMatchesPriceRange(salon, priceRange),
      );
    }

    // ==================================================
    // SORT
    // ==================================================

    results.sort((a, b) => {
      switch (sortBy) {
        // ----------------------------------------------
        // Recommended
        // ----------------------------------------------

        case "Recommended":
          if (b.searchScore !== a.searchScore) {
            return b.searchScore - a.searchScore;
          }

          if (a.calculatedDistance !== null && b.calculatedDistance !== null) {
            return a.calculatedDistance - b.calculatedDistance;
          }

          return Number(b.rating || 0) - Number(a.rating || 0);

        // ----------------------------------------------
        // Highest Rated
        // ----------------------------------------------

        case "Highest Rated":
          return Number(b.rating || 0) - Number(a.rating || 0);

        // ----------------------------------------------
        // Lowest Price
        // ----------------------------------------------

        case "Lowest Price": {
          const aPrices = (a.services || [])
            .map((service) => Number(service?.price))
            .filter(Number.isFinite);

          const bPrices = (b.services || [])
            .map((service) => Number(service?.price))
            .filter(Number.isFinite);

          const aMin = aPrices.length > 0 ? Math.min(...aPrices) : Infinity;

          const bMin = bPrices.length > 0 ? Math.min(...bPrices) : Infinity;

          return aMin - bMin;
        }

        // ----------------------------------------------
        // Highest Price
        // ----------------------------------------------

        case "Highest Price": {
          const aPrices = (a.services || [])
            .map((service) => Number(service?.price))
            .filter(Number.isFinite);

          const bPrices = (b.services || [])
            .map((service) => Number(service?.price))
            .filter(Number.isFinite);

          const aMax = aPrices.length > 0 ? Math.max(...aPrices) : -Infinity;

          const bMax = bPrices.length > 0 ? Math.max(...bPrices) : -Infinity;

          return bMax - aMax;
        }

        // ----------------------------------------------
        // Most Popular
        // ----------------------------------------------

        case "Most Popular":
          return Number(b.reviews || 0) - Number(a.reviews || 0);

        // ----------------------------------------------
        // Nearest
        // ----------------------------------------------

        case "Nearest":
        default:
          if (a.calculatedDistance !== null && b.calculatedDistance !== null) {
            return a.calculatedDistance - b.calculatedDistance;
          }

          if (a.calculatedDistance !== null) {
            return -1;
          }

          if (b.calculatedDistance !== null) {
            return 1;
          }

          return Number(b.rating || 0) - Number(a.rating || 0);
      }
    });

    return results;
  }, [
    salons,
    minimumRating,
    priceRange,
    sortBy,
    searchText,
    selectedLocation,
    selectedPincode,
    userLocation,
    openNow,
  ]);

  // ==================================================
  // TOTAL RESULTS
  // ==================================================

  useEffect(() => {
    setTotalSalons?.(processedSalons.length);
  }, [processedSalons.length, setTotalSalons]);

  // ==================================================
  // VISIBLE COUNT
  // ==================================================

  const visibleCount = loadState.key === filterKey ? loadState.count : rowSize;

  // ==================================================
  // INFINITE LOADING
  // ==================================================

  useEffect(() => {
    if (visibleCount >= processedSalons.length) {
      return;
    }

    const sentinel = document.getElementById("salon-grid-sentinel");

    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }

        setLoadState((currentState) => {
          // New filter/search/sort/location
          if (currentState.key !== filterKey) {
            return {
              key: filterKey,
              count: Math.min(rowSize * 2, processedSalons.length),
            };
          }

          // Load one more row
          return {
            key: filterKey,
            count: Math.min(
              currentState.count + rowSize,
              processedSalons.length,
            ),
          };
        });
      },
      {
        rootMargin: "250px",
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [filterKey, visibleCount, processedSalons.length, rowSize]);

  // ==================================================
  // VISIBLE SALONS
  // ==================================================

  const visibleSalons = processedSalons.slice(0, visibleCount);

  // ==================================================
  // EMPTY STATE
  // ==================================================

  if (processedSalons.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center">
        <h3 className="text-base font-semibold text-gray-900">
          No salons found
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
          Try changing your search, location, rating, or price filters.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Reset Filters
          </button>

          <button
            type="button"
            onClick={onStartNewSearch}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            New Search
          </button>
        </div>
      </div>
    );
  }

  // ==================================================
  // GRID
  // ==================================================

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-5">
        {visibleSalons.map((salon) => (
          <SalonCard
            key={salon._id}
            id={salon._id}
            image={salon.profileImage}
            name={salon.name}
            rating={salon.rating}
            reviews={salon.reviews}
            services={salon.services}
            location={salon.location}
            distance={salon.calculatedDistance}
            price={salon.price}
            priceLabel={salon.priceLabel}
            isOpen={salon.isOpen}
          />
        ))}
      </div>

      {visibleCount < processedSalons.length && (
        <div
          id="salon-grid-sentinel"
          className="flex min-h-20 items-center justify-center"
          aria-hidden="true"
        >
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-purple-600" />
        </div>
      )}
    </>
  );
}
