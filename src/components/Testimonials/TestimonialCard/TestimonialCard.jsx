import { Star, CircleCheckBig, User } from "lucide-react";

export default function TestimonialCard({ name, city, rating, review }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500 hover:shadow-md">
      {/* Customer */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100">
          <User className="text-purple-600" size={18} />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold leading-4 text-gray-900">
            {name}
          </h3>

          <p className="text-[10px] leading-3 text-gray-500">{city}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-2 flex items-center gap-1">
        <Star className="fill-yellow-400 text-yellow-400" size={13} />
        <span className="text-xs font-semibold">{rating}</span>
      </div>

      {/* Review */}
      <p className="mt-1.5 line-clamp-2 text-xs leading-4 text-gray-600">
        "{review}"
      </p>

      {/* Verified */}
      <div className="mt-2 flex items-center gap-1 text-green-600">
        <CircleCheckBig size={13} />
        <span className="text-[10px] font-medium leading-3">
          Verified Customer
        </span>
      </div>
    </div>
  );
}
