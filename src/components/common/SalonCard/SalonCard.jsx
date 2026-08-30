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
      <div className="group flex h-full min-h-[560px] flex-col overflow-hidden rounded-3xl border border-gray-400 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        {/* Image */}
        <div className="relative shrink-0 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Favourite */}
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
            aria-label="Add to favourites"
          >
            <Heart size={18} className="text-gray-600" />
          </button>

          {/* Open Badge */}
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white ${
              isOpen ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {isOpen ? "Open Now" : "Closed"}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Rating */}
          <div className="mb-3 flex shrink-0 items-center gap-2">
            <Star size={18} className="fill-yellow-400 text-yellow-400" />

            <span className="font-semibold">{rating || "New"}</span>

            <span className="text-sm text-gray-500">
              ({reviews || 0} reviews)
            </span>
          </div>

          {/* Salon Name */}
          <h3 className="shrink-0 text-xl font-bold text-slate-900">{name}</h3>

          {/* Services */}
          <div className="mt-4 flex min-h-[58px] flex-wrap content-start gap-2 overflow-hidden">
            {visibleServices.map((service) => (
              <span
                key={service._id || service.id}
                className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700"
              >
                {service.name}
              </span>
            ))}

            {remainingServices > 0 && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                +{remainingServices} more
              </span>
            )}
          </div>

          {/* Location */}
          <div className="mt-3 flex min-h-[24px] items-center gap-2">
            <MapPin size={16} className="shrink-0" />

            <span className="truncate text-sm text-gray-700">
              {typeof location === "object"
                ? [location.area, location.city].filter(Boolean).join(", ")
                : location || "Location unavailable"}
            </span>
          </div>

          {/* Bottom */}
          <div className="mt-auto flex items-center justify-between gap-3 pt-6">
            <span className="text-2xl font-bold text-purple-600">
              {priceLabel || "Price unavailable"}
            </span>

            <span className="shrink-0 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition group-hover:bg-purple-700">
              Book Now
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
