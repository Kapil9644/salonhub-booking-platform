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

  const handleBooking = () => {
    if (!hasSelectedServices) return;

    navigate(`/booking/${salonId}`, {
      state: {
        salon,
        selectedServices,
        totalPrice,
        totalDuration,
      },
    });
  };

  return (
    <>
      {/* Desktop Booking Card */}
      <div className="hidden sticky top-28 rounded-2xl border border-gray-200 bg-white p-4 shadow-md lg:block sm:rounded-3xl sm:p-5">
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

        {/* Desktop CTA */}
        <button
          type="button"
          disabled={!hasSelectedServices}
          onClick={handleBooking}
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

      {/* Mobile + Tablet Sticky Booking Bar */}
      <div className="lg:hidden">
        {/* Spacer so the fixed bar does not cover the last content */}
        <div className="h-20" />

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_25px_rgba(15,23,42,0.12)] backdrop-blur-md sm:px-5 sm:pb-[calc(0.875rem+env(safe-area-inset-bottom))] sm:pt-3.5">
          <div className="mx-auto flex w-full max-w-4xl items-center gap-3">
            <div className="min-w-0 flex-1">
              {hasSelectedServices ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-purple-600 sm:text-xl">
                      ₹{totalPrice}
                    </span>

                    <span className="text-xs font-medium text-gray-500 sm:text-sm">
                      • {totalDuration} min
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const servicesSection =
                        document.getElementById("salon-services");

                      if (servicesSection) {
                        servicesSection.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    className="mt-0.5 truncate text-left text-xs font-semibold text-purple-600 transition hover:text-purple-700"
                  >
                    {selectedServices.length}{" "}
                    {selectedServices.length === 1 ? "Service" : "Services"}{" "}
                    Selected
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold text-gray-500">
                    Starting price
                  </p>

                  <p className="text-sm font-bold text-purple-600 sm:text-base">
                    {salon.priceLabel || "Price unavailable"}
                  </p>
                </>
              )}
            </div>

            <button
              type="button"
              disabled={!hasSelectedServices}
              onClick={handleBooking}
              className={`flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition sm:min-h-12 sm:px-7 sm:text-base ${
                hasSelectedServices
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "cursor-not-allowed bg-gray-300 text-gray-500"
              }`}
            >
              <Calendar size={18} />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
