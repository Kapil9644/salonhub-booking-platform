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

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-7 sm:rounded-3xl sm:p-5">
      <h2 className="mb-4 text-lg font-bold leading-6 text-slate-900 sm:text-xl">
        Working Hours
      </h2>
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
    </section>
  );
}
