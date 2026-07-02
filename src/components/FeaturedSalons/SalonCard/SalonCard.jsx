import { MapPin, Star } from "lucide-react";

export default function SalonCard({
  image,
  name,
  rating,
  location,
  price,
}) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Image */}
      <img
        src={image}
        alt={name}
        className="h-56 w-full object-cover"
      />

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900">
          {name}
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <Star
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />
          <span className="font-semibold">{rating}</span>
        </div>

        <div className="mt-3 flex items-center gap-2 text-gray-500">
          <MapPin size={18} />
          <span>{location}</span>
        </div>

        <p className="mt-5 text-xl font-bold text-purple-600">
          Starting from {price}
        </p>

        <button className="mt-6 w-full rounded-xl bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700">
          Book Now
        </button>
      </div>
    </div>
  );
}