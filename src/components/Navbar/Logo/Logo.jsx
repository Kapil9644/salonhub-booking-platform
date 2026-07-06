import { Scissors } from "lucide-react";
import { Link } from "react-router-dom";


export default function Logo() {
  return (
    <Link to="/" className="flex cursor-pointer items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg">
        <Scissors size={22} />
      </div>

      <div>
          <h1 className="text-4xl font-bold text-gray-900">
           SalonHub
          </h1>

          <p className="text-xs text-gray-500">
            Book • Style • Shine
          </p>
      </div>
    </Link>
  );
}