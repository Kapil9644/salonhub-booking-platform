import { Link } from "react-router-dom";
import {
  Store,
  ArrowRight,
  Scissors,
  Clock3,
  CalendarDays,
  CheckCircle2,
  Sparkles,
  CreditCard,
} from "lucide-react";

const benefits = [
  {
    icon: Scissors,
    title: "Manage Services",
    description: "Control your services, pricing and duration with ease.",
  },
  {
    icon: Clock3,
    title: "Manage Schedule",
    description: "Set working hours and keep your salon availability updated.",
  },
  {
    icon: CalendarDays,
    title: "Manage Bookings",
    description: "Track customer appointments and organize your bookings.",
  },
  {
    icon: CreditCard,
    title: "Manage Payments",
    description: "Handle payments and track your financials with ease.",
  },
];

function BenefitCard({ benefit, compact = false }) {
  const Icon = benefit.icon;

  return (
    <div
      className={
        compact
          ? "flex min-w-0 items-start gap-3 rounded-2xl border border-purple-200/80 bg-white/90 p-3.5 transition duration-200 hover:border-purple-400 hover:bg-white sm:p-4"
          : "rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100/60 sm:p-6"
      }
    >
      <div
        className={`flex shrink-0 items-center justify-center rounded-xl ${
          compact ? "h-10 w-10" : "h-12 w-12"
        } bg-gradient-to-br from-fuchsia-100 to-purple-100 text-purple-700`}
      >
        <Icon size={compact ? 21 : 24} strokeWidth={2} />
      </div>

      <div className={compact ? "min-w-0 flex-1" : ""}>
        <h3
          className={`font-bold text-slate-900 ${
            compact ? "text-sm sm:text-base" : "mt-4 text-base sm:text-lg"
          }`}
        >
          {benefit.title}
        </h3>

        <p
          className={`mt-1 text-slate-600 ${
            compact
              ? "text-xs leading-5 sm:text-sm sm:leading-6"
              : "text-sm leading-6"
          }`}
        >
          {benefit.description}
        </p>
      </div>
    </div>
  );
}

export default function SalonOwner() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-fuchsia-100 via-violet-100 to-sky-100">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -left-32 top-36 -z-10 h-72 w-72 rounded-full bg-fuchsia-300/40 blur-3xl sm:h-96 sm:w-96" />

        <div className="pointer-events-none absolute -right-24 top-10 -z-10 h-72 w-72 rounded-full bg-sky-300/50 blur-3xl sm:h-[28rem] sm:w-[28rem]" />

        <div className="pointer-events-none absolute right-1/3 top-1/2 -z-10 h-56 w-56 -translate-y-1/2 rounded-full bg-purple-300/30 blur-3xl" />

        {/* Hero content */}
        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 py-7 sm:px-6 sm:py-10 md:gap-10 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-10 xl:gap-16">
          {/* LEFT CONTENT */}
          <div className="mx-auto w-full max-w-2xl text-center lg:mx-0 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/85 px-4 py-2 text-xs font-bold text-purple-800 shadow-lg shadow-purple-200/30 backdrop-blur-md sm:text-sm">
              <Sparkles size={17} className="text-purple-600" />
              Your business, made simpler
            </div>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-950 sm:mt-6 sm:text-5xl md:text-6xl lg:mt-7 lg:text-6xl xl:text-7xl">
              Grow Your Salon
              <span className="mt-1 block bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-700 bg-clip-text pb-1 text-transparent">
                With Rupiva
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-700 sm:mt-5 sm:text-base sm:leading-7 md:text-lg md:leading-8 lg:mx-0">
              Manage your salon, services, working hours, appointments and
              customers from one simple dashboard.
            </p>

            {/* Action buttons */}
            <div className="mt-6 flex flex-col justify-center gap-3 min-[480px]:flex-row lg:mt-8 lg:justify-start">
              <Link
                to="/salon-owner/login"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-fuchsia-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-400/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/30 focus:outline-none focus:ring-4 focus:ring-purple-300/60 min-[480px]:w-auto sm:px-6 sm:text-base"
              >
                Login as Salon Owner
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/salon-owner/signup"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-purple-300/90 bg-white/60 px-5 py-3 text-sm font-bold text-purple-800 shadow-sm backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-purple-500 hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-purple-300/60 min-[480px]:w-auto sm:px-6 sm:text-base"
              >
                Become a Salon Partner
              </Link>
            </div>

            {/* Highlights */}
            <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-3 text-xs font-medium text-slate-700 sm:mt-6 sm:text-sm lg:justify-start">
              {["Easy management", "Responsive access"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2
                    size={17}
                    className="shrink-0 text-emerald-600"
                  />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT WORKSPACE CARD */}
          <div className="mx-auto w-full max-w-xl lg:ml-auto lg:max-w-none">
            <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/55 p-4 shadow-2xl shadow-indigo-900/10 backdrop-blur-xl sm:p-5 md:p-6 lg:p-7">
              {/* Soft card glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-fuchsia-300/30 blur-3xl" />

              <div className="relative">
                {/* Card heading */}
                <div className="flex items-center gap-3 border-b border-white/80 pb-4 sm:gap-4 sm:pb-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-800 sm:h-14 sm:w-14">
                    <Store size={27} strokeWidth={2} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-extrabold tracking-tight text-slate-950 sm:text-xl md:text-2xl">
                      Your Salon Workspace
                    </h2>
                    <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                      Your essential tools, all in one place.
                    </p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
                  {benefits.map((benefit) => (
                    <BenefitCard
                      key={benefit.title}
                      benefit={benefit}
                      compact
                    />
                  ))}
                </div>

                {/* Bottom banner */}
                <div className="mt-4 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 p-4 text-white shadow-lg shadow-purple-300/20 sm:mt-5 sm:p-5">
                  <p className="text-sm font-extrabold sm:text-base md:text-lg">
                    Focus on your customers.
                  </p>
                  <p className="mt-1 text-xs leading-5 text-purple-100 sm:text-sm sm:leading-6">
                    Keep everyday salon management organized with Rupiva.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-16 bg-gradient-to-t from-white/20 to-transparent" />
      </section>

      {/* FEATURES SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-purple-700 sm:text-sm">
            Made for salon owners
          </p>

          <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-950 sm:mt-3 sm:text-3xl md:text-4xl">
            Everything You Need to Manage Your Salon
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Organize your daily tasks with simple tools designed around your
            salon business.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.title} benefit={benefit} />
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-purple-100 bg-gradient-to-r from-purple-50 via-fuchsia-50 to-indigo-50 p-5 sm:mt-10 sm:p-7 md:flex-row md:items-center md:gap-6 md:p-8">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
              Ready to partner with Rupiva?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              Get started with your salon partner account.
            </p>
          </div>

          <Link
            to="/salon-owner/signup"
            className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-purple-700 px-6 py-3 text-sm font-bold text-white shadow-md shadow-purple-200 transition hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300/60 sm:w-auto sm:text-base"
          >
            Become a Salon Partner
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-100 bg-slate-50/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <span className="font-extrabold text-slate-800">
            Rupiva{" "}
            <span className="font-medium text-purple-700">· For Business</span>
          </span>

          <span className="text-xs text-slate-500 sm:text-sm">
            Simple tools for your salon business.
          </span>
        </div>
      </footer>
    </main>
  );
}
