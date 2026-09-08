import { filterOptions } from "../../../data/filterOptions";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

export default function Filters({
  selectedServices,
  setSelectedServices,
  minimumRating,
  setMinimumRating,
  priceRange,
  setPriceRange,
  setSortBy,
}) {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const servicesDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target)
      ) {
        setIsServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredServices = filterOptions.services.filter((service) =>
    service.toLowerCase().includes(serviceSearch.toLowerCase()),
  );

  const toggleService = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((item) => item !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };
  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-2.5 shadow-sm sm:p-2.5 lg:p-4">
      <div className="flex items-center justify-between lg:block">
        <h2 className="text-lg font-bold leading-5 text-slate-900 sm:text-xl ml-1">
          Filters
        </h2>

        <button
          type="button"
          onClick={() => setIsFiltersOpen((previous) => !previous)}
          className="rounded-md border border-purple-200 bg-purple-50 px-2.5 mr-1 py-1 text-xs font-semibold leading-4 text-purple-700 transition hover:bg-purple-100 lg:hidden"
        >
          {isFiltersOpen ? "Hide" : "Show"}
        </button>
      </div>

      <div
        className={`${
          isFiltersOpen ? "mt-3 block" : "hidden"
        } lg:mt-4 lg:block`}
      >
        {/* Services */}
        <div className="mb-5">
          <h3 className="mb-2 text-base font-semibold text-slate-800">
            Services
          </h3>
          <div ref={servicesDropdownRef} className="relative">
            {/* Selected Services / Dropdown Trigger */}
            <button
              type="button"
              onClick={() => setIsServicesOpen((previous) => !previous)}
              className="flex min-h-[42px] w-full items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm outline-none transition hover:border-purple-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
            >
              <span
                className={
                  selectedServices.length > 0
                    ? "text-gray-800"
                    : "text-gray-500"
                }
              >
                {selectedServices.length === 0
                  ? "Select Services"
                  : `${selectedServices.length} service${
                      selectedServices.length > 1 ? "s" : ""
                    } selected`}
              </span>

              <ChevronDown
                size={18}
                className={`shrink-0 text-gray-500 transition-transform ${
                  isServicesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Selected Service Chips */}
            {selectedServices.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedServices.map((service) => (
                  <span
                    key={service}
                    className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700"
                  >
                    {service}

                    <button
                      type="button"
                      onClick={() => toggleService(service)}
                      className="rounded-full p-0.5 transition hover:bg-purple-200"
                      aria-label={`Remove ${service}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Dropdown */}
            {isServicesOpen && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                {/* Search */}
                <div className="border-b border-gray-100 p-2">
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 focus-within:border-purple-500">
                    <Search size={16} className="shrink-0 text-gray-400" />

                    <input
                      type="text"
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      placeholder="Search services..."
                      className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Service Options */}
                <div className="max-h-52 overflow-y-auto p-2">
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service) => {
                      const isSelected = selectedServices.includes(service);

                      return (
                        <button
                          key={service}
                          type="button"
                          onClick={() => toggleService(service)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                            isSelected
                              ? "bg-purple-50 text-purple-700"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span>{service}</span>

                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                              isSelected
                                ? "border-purple-600 bg-purple-600 text-white"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {isSelected ? "✓" : ""}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="px-3 py-4 text-center text-sm text-gray-500">
                      No services found
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="mb-5">
          <h3 className="mb-2 text-base font-semibold text-slate-800">
            Minimum Rating
          </h3>

          <select
            value={minimumRating}
            onChange={(e) => setMinimumRating(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-purple-600"
          >
            <option value={0}>All Ratings</option>

            {filterOptions.ratings.map((rating) => (
              <option key={rating} value={rating}>
                {rating}+ Stars
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <h3 className="mb-2 text-base font-semibold text-slate-800">
            Price Range
          </h3>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-purple-600"
          >
            {filterOptions.priceRanges.map((price) => (
              <option key={price} value={price}>
                {price}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div className="mt-5">
          <button
            onClick={() => {
              setSelectedServices([]);
              setMinimumRating(0);
              setPriceRange("Any Price");
              setSortBy("Nearest");
            }}
            className="w-full rounded-xl border border-purple-600 py-2 font-semibold text-purple-600 transition hover:bg-purple-600 hover:text-white"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </aside>
  );
}
