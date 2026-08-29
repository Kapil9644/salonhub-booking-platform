import { Link } from "react-router-dom";
import { Store, ArrowRight } from "lucide-react";

export default function SalonOwner() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main */}
      <main className="flex min-h-[calc(100vh-81px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl text-center">
          {/* Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-100">
            <Store size={38} className="text-purple-600" />
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Grow Your Salon With Rupiva
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-gray-500">
            Manage your salon, services, working hours, appointments, and
            customers from one simple dashboard.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/salon-owner/login"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-purple-600 px-8 py-4 font-semibold text-white transition hover:bg-purple-700 sm:w-auto"
            >
              Login as Salon Owner
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/salon-owner/signup"
              className="w-full rounded-full border border-purple-600 bg-white px-8 py-4 font-semibold text-purple-600 transition hover:bg-purple-50 sm:w-auto"
            >
              Become a Salon Partner
            </Link>
          </div>

          {/* Benefits */}
          <div className="mt-14 grid gap-4 text-left sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">Manage Services</h3>

              <p className="mt-2 text-sm text-gray-500">
                Control your services, pricing and duration.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">Manage Schedule</h3>

              <p className="mt-2 text-sm text-gray-500">
                Set working hours and salon availability.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">Manage Bookings</h3>

              <p className="mt-2 text-sm text-gray-500">
                Track and manage your appointments.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
