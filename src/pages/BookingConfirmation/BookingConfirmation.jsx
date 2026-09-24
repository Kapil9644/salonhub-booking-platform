import { CalendarCheck, Clock, Home, MapPin, Receipt } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "../../layouts/Container/Container";

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const booking = state?.booking;
  const location = useLocation();

  const paymentDetails = location.state?.paymentDetails;

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
            {/* Booking ID */}
            <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-purple-100 bg-purple-50 px-4 py-0">
              <span className="text-sm font-medium text-gray-500">
                Booking ID
              </span>

              <span className="font-bold tracking-wide text-purple-700">
                #{booking._id ? booking._id.slice(-6).toUpperCase() : "--"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {booking.salon?.name}
            </h2>

            {booking.salon?.location && (
              <div className="mt-2 flex items-start gap-2 text-sm text-gray-500">
                <MapPin size={16} className="mt-0.5 shrink-0" />

                <span>
                  {[
                    booking.salon.location.address,
                    booking.salon.location.area,
                    booking.salon.location.city,
                    booking.salon.location.state,
                    booking.salon.location.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Location not available"}
                </span>
              </div>
            )}

            <div className="mt-6 space-y-4">
              {/* Services */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Receipt size={18} className="text-purple-600" />
                  <span className="text-gray-500">Services</span>
                </div>

                <div className="text-right">
                  {booking.services?.length > 0 ? (
                    booking.services.map((service) => (
                      <div
                        key={service.id || service._id}
                        className="mb-2 last:mb-0"
                      >
                        <p className="font-semibold text-slate-900">
                          {service.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {service.duration} min · ₹{service.price}
                        </p>
                      </div>
                    ))
                  ) : (
                    <span className="font-semibold text-gray-500">
                      Service details unavailable
                    </span>
                  )}
                </div>
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
                    ₹{booking.totalPrice ?? 0}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Duration</span>

                  <span className="font-semibold text-slate-900">
                    {booking.totalDuration ?? 0} min
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="mt-5 border-t border-gray-200 pt-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Payment Details
                </h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    paymentDetails.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {paymentDetails.status === "PAID" ? "Paid" : "Unpaid"}
                </span>
              </div>

              <div className="space-y-2.5 rounded-xl bg-white">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-gray-500">Payment Method</span>

                  <span className="font-semibold text-slate-800">
                    {paymentDetails.method === "PAY_NOW"
                      ? "Pay Now"
                      : "Pay After Service"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-gray-500">
                    {paymentDetails.status === "PAID"
                      ? "Amount Paid"
                      : "Amount Due"}
                  </span>

                  <span className="font-bold text-purple-600">
                    ₹{paymentDetails.amount}
                  </span>
                </div>

                {paymentDetails.orderId && (
                  <div className="flex items-start justify-between gap-4 text-sm">
                    <span className="text-gray-500">Payment Order ID</span>

                    <span className="max-w-[60%] break-all text-right font-semibold text-slate-700">
                      {paymentDetails.orderId}
                    </span>
                  </div>
                )}

                {paymentDetails.transactionId && (
                  <div className="flex items-start justify-between gap-4 text-sm">
                    <span className="text-gray-500">Transaction ID</span>

                    <span className="max-w-[60%] break-all text-right font-semibold text-slate-700">
                      {paymentDetails.transactionId}
                    </span>
                  </div>
                )}

                {paymentDetails.paymentDate && (
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-gray-500">Payment Date & Time</span>

                    <span className="text-right font-semibold text-slate-700">
                      {new Date(paymentDetails.paymentDate).toLocaleString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        },
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

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
