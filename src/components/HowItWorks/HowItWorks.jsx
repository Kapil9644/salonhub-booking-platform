import SectionTitle from "./SectionTitle/SectionTitle";
import StepsGrid from "./StepsGrid/StepsGrid";

export default function HowItWorks() {
  return (
    <section className="bg-white py-5 sm:py-6 lg:py-7">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SectionTitle />
        <StepsGrid />
      </div>
    </section>
  );
}
