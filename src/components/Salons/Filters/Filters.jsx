import { filterOptions } from "../../../data/filterOptions";

export default function Filters({
  selectedServices,
  setSelectedServices,
  minimumRating,
  setMinimumRating,
  priceRange,
  setPriceRange,
  setSortBy,
}) {
  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        Filters
      </h2>

      {/* Services */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Services
        </h3>

        <div className="space-y-3">
          {filterOptions.services.map((service) => (
            <label
              key={service}
              className="flex cursor-pointer items-center gap-3"
            >
              <input
                  type="checkbox"
                  checked={selectedServices.includes(service)}
                  onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedServices([...selectedServices, service]);
                            } 
                            else {
                              setSelectedServices(selectedServices.filter((item) => item !== service));                                                      
                            }
                          }}
                  className="h-4 w-4 accent-purple-600"
              />

              <span className="text-gray-700">
                {service}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-8">
        <h3 className="mb-3 text-lg font-semibold text-slate-800">
          Minimum Rating
        </h3>

        <select
          value={minimumRating}
          onChange={(e) =>
            setMinimumRating(Number(e.target.value))
          }
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600"
        >
          <option value={0}>All Ratings</option>

          {filterOptions.ratings.map((rating) => (
            <option
              key={rating}
              value={rating}
            >
              {rating}+ Stars
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-slate-800">
          Price Range
        </h3>

        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600"
        >
          {filterOptions.priceRanges.map((price) => (
            <option key={price} value={price}>
              {price}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <div className="mt-8">
        <button
          onClick={() => {
            setSelectedServices([]);
            setMinimumRating(0);
            setPriceRange("Any Price");
            setSortBy("Recommended");
          }}
          className="w-full rounded-xl border border-purple-600 py-3 font-semibold text-purple-600 transition hover:bg-purple-600 hover:text-white"
        >
          Reset Filters
        </button>
      </div>
    </aside>
  );
}