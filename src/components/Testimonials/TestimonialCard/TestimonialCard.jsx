import { Star, CircleCheckBig, User } from "lucide-react";

export default function TestimonialCard({
  name,
  city,
  rating,
  review,
}) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Customer */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
          <User className="text-purple-600" size={30} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {name}
          </h3>

          <p className="text-gray-500">{city}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-6 flex items-center gap-2">
        <Star
          className="fill-yellow-400 text-yellow-400"
          size={18}
        />

        <span className="font-semibold">
          {rating}
        </span>
      </div>

      {/* Review */}
      <p className="mt-5 leading-7 text-gray-600">
        "{review}"
      </p>

      {/* Verified */}
      <div className="mt-6 flex items-center gap-2 text-green-600">
        <CircleCheckBig size={18} />

        <span className="font-medium">
          Verified Customer
        </span>
      </div>
    </div>
  );
}