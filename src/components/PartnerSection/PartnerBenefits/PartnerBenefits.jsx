import { partnerBenefits } from "../../../data/partnerBenefits";
import PartnerBenefitCard from "../PartnerBenefitCard/PartnerBenefitCard";

export default function PartnerBenefits() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {partnerBenefits.map((benefit) => (
        <PartnerBenefitCard
          key={benefit.id}
          icon={benefit.icon}
          title={benefit.title}
          description={benefit.description}
        />
      ))}
    </div>
  );
}