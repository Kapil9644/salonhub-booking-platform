import { useEffect, useRef, useState } from "react";
import { ChevronDown, Clock3 } from "lucide-react";

const days = [
  { key: "monday", label: "Monday", value: 1 },
  { key: "tuesday", label: "Tuesday", value: 2 },
  { key: "wednesday", label: "Wednesday", value: 3 },
  { key: "thursday", label: "Thursday", value: 4 },
  { key: "friday", label: "Friday", value: 5 },
  { key: "saturday", label: "Saturday", value: 6 },
  { key: "sunday", label: "Sunday", value: 0 },
];

export default function WorkingHours({ workingHours }) {
  const today = new Date().getDay();

  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef(null);

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
            <Clock3 size={17} strokeWidth={2} />
          </span>

          <span className="text-lg font-bold leading-6 text-slate-900 sm:text-xl">
            Working Hours
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
          <div className="space-y-1.5 sm:space-y-2">
            {days.map((day) => {
              const schedule = workingHours?.[day.key];

              const isOpen = schedule?.isOpen;
              const isToday = today === day.value;

              return (
                <div
                  key={day.key}
                  className={`flex min-h-[42px] items-center justify-between gap-3 rounded-lg border-b border-gray-100 px-2.5 ${
                    isToday ? "border-transparent bg-purple-50" : ""
                  }`}
                >
                  {/* Day */}
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`text-sm font-medium sm:text-base ${
                        isToday ? "text-purple-700" : "text-slate-700"
                      }`}
                    >
                      {day.label}
                    </span>

                    {isToday && (
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-purple-700">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Time */}
                  {isOpen ? (
                    <span className="shrink-0 text-right text-xs text-gray-600 sm:text-sm">
                      {schedule.openTime} - {schedule.closeTime}
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs font-semibold text-red-500 sm:text-sm">
                      Closed
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
