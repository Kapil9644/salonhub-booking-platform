import { CalendarDays } from "lucide-react";
import { getBookingDateLimits } from "../../utils/dateUtils";

export default function DateSelector({ selectedDate, setSelectedDate }) {
  const { minDate, maxDate } = getBookingDateLimits();

  return (
    <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-3">
        <CalendarDays size={24} className="text-purple-600" />

        <h2 className="text-2xl font-bold text-slate-900">Select Date</h2>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        Select a date within the next 7 days.
      </p>

      <div className="mt-6">
        <input
          type="date"
          value={selectedDate || ""}
          min={minDate}
          max={maxDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base font-medium text-slate-900 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 sm:max-w-md"
        />
      </div>
    </section>
  );
}
