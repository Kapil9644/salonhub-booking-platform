import { filterOptions } from "../../../data/filterOptions";

export default function Filters() {
  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-slate-900">
        Filters
      </h2>

      {/* Locations */}
      <div className="mb-8">
        <h3 className="mb-3 font-semibold">Location</h3>

        {filterOptions.locations.map((location) => (
          <label
            key={location}
            className="mb-2 flex items-center gap-2"
          >
            <input type="checkbox" />
            {location}
          </label>
        ))}
      </div>

      {/* Ratings */}
      <div className="mb-8">
        <h3 className="mb-3 font-semibold">Rating</h3>

        {filterOptions.ratings.map((rating) => (
          <label
            key={rating}
            className="mb-2 flex items-center gap-2"
          >
            <input type="checkbox" />
            {rating}
          </label>
        ))}
      </div>

      {/* Services */}
      <div className="mb-8">
        <h3 className="mb-3 font-semibold">Services</h3>

        {filterOptions.services.map((service) => (
          <label
            key={service}
            className="mb-2 flex items-center gap-2"
          >
            <input type="checkbox" />
            {service}
          </label>
        ))}
      </div>

      {/* Price */}
      <div className="mb-8">
        <h3 className="mb-3 font-semibold">Price</h3>

        {filterOptions.prices.map((price) => (
          <label
            key={price}
            className="mb-2 flex items-center gap-2"
          >
            <input type="checkbox" />
            {price}
          </label>
        ))}
      </div>

      <button className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800">
        Clear Filters
      </button>
    </aside>
  );
}