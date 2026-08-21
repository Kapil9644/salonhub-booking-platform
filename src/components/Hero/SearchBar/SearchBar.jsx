import { Search, MapPin, LoaderCircle } from "lucide-react";
import { useLocation } from "../../../context/LocationContext";
import { useEffect, useRef, useState } from "react";
import LocationPicker from "./LocationPicker/LocationPicker";

export default function SearchBar() {
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const locationPickerRef = useRef(null);
  const { location, locationStatus, requestLocation } = useLocation();

  const isLoading = locationStatus === "loading";

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        locationPickerRef.current &&
        !locationPickerRef.current.contains(event.target)
      ) {
        setIsLocationPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const locationParts =
    locationStatus === "success" && location
      ? [location.area, location.city, location.state].filter(Boolean)
      : [];

  const locationText =
    locationParts.length > 0
      ? [...new Set(locationParts)].join(", ")
      : "Use my location";

  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl lg:h-20 lg:flex-row lg:items-center lg:gap-0 lg:p-2">
      {/* Location */}
      {/* Location */}
      <div
        ref={locationPickerRef}
        className="relative flex min-w-0 flex-1 items-center gap-3 px-4 text-left text-gray-700 transition hover:text-purple-600"
      >
        <button
          type="button"
          onClick={() => setIsLocationPickerOpen((previous) => !previous)}
          className="flex w-full items-center gap-3 px-4 text-left text-gray-700 transition hover:text-purple-600"
        >
          {isLoading ? (
            <LoaderCircle
              className="shrink-0 animate-spin text-purple-600"
              size={22}
            />
          ) : (
            <MapPin className="shrink-0 text-purple-600" size={22} />
          )}

          <span className="min-w-0 truncate">
            {isLoading ? "Detecting location..." : locationText}
          </span>
        </button>

        {isLocationPickerOpen && (
          <LocationPicker onClose={() => setIsLocationPickerOpen(false)} />
        )}
      </div>

      {/* Divider */}
      <div className="hidden h-10 w-px bg-gray-200 lg:block"></div>

      {/* Search */}
      <div className="flex min-w-0 flex-1 items-center gap-3 px-4">
        <Search className="shrink-0 text-gray-400" size={22} />

        <input
          type="text"
          placeholder="Search salon or service"
          className="w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Button */}
      <button
        type="button"
        className="w-full rounded-xl bg-purple-600 px-8 py-2 font-semibold whitespace-nowrap text-white transition hover:bg-purple-700 lg:w-auto lg:min-w-[170px]"
      >
        Find Salons
      </button>
    </div>
  );
}
