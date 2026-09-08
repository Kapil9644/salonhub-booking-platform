export default function SortDropdown({
  sortBy,
  setSortBy,
  totalSalons = 0,
  selectedLocation = "",
  searchText = "",
}) {
  return (
    <div className="mb-1 flex flex-col gap-2 sm:mb-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h2 className="ml-1.5 text-1xl font-bold leading-tight text-slate-900 sm:text-1xl">
          Available Salons
        </h2>

        {(selectedLocation || searchText) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 sm:text-sm">
            {selectedLocation && (
              <span className="truncate">
                📍 Near{" "}
                <span className="font-medium text-gray-700">
                  {selectedLocation}
                </span>
              </span>
            )}

            {selectedLocation && searchText && <span>·</span>}

            {searchText && (
              <span className="truncate">
                🔍{" "}
                <span className="font-medium text-gray-700">{searchText}</span>
              </span>
            )}
          </div>
        )}

        <p className="mt-0.5 text-xs text-gray-500 sm:text-sm ml-1.5">
          Showing {totalSalons} {totalSalons === 1 ? "salon" : "salons"}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-3 ">
        <span className="text-sm font-medium text-gray-600 ml-1.5">
          Sort By
        </span>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="min-w-0 rounded-lg border border-gray-300 bg-white mr-1.5 pl-2 py-2 text-sm text-gray-700 shadow-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-200 sm:rounded-xl sm:px-2 sm:py-2.5"
        >
          <option>Recommended</option>
          <option>Highest Rated</option>
          <option>Lowest Price</option>
          <option>Highest Price</option>
          <option>Most Popular</option>
          <option>Nearest</option>
        </select>
      </div>
    </div>
  );
}
