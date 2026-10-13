import { useEffect, useState } from "react";
import { getPublicSalons } from "../../services/salonService";

import { useLocation } from "../../context/LocationContext";
import { useSearchParams, useNavigate } from "react-router-dom";

import Container from "../../layouts/Container/Container";
import PageHeader from "../../components/Salons/PageHeader/PageHeader";
import Filters from "../../components/Salons/Filters/Filters";
import SortDropdown from "../../components/Salons/SortDropdown/SortDropdown";
import SalonGrid from "../../components/Salons/SalonGrid/SalonGrid";
import SearchBar from "../../components/Hero/SearchBar/SearchBar";

export default function Salons() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const { location } = useLocation();

  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchText = searchParams.get("search") || "";
  const selectedLocation = searchParams.get("location") || "";
  const selectedPincode = searchParams.get("pincode") || "";
  const serviceCategory = searchParams.get("serviceCategory") || "";

  const [totalSalons, setTotalSalons] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // ==================================================
  // OPEN NOW
  // ==================================================

  const [openNow, setOpenNow] = useState(
    () => searchParams.get("openNow") === "true",
  );

  // ==================================================
  // RATING
  // ==================================================

  const [minimumRating, setMinimumRating] = useState(() => {
    const rating = searchParams.get("rating");
    return rating ? Number(rating) : 0;
  });

  // ==================================================
  // PRICE
  // ==================================================

  const [priceRange, setPriceRange] = useState(
    () => searchParams.get("price") || "Any Price",
  );

  // ==================================================
  // SORT
  // ==================================================

  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sort") || "Nearest",
  );

  // ==================================================
  // SORT CHANGE
  // ==================================================

  const handleSortChange = (value) => {
    setSortBy(value);

    const params = new URLSearchParams(searchParams);

    if (value === "Nearest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    setSearchParams(params);
  };

  // ==================================================
  // OPEN NOW CHANGE
  // ==================================================

  const handleOpenNowChange = (value) => {
    setOpenNow(value);

    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("openNow", "true");
    } else {
      params.delete("openNow");
    }

    setSearchParams(params);
  };

  // ==================================================
  // RATING CHANGE
  // ==================================================

  const handleRatingChange = (rating) => {
    setMinimumRating(rating);

    const params = new URLSearchParams(searchParams);

    if (rating > 0) {
      params.set("rating", rating);
    } else {
      params.delete("rating");
    }

    setSearchParams(params);
  };

  // ==================================================
  // PRICE CHANGE
  // ==================================================

  const handlePriceChange = (price) => {
    setPriceRange(price);

    const params = new URLSearchParams(searchParams);

    if (price !== "Any Price") {
      params.set("price", price);
    } else {
      params.delete("price");
    }

    setSearchParams(params);
  };

  // ==================================================
  // RESET FILTERS
  // ==================================================

  const resetFilters = () => {
    setOpenNow(false);
    setMinimumRating(0);
    setPriceRange("Any Price");
    setSortBy("Nearest");

    const params = new URLSearchParams(searchParams);

    params.delete("openNow");
    params.delete("rating");
    params.delete("price");
    params.delete("sort");

    setSearchParams(params);
  };

  // ==================================================
  // NEW SEARCH
  // ==================================================

  const startNewSearch = () => {
    setSearchParams({});
    resetFilters();
    navigate("/");
  };

  // ==================================================
  // FETCH FIRST PAGE OF SALONS
  // ==================================================

  // ==================================================
  // FETCH SALONS WHEN SEARCH/FILTERS CHANGE
  // ==================================================

  useEffect(() => {
    let cancelled = false;

    const fetchSalons = async () => {
      try {
        setLoading(true);
        setError("");
        setSalons([]);
        setCurrentPage(1);
        setHasMore(false);
        setTotalSalons(0);

        const data = await getPublicSalons({
          page: 1,
          limit: 20,
          search: searchText,
          location: selectedLocation,
          pincode: selectedPincode,
          serviceCategory,
          rating: minimumRating || undefined,
          price: priceRange !== "Any Price" ? priceRange : undefined,
          openNow: openNow ? "true" : undefined,
          sort: sortBy,
          latitude: location?.latitude ?? undefined,
          longitude: location?.longitude ?? undefined,
        });

        if (cancelled) return;

        setSalons(data.salons || []);
        setCurrentPage(data.pagination?.currentPage || 1);
        setHasMore(data.pagination?.hasMore ?? false);
        setTotalSalons(data.pagination?.totalSalons ?? 0);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch public salons:", error);
        setError(error.response?.data?.message || "Failed to load salons.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSalons();

    return () => {
      cancelled = true;
    };
  }, [
    searchText,
    selectedLocation,
    selectedPincode,
    serviceCategory,
    minimumRating,
    priceRange,
    openNow,
    sortBy,
  ]);

  // ==================================================
  // LOAD NEXT PAGE
  // ==================================================

  const loadMoreSalons = async () => {
    if (loadingMore || loading || !hasMore) return;

    try {
      setLoadingMore(true);
      setError("");

      const nextPage = currentPage + 1;

      const data = await getPublicSalons({
        page: nextPage,
        limit: 20,
        search: searchText,
        location: selectedLocation,
        pincode: selectedPincode,
        serviceCategory,
        rating: minimumRating || undefined,
        price: priceRange !== "Any Price" ? priceRange : undefined,
        openNow: openNow ? "true" : undefined,
        sort: sortBy,
        latitude: location?.latitude ?? undefined,
        longitude: location?.longitude ?? undefined,
      });

      const newSalons = data.salons || [];

      setSalons((previousSalons) => {
        const existingIds = new Set(
          previousSalons.map((salon) => String(salon._id)),
        );

        return [
          ...previousSalons,
          ...newSalons.filter((salon) => !existingIds.has(String(salon._id))),
        ];
      });

      setCurrentPage(data.pagination?.currentPage || nextPage);
      setHasMore(data.pagination?.hasMore ?? false);
      setTotalSalons(data.pagination?.totalSalons ?? 0);
    } catch (error) {
      console.error("Failed to load more salons:", error);
      setError(error.response?.data?.message || "Failed to load more salons.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Container>
      <div className="py-3 sm:py-4 lg:py-5">
        {/* ==========================================
            PAGE HEADER
            ========================================== */}

        <PageHeader />

        {/* ==========================================
            SEARCH BAR
            MOBILE + TABLET
            ========================================== */}

        <div className="mb-4 w-full lg:hidden">
          <SearchBar />
        </div>

        {/* ==========================================
            MAIN LAYOUT
            ========================================== */}

        <div className="grid grid-cols-1 items-start gap-4 sm:gap-5 lg:grid-cols-12 lg:gap-6">
          {/* ========================================
              FILTERS
              MOBILE + TABLET
              ======================================== */}

          <div className="sticky top-[100px] z-40 w-full bg-white pb-2 lg:hidden">
            <Filters
              openNow={openNow}
              setOpenNow={handleOpenNowChange}
              minimumRating={minimumRating}
              setMinimumRating={handleRatingChange}
              priceRange={priceRange}
              setPriceRange={handlePriceChange}
            />

            <div className="mt-2 bg-white">
              <SortDropdown
                sortBy={sortBy}
                setSortBy={handleSortChange}
                totalSalons={totalSalons}
                selectedLocation={selectedLocation}
                searchText={searchText}
              />
            </div>
          </div>

          {/* ========================================
              FILTERS
              DESKTOP
              ======================================== */}

          <div className="hidden lg:col-span-3 lg:block lg:sticky lg:top-[110px] lg:self-start">
            <Filters
              openNow={openNow}
              setOpenNow={handleOpenNowChange}
              minimumRating={minimumRating}
              setMinimumRating={handleRatingChange}
              priceRange={priceRange}
              setPriceRange={handlePriceChange}
            />
          </div>

          {/* ========================================
              SALON CONTENT
              ======================================== */}

          <div className="w-full lg:col-span-9">
            {/* ======================================
                SEARCH BAR
                DESKTOP ONLY

                This is intentionally inside the
                salon-content column so it sits
                directly above Available Salons.
                ====================================== */}

            <div className="mb-4 hidden w-full lg:block">
              <SearchBar />
            </div>

            {/* ======================================
                SORT
                DESKTOP
                ====================================== */}

            <div className="hidden lg:sticky lg:top-[110px] lg:z-20 lg:block lg:bg-white lg:pb-3">
              <SortDropdown
                sortBy={sortBy}
                setSortBy={handleSortChange}
                totalSalons={totalSalons}
                selectedLocation={selectedLocation}
                searchText={searchText}
              />
            </div>

            {/* ======================================
                SALON GRID
                ====================================== */}

            <div className="mt-2">
              <SalonGrid
                salons={salons}
                minimumRating={minimumRating}
                priceRange={priceRange}
                sortBy={sortBy}
                searchText={searchText}
                serviceCategory={serviceCategory}
                selectedLocation={selectedLocation}
                userLocation={location}
                selectedPincode={selectedPincode}
                openNow={openNow}
                setTotalSalons={setTotalSalons}
                onResetFilters={resetFilters}
                onStartNewSearch={startNewSearch}
              />
            </div>

            {hasMore && salons.length > 0 && (
              <div className="flex justify-center py-5">
                <button
                  type="button"
                  onClick={loadMoreSalons}
                  disabled={loadingMore || loading}
                  className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {loadingMore ? "Loading..." : "Load More Salons"}
                </button>
              </div>
            )}

            {error && (
              <p className="py-3 text-center text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
