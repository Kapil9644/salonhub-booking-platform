import { salons } from "../../../data/salons";
import SalonCard from "../../common/SalonCard/SalonCard";


export default function SalonGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {salons.map((salon) => (
        <SalonCard
          key={salon.id}
          {...salon}
        />
      ))}
    </div>
  );
}