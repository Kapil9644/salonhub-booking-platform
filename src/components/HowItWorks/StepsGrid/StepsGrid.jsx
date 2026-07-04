import { howItWorks } from "../../../data/howItWorks";
import StepCard from "../StepCard/StepCard";

export default function StepsGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {howItWorks.map((step) => (
        <StepCard
          key={step.id}
          icon={step.icon}
          title={step.title}
          description={step.description}
        />
      ))}
    </div>
  );
}