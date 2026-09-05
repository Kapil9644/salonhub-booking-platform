import { howItWorks } from "../../../data/howItWorks";
import StepCard from "../StepCard/StepCard";

export default function StepsGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 sm:gap-4">
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
