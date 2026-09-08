import { Link } from "react-router-dom";
import { Heart, MapPin, Star } from "lucide-react";

export default function SalonCard({
  id,
  image,
  name,
  rating,
  reviews,
  services = [],
  location,
  distance,
  price,
  priceLabel,
  isOpen,
}) {
  const visibleServices = services.slice(0, 3);
  const remainingServices = Math.max(services.length - 3, 0);

  return (
    <Link to={`/salons/${id}`} className="block h-full">
      <div className="group flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500 hover:shadow-md sm:min-h-[330px] md:min-h-[340px]">
        {/* Image */}
        <div className="relative shrink-0 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-40 md:h-44 lg:h-45"
          />

          {/* Favourite */}
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-sm transition hover:bg-white"
            aria-label="Add to favourites"
          >
            <Heart size={15} className="text-gray-600" />
          </button>

          {/* Open Badge */}
          <span
            className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${
              isOpen ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {isOpen ? "Open Now" : "Closed"}
          </span>
        </div>

        {/* Content */}
        <div className="flex min-h-0 flex-1 flex-col p-2.5 sm:p-3">
          {/* Rating */}
          <div className="mb-1 flex shrink-0 items-center gap-1.5">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />

            <span className="text-sm font-semibold">{rating || "New"}</span>

            <span className="text-[11px] text-gray-500">({reviews || 0})</span>
          </div>

          {/* Salon Name */}
          <h3 className="truncate text-sm font-bold leading-5 text-slate-900 sm:text-base">
            {name}
          </h3>

          {/* Services */}
          <div className="mt-1.5 flex min-h-[22px] flex-wrap content-start gap-1 overflow-hidden">
            {visibleServices.map((service) => (
              <span
                key={service._id || service.id}
                className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] leading-4 text-purple-700"
              >
                {service.name}
              </span>
            ))}

            {remainingServices > 0 && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium leading-4 text-gray-600">
                +{remainingServices}
              </span>
            )}
          </div>

          {/* Location */}
          <div className="mt-1.5 flex min-w-0 items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <MapPin size={13} className="shrink-0 text-gray-500" />

              <span className="truncate text-[11px] leading-4 text-gray-600 sm:text-xs">
                {typeof location === "object"
                  ? [location.area, location.city].filter(Boolean).join(", ")
                  : location || "Location unavailable"}
              </span>
            </div>

            {distance !== undefined && distance !== null && distance !== "" && (
              <span className="shrink-0 text-[10px] font-semibold leading-4 text-purple-600">
                {typeof distance === "number"
                  ? `${distance.toFixed(1)} km`
                  : `${distance}`}
              </span>
            )}
          </div>

          {/* Bottom */}
          <div className="mt-auto flex min-w-0 items-end justify-between gap-2 border-t border-gray-100 pt-2.5 sm:pt-3">
            {/* Price */}
            <span className="min-w-0 flex-1 truncate text-sm font-bold leading-4 text-purple-600 sm:text-base sm:leading-5">
              {priceLabel || "Price unavailable"}
            </span>

            {/* Book Now */}
            <span className="shrink-0 rounded-lg bg-purple-600 px-2.5 py-1.5 text-[10px] font-semibold leading-4 whitespace-nowrap text-white transition group-hover:bg-purple-700 sm:px-3 sm:text-xs">
              Book Now
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
