import { useEffect, useState } from "react";
import Container from "../../layouts/Container/Container";
import { getMyBookings, cancelBooking } from "../../services/bookingService";
import EditBookingModal from "../../components/Booking/EditBookingModal";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);

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

  const renderBookingCard = (booking) => (
    <div
      key={booking._id}
      className="rounded-3xl border border-gray-200 p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-slate-900">{booking.salon.name}</h2>

      <p className="mt-2 text-gray-600">{booking.service.name}</p>

      <p className="mt-2 text-gray-600">
        {booking.date
          ? new Date(booking.date).toLocaleDateString("en-IN")
          : "--"}{" "}
        • {booking.time}
      </p>

      <p className="mt-3 font-semibold text-purple-600">
        ₹{booking.service.price}
      </p>

      {booking.status === "Upcoming" ? (
        <>
          <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
            Upcoming
          </span>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => setEditingBooking(booking)}
              className="rounded-full border border-purple-600 px-5 py-2 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
            >
              Edit
            </button>

            <button
              onClick={() => handleCancelBooking(booking._id)}
              className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <span className="mt-3 inline-block rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
          Cancelled
        </span>
      )}
    </div>
  );

  return (
    <Container>
      <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>

      {loading ? (
        <div className="mt-8 py-16 text-center">
          <p className="text-gray-500">Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-gray-300 py-16 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No bookings yet
          </h2>

          <p className="mt-2 text-gray-500">
            Your upcoming appointments will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {upcomingBookings.length > 0 && (
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  Upcoming Appointments
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your upcoming salon appointments
                </p>
              </div>

              <div className="space-y-5">
                {upcomingBookings.map(renderBookingCard)}
              </div>
            </section>
          )}

          {cancelledBookings.length > 0 && (
            <section className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <div className="mb-6 border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  Cancelled Bookings
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your cancelled appointments
                </p>
              </div>

              <div className="space-y-5">
                {cancelledBookings.map(renderBookingCard)}
              </div>
            </section>
          )}
        </div>
      )}

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
