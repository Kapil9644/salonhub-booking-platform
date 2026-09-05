import { Link } from "react-router-dom";
import SectionTitle from "./SectionTitle/SectionTitle";
import TestimonialCarousel from "./TestimonialCarousel/TestimonialCarousel";

export default function Testimonials() {
  return (
    <section className="bg-white py-5 sm:py-6 lg:py-7">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <SectionTitle />

          {/* Desktop / iPad */}
          <Link
            to="/testimonials"
            className="absolute right-0 top-0 hidden rounded-lg px-2 py-1 text-xs font-semibold text-purple-600 transition hover:bg-purple-50 hover:text-purple-700 sm:block sm:px-3 sm:text-sm"
          >
            View All →
          </Link>

          {/* Mobile */}
          <div className="-mt-2 flex justify-end sm:hidden">
            <Link
              to="/testimonials"
              className="rounded-lg px-2 py-1 text-xs font-semibold text-purple-600 transition hover:bg-purple-50 hover:text-purple-700"
            >
              View All →
            </Link>
          </div>
        </div>

        <TestimonialCarousel />
      </div>
    </section>
  );
}
