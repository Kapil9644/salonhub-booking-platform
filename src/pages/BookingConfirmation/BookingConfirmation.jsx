import { CalendarCheck, Clock, Home, MapPin, Receipt } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../../layouts/Container/Container";

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const booking = state?.booking;

  if (!booking) {
    return (
      <Container>
        <div className="flex min-h-[70vh] items-center justify-center py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              Booking details not found
            </h1>

            <p className="mt-3 text-gray-500">
              Your booking may still be available in My Bookings.
            </p>

            <button
              type="button"
              onClick={() => navigate("/my-bookings")}
              className="mt-6 rounded-full bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              View My Bookings
            </button>
          </div>
        </div>
      </Container>
    );
  }

  const formattedDate = booking.date
    ? new Date(booking.date).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "--";

  return (
    <Container>
      <div className="flex min-h-[75vh] items-center justify-center py-16">
        <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-xl sm:p-10">
          {/* Success Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CalendarCheck
              size={42}
              strokeWidth={2.5}
              className="text-green-600"
            />
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Booking Confirmed! 🎉
          </h1>

          <p className="mt-3 text-gray-500">
            Your salon appointment has been successfully booked.
          </p>

          {/* Booking Details */}
          <div className="mt-8 rounded-2xl bg-gray-50 p-6 text-left">
            <h2 className="text-xl font-bold text-slate-900">
              {booking.salon?.name}
            </h2>

            {booking.salon?.location && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} />
                <span>{booking.salon.location}</span>
              </div>
            )}

            <div className="mt-6 space-y-4">
              {/* Service */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Receipt size={18} className="text-purple-600" />
                  <span className="text-gray-500">Service</span>
                </div>

                <span className="font-semibold text-slate-900">
                  {booking.service?.name}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CalendarCheck size={18} className="text-purple-600" />
                  <span className="text-gray-500">Date</span>
                </div>

                <span className="font-semibold text-slate-900">
                  {formattedDate}
                </span>
              </div>

              {/* Time */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-purple-600" />
                  <span className="text-gray-500">Time</span>
                </div>

                <span className="font-semibold text-slate-900">
                  {booking.time || "--"}
                </span>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-900">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-purple-600">
                    ₹{booking.service?.price}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/my-bookings")}
              className="flex-1 rounded-full bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              View My Bookings
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <span className="flex items-center justify-center gap-2">
                <Home size={18} />
                Back to Home
              </span>
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
