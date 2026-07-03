import { testimonials } from "../../../data/testimonials";
import TestimonialCard from "../TestimonialCard/TestimonialCard";

export default function TestimonialCarousel() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
  );
}