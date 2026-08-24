import { MapPin } from "lucide-react";

export default function HeroSection({ salon }) {
  const location = salon.location || {};

  const locationText = [
    location.area,
    location.city,
    location.state,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section>
      {/* Salon Image */}
      {salon.profileImage ? (
        <img
          src={salon.profileImage}
          alt={salon.name}
          className="h-[420px] w-full rounded-3xl object-cover"
        />
      ) : (
        <div className="flex h-[420px] w-full items-center justify-center rounded-3xl bg-gray-100">
          <span className="text-lg font-semibold text-gray-400">
            Salon image not available
          </span>
        </div>
      )}

      <div className="mt-8">
        {/* Salon Name */}
        <h1 className="text-4xl font-bold text-slate-900">
          {salon.name}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-6">
          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={18} />

            <span>
              {locationText || "Location not available"}
            </span>
          </div>

          {/* Open / Closed Status */}
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${
              salon.isOpen ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {salon.isOpen ? "Open Now" : "Closed"}
          </span>
        </div>

        {/* Starting Price */}
        <h2 className="mt-6 text-3xl font-bold text-purple-600">
          {salon.priceLabel || "Price unavailable"}
        </h2>
      </div>
    </section>
  );
}