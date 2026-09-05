import SectionTitle from "./SectionTitle/SectionTitle";
import FeatureGrid from "./FeatureGrid/FeatureGrid";

export default function WhyChooseUs() {
  return (
    <section className="bg-gray-50 py-5 sm:py-6 lg:py-7">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SectionTitle />
        <FeatureGrid />
      </div>
    </section>
  );
}
