import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createBooking } from "../../services/bookingService";

export default function BookingSummary({
  salon,
  selectedService,
  selectedDate,
  selectedTime,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleConfirmBooking = async () => {
    try {
      const bookingData = {
        salon: {
          id: salon.id,
          name: salon.name,
        },
        service: {
          id: selectedService.id,
          name: selectedService.name,
          price: selectedService.price,
          duration: selectedService.duration,
        },
        date: selectedDate,
        time: selectedTime,
      };

      await createBooking(bookingData);

      alert("Booking Confirmed 🎉");

      navigate("/");
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
        <div className="flex justify-between">
          <span className="text-gray-500">Salon</span>
          <span className="font-medium">{salon.name}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Service</span>
          <span className="font-medium">{selectedService.name}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Date</span>
          <span className="font-medium">
            {selectedDate
              ? selectedDate.toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "--"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Time</span>
          <span className="font-medium">{selectedTime || "--"}</span>
        </div>

        <hr />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>

          <span className="text-purple-600">₹{selectedService.price}</span>
        </div>
      </div>

      <button
        onClick={handleConfirmBooking}
        disabled={!selectedDate || !selectedTime}
        className={`mt-8 w-full rounded-full py-4 text-lg font-semibold transition ${
          selectedDate && selectedTime
            ? "bg-purple-600 text-white hover:bg-purple-700"
            : "cursor-not-allowed bg-gray-300 text-gray-500"
        }`}
      >
        Confirm Booking
      </button>
    </div>
  );
}
