import { useNavigate } from "react-router-dom";
import Container from "../../layouts/Container/Container";
import { partnerBenefits } from "../../data/partnerBenefits";
import {
  Store,
  ClipboardList,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function BecomePartner() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    alert("Partner registration will be available soon.");
  };

  const partnerSteps = [
    {
      id: 1,
      icon: ClipboardList,
      title: "Register Your Salon",
      description:
        "Tell us about your salon and provide your basic business details.",
    },
    {
      id: 2,
      icon: Store,
      title: "Create Your Profile",
      description:
        "Add your salon information, services, pricing and working hours.",
    },
    {
      id: 3,
      icon: CalendarCheck,
      title: "Receive Appointments",
      description:
        "Customers can discover your salon and book appointments online.",
    },
    {
      id: 4,
      icon: TrendingUp,
      title: "Grow Your Business",
      description:
        "Reach more customers, build reviews and grow your salon with SalonHub.",
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-white">
        <Container>
          <div className="py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                <Store size={32} />
              </div>

              <p className="mt-6 font-semibold uppercase tracking-wider text-purple-600">
                SalonHub for Business
              </p>

              <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Grow Your Salon With SalonHub
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
                Join SalonHub and connect your salon with customers looking for
                professional beauty and grooming services nearby.
              </p>

              <button
                onClick={handleGetStarted}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-purple-600 px-7 py-3.5 font-semibold text-white transition hover:bg-purple-700"
              >
                Become a Partner
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold uppercase tracking-wider text-purple-600">
              Why Partner With Us
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Everything You Need to Grow
            </h2>

            <p className="mt-4 text-gray-600">
              SalonHub gives you the tools and visibility you need to manage
              your salon and reach more customers.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {partnerBenefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.id}
                  className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 transition duration-300 group-hover:bg-purple-600 group-hover:text-white">
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-900">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold uppercase tracking-wider text-purple-600">
              Simple Process
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              How Partnering Works
            </h2>

            <p className="mt-4 text-gray-600">
              Get your salon online and start accepting customers with just a
              few simple steps.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {partnerSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className="relative rounded-3xl border border-gray-200 p-6"
                >
                  <span className="text-5xl font-bold text-purple-100">
                    0{step.id}
                  </span>

                  <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-purple-600">
        <Container>
          <div className="py-14 text-center sm:py-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Grow Your Salon?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-purple-100">
              Join SalonHub and put your salon in front of customers who are
              ready to book.
            </p>

            <button
              onClick={handleGetStarted}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-purple-600 transition hover:bg-gray-100"
            >
              Become a Partner
              <ArrowRight size={18} />
            </button>
          </div>
        </Container>
      </section>
    </div>
  );
}
