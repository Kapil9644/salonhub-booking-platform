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

  const toggleSection = (section) => {
    setActiveSection((current) => (current === section ? null : section));
  };

  const renderBookingCard = (booking) => (
    <div
      key={booking._id}
      className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            {booking.salon.name}
          </h3>

          {booking.salon.location && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={16} className="shrink-0 text-purple-600" />

              <span>{booking.salon.location}</span>
            </div>
          )}
        </div>

        <span
          className={`w-fit rounded-full px-4 py-1.5 text-sm font-semibold ${
            booking.status === "Upcoming"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {booking.status}
        </span>
      </div>

      {/* Details */}
      <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
        {/* Service */}
        <div className="rounded-2xl bg-gray-50 p-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Scissors size={15} />

            <p className="text-xs font-medium uppercase tracking-wide">
              Service
            </p>
          </div>

          <p className="mt-2 font-semibold text-slate-900">
            {booking.service.name}
          </p>
        </div>

        {/* Price */}
        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Price
          </p>

          <p className="mt-2 text-xl font-bold text-purple-600">
            ₹{booking.service.price}
          </p>
        </div>

        {/* Date */}
        <div className="rounded-2xl bg-gray-50 p-4">
          <div className="flex items-center gap-2 text-gray-400">
            <CalendarDays size={15} />

            <p className="text-xs font-medium uppercase tracking-wide">Date</p>
          </div>

          <p className="mt-2 font-semibold text-slate-900">
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
        <div className="rounded-2xl bg-gray-50 p-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock size={15} />

            <p className="text-xs font-medium uppercase tracking-wide">Time</p>
          </div>

          <p className="mt-2 font-semibold text-slate-900">
            {booking.time || "--"}
          </p>
        </div>
      </div>

      {/* Actions */}
      {booking.status === "Upcoming" && (
        <div className="flex flex-col gap-3 border-t border-gray-100 p-5 sm:flex-row sm:justify-end sm:p-6">
          <button
            onClick={() => setEditingBooking(booking)}
            className="rounded-full border border-purple-600 px-6 py-2.5 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
          >
            Edit Booking
          </button>

          <button
            onClick={() => handleCancelBooking(booking._id)}
            className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );

  return (
    <Container>
      <div className="py-10 sm:py-14">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            My Bookings
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your salon appointments and booking history.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-gray-200 bg-white py-20 text-center shadow-sm">
            <p className="text-gray-500">Loading your bookings...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Upcoming Bookings */}
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => toggleSection("upcoming")}
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-purple-50/50 sm:p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
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
                    <div className="space-y-5">
                      {upcomingBookings.map(renderBookingCard)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cancelled Bookings */}
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => toggleSection("cancelled")}
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-red-50/40 sm:p-6"
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
                    <div className="space-y-5">
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
