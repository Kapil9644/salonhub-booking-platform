export default function DateSelector({ selectedDate, setSelectedDate }) {
  const dates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  return (
    <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Select Date</h2>

      <div className="mt-6 flex flex-wrap gap-3">
        {dates.map((date) => (
          <button
            key={date.toDateString()}
            onClick={() => setSelectedDate(date)}
            className={`rounded-xl border px-5 py-3 transition ${
              selectedDate?.toDateString() === date.toDateString()
                ? "border-purple-600 bg-purple-600 text-white"
                : "border-gray-300 hover:border-purple-600"
            }`}
          >
            {date.toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </button>
        ))}
      </div>
    </div>
  );
}
