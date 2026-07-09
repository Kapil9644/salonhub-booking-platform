import SalonCard from "../../common/SalonCard/SalonCard";
import { salons } from "../../../data/salons";

export default function SalonGrid({
  selectedServices = [],
  minimumRating = 0,
  priceRange = "Any Price",
  sortBy = "Recommended",
}) {

  let filteredSalons = [...salons];

  // Service Filter
  if (selectedServices.length > 0) {
    filteredSalons = filteredSalons.filter((salon) =>
      selectedServices.some((service) =>
        salon.services.includes(service)
      )
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {filteredSalons.map((salon) => (
        <SalonCard
          key={salon.id}
          {...salon}
        />
      ))}
    </div>
  );
}