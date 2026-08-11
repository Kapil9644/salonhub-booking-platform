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
      {/* Hero */}
      <section className="bg-white">
        <Container>
          <div className="py-16 text-center sm:py-20">
            <p className="font-semibold uppercase tracking-wider text-purple-600">
              SalonHub Services
            </p>

            <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">
              Look Good. Feel Great.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
              Discover professional beauty and grooming services from trusted
              salons near you.
            </p>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="py-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.id}
                  className="group rounded-3xl border border-gray-400 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 transition duration-300 group-hover:bg-purple-600 group-hover:text-white">
                    <Icon size={28} strokeWidth={1.8} />
                  </div>

                  <h2 className="mt-6 text-2xl font-bold text-slate-900">
                    {service.title}
                  </h2>

                  <p className="mt-2 text-gray-600">{service.description}</p>

                  <button
                    onClick={handleFindSalons}
                    className="mt-6 font-semibold text-purple-600 transition hover:text-purple-800"
                  >
                    Find Salons →
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
          <div className="py-14 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready for your next look?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-purple-100">
              Find a trusted salon and book your preferred service in just a few
              clicks.
            </p>

            <button
              onClick={handleFindSalons}
              className="mt-7 rounded-full bg-white px-7 py-3 font-semibold text-purple-600 transition hover:bg-gray-100"
            >
              Find a Salon
            </button>
          </div>
        </Container>
      </section>
    </div>
  );
}
