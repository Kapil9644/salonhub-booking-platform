import { timeSlots } from "../../data/timeSlots";
export default function TimeSlotSelector({
  selectedDate,
  selectedTime,
  setSelectedTime,
}) {
  return (
    <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Select Time</h2>

      {!selectedDate && (
        <p className="mt-3 text-gray-500">Please select a date first.</p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {timeSlots.map((time) => (
          <button
            key={time}
            disabled={!selectedDate}
            onClick={() => setSelectedTime(time)}
            className={`rounded-xl border px-4 py-3 font-medium transition ${
              !selectedDate
                ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                : selectedTime === time
                  ? "border-purple-600 bg-purple-600 text-white"
                  : "border-gray-300 hover:border-purple-600"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}
