import SectionTitle from "./SectionTitle/SectionTitle";
import SalonGrid from "./SalonGrid/SalonGrid";

export default function FeaturedSalons() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1400px] px-12">
        <SectionTitle />
        <SalonGrid />
      </div>
    </section>
  );
}