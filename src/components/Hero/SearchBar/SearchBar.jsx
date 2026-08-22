import { Search, MapPin, LoaderCircle } from "lucide-react";
import { useLocation } from "../../../context/LocationContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationPicker from "./LocationPicker/LocationPicker";

export default function SearchBar() {
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const { location, locationStatus } = useLocation();

  const navigate = useNavigate();

  const isLoading = locationStatus === "loading";

  const locationText =
    locationStatus === "success" && location
      ? `${location.city || "Current location"}${
          location.state ? `, ${location.state}` : ""
        }`
      : "Use my location";

  const handleFindSalons = () => {
    const params = new URLSearchParams();

    if (locationText && locationText !== "Use my location") {
      params.set("location", locationText);
    }

    if (searchText.trim()) {
      params.set("search", searchText.trim());
    }

    navigate(`/salons?${params.toString()}`);
  };

  return (
    <div className="relative flex w-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl lg:h-20 lg:flex-row lg:items-center lg:gap-0 lg:p-2">
      {/* Location */}
      <button
        type="button"
        onClick={() => setIsLocationPickerOpen((previous) => !previous)}
        className="flex min-w-0 flex-1 items-center gap-3 px-4 text-left text-gray-700 transition hover:text-purple-600"
      >
        {isLoading ? (
          <LoaderCircle
            className="shrink-0 animate-spin text-purple-600"
            size={22}
          />
        ) : (
          <MapPin className="shrink-0 text-purple-600" size={22} />
        )}

        <span className="truncate">
          {isLoading ? "Detecting location..." : locationText}
        </span>
      </button>

      {/* Divider */}
      <div className="hidden h-10 w-px bg-gray-200 lg:block"></div>

      {/* Search */}
      <div className="flex min-w-0 flex-1 items-center gap-3 px-4">
        <Search className="shrink-0 text-gray-400" size={22} />

        <input
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleFindSalons();
            }
          }}
          placeholder="Search salon or service"
          className="w-full min-w-0 bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Button */}
      <button
        type="button"
        onClick={handleFindSalons}
        className="w-full rounded-xl bg-purple-600 px-8 py-2 font-semibold whitespace-nowrap text-white transition hover:bg-purple-700 lg:w-auto lg:min-w-[170px]"
      >
        Find Salons
      </button>

      {/* Location Picker */}
      {isLocationPickerOpen && (
        <LocationPicker onClose={() => setIsLocationPickerOpen(false)} />
      )}
    </div>
  );
}
