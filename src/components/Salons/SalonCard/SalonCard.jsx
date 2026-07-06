import { Star, MapPin } from "lucide-react";

export default function SalonCard({
  image,
  name,
  rating,
  reviews,
  services,
  location,
  price,
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <img
        src={image}
        alt={name}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
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

        <h3 className="text-xl font-bold">
          {name}
        </h3>

        <p className="mt-2 text-gray-600">
          {services}
        </p>

        <div className="mt-3 flex items-center gap-2 text-gray-500">
          <MapPin size={18} />

          <span>{location}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-purple-600">
            {price}
          </span>

          <button className="rounded-xl bg-purple-600 px-5 py-2 font-semibold text-white hover:bg-purple-700">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}