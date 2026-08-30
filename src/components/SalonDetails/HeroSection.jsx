import { MapPin } from "lucide-react";

export default function HeroSection({ salon }) {
  const location = salon.location || {};

  const locationText = [location.area, location.city, location.state]
    .filter(Boolean)
    .join(", ");

  return (
    <section>
      {/* Salon Image */}
      {salon.profileImage ? (
        <img
          src={salon.profileImage}
          alt={`${salon.name} salon`}
          className="h-[280px] w-full rounded-2xl object-cover sm:h-[340px] sm:rounded-3xl lg:h-[420px]"
        />
      ) : (
        <div className="flex h-[280px] w-full items-center justify-center rounded-2xl bg-gray-100 sm:h-[340px] sm:rounded-3xl lg:h-[420px]">
          <span className="px-4 text-center text-lg font-semibold text-gray-400">
            Salon image not available
          </span>
        </div>
      )}

      {/* Salon Information */}
      <div className="mt-6 sm:mt-8">
        {/* Salon Name */}
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          {salon.name}
        </h1>

        {/* Location + Status */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          {/* Location */}
          <div className="flex min-w-0 items-center gap-2 text-gray-600">
            <MapPin size={18} className="shrink-0 text-purple-600" />

            <span className="truncate">
              {locationText || "Location not available"}
            </span>
          </div>

          {/* Open / Closed */}
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${
              salon.isOpen ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {salon.isOpen ? "Open Now" : "Closed"}
          </span>
        </div>

        {/* Starting Price */}
        <div className="mt-5">
          <p className="text-sm text-gray-500">Starting price</p>

          <h2 className="mt-1 text-2xl font-bold text-purple-600 sm:text-3xl">
            {salon.priceLabel || "Price unavailable"}
          </h2>
        </div>
      </div>
    </section>
  );
}
