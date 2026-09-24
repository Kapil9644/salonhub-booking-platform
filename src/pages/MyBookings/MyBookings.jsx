import { useEffect, useState } from "react";
import Container from "../../layouts/Container/Container";
import { getMyBookings, cancelBooking } from "../../services/bookingService";
import EditBookingModal from "../../components/Booking/EditBookingModal";
import {
  CalendarDays,
  ChevronDown,
  Clock,
  MapPin,
  Scissors,
  XCircle,
} from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);

  // Controls which section is open
  const [activeSection, setActiveSection] = useState(null);

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) return;

    try {
      await cancelBooking(bookingId);

      const data = await getMyBookings();
      setBookings(data.bookings || []);

      alert("Booking cancelled successfully.");
    } catch (error) {
      console.error("Cancel booking error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to cancel booking. Please try again.",
      );
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        const data = await getMyBookings();

        setBookings(data.bookings || []);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "Upcoming",
  );

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled",
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed",
  );

  const toggleSection = (section) => {
    setActiveSection((current) => (current === section ? null : section));
  };

  const renderBookingCard = (booking) => (
    <div
      key={booking._id}
      className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-gray-100 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-2 sm:p-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 text-14px font-bold leading-tight text-slate-900 sm:text-base">
              {booking.salon?.name || "Salon"}
            </h3>

            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-xs ${
                booking.status === "Upcoming"
                  ? "bg-green-100 text-green-700"
                  : booking.status === "Completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {booking.status}
            </span>
          </div>

          <p className="mt-0.5 text-[12px] font-semibold text-purple-600 sm:text-xs">
            Booking ID #{booking._id?.slice(-6).toUpperCase()}
          </p>
          {booking.salon?.location && (
            <div className="mt-1.5 flex items-start gap-1.5 text-xs leading-4.5 text-gray-500 sm:text-sm">
              <MapPin size={16} className="mt-0.5 shrink-0 text-purple-600" />

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
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-1.5 p-3 sm:gap-2 sm:p-3.5">
        {/* Services */}
        <div className="col-span-2 rounded-xl bg-gray-50 p-3 sm:p-3.5">
          <div className="flex items-center gap-2 text-gray-400">
            <Scissors size={15} />

            <p className="text-[11px] font-semibold uppercase tracking-wide">
              Services
            </p>
          </div>

          <div className="mt-2 space-y-1.5">
            {booking.services?.length > 0 ? (
              booking.services.map((service) => (
                <div
                  key={service.id || service._id}
                  className="flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {service.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {service.duration} min
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-bold text-purple-600">
                    ₹{service.price}
                  </p>
                </div>
              ))
            ) : (
              <p className="font-semibold text-gray-500">
                No service details available
              </p>
            )}
          </div>
        </div>

        {/* Total Price */}
        <div className="rounded-xl bg-gray-50 p-2.5 sm:p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Total Price
          </p>

          <p className="mt-1 text-sm font-extrabold text-purple-600 sm:text-sm">
            ₹{booking.totalPrice ?? 0}
          </p>
        </div>

        {/* Total Duration */}
        <div className="rounded-xl bg-gray-50 p-2.5 sm:p-3">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock size={15} />

            <p className="text-[11px] font-medium uppercase tracking-wide">
              Total Duration
            </p>
          </div>

          <p className="mt-1.5 text-sm font-semibold text-slate-900 sm:text-base">
            {booking.totalDuration ?? 0} min
          </p>
        </div>

        {/* Date */}
        <div className="rounded-xl bg-gray-50 p-2.5 sm:p-3">
          <div className="flex items-center gap-2 text-gray-400">
            <CalendarDays size={15} />

            <p className="text-[11px] font-medium uppercase tracking-wide">
              Date
            </p>
          </div>

          <p className="mt-1.5 text-sm font-semibold text-slate-900 sm:text-base">
            {booking.date
              ? new Date(booking.date).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "--"}
          </p>
        </div>

        {/* Time */}
        <div className="rounded-xl bg-gray-50 p-2.5 sm:p-3">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock size={15} />

            <p className="text-[11px] font-medium uppercase tracking-wide">
              Time
            </p>
          </div>

          <p className="mt-1.5 text-sm font-semibold text-slate-900 sm:text-base">
            {booking.time || "--"}
          </p>
        </div>

        <div className="col-span-2 mt-2.5 grid grid-cols-1 gap-y-2.5 border-t border-gray-100 pt-3.5 sm:mt-3 sm:pt-4 sm:text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className=" text-[13px] shrink-0 whitespace-nowrap text-gray-500">
              Booked On
            </span>

            <span className="min-w-0 whitespace-nowrap text-right text-[12px] font-semibold leading-4 text-slate-700 sm:text-sm">
              {booking.createdAt
                ? new Date(booking.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "—"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className=" text-[13px] shrink-0 whitespace-nowrap text-gray-500">
              Payment Method
            </span>

            <span className="whitespace-nowrap text-right text-[12px] font-semibold text-slate-700 sm:text-sm">
              {booking.paymentMethod === "PAY_NOW"
                ? "Pay Now"
                : "Pay After Service"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className=" text-[13px] shrink-0 whitespace-nowrap text-gray-500">
              Payment Status
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                booking.paymentStatus === "PAID"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {booking.paymentStatus === "PAID" ? "Paid" : "Unpaid"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className=" text-[13px] shrink-0 whitespace-nowrap text-gray-500">
              Amount
            </span>

            <span className="whitespace-nowrap text-right text-[12px] font-bold text-purple-600 sm:text-sm">
              ₹{booking.totalPrice}
            </span>
          </div>

          {booking.cashfreeOrderId && (
            <div className="flex items-start justify-between gap-3">
              <span className=" text-[13px] shrink-0 whitespace-nowrap text-gray-500">
                Payment Order ID
              </span>
              <span className="min-w-0 whitespace-nowrap text-right text-[12px] font-semibold leading-4 tracking-tight text-slate-700 sm:text-sm">
                {booking.paymentOrderId}
              </span>
            </div>
          )}

          {booking.cashfreePaymentId && (
            <div className="flex items-start justify-between gap-3">
              <span className=" text-[13px] shrink-0 whitespace-nowrap text-gray-500">
                Transaction ID
              </span>
              <span className="min-w-0 whitespace-nowrap text-right text-[12px] font-semibold leading-4 tracking-tight text-slate-700 sm:text-sm">
                {booking.cashfreePaymentId}
              </span>
            </div>
          )}
          {booking.cashfreePaymentDate && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] text-gray-500">
                Payment Date & Time
              </span>
              <span className="min-w-0 whitespace-nowrap text-right text-[12px] font-semibold leading-4 text-slate-700 sm:text-sm">
                {new Date(booking.cashfreePaymentDate).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {booking.status === "Upcoming" && (
        <div className="grid grid-cols-1 gap-2.5 border-t border-gray-100 p-3.5 sm:flex sm:justify-end sm:gap-3 sm:p-4.5">
          <button
            onClick={() => setEditingBooking(booking)}
            className="w-full rounded-full border border-purple-600 px-5 py-2.5 text-sm font-semibold text-purple-600 transition hover:bg-purple-50 sm:w-auto"
          >
            Edit Booking
          </button>

          <button
            onClick={() => handleCancelBooking(booking._id)}
            className="w-full rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 sm:w-auto"
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );

  return (
    <Container>
      <div className="py-5 sm:py-7 lg:py-8">
        {/* Page Header */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            My Bookings
          </h1>

          <p className="mt-1 text-md text-gray-500">
            Manage your salon appointments and booking history.
          </p>
        </div>
        {loading ? (
          <div className="rounded-3xl border border-gray-200 bg-white py-20 text-center shadow-sm">
            <p className="text-gray-500">Loading your bookings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:items-stretch">
            {/* Upcoming Bookings */}
            <div className="min-w-0 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => toggleSection("upcoming")}
                className="flex w-full items-center justify-between gap-3 p-3.5 text-left transition hover:bg-purple-50/50 sm:p-4.5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 sm:h-11 sm:w-11">
                    <CalendarDays size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                      Upcoming Bookings
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      View and manage your upcoming appointments.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-bold text-purple-700">
                    {upcomingBookings.length}
                  </span>

                  <ChevronDown
                    size={22}
                    className={`text-gray-500 transition-transform duration-300 ${
                      activeSection === "upcoming" ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {activeSection === "upcoming" && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-4 sm:p-6">
                  {upcomingBookings.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center">
                      <CalendarDays
                        size={36}
                        className="mx-auto text-gray-300"
                      />

                      <h3 className="mt-4 font-semibold text-gray-700">
                        No upcoming bookings
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Your upcoming appointments will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingBookings.map(renderBookingCard)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Completed Bookings */}
            <div className="min-w-0 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => toggleSection("completed")}
                className="flex w-full items-center justify-between gap-4 p-3.5 text-left transition hover:bg-green-50/40 sm:p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                    <CalendarDays size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                      Completed Bookings
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      View your completed appointments.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                    {completedBookings.length}
                  </span>

                  <ChevronDown
                    size={22}
                    className={`text-gray-500 transition-transform duration-300 ${
                      activeSection === "completed" ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {activeSection === "completed" && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-4 sm:p-6">
                  {completedBookings.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center">
                      <CalendarDays
                        size={36}
                        className="mx-auto text-gray-300"
                      />

                      <h3 className="mt-4 font-semibold text-gray-700">
                        No completed bookings
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Completed appointments will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {completedBookings.map(renderBookingCard)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cancelled Bookings */}
            <div className="min-w-0 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => toggleSection("cancelled")}
                className="flex w-full items-center justify-between gap-4 p-3.5 text-left transition hover:bg-red-50/40 sm:p-4.5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-500">
                    <XCircle size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                      Cancelled Bookings
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      View your cancelled appointments.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-600">
                    {cancelledBookings.length}
                  </span>

                  <ChevronDown
                    size={22}
                    className={`text-gray-500 transition-transform duration-300 ${
                      activeSection === "cancelled" ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {activeSection === "cancelled" && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-4 sm:p-6">
                  {cancelledBookings.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center">
                      <XCircle size={36} className="mx-auto text-gray-300" />

                      <h3 className="mt-4 font-semibold text-gray-700">
                        No cancelled bookings
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Cancelled appointments will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cancelledBookings.map(renderBookingCard)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Booking Modal */}
      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onUpdated={(updatedBooking) => {
            setBookings((currentBookings) =>
              currentBookings.map((booking) =>
                booking._id === updatedBooking._id ? updatedBooking : booking,
              ),
            );
          }}
        />
      )}
    </Container>
  );
}
