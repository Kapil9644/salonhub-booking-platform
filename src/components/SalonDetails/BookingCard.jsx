import { Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BookingCard({ salon, selectedServices = [] }) {
  const navigate = useNavigate();

  const totalPrice = selectedServices.reduce(
    (total, service) => total + Number(service.price || 0),
    0,
  );

  const totalDuration = selectedServices.reduce(
    (total, service) => total + Number(service.duration || 0),
    0,
  );

  const hasSelectedServices = selectedServices.length > 0;

  const salonId = salon._id || salon.id;

  return (
    <div className="sticky top-28 rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-slate-900">Book Appointment</h2>

      {/* Selected Services */}
      <div className="mt-6">
        {hasSelectedServices ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500">
                Selected Services
              </p>

              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                {selectedServices.length}{" "}
                {selectedServices.length === 1 ? "Service" : "Services"}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {selectedServices.map((service) => (
                <div
                  key={service._id || service.id}
                  className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {service.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {service.duration} min
                    </p>
                  </div>

                  <p className="shrink-0 font-semibold text-purple-600">
                    ₹{service.price}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-5 rounded-2xl bg-purple-50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-600">Total Price</span>

                <span className="text-2xl font-bold text-purple-600">
                  ₹{totalPrice}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="font-medium text-gray-600">
                  Total Duration
                </span>

                <span className="font-semibold text-slate-900">
                  {totalDuration} min
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-4xl font-bold text-purple-600">
              {salon.priceLabel || "Price unavailable"}
            </p>

            <p className="mt-1 text-sm text-gray-500">Starting price</p>

            <p className="mt-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-500">
              Please select at least one service to continue.
            </p>
          </>
        )}
      </div>

      {/* Rating */}
      <div className="mt-6 flex items-center justify-between rounded-2xl bg-gray-50 p-4">
        <div className="flex items-center gap-2">
          <Star className="fill-yellow-400 text-yellow-400" size={18} />

          <span className="font-semibold">{salon.rating || 0}</span>
        </div>

        <span className="text-sm text-gray-500">
          {salon.reviews || 0} Reviews
        </span>
      </div>

      {/* CTA */}
      <button
        type="button"
        disabled={!hasSelectedServices}
        onClick={() =>
          navigate(`/booking/${salonId}`, {
            state: {
              salon,
              selectedServices,
              totalPrice,
              totalDuration,
            },
          })
        }
        className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 text-lg font-semibold transition ${
          hasSelectedServices
            ? "bg-purple-600 text-white hover:bg-purple-700"
            : "cursor-not-allowed bg-gray-300 text-gray-500"
        }`}
      >
        <Calendar size={20} />
        Book Appointment
      </button>
    </div>
  );
}
