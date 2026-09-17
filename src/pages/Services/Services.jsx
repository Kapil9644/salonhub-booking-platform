import { useNavigate } from "react-router-dom";
import Container from "../../layouts/Container/Container";
import { services } from "../../data/services";

export default function Services() {
  const navigate = useNavigate();

  const handleFindSalons = () => {
    navigate("/salons");
  };

  return (
    <div className="bg-gray-50">
      {/* Services */}
      <section className="py-6 sm:py-8 lg:py-10">
        <Container>
          {/* Section Header */}
          <div className="mb-5 text-center sm:mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-600 sm:text-sm">
              Explore Our Services
            </p>

            <h1 className="mt-1.5 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Beauty & Grooming, Your Way
            </h1>

            <p className="mx-auto mt-1.5 max-w-2xl text-sm leading-5 text-gray-600 sm:text-base sm:leading-6">
              Choose from a range of professional beauty and grooming services
              and find salons that offer what you need.
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.id}
                  className="group flex h-full min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg active:-translate-y-1 active:border-purple-300 active:shadow-lg touch-manipulation sm:rounded-3xl sm:p-5"
                >
                  {/* Icon */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white group-active:bg-purple-600 group-active:text-white sm:h-14 sm:w-14 sm:rounded-2xl">
                    <Icon
                      size={25}
                      strokeWidth={1.8}
                      className="transition-transform duration-300 group-hover:scale-110 group-active:scale-110"
                    />
                  </div>

                  {/* Title */}
                  <h2 className="mt-4 text-xl font-extrabold leading-tight text-slate-900 sm:text-2xl">
                    {service.title}
                  </h2>

                  {/* Short Description */}
                  <p className="mt-1.5 text-sm font-medium leading-5 text-purple-700">
                    {service.description}
                  </p>

                  {/* Detailed Description */}
                  <p className="mt-2.5 text-sm leading-5 text-gray-600">
                    {service.detailedDescription}
                  </p>

                  {/* Highlights */}
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-900">
                      Includes
                    </p>

                    <ul className="mt-2 space-y-1.5">
                      {service.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2 text-xs leading-4 text-gray-600 sm:text-sm"
                        >
                          <span className="mt-0.5 shrink-0 font-bold text-purple-600">
                            ✓
                          </span>

                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Service Information */}
                  <div className="mt-4 grid grid-cols-1 gap-2 border-t border-gray-100 pt-3 sm:grid-cols-2 sm:gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Duration
                      </p>

                      <p className="mt-0.5 text-xs font-semibold text-slate-700 sm:text-sm">
                        {service.duration}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Best For
                      </p>

                      <p className="mt-0.5 text-xs font-semibold leading-4 text-slate-700 sm:text-sm">
                        {service.bestFor}
                      </p>
                    </div>
                  </div>

                  {/* Find Salons */}
                  <button
                    type="button"
                    onClick={handleFindSalons}
                    className="mt-auto pt-5"
                  >
                    <span className="flex w-full items-center justify-center rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-purple-700 hover:shadow-md active:scale-[0.98] active:bg-purple-700 active:shadow-md">
                      Find Salons →
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="bg-purple-600">
        <Container>
          <div className="py-10 text-center sm:py-12">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              Ready for your next look?
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-5 text-purple-100 sm:text-base">
              Find a trusted salon and book your preferred service in just a few
              clicks.
            </p>

            <button
              type="button"
              onClick={handleFindSalons}
              className="mt-5 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-purple-600 transition-all duration-300 hover:bg-gray-100 hover:shadow-md active:scale-[0.98] active:bg-gray-100 active:shadow-md sm:px-7 sm:py-3"
            >
              Find a Salon
            </button>
          </div>
        </Container>
      </section>
    </div>
  );
}
