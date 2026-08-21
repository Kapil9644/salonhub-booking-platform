import { MapPin, Search, LoaderCircle } from "lucide-react";
import { useLocation } from "../../../../context/LocationContext";
import { useState } from "react";

export default function LocationPicker({ onClose }) {
  const { requestLocation, locationStatus, selectLocation } = useLocation();

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState("idle");
  const [searchError, setSearchError] = useState("");

  const isLoading = locationStatus === "loading";
  const isSearching = searchStatus === "loading";

  const handleSelectLocation = (result) => {
    const selectedLocation = {
      latitude: Number(result.lat),
      longitude: Number(result.lon),
      accuracy: null,

      area:
        result.address?.suburb ||
        result.address?.neighbourhood ||
        result.address?.quarter ||
        result.name ||
        "",

      city:
        result.address?.city ||
        result.address?.town ||
        result.address?.village ||
        result.address?.municipality ||
        result.address?.city_district ||
        "",

      state: result.address?.state || "",
      country: result.address?.country || "",
      postcode: result.address?.postcode || "",
      displayName: result.display_name,
    };
    selectLocation(selectedLocation);
    onClose();
  };

  const handleCurrentLocation = () => {
    requestLocation();
    onClose();
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    const query = searchText.trim();

    if (!query) {
      setSearchResults([]);
      return;
    }

    setSearchStatus("loading");
    setSearchError("");
    setSearchResults([]);

    try {
      const params = new URLSearchParams({
        q: query,
        format: "jsonv2",
        addressdetails: "1",
        limit: "5",
        countrycodes: "in",
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Location search failed.");
      }

      const data = await response.json();

      setSearchResults(data);
      setSearchStatus("success");
    } catch (error) {
      console.error("Location search error:", error);
      setSearchStatus("error");
      setSearchError("Unable to search this location. Please try again.");
    }
  };

  return (
    <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[300px] rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
      {/* Current Location */}
      <button
        type="button"
        onClick={handleCurrentLocation}
        disabled={isLoading}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <LoaderCircle
            size={20}
            className="shrink-0 animate-spin text-purple-600"
          />
        ) : (
          <MapPin size={20} className="shrink-0 text-purple-600" />
        )}

        <div>
          <p className="text-sm font-semibold text-gray-800">
            {isLoading ? "Detecting location..." : "Use my current location"}
          </p>

          <p className="text-xs text-gray-500">
            Detect your location automatically
          </p>
        </div>
      </button>

      {/* Divider */}
      <div className="my-2 border-t border-gray-100"></div>

      {/* Search */}
      <form onSubmit={handleSearch}>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 focus-within:border-purple-400">
          <Search size={20} className="shrink-0 text-gray-400" />

          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search area or PIN code"
            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />

          <button
            type="submit"
            disabled={isSearching || !searchText.trim()}
            className="shrink-0 text-sm font-semibold text-purple-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSearching ? "..." : "Search"}
          </button>
        </div>
      </form>

      {/* Search Status */}
      {isSearching && (
        <div className="flex items-center gap-2 px-3 py-4 text-sm text-gray-500">
          <LoaderCircle size={16} className="animate-spin" />
          Searching locations...
        </div>
      )}

      {searchError && (
        <p className="px-3 py-3 text-xs text-red-500">{searchError}</p>
      )}

      {/* Results */}
      {!isSearching && searchResults.length > 0 && (
        <div className="mt-2 max-h-60 overflow-y-auto">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Search results
          </p>

          <div className="space-y-1">
            {searchResults.map((result) => (
              <button
                key={result.place_id}
                type="button"
                onClick={() => handleSelectLocation(result)}
                className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-purple-50"
              >
                <MapPin size={18} className="mt-0.5 shrink-0 text-purple-600" />

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">
                    {result.name ||
                      result.address?.suburb ||
                      result.display_name}
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-gray-500">
                    {result.display_name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {!isSearching &&
        searchStatus === "success" &&
        searchResults.length === 0 && (
          <p className="px-3 py-4 text-sm text-gray-500">
            No matching locations found.
          </p>
        )}

      {/* Attribution */}
      <p className="mt-2 px-3 text-[10px] leading-4 text-gray-400">
        Location data © OpenStreetMap contributors
      </p>
    </div>
  );
}
