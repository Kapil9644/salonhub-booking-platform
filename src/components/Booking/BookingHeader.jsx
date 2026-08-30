export default function BookingHeader({ salon, selectedServices = [] }) {
  const totalPrice = selectedServices.reduce(
    (total, service) => total + Number(service.price || 0),
    0,
  );

  const totalDuration = selectedServices.reduce(
    (total, service) => total + Number(service.duration || 0),
    0,
  );

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-wide text-purple-600">
        Booking Details
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        Book Appointment
      </h1>

      <div className="mt-8 space-y-6">
        {/* Salon */}
        <div>
          <p className="text-sm text-gray-500">Salon</p>

          <h2 className="text-2xl font-bold text-slate-900">{salon.name}</h2>
        </div>

        {/* Selected Services */}
        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Selected Services</p>

            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
              {selectedServices.length}{" "}
              {selectedServices.length === 1 ? "Service" : "Services"}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {selectedServices.map((service) => (
              <div
                key={service._id || service.id}
                className="flex items-center justify-between rounded-2xl bg-gray-50 p-4"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {service.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Duration: {service.duration} min
                  </p>
                </div>

                <p className="font-semibold text-purple-600">
                  ₹{service.price}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
          <div>
            <p className="text-sm text-gray-500">Total Duration</p>

            <p className="mt-1 font-semibold text-slate-900">
              {totalDuration} min
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Price</p>

            <p className="mt-1 font-semibold text-purple-600">₹{totalPrice}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
