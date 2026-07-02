import { services } from "../../../data/services";
import ServiceCard from "../ServiceCard/ServiceCard";

export default function ServiceGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          title={service.title}
          description={service.description}
          icon={service.icon}
        />
      ))}
    </div>
  );
}