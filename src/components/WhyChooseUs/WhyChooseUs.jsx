import SectionTitle from "./SectionTitle/SectionTitle";
import FeatureGrid from "./FeatureGrid/FeatureGrid";

export default function WhyChooseUs() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-[1400px] px-12">
        <SectionTitle />
        <FeatureGrid />
      </div>
    </section>
  );
}