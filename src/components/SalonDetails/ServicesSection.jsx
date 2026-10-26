import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Clock3,
  Scissors,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

const getCategory = (service) => {
  const name = String(service.name || "").toLowerCase();

  if (/hair|shampoo|blow.?dry|color|colour|cut|styling/.test(name))
    return "Hair";
  if (/beard|shav|moustache|mustache/.test(name)) return "Beard";
  if (/massage|head massage/.test(name)) return "Massage";
  if (/facial|skin|cleanup|clean.?up|bleach|wax|thread/.test(name))
    return "Skin";

  return "Other";
};

const formatPrice = (price) => `₹${Number(price || 0).toLocaleString("en-IN")}`;

export default function ServicesSection({
  services = [],
  selectedServices = [],
  setSelectedServices,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [isExpanded, setIsExpanded] = useState(true);

  const categories = useMemo(() => {
    const counts = {};

    services.forEach((service) => {
      const group = getCategory(service);
      counts[group] = (counts[group] || 0) + 1;
    });

    return [
      { name: "All", count: services.length },
      ...["Hair", "Beard", "Skin", "Massage", "Other"]
        .filter((name) => counts[name])
        .map((name) => ({ name, count: counts[name] })),
    ];
  }, [services]);

  const visibleServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = services.filter((service) => {
      const matchesSearch = String(service.name || "")
        .toLowerCase()
        .includes(query);

      const matchesCategory =
        category === "All" || getCategory(service) === category;

      return matchesSearch && matchesCategory;
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === "duration") {
      result.sort((a, b) => Number(a.duration || 0) - Number(b.duration || 0));
    }

    return result;
  }, [services, search, category, sortBy]);

  const isSelected = (service) =>
    selectedServices.some(
      (item) => (item._id || item.id) === (service._id || service.id),
    );

  const toggleService = (service) => {
    if (!setSelectedServices) return;

    setSelectedServices((current) => {
      const id = service._id || service.id;
      const alreadySelected = current.some(
        (item) => (item._id || item.id) === id,
      );

      return alreadySelected
        ? current.filter((item) => (item._id || item.id) !== id)
        : [...current, service];
    });
  };

  return (
    <section
      id="salon-services"
      className="mt-6 scroll-mt-28 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:mt-7 sm:rounded-3xl"
    >
      {/* Section heading */}
      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        aria-expanded={isExpanded}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-6 sm:py-5"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            <Scissors size={20} />
          </span>

          <span>
            <span className="block text-lg font-bold text-slate-900 sm:text-xl">
              Services &amp; Treatments
            </span>
            <span className="mt-0.5 block text-sm text-slate-500">
              Services you&apos;d like to book
            </span>
            {selectedServices.length > 0 && (
              <span className="mt-1 block text-xs font-semibold text-purple-700">
                {selectedServices.length}{" "}
                {selectedServices.length === 1 ? "service" : "services"}{" "}
                selected
              </span>
            )}
          </span>
        </span>

        <ChevronDown
          size={20}
          className={`shrink-0 text-slate-500 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div className="border-t border-slate-100 p-3 sm:p-5">
          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:thin]">
            {categories.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setCategory(item.name)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                  category === item.name
                    ? "border-purple-700 bg-purple-700 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-purple-300 hover:text-purple-700"
                }`}
              >
                {item.name === "All" ? "All Services" : item.name}
                <span
                  className={`text-xs ${
                    category === item.name
                      ? "text-purple-100"
                      : "text-slate-400"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search and sorting */}
          <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-3 transition focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search services..."
                aria-label="Search salon services"
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={17} />
                </button>
              )}
            </label>

            <label className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 sm:w-48">
              <SlidersHorizontal
                size={17}
                className="shrink-0 text-slate-500"
              />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort services"
                className="w-full min-w-0 bg-transparent text-sm font-medium text-slate-700 outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration">Shortest Duration</option>
              </select>
            </label>
          </div>

          {/* Service cards */}
          <div className="space-y-2.5">
            {visibleServices.map((service) => {
              const selected = isSelected(service);
              const id = service._id || service.id;

              return (
                <article
                  key={id}
                  className={`flex flex-col gap-3 rounded-2xl border p-3 transition duration-200 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4 ${
                    selected
                      ? "border-purple-300 bg-purple-50/70 ring-1 ring-purple-100"
                      : "border-slate-200 bg-white hover:border-purple-200 hover:shadow-sm"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        selected
                          ? "bg-purple-100 text-purple-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {selected ? <Check size={20} /> : <Sparkles size={19} />}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-bold text-slate-900">
                        {service.name}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500 sm:text-sm">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 size={14} />
                          {service.duration || 0} min
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                          {getCategory(service) === "Other"
                            ? "Service"
                            : getCategory(service)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:shrink-0 sm:justify-end sm:border-0 sm:pt-0">
                    <span className="text-lg font-extrabold tabular-nums text-purple-700">
                      {formatPrice(service.price)}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleService(service)}
                      aria-pressed={selected}
                      className={`inline-flex min-w-28 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                        selected
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                          : "border border-purple-600 bg-white text-purple-700 hover:bg-purple-700 hover:text-white"
                      }`}
                    >
                      {selected ? (
                        <>
                          <Check size={16} /> Added
                        </>
                      ) : (
                        "+ Add"
                      )}
                    </button>
                  </div>
                </article>
              );
            })}

            {visibleServices.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center">
                <Search className="mx-auto text-slate-400" size={28} />
                <h3 className="mt-3 font-semibold text-slate-800">
                  No services found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try another search or category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                  className="mt-3 text-sm font-semibold text-purple-700 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-slate-500">
            {visibleServices.length} of {services.length} services
            {selectedServices.length > 0 &&
              ` · ${selectedServices.length} selected`}
          </p>
        </div>
      )}
    </section>
  );
}
