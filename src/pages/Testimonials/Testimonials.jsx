import TestimonialCard from "../../components/Testimonials/TestimonialCard/TestimonialCard";
import { testimonials } from "../../data/testimonials";

export default function Testimonials() {
  return (
    <main className="bg-gray-50">
      {/* Page Header */}
      <section className="border-b border-gray-100 bg-white py-6 sm:py-8 lg:py-10">
        <div className="mx-auto w-full max-w-[1400px] px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
            What Our Customers Say
          </h1>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-5 text-gray-600 sm:text-[15px]">
            Thousands of happy customers trust Rupiva for their beauty bookings.
          </p>
        </div>
      </section>

      {/* All Testimonials */}
      <section className="py-6 sm:py-8 lg:py-10">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  name={testimonial.name}
                  city={testimonial.city}
                  rating={testimonial.rating}
                  review={testimonial.review}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center">
              <p className="text-sm font-medium text-gray-500">
                No customer testimonials available right now.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
