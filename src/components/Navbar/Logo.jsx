import { Scissors } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white">
        <Scissors size={20} />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          SalonHub
        </h1>

        <p className="text-xs text-gray-500 -mt-1">
          Book • Style • Shine
        </p>
      </div>
    </div>
  );
}