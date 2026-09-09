import { Ban, CalendarClock, CreditCard, FileText } from "lucide-react";

export default function PoliciesSection() {
  const policies = [
    {
      icon: CalendarClock,
      title: "Booking & Rescheduling",
      description:
        "Please arrive on time for your appointment. Rescheduling may depend on the salon's availability.",
    },
    {
      icon: Ban,
      title: "Cancellation",
      description:
        "Cancellation availability and any applicable charges may vary by salon and booking.",
    },
    {
      icon: CreditCard,
      title: "Payment",
      description:
        "Payment details and applicable charges are shown during the booking process.",
    },
    {
      icon: FileText,
      title: "General Policy",
      description:
        "Salon-specific rules may apply. Please contact the salon if you need clarification before your appointment.",
    },
  ];

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-7 sm:rounded-3xl sm:p-5">
      <h2 className="text-lg font-bold leading-6 text-slate-900 sm:text-xl">
        Policies
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {policies.map((policy) => {
          const Icon = policy.icon;

          return (
            <div
              key={policy.title}
              className="rounded-xl border border-gray-100 bg-gray-50 p-3 transition hover:border-purple-300 hover:bg-purple-50"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Icon size={17} />
                </span>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {policy.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {policy.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
