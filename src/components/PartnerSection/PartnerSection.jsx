import SectionTitle from "./SectionTitle/SectionTitle";
import PartnerBenefits from "./PartnerBenefits/PartnerBenefits";
import PartnerImage from "./PartnerImage/PartnerImage";
import PartnerCTA from "./PartnerCTA/PartnerCTA";

export default function PartnerSection() {
  return (
    <section className="bg-gray-50 py-5 sm:py-6 lg:py-7">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-5 px-4 sm:px-6 md:grid-cols-2 lg:gap-7 lg:px-8">
        {/* Left Side */}
        <div>
          <SectionTitle />
          <PartnerCTA />
        </div>

        {/* Right Side */}
        <PartnerImage />
      </div>

      <div className="mx-auto mt-6 w-full max-w-[1400px] px-4 sm:px-6 lg:mt-7 lg:px-8">
        <PartnerBenefits />
      </div>
    </section>
  );
}
