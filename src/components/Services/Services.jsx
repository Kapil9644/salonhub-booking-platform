import { Link } from "react-router-dom";
import SectionTitle from "./SectionTitle/SectionTitle";
import ServiceGrid from "./ServiceGrid/ServiceGrid";

export default function Services() {
  return (
    <section className="bg-gray-50 py-6 sm:py-7 lg:py-8">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <SectionTitle />

          <Link
            to="/services"
            className="absolute right-0 top-0 hidden rounded-lg px-2 py-1 text-xs font-semibold text-purple-600 transition hover:bg-purple-50 hover:text-purple-700 sm:block sm:px-3 sm:text-sm"
          >
            View All →
          </Link>

          <div className="-mt-2 flex justify-end sm:hidden">
            <Link
              to="/services"
              className="rounded-lg px-2 py-1 text-xs font-semibold text-purple-600 transition hover:bg-purple-50 hover:text-purple-700"
            >
              View All →
            </Link>
          </div>
        </div>

        <ServiceGrid />
      </div>
    </section>
  );
}
