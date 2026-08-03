export default function WorkingHours({ workingHours }) {
  return (
    <section className="mt-12 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Working Hours</h2>

      <div className="space-y-4">
        {workingHours.map((item) => (
          <div
            key={item.day}
            className="flex items-center justify-between border-b border-gray-100 pb-3"
          >
            <span className="font-medium text-slate-700">{item.day}</span>

            <span className="text-gray-600">{item.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
