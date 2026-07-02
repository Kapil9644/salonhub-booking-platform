import SectionTitle from "./SectionTitle/SectionTitle";
import ServiceGrid from "./ServiceGrid/ServiceGrid";

export default function Services() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-[1400px] px-12">
        <SectionTitle />
        <ServiceGrid />
      </div>
    </section>
  );
}