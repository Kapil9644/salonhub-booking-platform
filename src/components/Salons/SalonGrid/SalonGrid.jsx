import SalonCard from "../../common/SalonCard/SalonCard";
import { salons } from "../../../data/salons";

export default function SalonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {salons.map((salon) => (
        <SalonCard
          key={salon.id}
          {...salon}
        />
      ))}
    </div>
  );
}