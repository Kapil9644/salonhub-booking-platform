import { CalendarDays } from "lucide-react";
import { getBookingDateLimits } from "../../utils/dateUtils";

const getAvailableDates = () => {
  const { minDate, maxDate } = getBookingDateLimits();
  const dates = [];

  // ISO date strings sort chronologically.
  const start = new Date(`${minDate}T12:00:00`);
  const end = new Date(`${maxDate}T12:00:00`);

  for (
    const date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);
  }

  return dates;
};

export default function DateSelector({ selectedDate, setSelectedDate }) {
  const dates = getAvailableDates();

  return (
    <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <CalendarDays size={24} className="shrink-0 text-purple-600" />
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Select Date
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose a date within the next 7 days.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {dates.map((date) => {
          const isSelected = selectedDate === date;
          const parsedDate = new Date(`${date}T12:00:00`);

          return (
            <button
              key={date}
              type="button"
              onClick={() => setSelectedDate(date)}
              aria-pressed={isSelected}
              className={`min-h-[76px] rounded-2xl border p-3 text-left transition ${
                isSelected
                  ? "border-purple-600 bg-purple-50 ring-2 ring-purple-100"
                  : "border-gray-200 bg-white hover:border-purple-400"
              }`}
            >
              <span className="block text-sm text-gray-500">
                {parsedDate.toLocaleDateString("en-IN", {
                  weekday: "short",
                })}
              </span>
              <span
                className={`mt-1 block text-lg font-bold ${
                  isSelected ? "text-purple-700" : "text-slate-900"
                }`}
              >
                {parsedDate.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
