import { MapPin, Star, Navigation, ArrowLeft } from "lucide-react";

export default function HeroSection({ salon, distance }) {
  const location = salon.location || {};

  const locationText = [location.area, location.city, location.state]
    .filter(Boolean)
    .join(", ");

  const latitude = location.latitude;
  const longitude = location.longitude;

  const hasCoordinates =
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined;

  const directionsUrl = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    : "";

  return (
    <section>
      <a
        href="/salons"
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 transition hover:text-purple-700"
      >
        <ArrowLeft size={16} />
        Back to Salons
      </a>
      {/* Salon Image */}
      {salon.profileImage ? (
        <img
          src={salon.profileImage}
          alt={`${salon.name} salon`}
          className="h-[180px] w-full rounded-2xl object-cover sm:h-[240px] sm:rounded-2xl lg:h-[280px]"
        />
      ) : (
        <div className="flex h-[180px] w-full items-center justify-center rounded-2xl bg-gray-100 sm:h-[240px] sm:rounded-3xl lg:h-[280px]">
          <span className="px-4 text-center text-lg font-semibold text-gray-400">
            Salon image not available
          </span>
        </div>
      )}

      {/* Salon Information */}
      <div className="mt-3 sm:mt-5">
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <h1 className="truncate text-2xl font-bold leading-tight text-slate-900 sm:text-2xl lg:text-2xl">
              {salon.name}
            </h1>

            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-4 text-white ${
                salon.isOpen ? "bg-green-600" : "bg-red-500"
              }`}
            >
              {salon.isOpen ? "Open Now" : "Closed"}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />

            <span className="text-sm font-bold text-slate-900">
              {salon.rating || "New"}
            </span>

            <span className="text-xs text-gray-1000">
              {salon.reviews || 0} Reviews
            </span>
          </div>
        </div>
        {/* Salon Quick Information */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          {/* Location */}
          <div className="flex min-w-0 items-center gap-2 text-gray-600">
            <MapPin size={17} className="shrink-0 text-purple-600" />

            <span className="min-w-0 truncate text-sm">
              {locationText || "Location not available"}
            </span>
          </div>

          {/* Distance */}
          {distance !== null && distance !== undefined && (
            <span className="shrink-0 text-xs font-semibold text-purple-600">
              {distance.toFixed(1)} km away
            </span>
          )}

          {/* Get Directions */}
          {hasCoordinates && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1.5 text-xs font-semibold text-purple-700 transition hover:border-purple-300 hover:bg-purple-100"
            >
              <Navigation size={14} />
              Get Directions
            </a>
          )}

          {/* Starting Price */}
          <span className="shrink-0 font-semibold text-gray-900 text-1xl  bg-amber-300 px-2 py-1 rounded-lg">
            Starting {salon.priceLabel || "Price unavailable"}
          </span>
        </div>
      </div>
    </section>
  );
}
