const days = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export default function WorkingHours({ workingHours }) {
  return (
    <section className="mt-12 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Working Hours</h2>

      <div className="space-y-4">
        {days.map((day) => {
          const schedule = workingHours?.[day.key];

          const isOpen = schedule?.isOpen;

          return (
            <div
              key={day.key}
              className="flex items-center justify-between border-b border-gray-100 pb-3"
            >
              <span className="font-medium text-slate-700">{day.label}</span>

              {isOpen ? (
                <span className="text-gray-600">
                  {schedule.openTime} - {schedule.closeTime}
                </span>
              ) : (
                <span className="font-medium text-red-500">Closed</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
