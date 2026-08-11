import SectionTitle from "./SectionTitle/SectionTitle";
import TestimonialCarousel from "./TestimonialCarousel/TestimonialCarousel";

export default function Testimonials() {
  return (
    <section className="bg-white py-6">
      <div className="mx-auto max-w-[1400px] px-12">
        <SectionTitle />
        <TestimonialCarousel />
      </div>
    </section>
  );
}
