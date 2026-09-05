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
    <div className="relative flex w-full flex-col gap-2 rounded-xl border border-gray-200 bg-white p-2.5 shadow-lg md:h-14 md:flex-row md:items-center md:gap-0 md:rounded-2xl md:p-1.5">
      {/* Location */}
      <button
        type="button"
        onClick={() => setIsLocationPickerOpen((previous) => !previous)}
        className="flex min-w-0 flex-1 items-center gap-2 px-2.5 text-left text-sm text-gray-700 transition hover:text-purple-600 md:px-3"
      >
        {isLoading ? (
          <LoaderCircle
            className="shrink-0 animate-spin text-purple-600"
            size={18}
          />
        ) : (
          <MapPin className="shrink-0 text-purple-600" size={18} />
        )}

        <span className="truncate">
          {isLoading ? "Detecting location..." : locationText}
        </span>
      </button>

      {/* Divider */}
      <div className="hidden h-7 w-px bg-gray-200 md:block"></div>

      {/* Search */}
      <div className="flex min-w-0 flex-1 items-center gap-2 px-2.5 md:px-3">
        <Search className="shrink-0 text-gray-400" size={18} />

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
          className="w-full min-w-0 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Button */}
      <button
        type="button"
        onClick={handleFindSalons}
        className="w-full rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold whitespace-nowrap text-white transition hover:bg-purple-700 md:w-auto md:min-w-[130px] md:px-5"
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
