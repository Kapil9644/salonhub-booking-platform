import { Heart, MapPin, Star } from "lucide-react";

export default function SalonCard({
  image,
  name,
  rating,
  reviews,
  services,
  location,
  distance,
  price,
  isOpen,
}) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Favourite */}
        <button className="absolute right-4 top-4 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white">
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
      <div className="p-5">

        {/* Rating */}
        <div className="mb-3 flex items-center gap-2">
          <Star
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="font-semibold">
            {rating}
          </span>

          <span className="text-sm text-gray-500">
            ({reviews} reviews)
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900">
          {name}
        </h3>

        {/* Service Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {services.map((service) => (
            <span
              key={service}
              className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700"
            >
              {service}
            </span>
          ))}
        </div>

        {/* Location */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            {location}
          </div>

          <span>{distance}</span>
        </div>

        {/* Bottom */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-2xl font-bold text-purple-600">
            {price}
          </span>

          <button className="rounded-xl bg-purple-600 px-6 py-3 rounded-full font-semibold text-white transition hover:bg-purple-700">
            Book Now
          </button>
        </div>

      </div>
    </div>
  );
}