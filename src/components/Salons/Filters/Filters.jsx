import { filterOptions } from "../../../data/filterOptions";

export default function Filters({
  selectedServices,
  setSelectedServices,
  minimumRating,
  setMinimumRating,
  priceRange,
  setPriceRange,
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
                className="h-4 w-4 accent-purple-600"
                checked={selectedServices.includes(service)}
                onChange={() => {
                  if (selectedServices.includes(service)) {
                    setSelectedServices(selectedServices.filter((s) => s !== service));
                  } else {
                    setSelectedServices([...selectedServices, service]);
                  }
                }}
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
          onChange={(e) => setMinimumRating(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600"
        >
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
    </aside>
  );
}