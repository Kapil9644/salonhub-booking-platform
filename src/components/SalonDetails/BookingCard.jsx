import { Calendar } from "lucide-react";
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
    <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white p-4 shadow-md sm:rounded-3xl sm:p-5">
      <h2 className="text-2xl font-bold text-slate-900">Book Appointment</h2>

      {/* Selected Services */}
      <div className="mt-4">
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

            <div className="mt-2 space-y-2">
              {selectedServices.map((service) => (
                <div
                  key={service._id || service.id}
                  className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {service.name}
                    </p>

                    <p className="mt-0.5 text-[11px] text-gray-500">
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
            <div className="mt-4 rounded-xl bg-purple-50 p-3.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-600">Total Price</span>

                <span className="text-xl font-bold text-purple-600">
                  ₹{totalPrice}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
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
            <p className="text-xl font-bold text-purple-600">
              {salon.priceLabel || "Price unavailable"}
            </p>

            <p className="mt-1 text-sm text-gray-500">Starting price</p>

            <p className="mt-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-500">
              Please select at least one service to continue.
            </p>
          </>
        )}
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
        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2 text-base font-semibold transition ${
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
