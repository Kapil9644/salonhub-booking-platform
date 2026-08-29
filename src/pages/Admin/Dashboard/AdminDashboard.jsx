import { CalendarCheck, Clock3, Store, Users } from "lucide-react";

const stats = [
  {
    label: "Total Salons",
    value: "0",
    icon: Store,
  },
  {
    label: "Pending Applications",
    value: "0",
    icon: Clock3,
  },
  {
    label: "Total Customers",
    value: "0",
    icon: Users,
  },
  {
    label: "Appointments",
    value: "0",
    icon: CalendarCheck,
  },
];

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
          Administration
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Manage Rupiva and monitor platform activity.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Welcome / Quick Actions */}
      <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">
          Welcome to Rupiva Admin
        </h2>

        <p className="mt-2 max-w-2xl leading-7 text-gray-500">
          From here you will be able to review salon applications, manage salons
          and customers, monitor appointments and control the Rupiva platform.
        </p>

        <div className="mt-6 rounded-2xl bg-purple-50 p-5">
          <p className="font-semibold text-purple-800">Salon applications</p>

          <p className="mt-1 text-sm leading-6 text-purple-700">
            Pending salon applications will appear here once salon owners submit
            their profiles for approval.
          </p>
        </div>
      </section>
    </div>
  );
}
