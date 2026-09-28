import { useEffect, useMemo, useState } from "react";
import { getPublicSalons } from "../../services/salonService";

import { useLocation } from "../../context/LocationContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import Container from "../../layouts/Container/Container";
import PageHeader from "../../components/Salons/PageHeader/PageHeader";
import Filters from "../../components/Salons/Filters/Filters";
import SortDropdown from "../../components/Salons/SortDropdown/SortDropdown";
import SalonGrid from "../../components/Salons/SalonGrid/SalonGrid";

export default function Salons() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const { location } = useLocation();

  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalSalons, setTotalSalons] = useState(0);

  const searchText = searchParams.get("search") || "";
  const selectedLocation = searchParams.get("location") || "";
  const selectedPincode = searchParams.get("pincode") || "";

  // ==================================================
  // DYNAMIC SERVICES
  // ==================================================

  const availableServices = useMemo(() => {
    const serviceMap = new Map();

    salons.forEach((salon) => {
      if (!Array.isArray(salon.services)) {
        return;
      }

      salon.services.forEach((service) => {
        const name = service?.name?.trim();

        if (!name) {
          return;
        }

        const key = name.toLowerCase();

        if (!serviceMap.has(key)) {
          serviceMap.set(key, name);
        }
      });
    });

    return Array.from(serviceMap.values()).sort((a, b) => a.localeCompare(b));
  }, [salons]);

  // ==================================================
  // FILTER STATES
  // ==================================================

  const [selectedServices, setSelectedServices] = useState(() => {
    const services = searchParams.get("services");

    return services ? services.split(",").filter(Boolean) : [];
  });

  const [openNow, setOpenNow] = useState(() => {
    return searchParams.get("openNow") === "true";
  });

  const [minimumRating, setMinimumRating] = useState(() => {
    const rating = searchParams.get("rating");

    return rating ? Number(rating) : 0;
  });

  const [priceRange, setPriceRange] = useState(
    () => searchParams.get("price") || "Any Price",
  );

  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sort") || "Nearest",
  );

  // ==================================================
  // SORT
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
  // SERVICES
  // ==================================================

  const handleServicesChange = (services) => {
    setSelectedServices(services);

    const params = new URLSearchParams(searchParams);

    if (services.length > 0) {
      params.set("services", services.join(","));
    } else {
      params.delete("services");
    }

    setSearchParams(params);
  };

  // ==================================================
  // OPEN NOW
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
  // RATING
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
  // PRICE
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
    setSelectedServices([]);
    setOpenNow(false);
    setMinimumRating(0);
    setPriceRange("Any Price");
    setSortBy("Nearest");

    const params = new URLSearchParams(searchParams);

    params.delete("sort");
    params.delete("services");
    params.delete("openNow");
    params.delete("rating");
    params.delete("price");

    setSearchParams(params);
  };

  // ==================================================
  // NEW SEARCH
  // ==================================================

  const startNewSearch = () => {
    setSelectedServices([]);
    setOpenNow(false);
    setMinimumRating(0);
    setPriceRange("Any Price");
    setSortBy("Nearest");

    setSearchParams({});
    navigate("/");
  };

  // ==================================================
  // FETCH SALONS
  // ==================================================

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPublicSalons();

        setSalons(data.salons || []);
      } catch (error) {
        console.error("Failed to fetch public salons:", error);

        setError(error.response?.data?.message || "Failed to load salons.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, []);

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <Container>
      <div className="py-3 sm:py-4 lg:py-5">
        <PageHeader
          searchText={searchText}
          selectedLocation={selectedLocation}
          selectedPincode={selectedPincode}
        />

        <div className="grid grid-cols-1 items-start gap-4 sm:gap-5 lg:grid-cols-12 lg:gap-6">
          {/* ==========================================
              MOBILE + TABLET
              ========================================== */}

          <div className="sticky top-[100px] z-40 w-full bg-white pb-2 lg:hidden">
            <Filters
              availableServices={availableServices}
              selectedServices={selectedServices}
              setSelectedServices={handleServicesChange}
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

          {/* ==========================================
              DESKTOP FILTERS
              ========================================== */}

          <div className="hidden lg:col-span-3 lg:block lg:sticky lg:top-[110px] lg:self-start">
            <Filters
              availableServices={availableServices}
              selectedServices={selectedServices}
              setSelectedServices={handleServicesChange}
              openNow={openNow}
              setOpenNow={handleOpenNowChange}
              minimumRating={minimumRating}
              setMinimumRating={handleRatingChange}
              priceRange={priceRange}
              setPriceRange={handlePriceChange}
            />
          </div>

          {/* ==========================================
              SALON RESULTS
              ========================================== */}

          <div className="w-full lg:col-span-9">
            {/* Desktop Sort */}
            <div className="hidden lg:sticky lg:top-[110px] lg:z-20 lg:block lg:bg-white lg:pb-3">
              <SortDropdown
                sortBy={sortBy}
                setSortBy={handleSortChange}
                totalSalons={totalSalons}
                selectedLocation={selectedLocation}
                searchText={searchText}
              />
            </div>

            <div className="mt-2">
              <SalonGrid
                salons={salons}
                availableServices={availableServices}
                selectedServices={selectedServices}
                openNow={openNow}
                minimumRating={minimumRating}
                priceRange={priceRange}
                sortBy={sortBy}
                searchText={searchText}
                selectedLocation={selectedLocation}
                userLocation={location}
                selectedPincode={selectedPincode}
                setTotalSalons={setTotalSalons}
                onResetFilters={resetFilters}
                onStartNewSearch={startNewSearch}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
