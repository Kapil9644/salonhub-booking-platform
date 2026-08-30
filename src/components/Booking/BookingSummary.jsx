import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createBooking } from "../../services/bookingService";

export default function BookingSummary({
  salon,
  selectedServices = [],
  selectedDate,
  selectedTime,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const totalPrice = selectedServices.reduce(
    (total, service) => total + Number(service.price || 0),
    0,
  );

  const totalDuration = selectedServices.reduce(
    (total, service) => total + Number(service.duration || 0),
    0,
  );

  const handleConfirmBooking = async () => {
    if (!selectedServices.length) {
      alert("Please select at least one service.");
      return;
    }

    if (!user) {
      navigate("/login", {
        state: {
          from: {
            pathname: `/booking/${salon._id || salon.id}`,
          },
        },
      });

      return;
    }

    if (!selectedDate || !selectedTime) {
      alert("Please select date and time.");
      return;
    }

    try {
      const bookingData = {
        salon: {
          id: salon._id || salon.id,
          name: salon.name,
          location: salon.location,
        },

        services: selectedServices.map((service) => ({
          id: service._id || service.id,
          name: service.name,
          price: Number(service.price || 0),
          duration: Number(service.duration || 0),
        })),

        totalPrice,
        totalDuration,

        date: selectedDate,
        time: selectedTime,
      };

      const response = await createBooking(bookingData);

      const confirmedBooking = {
        ...(response.booking || bookingData),

        salon: {
          ...(response.booking?.salon || {}),
          ...bookingData.salon,
        },

        services: response.booking?.services || bookingData.services,

        totalPrice: response.booking?.totalPrice ?? bookingData.totalPrice,

        totalDuration:
          response.booking?.totalDuration ?? bookingData.totalDuration,
      };

      navigate("/booking-confirmation", {
        state: {
          booking: confirmedBooking,
        },
      });
    } catch (error) {
      console.error("Booking error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create booking. Please try again.",
      );
    }
  };

  return (
    <div className="sticky top-28 rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-slate-900">Booking Summary</h2>

      <div className="mt-6 space-y-5">
        {/* Salon */}
        <div className="flex items-start justify-between gap-4">
          <span className="text-gray-500">Salon</span>

          <span className="text-right font-medium">{salon.name}</span>
        </div>

        {/* Services */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Services</span>

            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
              {selectedServices.length}
            </span>
          </div>

          <div className="mt-3 space-y-3">
            {selectedServices.map((service) => (
              <div
                key={service._id || service.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {service.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {service.duration} min
                  </p>
                </div>

                <span className="shrink-0 font-medium text-purple-600">
                  ₹{service.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-500">Date</span>

          <span className="text-right font-medium">
            {selectedDate
              ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                  "en-IN",
                  {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  },
                )
              : "--"}
          </span>
        </div>

        {/* Time */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-500">Time</span>

          <span className="font-medium">{selectedTime || "--"}</span>
        </div>

        {/* Total Duration */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-500">Total Duration</span>

          <span className="font-medium">{totalDuration} min</span>
        </div>

        <hr />

        {/* Total */}
        <div className="flex items-center justify-between text-xl font-bold">
          <span>Total</span>

          <span className="text-purple-600">₹{totalPrice}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleConfirmBooking}
        disabled={!selectedServices.length || !selectedDate || !selectedTime}
        className={`mt-8 w-full rounded-full py-4 text-lg font-semibold transition ${
          selectedServices.length && selectedDate && selectedTime
            ? "bg-purple-600 text-white hover:bg-purple-700"
            : "cursor-not-allowed bg-gray-300 text-gray-500"
        }`}
      >
        Confirm Booking
      </button>
    </div>
  );
}
