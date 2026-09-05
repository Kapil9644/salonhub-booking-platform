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
      <div className="group flex h-full min-h-[390px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:min-h-[410px]">
        {/* Image */}
        <div className="relative shrink-0 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-44 md:h-48"
          />

          {/* Favourite */}
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="absolute right-2.5 top-2.5 rounded-full bg-white/90 p-1.5 shadow-sm transition hover:bg-white"
            aria-label="Add to favourites"
          >
            <Heart size={16} className="text-gray-600" />
          </button>

          {/* Open Badge */}
          <span
            className={`absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${
              isOpen ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {isOpen ? "Open Now" : "Closed"}
          </span>
        </div>

        {/* Content */}
        <div className="flex min-h-0 flex-1 flex-col p-3">
          {/* Rating */}
          <div className="mb-1.5 flex shrink-0 items-center gap-1.5">
            <Star size={15} className="fill-yellow-400 text-yellow-400" />

            <span className="text-sm font-semibold">{rating || "New"}</span>

            <span className="text-xs text-gray-500">({reviews || 0})</span>
          </div>

          {/* Salon Name */}
          <h3 className="truncate text-base font-bold leading-5 text-slate-900">
            {name}
          </h3>

          {/* Services */}
          <div className="mt-2 flex min-h-[24px] flex-wrap content-start gap-1 overflow-hidden">
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
          <div className="mt-2 flex min-w-0 items-center gap-1.5">
            <MapPin size={14} className="shrink-0 text-gray-500" />

            <span className="truncate text-xs leading-4 text-gray-600">
              {typeof location === "object"
                ? [location.area, location.city].filter(Boolean).join(", ")
                : location || "Location unavailable"}
            </span>
          </div>

          <div className="mt-auto flex min-w-0 items-end justify-between gap-2 border-t border-gray-100 pt-3 sm:gap-4">
            {/* Price */}
            <span className="min-w-0 flex-1 text-sm font-bold leading-4 text-purple-600 sm:text-base sm:leading-5">
              {priceLabel || "Price unavailable"}
            </span>

            {/* Book Now */}
            <span className="shrink-0 rounded-lg bg-purple-600 px-2 py-1.5 text-[10px] font-semibold leading-4 whitespace-nowrap text-white transition group-hover:bg-purple-700 sm:px-3.5 sm:py-1.5 sm:text-xs">
              Book Now
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
