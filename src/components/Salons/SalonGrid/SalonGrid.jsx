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

  // Rating Filter
  if (minimumRating > 0) {
    filteredSalons = filteredSalons.filter(
      (salon) => salon.rating >= minimumRating
    );
  }

  // Price Filter
  if (priceRange !== "Any Price") {
    filteredSalons = filteredSalons.filter((salon) => {
    switch (priceRange) {
      case "₹0 - ₹500":
        return salon.price <= 500;

      case "₹500 - ₹1000":
        return salon.price > 500 && salon.price <= 1000;

      case "₹1000+":
        return salon.price > 1000;

      default:
        return true;
      }
    });
  }


  // Sorting
  switch (sortBy) {
    case "Highest Rated":
      filteredSalons.sort((a, b) => b.rating - a.rating);
      break;

    case "Lowest Price":
      filteredSalons.sort((a, b) => a.price - b.price);
      break;

    case "Highest Price":
      filteredSalons.sort((a, b) => b.price - a.price);
      break;

    case "Most Popular":
      filteredSalons.sort((a, b) => b.reviews - a.reviews);
      break;

    default:
      break; // Recommended keeps the original order
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