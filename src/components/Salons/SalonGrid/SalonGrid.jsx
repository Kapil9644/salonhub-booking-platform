import SalonCard from "../../common/SalonCard/SalonCard";
import { calculateDistance } from "../../../utils/distance";

export default function SalonGrid({
  salons = [],
  selectedServices = [],
  minimumRating = 0,
  priceRange = "Any Price",
  sortBy = "Recommended",
  searchText = "",
  selectedLocation = "",
  userLocation = null,
  setTotalSalons,
  onResetFilters,
  onStartNewSearch,
}) {
  let filteredSalons = [...salons];

  if (userLocation?.latitude != null && userLocation?.longitude != null) {
    filteredSalons = filteredSalons.map((salon) => {
      if (salon.latitude == null || salon.longitude == null) {
        return salon;
      }

      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        salon.latitude,
        salon.longitude,
      );

      return {
        ...salon,
        calculatedDistance: distance,
      };
    });
  }

  // Search Filter
  if (searchText.trim()) {
    const search = searchText.trim().toLowerCase();

    filteredSalons = filteredSalons.filter((salon) => {
      const matchesSalonName = salon.name.toLowerCase().includes(search);

      const matchesLocation = salon.location.toLowerCase().includes(search);

      const matchesService = salon.services.some((service) =>
        service.name.toLowerCase().includes(search),
      );

      return matchesSalonName || matchesLocation || matchesService;
    });
  }

  // Location Filter

  if (selectedLocation.trim()) {
    const normalizedLocation = selectedLocation
      .replace("Current location,", "")
      .trim()
      .toLowerCase();

    const exactLocationMatches = filteredSalons.filter((salon) => {
      const area = salon.area?.toLowerCase() || "";
      const city = salon.city?.toLowerCase() || "";
      const state = salon.state?.toLowerCase() || "";
      const location = salon.location?.toLowerCase() || "";

      return (
        normalizedLocation.includes(area) ||
        normalizedLocation.includes(city) ||
        normalizedLocation.includes(state) ||
        location.includes(normalizedLocation)
      );
    });

    if (exactLocationMatches.length > 0) {
      filteredSalons = exactLocationMatches;
    } else {
      // If the selected area is not present,
      // fall back to the city.
      const cityMatches = filteredSalons.filter((salon) =>
        normalizedLocation.includes(salon.city?.toLowerCase() || ""),
      );

      if (cityMatches.length > 0) {
        filteredSalons = cityMatches;
      }
    }
  }

  // Filter by Services
  if (selectedServices.length > 0) {
    filteredSalons = filteredSalons.filter((salon) =>
      selectedServices.some((service) =>
        salon.services.some((salonService) => salonService.name === service),
      ),
    );
  }

  // Rating Filter
  if (minimumRating > 0) {
    filteredSalons = filteredSalons.filter(
      (salon) => salon.rating >= minimumRating,
    );
  }

  // Price Filter
  if (priceRange !== "Any Price") {
    filteredSalons = filteredSalons.filter((salon) => {
      switch (priceRange) {
        case "₹0 - ₹500":
          return salon.price <= 500;

        case "₹500 - ₹1000":
          return salon.price > 500 && salon.price <= 1000;

        case "₹1000+":
          return salon.price > 1000;

        default:
          return true;
      }
    });
  }

  // Sorting
  switch (sortBy) {
    case "Highest Rated":
      filteredSalons.sort((a, b) => b.rating - a.rating);
      break;

    case "Lowest Price":
      filteredSalons.sort((a, b) => a.price - b.price);
      break;

    case "Highest Price":
      filteredSalons.sort((a, b) => b.price - a.price);
      break;

    case "Most Popular":
      filteredSalons.sort((a, b) => b.reviews - a.reviews);
      break;

    case "Nearest":
      filteredSalons.sort((a, b) => {
        if (a.calculatedDistance == null) return 1;
        if (b.calculatedDistance == null) return -1;

        return a.calculatedDistance - b.calculatedDistance;
      });
      break;

    default:
      break;
  }

  console.log("Search:", searchText);
  console.log("Location:", selectedLocation);
  console.log("Filtered Salons:", filteredSalons);
  console.log("Count:", filteredSalons.length);

  if (setTotalSalons) {
    setTotalSalons(filteredSalons.length);
  }

  if (filteredSalons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-3xl">
          😔
        </div>

        <h2 className="mt-5 text-2xl font-bold text-slate-900">
          No salons found
        </h2>

        <p className="mt-3 max-w-md text-gray-500">
          We couldn't find any salons matching your current search, location, or
          filters.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onResetFilters}
            className="rounded-xl border border-purple-200 bg-white px-6 py-3 font-semibold text-purple-700 transition hover:bg-purple-50"
          >
            Clear Filters
          </button>

          <button
            type="button"
            onClick={onStartNewSearch}
            className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Start New Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {filteredSalons.map((salon) => (
        <SalonCard
          key={salon._id}
          {...salon}
          image={salon.profileImage}
          distance={
            salon.calculatedDistance != null
              ? `${salon.calculatedDistance.toFixed(1)} km`
              : salon.distance
          }
        />
      ))}
    </div>
  );
}
