import { whyChooseUs } from "../../../data/whyChooseUs";
import FeatureCard from "../FeatureCard/FeatureCard";

export default function FeatureGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {whyChooseUs.map((feature) => (
        <FeatureCard
          key={feature.id}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
}