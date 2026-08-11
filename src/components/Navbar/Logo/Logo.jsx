import { Link } from "react-router-dom";
import { Scissors } from "lucide-react";

export default function Logo({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="ml-4 inline-block shrink-0 leading-none sm:ml-6 lg:ml-8"
    >
      <div className="flex items-center gap-2">
        <Scissors size={28} className="text-purple-600" />

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            SalonHub
          </h1>

          <p className="mt-1 text-[10px] font-medium tracking-wide text-gray-500 sm:text-xs">
            Book • Style • Shine
          </p>
        </div>
      </div>
    </Link>
  );
}
