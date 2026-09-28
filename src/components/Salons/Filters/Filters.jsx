import { useMemo, useState } from "react";
import { ChevronDown, Filter, RotateCcw, X } from "lucide-react";
import { filterOptions } from "../../../data/filterOptions";

export default function Filters({
  availableServices = [],
  selectedServices = [],
  setSelectedServices,
  openNow = false,
  setOpenNow,
  minimumRating = 0,
  setMinimumRating,
  priceRange = "Any Price",
  setPriceRange,
}) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [serviceSearch, setServiceSearch] = useState("");

  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

  // ==================================================
  // SERVICE SEARCH
  // ==================================================

  const filteredServices = useMemo(() => {
    const query = serviceSearch.trim().toLowerCase();

    if (!query) {
      return availableServices;
    }

    return availableServices.filter((service) =>
      service.toLowerCase().includes(query),
    );
  }, [availableServices, serviceSearch]);

  // ==================================================
  // TOGGLE SERVICE
  // ==================================================

  const toggleService = (service) => {
    const exists = selectedServices.some(
      (selected) => selected.toLowerCase() === service.toLowerCase(),
    );

    if (exists) {
      setSelectedServices(
        selectedServices.filter(
          (selected) => selected.toLowerCase() !== service.toLowerCase(),
        ),
      );
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // ==================================================
  // RESET
  // ==================================================

  const resetFilters = () => {
    setSelectedServices([]);
    setOpenNow(false);
    setMinimumRating(0);
    setPriceRange("Any Price");
  };

  // ==================================================
  // ACTIVE FILTER COUNT
  // ==================================================

  const activeFilterCount =
    selectedServices.length +
    (openNow ? 1 : 0) +
    (minimumRating > 0 ? 1 : 0) +
    (priceRange !== "Any Price" ? 1 : 0);

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* ==============================================
          MOBILE / TABLET HEADER
          ============================================== */}

      <button
        type="button"
        onClick={() => setIsFiltersOpen((previous) => !previous)}
        className="flex w-full items-center justify-between px-4 py-3 lg:hidden"
      >
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-purple-600" />

          <span className="text-sm font-semibold text-gray-800">Filters</span>

          {activeFilterCount > 0 && (
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
              {activeFilterCount}
            </span>
          )}
        </div>

        <ChevronDown
          size={18}
          className={`transition-transform ${
            isFiltersOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ==============================================
          FILTER CONTENT
          ============================================== */}

      <div className={`${isFiltersOpen ? "block" : "hidden"} lg:block`}>
        <div className="border-t border-gray-100 p-4 lg:border-t-0">
          {/* ==========================================
              HEADER
              ========================================== */}

          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Filters</h3>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700"
              >
                <RotateCcw size={13} />
                Reset
              </button>
            )}
          </div>

          {/* ==========================================
              SERVICES
              ========================================== */}

          <div className="border-b border-gray-100 pb-4">
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Services
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setIsServiceDropdownOpen((previous) => !previous)
                }
                className="flex min-h-10 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-700 transition hover:border-purple-300"
              >
                <span className="truncate">
                  {selectedServices.length > 0
                    ? `${selectedServices.length} service${
                        selectedServices.length > 1 ? "s" : ""
                      } selected`
                    : "Select services"}
                </span>

                <ChevronDown
                  size={16}
                  className={`shrink-0 transition-transform ${
                    isServiceDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isServiceDropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                  {/* Service Search */}
                  <div className="border-b border-gray-100 p-2">
                    <input
                      type="text"
                      value={serviceSearch}
                      onChange={(event) => setServiceSearch(event.target.value)}
                      placeholder="Search services..."
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                    />
                  </div>

                  {/* Service List */}
                  <div className="max-h-56 overflow-y-auto p-2">
                    {filteredServices.length === 0 ? (
                      <p className="px-2 py-4 text-center text-xs text-gray-500">
                        No services found.
                      </p>
                    ) : (
                      filteredServices.map((service) => {
                        const checked = selectedServices.some(
                          (selected) =>
                            selected.toLowerCase() === service.toLowerCase(),
                        );

                        return (
                          <label
                            key={service}
                            className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-purple-50"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleService(service)}
                              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />

                            <span className="text-gray-700">{service}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Selected Service Chips */}
            {selectedServices.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedServices.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className="flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700"
                  >
                    {service}

                    <X size={12} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ==========================================
              OPEN NOW
              ========================================== */}

          <div className="border-b border-gray-100 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-800">
                  Open Now
                </label>

                <p className="mt-1 text-[11px] leading-4 text-gray-500">
                  Show salons that are currently open
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpenNow(!openNow)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  openNow ? "bg-purple-600" : "bg-gray-300"
                }`}
                aria-pressed={openNow}
                aria-label="Toggle Open Now filter"
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                    openNow ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* ==========================================
              RATING
              ========================================== */}

          <div className="border-b border-gray-100 py-4">
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Minimum Rating
            </label>

            <select
              value={minimumRating}
              onChange={(event) => setMinimumRating(Number(event.target.value))}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-purple-400"
            >
              <option value={0}>Any Rating</option>

              {filterOptions.ratings.map((rating) => (
                <option key={rating} value={rating}>
                  {rating}+ ⭐
                </option>
              ))}
            </select>
          </div>

          {/* ==========================================
              PRICE
              ========================================== */}

          <div className="pt-4">
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Service Price
            </label>

            <select
              value={priceRange}
              onChange={(event) => setPriceRange(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-purple-400"
            >
              {filterOptions.priceRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>

            <p className="mt-2 text-[11px] leading-4 text-gray-500">
              Price is checked against actual salon services, not the salon's
              starting price.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
