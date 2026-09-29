import { useState } from "react";
import { ChevronDown, Filter, RotateCcw } from "lucide-react";
import { filterOptions } from "../../../data/filterOptions";

export default function Filters({
  openNow = false,
  setOpenNow,
  minimumRating = 0,
  setMinimumRating,
  priceRange = "Any Price",
  setPriceRange,
}) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // ==================================================
  // RESET
  // ==================================================

  const resetFilters = () => {
    setOpenNow(false);
    setMinimumRating(0);
    setPriceRange("Any Price");
  };

  // ==================================================
  // ACTIVE FILTER COUNT
  // ==================================================

  const activeFilterCount =
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
