import { Search, MapPin } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex h-20 w-full items-center rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
      {/* Search */}
      <div className="flex flex-1 items-center gap-3 px-4">
        <Search className="text-gray-400" size={22} />

        <input
          type="text"
          placeholder="Search salon or service"
          className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
        />
      </div>

      {/* Divider */}
      <div className="h-10 w-px bg-gray-200"></div>

      {/* Location */}
      <div className="flex flex-1 items-center gap-3 px-4">
        <MapPin className="text-gray-400" size={22} />

        <input
          type="text"
          placeholder="Select location"
          className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
        />
      </div>

      {/* Button */}
      <button className="rounded-xl bg-purple-600 px-8 py-4 font-semibold text-white transition hover:bg-purple-700">
        Find Salons
      </button>
    </div>
  );
}