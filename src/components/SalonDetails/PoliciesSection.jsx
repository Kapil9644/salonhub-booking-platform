import { useEffect, useRef, useState } from "react";
import {
  Ban,
  CalendarClock,
  CreditCard,
  FileText,
  ChevronDown,
  ClipboardList,
} from "lucide-react";

export default function PoliciesSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef(null);

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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sectionRef.current && !sectionRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isExpanded]);

  return (
    <section
      ref={sectionRef}
      className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm sm:mt-7 sm:rounded-3xl"
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5 sm:py-5"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <ClipboardList size={17} strokeWidth={2} />
          </span>

          <span className="text-lg font-bold leading-6 text-slate-900 sm:text-xl">
            Policies
          </span>
        </span>

        <ChevronDown
          size={20}
          strokeWidth={2}
          className={`shrink-0 text-slate-500 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          <div className="grid gap-3 sm:grid-cols-2">
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
        </div>
      )}
    </section>
  );
}
