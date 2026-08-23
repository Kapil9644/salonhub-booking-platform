import { useState } from "react";

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
  const searchText = searchParams.get("search") || "";
  const selectedLocation = searchParams.get("location") || "";
  const [totalSalons, setTotalSalons] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);

  const [minimumRating, setMinimumRating] = useState(0);

  const [priceRange, setPriceRange] = useState("Any Price");

  const [sortBy, setSortBy] = useState("Recommended");

  const resetFilters = () => {
    setSelectedServices([]);
    setMinimumRating(0);
    setPriceRange("Any Price");
    setSortBy("Recommended");
  };

  const startNewSearch = () => {
    setSearchParams({});
    resetFilters();
    navigate("/");
  };

  return (
    <Container>
      <div className="py-16">
        <PageHeader />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Filters
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
              minimumRating={minimumRating}
              setMinimumRating={setMinimumRating}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              setSortBy={setSortBy}
            />
          </div>

          <div className="lg:col-span-9">
            <SortDropdown
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalSalons={totalSalons}
              selectedLocation={selectedLocation}
              searchText={searchText}
            />

            <div className="mt-6">
              <SalonGrid
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
