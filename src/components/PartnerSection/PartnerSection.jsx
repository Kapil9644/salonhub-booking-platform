import SectionTitle from "./SectionTitle/SectionTitle";
import PartnerBenefits from "./PartnerBenefits/PartnerBenefits";
import PartnerImage from "./PartnerImage/PartnerImage";
import PartnerCTA from "./PartnerCTA/PartnerCTA";

export default function PartnerSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 px-12 lg:grid-cols-2">
        
        {/* Left Side */}
        <div>
          <SectionTitle />
          <PartnerCTA />
        </div>

        {/* Right Side */}
        <PartnerImage />
      </div>

      <div className="mx-auto mt-16 max-w-[1400px] px-12">
        <PartnerBenefits />
      </div>
    </section>
  );
}