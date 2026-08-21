import { MapPin, LoaderCircle, RefreshCw } from "lucide-react";
import { useLocation } from "../../../context/LocationContext";

export default function LocationSelector() {
  const { location, locationStatus, locationError, requestLocation } =
    useLocation();

  const isLoading = locationStatus === "loading";

  if (locationStatus === "success" && location) {
    return (
      <div className="flex w-fit max-w-full items-center gap-2 rounded-xl bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700">
        <MapPin size={16} strokeWidth={2} />

        <span className="truncate">
          {location.city
            ? `${location.city}${location.state ? `, ${location.state}` : ""}`
            : "Location detected"}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <button
        type="button"
        onClick={requestLocation}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm font-semibold text-purple-700 shadow-sm transition-all duration-200 hover:border-purple-300 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <LoaderCircle size={17} strokeWidth={2} className="animate-spin" />
        ) : locationError ? (
          <RefreshCw size={17} strokeWidth={2} />
        ) : (
          <MapPin size={17} strokeWidth={2} />
        )}

        <span>
          {isLoading
            ? "Detecting location..."
            : locationError
              ? "Try again"
              : "Use my current location"}
        </span>
      </button>

      {locationError && (
        <p className="mt-2 text-xs leading-5 text-red-500">{locationError}</p>
      )}
    </div>
  );
}
