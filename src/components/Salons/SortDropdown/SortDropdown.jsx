export default function SortDropdown({
  sortBy,
  setSortBy,
  }) 
  
  {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          Available Salons
        </h2>

        <p className="mt-1 text-gray-500">
          Showing 3 salons
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-medium text-gray-600">
          Sort By
        </span>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
        >
          <option>Recommended</option>
          <option>Highest Rated</option>
          <option>Lowest Price</option>
          <option>Highest Price</option>
          <option>Most Popular</option>
        </select>
      </div>
    </div>
  );
}