import SectionTitle from "./SectionTitle/SectionTitle";
import StepsGrid from "./StepsGrid/StepsGrid";

export default function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1400px] px-12">
        <SectionTitle />
        <StepsGrid />
      </div>
    </section>
  );
}