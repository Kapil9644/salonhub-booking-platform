export default function BookingHeader({ salon, selectedService }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-wide text-purple-600">
        Booking Details
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        Book Appointment
      </h1>

      <div className="mt-8 space-y-3">
        <div>
          <p className="text-sm text-gray-500">Salon</p>

          <h2 className="text-2xl font-bold text-slate-900">{salon.name}</h2>
        </div>

        <div>
          <p className="text-sm text-gray-500">Selected Service</p>

          <h3 className="text-xl font-semibold text-purple-600">
            {selectedService.name}
          </h3>
        </div>

        <div className="flex gap-8 pt-4">
          <div>
            <p className="text-sm text-gray-500">Duration</p>

            <p className="font-semibold">{selectedService.duration}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Price</p>

            <p className="font-semibold text-purple-600">
              ₹{selectedService.price}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
