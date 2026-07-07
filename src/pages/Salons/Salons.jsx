import { useState } from "react";
import Container from "../../layouts/Container/Container";
import PageHeader from "../../components/Salons/PageHeader/PageHeader";
import Filters from "../../components/Salons/Filters/Filters";
import SortDropdown from "../../components/Salons/SortDropdown/SortDropdown";
import SalonGrid from "../../components/Salons/SalonGrid/SalonGrid";

export default function Salons() {

  const [selectedServices, setSelectedServices] = useState([]);

  const [minimumRating, setMinimumRating] = useState(0);

  const [priceRange, setPriceRange] = useState("Any Price");

  const [sortBy, setSortBy] = useState("Recommended");

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
            />
          </div>

          <div className="lg:col-span-9">
            <SortDropdown
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            <div className="mt-6">
              <SalonGrid
                selectedServices={selectedServices}
                minimumRating={minimumRating}
                priceRange={priceRange}
                sortBy={sortBy}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}