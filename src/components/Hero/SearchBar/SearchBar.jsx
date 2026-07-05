import { Search, MapPin } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl lg:h-20 lg:flex-row lg:items-center lg:gap-0 lg:p-2">
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
      <div className="hidden h-10 w-px bg-gray-200 lg:block"></div>

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
      <button className="w-full rounded-xl bg-purple-600 px-8 py-4 font-semibold text-white whitespace-nowrap transition hover:bg-purple-700 lg:w-auto lg:min-w-[170px]">
        Find Salons
      </button>
    </div>
  );
}