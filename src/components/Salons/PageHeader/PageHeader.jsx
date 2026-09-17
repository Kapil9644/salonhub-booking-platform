export default function PageHeader({
  searchText = "",
  selectedLocation = "",
  selectedPincode = "",
}) {
  const hasSearch = searchText.trim();
  const hasLocation = selectedLocation.trim();
  const hasPincode = selectedPincode.trim();

  return (
    <section className="mb-4 sm:mb-5 lg:mb-6">
      <h1 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
        Find Your Perfect Salon
      </h1>

      <p className="mt-1.5 max-w-2xl text-sm leading-5 text-slate-600 sm:text-base">
        Discover top-rated salons near you. Compare ratings, prices, services
        and book your appointment instantly.
      </p>

      {(hasSearch || hasLocation || hasPincode) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {hasSearch && (
            <div className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 sm:text-sm">
              <span>🔍</span>
              <span className="max-w-[220px] truncate">
                {searchText.trim()}
              </span>
            </div>
          )}

          {hasLocation && (
            <div className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 sm:text-sm">
              <span>📍</span>
              <span className="max-w-[260px] truncate">
                {selectedLocation.trim()}
              </span>
            </div>
          )}

          {hasPincode && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 sm:text-sm">
              <span>📌</span>
              <span>{selectedPincode.trim()}</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
