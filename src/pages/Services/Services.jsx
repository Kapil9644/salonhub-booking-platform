import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  Clock3,
  Sparkles,
  ArrowRight,
  Scissors,
  Brush,
  UserRound,
  Paintbrush,
  Hand,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Container from "../../layouts/Container/Container";
import { getPublicServiceCatalog } from "../../services/serviceService";
import { SERVICE_CATEGORIES } from "../../constants/serviceCategories";

/* =========================================================
   HELPERS
========================================================= */

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

/* =========================================================
   CATEGORY ALIASES
========================================================= */

const CATEGORY_ALIASES = {
  Eye: ["eye", "eyes", "eyebrow", "eyebrows", "eyelash", "eyelashes"],

  Thread: ["thread", "threading"],

  Wax: ["wax", "waxing"],

  Nail: ["nail", "nails", "manicure", "pedicure"],

  Face: ["face", "facial"],

  Lip: ["lip", "lips"],

  Hair: [
    "hair",
    "haircut",
    "hair color",
    "hair treatment",
    "hair spa",
    "styling",
  ],

  Beard: ["beard"],

  Shaving: ["shave", "shaving"],

  Moustache: ["moustache", "mustache"],

  Hand: ["hand", "hands"],

  Feet: ["feet", "foot"],

  "Skin Care": ["skin", "skin care", "skincare"],

  Bleach: ["bleach", "bleaching", "de-tan", "detan"],

  Makeup: ["makeup", "make up"],

  Bridal: ["bridal", "bride"],

  Massage: ["massage"],

  Spa: ["spa"],

  Mehendi: ["mehendi", "mehndi", "henna"],

  "Permanent Beauty": ["permanent beauty", "permanent makeup", "microblading"],

  Piercing: ["piercing"],

  Tattoo: ["tattoo"],

  Packages: ["package", "packages"],
};

/* =========================================================
   CANONICAL CATEGORY
========================================================= */

const getServiceCategory = (service) => {
  const raw = normalizeText(service?.category);

  /* Exact category from master list */
  const exact = SERVICE_CATEGORIES.find(
    (category) => normalizeText(category) === raw,
  );

  if (exact) {
    return exact;
  }

  /* Legacy aliases */
  for (const [masterCategory, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (aliases.includes(raw)) {
      return masterCategory;
    }
  }

  return "Other";
};

/* =========================================================
   CATEGORY ICON
========================================================= */

const getCategoryIcon = (category) => {
  const value = normalizeText(category);

  if (
    value.includes("hair") ||
    value.includes("beard") ||
    value.includes("shav") ||
    value.includes("moustache")
  ) {
    return Scissors;
  }

  if (
    value.includes("nail") ||
    value.includes("hand") ||
    value.includes("feet")
  ) {
    return Hand;
  }

  if (
    value.includes("makeup") ||
    value.includes("bridal") ||
    value.includes("mehendi")
  ) {
    return Paintbrush;
  }

  if (value.includes("eye") || value.includes("thread")) {
    return Brush;
  }

  if (value.includes("massage") || value.includes("spa")) {
    return UserRound;
  }

  return Sparkles;
};

/* =========================================================
   STRING MATCH
========================================================= */

const SEARCH_ALIASES = {
  wax: ["wax", "waxing"],
  waxing: ["wax", "waxing"],

  thread: ["thread", "threading"],
  threading: ["thread", "threading"],

  eye: ["eye", "eyes", "eyebrow", "eyebrows", "eyelash", "eyelashes"],

  eyebrow: ["eye", "eyebrow", "eyebrows", "brow"],

  eyelash: ["eye", "eyelash", "eyelashes", "lash", "lashes"],

  nail: ["nail", "nails", "manicure", "pedicure"],

  hand: ["hand", "hands", "manicure"],

  feet: ["feet", "foot", "pedicure"],

  face: ["face", "facial"],

  facial: ["face", "facial", "skin"],

  hair: ["hair", "haircut", "hairstyle", "styling"],

  beard: ["beard", "beards"],

  shave: ["shave", "shaving"],

  shaving: ["shave", "shaving"],

  lip: ["lip", "lips"],

  skin: ["skin", "skincare", "skin care", "facial"],

  massage: ["massage", "massages"],

  spa: ["spa", "spas"],

  makeup: ["makeup", "make up"],

  bridal: ["bridal", "bride"],

  mehendi: ["mehendi", "mehndi", "henna"],
};

/* =========================================================
   STRING MATCH FUNCTION
========================================================= */

/* =========================================================
   CATEGORY STRING MATCH
========================================================= */

const matchesCategory = (service, selectedCategory) => {
  const selected = normalizeText(selectedCategory);

  if (!selected || selected === "all services") {
    return true;
  }

  const rawCategory = normalizeText(service?.category);
  const serviceName = normalizeText(service?.name);
  const description = normalizeText(service?.description);

  /*
   * Everything related to this service.
   */
  const searchableText = [rawCategory, serviceName, description].filter(
    Boolean,
  );

  /*
   * 1. DIRECT STRING MATCH
   *
   * Wax → Waxing
   * Thread → Threading
   * Hair → Hair Spa
   */
  if (
    searchableText.some(
      (text) => text.includes(selected) || selected.includes(text),
    )
  ) {
    return true;
  }

  /*
   * 2. CATEGORY ALIASES
   *
   * Eye → Eyebrow / Eyelash
   * Nail → Manicure / Pedicure
   * Face → Facial
   * Feet → Pedicure
   */
  const aliases = CATEGORY_ALIASES[selected] || [];

  if (aliases.length > 0) {
    const aliasMatched = aliases.some((alias) => {
      const normalizedAlias = normalizeText(alias);

      return searchableText.some(
        (text) =>
          text.includes(normalizedAlias) || normalizedAlias.includes(text),
      );
    });

    if (aliasMatched) {
      return true;
    }
  }

  /*
   * 3. PARTIAL WORD MATCH
   *
   * pedi → pedicure
   * mani → manicure
   * brow → eyebrow
   * lash → eyelash
   */
  if (selected.length >= 2) {
    const selectedWords = selected.split(/\s+/).filter(Boolean);

    const words = searchableText.join(" ").split(/\s+/).filter(Boolean);

    return selectedWords.every((selectedWord) =>
      words.some(
        (word) =>
          word.startsWith(selectedWord) || selectedWord.startsWith(word),
      ),
    );
  }

  return false;
};

const matchesSearch = (service, query) => {
  const search = normalizeText(query);

  // Empty search = show everything
  if (!search) {
    return true;
  }

  const serviceName = normalizeText(service?.name);
  const category = normalizeText(service?.category);
  const description = normalizeText(service?.description);
  const detailedDescription = normalizeText(service?.detailedDescription);
  const salonName = normalizeText(service?.salonName);

  const searchableText = [
    serviceName,
    category,
    description,
    detailedDescription,
    salonName,
  ].filter(Boolean);

  /*
   * -------------------------------------------------------
   * 1. DIRECT STRING MATCH
   *
   * Example:
   * "wax" → "Full Body Wax"
   * "hair" → "Haircut"
   * -------------------------------------------------------
   */

  if (searchableText.some((text) => text.includes(search))) {
    return true;
  }

  /*
   * -------------------------------------------------------
   * 2. ALIAS MATCH
   *
   * Example:
   * wax → waxing
   * eye → eyebrow / eyelash
   * facial → face / skin
   * -------------------------------------------------------
   */

  const aliases = SEARCH_ALIASES[search] || [];

  if (aliases.length > 0) {
    const aliasMatched = aliases.some((alias) => {
      const normalizedAlias = normalizeText(alias);

      return searchableText.some((text) => text.includes(normalizedAlias));
    });

    if (aliasMatched) {
      return true;
    }
  }

  /*
   * -------------------------------------------------------
   * 3. MULTI-WORD SEARCH
   *
   * Example:
   * "hair spa"
   *
   * Both "hair" and "spa" must be
   * present somewhere in the service data.
   * -------------------------------------------------------
   */

  const words = search.split(/\s+/).filter(Boolean);

  if (words.length > 1) {
    return words.every((word) => {
      const wordAliases = SEARCH_ALIASES[word] || [word];

      return wordAliases.some((alias) => {
        const normalizedAlias = normalizeText(alias);

        return searchableText.some((text) => text.includes(normalizedAlias));
      });
    });
  }

  /*
   * -------------------------------------------------------
   * 4. PARTIAL STRING MATCH
   *
   * Example:
   * mass → massage
   * mani → manicure
   * brow → eyebrow
   * pedi → pedicure
   * -------------------------------------------------------
   */

  if (search.length >= 2) {
    return searchableText.some((text) => {
      const wordsInText = text.split(/\s+/);

      return wordsInText.some((word) => word.startsWith(search));
    });
  }

  return false;
};

/* =========================================================
   DURATION
========================================================= */

const formatDuration = (duration) => {
  const value = Number(duration);

  if (!Number.isFinite(value) || value <= 0) {
    return "";
  }

  return `${value} min`;
};

/* =========================================================
   PAGE
========================================================= */

export default function Services() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All Services");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =======================================================
     FETCH
  ======================================================= */

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPublicServiceCatalog();

      setServices(Array.isArray(response?.services) ? response.services : []);
    } catch (err) {
      console.error("Failed to load services:", err);

      setServices([]);

      setError(err?.response?.data?.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  /* =======================================================
     BUILD CATEGORY → SERVICES
  ======================================================= */

  const categoryGroups = useMemo(() => {
    const groups = new Map();

    services.forEach((service) => {
      if (service?.isActive === false) {
        return;
      }

      const category = getServiceCategory(service);

      /* =======================================================
   CATEGORY FILTER
======================================================= */

      if (!matchesCategory(service, selectedCategory)) {
        return;
      }

      /* Search filter */
      if (!matchesSearch(service, searchText)) {
        return;
      }

      if (!groups.has(category)) {
        groups.set(category, []);
      }

      groups.get(category).push(service);
    });

    /* Remove duplicate service entries */
    groups.forEach((items, category) => {
      const unique = new Map();

      items.forEach((service) => {
        const key = [
          service?._id,
          normalizeText(service?.name),
          service?.salonId,
        ].join("-");

        if (!unique.has(key)) {
          unique.set(key, service);
        }
      });

      groups.set(category, [...unique.values()]);
    });

    /* Follow master category order */
    return [...groups.entries()].sort(([a], [b]) => {
      const indexA = SERVICE_CATEGORIES.findIndex(
        (item) => normalizeText(item) === normalizeText(a),
      );

      const indexB = SERVICE_CATEGORIES.findIndex(
        (item) => normalizeText(item) === normalizeText(b),
      );

      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
  }, [services, searchText, selectedCategory]);

  /* =======================================================
     COUNT
  ======================================================= */

  const totalServices = categoryGroups.reduce(
    (total, [, items]) => total + items.length,
    0,
  );

  /* =======================================================
     FIND SALON
  ======================================================= */

  const handleFindSalon = (service) => {
    const search = service?.name || service?.title || "";
    const category = getServiceCategory(service);

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (category && category !== "Other") {
      params.set("serviceCategory", category);
    }

    navigate(`/salons?${params.toString()}`);
  };

  const handleSearchSubmit = () => {
    const query = normalizeText(searchText);

    if (!query) {
      return;
    }

    /* =======================================================
     1. EXACT SERVICE NAME MATCH
     Example:
     "Face Scrub" → Face
     "Hair Spa" → Hair
  ======================================================= */

    const exactServiceMatch = services.find(
      (service) => normalizeText(service?.name) === query,
    );

    if (exactServiceMatch) {
      setSelectedCategory(getServiceCategory(exactServiceMatch));
      return;
    }

    /* =======================================================
     2. CATEGORY SEARCH
     Example:
     "hair" → Hair
     "face" → Face
     "facial" → Face
     "eyebrow" → Eye
     "waxing" → Wax
  ======================================================= */

    const matchedCategory = SERVICE_CATEGORIES.find((category) => {
      const normalizedCategory = normalizeText(category);

      if (normalizedCategory === query) {
        return true;
      }

      const aliases = CATEGORY_ALIASES[category] || [];

      return aliases.some((alias) => normalizeText(alias) === query);
    });

    if (matchedCategory) {
      setSelectedCategory(matchedCategory);
      return;
    }

    /* =======================================================
     3. NORMAL SERVICE SEARCH
     Prefer a proper category over "Other"
  ======================================================= */

    const matchedService = services.find((service) => {
      if (!matchesSearch(service, query)) {
        return false;
      }

      return getServiceCategory(service) !== "Other";
    });

    if (matchedService) {
      setSelectedCategory(getServiceCategory(matchedService));
      return;
    }

    /* =======================================================
     4. FALLBACK
  ======================================================= */

    const fallbackService = services.find((service) =>
      matchesSearch(service, query),
    );

    if (fallbackService) {
      setSelectedCategory(getServiceCategory(fallbackService));
    }
  };

  /* =======================================================
     CLEAR
  ======================================================= */

  const clearFilters = () => {
    setSearchText("");
    setSelectedCategory("All Services");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===================================================
          HERO
      ================================================== */}

      <section className="bg-white">
        <Container>
          <div className="py-8 text-center sm:py-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-purple-600">
              Explore Our Services
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Beauty & Grooming,
              <span className="text-purple-600"> Your Way</span>
            </h1>

            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-500">
              Discover professional beauty, grooming, nail and wellness services
              from salons around you.
            </p>

            {/* SEARCH BOX */}

            <div className="mx-auto mt-6 max-w-xl">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearchSubmit();
                    }
                  }}
                  placeholder="Search haircut, facial, massage..."
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-11 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
                />

                {searchText && (
                  <button
                    type="button"
                    onClick={() => setSearchText("")}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ===================================================
          CATEGORY TABS
      ================================================== */}

      <section className="border-y border-gray-100 bg-white">
        <Container>
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            <button
              type="button"
              onClick={() => setSelectedCategory("All Services")}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                selectedCategory === "All Services"
                  ? "bg-purple-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:text-purple-600"
              }`}
            >
              All Services
            </button>

            {SERVICE_CATEGORIES.map((category) => {
              const active =
                normalizeText(selectedCategory) === normalizeText(category);

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                    active
                      ? "bg-purple-600 text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:text-purple-600"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ===================================================
          CONTENT
      ================================================== */}

      <section className="py-8 sm:py-10">
        <Container>
          {/* HEADER */}

          <div className="mb-6 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Services
              </p>

              <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                {selectedCategory === "All Services"
                  ? "Find a service you need"
                  : `${selectedCategory} Services`}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {loading
                  ? "Loading services..."
                  : `${totalServices} ${
                      totalServices === 1 ? "service" : "services"
                    } available`}
              </p>
            </div>

            {(searchText || selectedCategory !== "All Services") &&
              !loading && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 hover:border-purple-300 hover:text-purple-600"
                >
                  <X size={14} />
                  Clear
                </button>
              )}
          </div>

          {/* LOADING */}

          {loading && (
            <div className="rounded-3xl border border-gray-200 bg-white py-16 text-center">
              <LoaderCircle
                size={32}
                className="mx-auto animate-spin text-purple-600"
              />

              <p className="mt-4 text-sm font-semibold text-gray-500">
                Loading services...
              </p>
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 py-14 text-center">
              <AlertCircle size={32} className="mx-auto text-red-500" />

              <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                Unable to load services
              </h3>

              <p className="mt-2 text-sm text-gray-500">{error}</p>

              <button
                type="button"
                onClick={fetchServices}
                className="mt-5 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-purple-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* =================================================
              CATEGORY CARDS
          ================================================= */}

          {!loading && !error && categoryGroups.length > 0 && (
            <div className="space-y-6">
              {categoryGroups.map(([category, categoryServices]) => {
                const CategoryIcon = getCategoryIcon(category);

                return (
                  <div
                    key={category}
                    className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
                  >
                    {/* CATEGORY HEADER */}

                    <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white px-5 py-5 sm:px-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-purple-600 shadow-sm ring-1 ring-purple-100">
                          <CategoryIcon size={23} />
                        </div>

                        <div>
                          <h3 className="text-xl font-extrabold text-slate-900">
                            {category} Services
                          </h3>

                          <p className="mt-1 text-xs text-gray-500">
                            {categoryServices.length}{" "}
                            {categoryServices.length === 1
                              ? "service"
                              : "services"}{" "}
                            available
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                            SERVICES INSIDE CATEGORY
                        ================================================= */}

                    <div className="divide-y divide-gray-100">
                      {categoryServices.map((service) => (
                        <div
                          key={service._id}
                          className="group px-5 py-5 transition hover:bg-purple-50/30 sm:px-6"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            {/* SERVICE INFO */}

                            <div className="min-w-0 flex-1">
                              <h4 className="text-lg font-extrabold text-slate-900">
                                {service.name}
                              </h4>

                              {service.description && (
                                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                                  {service.description}
                                </p>
                              )}

                              <div className="mt-3 flex flex-wrap items-center gap-4">
                                {service.duration && (
                                  <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                                    <Clock3 size={14} />
                                    {formatDuration(service.duration)}
                                  </span>
                                )}

                                {service.price !== undefined &&
                                  service.price !== null && (
                                    <span className="text-sm font-extrabold text-purple-600">
                                      ₹{service.price}
                                    </span>
                                  )}

                                {service.salonName && (
                                  <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-semibold text-purple-600">
                                    {service.salonName}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* FIND SALON */}

                            <button
                              type="button"
                              onClick={() => handleFindSalon(service)}
                              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-purple-700 active:scale-[0.98]"
                            >
                              Find Salon
                              <ArrowRight size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* NO RESULT */}

          {!loading && !error && categoryGroups.length === 0 && (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                <Search size={25} />
              </div>

              <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                No services found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                Try another service name or remove the current filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-purple-700"
              >
                View All Services
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* ===================================================
          CTA
      ================================================== */}

      <section className="bg-purple-600">
        <Container>
          <div className="py-10 text-center">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              Ready for your next look?
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm text-purple-100">
              Explore salons, compare services and find the right place for your
              next appointment.
            </p>

            <button
              type="button"
              onClick={() => navigate("/salons")}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-purple-600 hover:bg-gray-100"
            >
              Explore Salons
              <ArrowRight size={16} />
            </button>
          </div>
        </Container>
      </section>
    </div>
  );
}
