import {
  CalendarCheck,
  CheckCircle2,
  MapPin,
  Search,
  Scissors,
  Sparkles,
  Users,
} from "lucide-react";

const AboutUs = () => {
  const features = [
    {
      icon: Search,
      title: "Find Nearby Salons",
      description:
        "Discover salons, parlours and beauty services near your preferred location.",
    },
    {
      icon: CalendarCheck,
      title: "Book in Seconds",
      description:
        "Choose your preferred service, date and available time slot with ease.",
    },
    {
      icon: CheckCircle2,
      title: "Choose with Confidence",
      description:
        "Explore salon details, services, pricing, timings and customer reviews before booking.",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Search",
      description: "Find salons and services that match your needs.",
    },
    {
      number: "02",
      icon: Scissors,
      title: "Select",
      description: "Choose your preferred salon and services.",
    },
    {
      number: "03",
      icon: CalendarCheck,
      title: "Book",
      description: "Pick an available time slot and confirm your appointment.",
    },
    {
      number: "04",
      icon: Sparkles,
      title: "Visit & Shine",
      description: "Visit your salon and enjoy your beauty experience.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <Scissors size={24} strokeWidth={2} />
            </div>

            <p className="mt-4 text-sm font-bold uppercase tracking-wider text-purple-600">
              About Rupiva
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Your Beauty, Your Time,
              <span className="block text-purple-600">Your Choice.</span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Rupiva makes it simple to discover trusted salons, explore
              services and book your preferred appointment without the
              unnecessary waiting.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-purple-600">
              What is Rupiva?
            </p>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              A simpler way to book your salon experience
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Rupiva is a salon and beauty booking platform designed to make
              finding and booking salon services easier. Instead of spending
              time searching for salons or waiting to get an appointment,
              customers can explore available options and book a suitable time
              slot from one place.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Our goal is to connect customers with salons while helping salon
              owners manage their services and appointments more efficiently.
            </p>
          </div>

          <div className="rounded-3xl border border-purple-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-2xl bg-purple-50 p-4">
                <MapPin className="text-purple-600" size={22} />
                <p className="mt-3 text-sm font-bold text-slate-900">
                  Nearby Discovery
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Find salons based on your location.
                </p>
              </div>

              <div className="rounded-2xl bg-purple-50 p-4">
                <CalendarCheck className="text-purple-600" size={22} />
                <p className="mt-3 text-sm font-bold text-slate-900">
                  Easy Booking
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Select a service and available slot.
                </p>
              </div>

              <div className="rounded-2xl bg-purple-50 p-4">
                <Users className="text-purple-600" size={22} />
                <p className="mt-3 text-sm font-bold text-slate-900">
                  Customer First
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Designed around a simple experience.
                </p>
              </div>

              <div className="rounded-2xl bg-purple-50 p-4">
                <Sparkles className="text-purple-600" size={22} />
                <p className="mt-3 text-sm font-bold text-slate-900">
                  Better Experience
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Less waiting, more convenience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Rupiva */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-purple-600">
              Why Rupiva
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Everything you need before your appointment
            </h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-purple-600">
              How It Works
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              From search to salon in four simple steps
            </h2>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                      <Icon size={20} />
                    </div>

                    <span className="text-2xl font-extrabold text-purple-100">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="rounded-3xl bg-purple-600 px-5 py-7 text-center shadow-lg sm:px-8 sm:py-9">
            <Sparkles className="mx-auto text-purple-200" size={26} />

            <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
              Ready to book your next salon visit?
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-purple-100">
              Discover salons, choose your services and book a convenient time
              with Rupiva.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
