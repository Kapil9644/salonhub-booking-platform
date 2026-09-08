import { useEffect, useState } from "react";
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
  const searchText = searchParams.get("search") || "";
  const selectedLocation = searchParams.get("location") || "";
  const [totalSalons, setTotalSalons] = useState(0);

  const [selectedServices, setSelectedServices] = useState(() => {
    const services = searchParams.get("services");
    return services ? services.split(",") : [];
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

  const resetFilters = () => {
    setSelectedServices([]);
    setMinimumRating(0);
    setPriceRange("Any Price");
    setSortBy("Nearest");

    const params = new URLSearchParams(searchParams);

    params.delete("sort");
    params.delete("services");
    params.delete("rating");
    params.delete("price");

    setSearchParams(params);
  };

  const startNewSearch = () => {
    setSearchParams({});
    resetFilters();
    navigate("/");
  };

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

  return (
    <Container>
      <div className="py-3 sm:py-4 lg:py-5">
        <PageHeader />

        <div className="grid grid-cols-1 items-start gap-4 sm:gap-5 lg:grid-cols-12 lg:gap-6">
          {/* Mobile + Tablet Sticky Controls */}
          <div className="sticky top-[100px] z-40 w-full bg-white pb-2 lg:hidden">
            {/* Filters */}
            <Filters
              selectedServices={selectedServices}
              setSelectedServices={handleServicesChange}
              minimumRating={minimumRating}
              setMinimumRating={handleRatingChange}
              priceRange={priceRange}
              setPriceRange={handlePriceChange}
              setSortBy={setSortBy}
            />

            {/* Available Salons + Sort */}
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

          {/* Desktop Filters */}
          <div className="hidden lg:col-span-3 lg:block lg:sticky lg:top-[110px] lg:self-start">
            <Filters
              selectedServices={selectedServices}
              setSelectedServices={handleServicesChange}
              minimumRating={minimumRating}
              setMinimumRating={handleRatingChange}
              priceRange={priceRange}
              setPriceRange={handlePriceChange}
              setSortBy={setSortBy}
            />
          </div>

          {/* Salon Results */}
          <div className="w-full lg:col-span-9">
            {/* Desktop Available Salons + Sort */}
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
                selectedServices={selectedServices}
                minimumRating={minimumRating}
                priceRange={priceRange}
                sortBy={sortBy}
                searchText={searchText}
                selectedLocation={selectedLocation}
                userLocation={location}
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
