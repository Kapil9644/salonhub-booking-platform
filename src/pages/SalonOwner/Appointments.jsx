import { useEffect, useState } from "react";
import AppointmentCard from "../../components/SalonOwner/AppointmentCard";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  User,
  XCircle,
} from "lucide-react";

import {
  getSalonOwnerAppointments,
  updateAppointmentStatus,
} from "../../services/salonOwnerBookingService";

export default function SalonOwnerAppointments() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const [activeSection, setActiveSection] = useState(null);

  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "Upcoming",
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed",
  );

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled",
  );

  const toggleSection = (section) => {
    setActiveSection((current) => (current === section ? null : section));
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSalonOwnerAppointments();

      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);

      setError(error.response?.data?.message || "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ========================================
  // UPDATE STATUS
  // ========================================
  const handleStatusUpdate = async (bookingId, status) => {
    const message =
      status === "Completed"
        ? "Mark this appointment as completed?"
        : "Cancel this appointment?";

    const confirmed = window.confirm(message);

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(bookingId);

      const data = await updateAppointmentStatus(bookingId, status);

      // Replace updated booking in state
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingId ? data.booking : booking,
        ),
      );
    } catch (error) {
      console.error("Update appointment error:", error);

      alert(error.response?.data?.message || "Failed to update appointment.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ========================================
  // LOADING
  // ========================================
  if (loading) {
    return (
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
          Rupiva for Business
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">Appointments</h1>

        <div className="mt-8 rounded-3xl border border-gray-200 bg-white py-16 text-center">
          <p className="text-gray-500">Loading appointments...</p>
        </div>
      </div>
    );
  }

  // ========================================
  // PAGE
  // ========================================
  return (
    <div>
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
          Rupiva for Business
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">Appointments</h1>

        <p className="mt-2 text-gray-500">
          Manage your salon appointments and customer bookings.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!error && bookings.length === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <CalendarDays size={40} className="mx-auto text-gray-400" />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            No appointments yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Customer bookings will appear here.
          </p>
        </div>
      )}

      {/* Appointment Sections */}

      {!error && bookings.length > 0 && (
        <div className="mt-8 space-y-4">
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
                    Upcoming Appointments
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

                <span className="text-gray-500">
                  {activeSection === "upcoming" ? "−" : "+"}
                </span>
              </div>
            </button>

            {activeSection === "upcoming" && (
              <div className="border-t border-gray-100 bg-gray-50/50 p-4 sm:p-6">
                {upcomingBookings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center">
                    <CalendarDays size={36} className="mx-auto text-gray-300" />

                    <h3 className="mt-4 font-semibold text-gray-700">
                      No upcoming appointments
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Upcoming customer bookings will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {upcomingBookings.map((booking) => {
                      const customer = booking.user;
                      const isUpdating = updatingId === booking._id;

                      return (
                        <AppointmentCard
                          key={booking._id}
                          booking={booking}
                          customer={customer}
                          isUpdating={isUpdating}
                          handleStatusUpdate={handleStatusUpdate}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Completed Bookings */}
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => toggleSection("completed")}
              className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-green-50/40 sm:p-6"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                  <CheckCircle2 size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    Completed Appointments
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    View your completed customer appointments.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                  {completedBookings.length}
                </span>

                <span className="text-gray-500">
                  {activeSection === "completed" ? "−" : "+"}
                </span>
              </div>
            </button>

            {activeSection === "completed" && (
              <div className="border-t border-gray-100 bg-gray-50/50 p-4 sm:p-6">
                {completedBookings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center">
                    <CheckCircle2 size={36} className="mx-auto text-gray-300" />

                    <h3 className="mt-4 font-semibold text-gray-700">
                      No completed appointments
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Completed appointments will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {completedBookings.map((booking) => {
                      const customer = booking.user;
                      const isUpdating = updatingId === booking._id;

                      return (
                        <AppointmentCard
                          key={booking._id}
                          booking={booking}
                          customer={customer}
                          isUpdating={isUpdating}
                          handleStatusUpdate={handleStatusUpdate}
                        />
                      );
                    })}
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
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                  <XCircle size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    Cancelled Appointments
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    View your cancelled customer appointments.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                  {cancelledBookings.length}
                </span>

                <span className="text-gray-500">
                  {activeSection === "cancelled" ? "−" : "+"}
                </span>
              </div>
            </button>

            {activeSection === "cancelled" && (
              <div className="border-t border-gray-100 bg-gray-50/50 p-4 sm:p-6">
                {cancelledBookings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center">
                    <XCircle size={36} className="mx-auto text-gray-300" />

                    <h3 className="mt-4 font-semibold text-gray-700">
                      No cancelled appointments
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Cancelled appointments will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {cancelledBookings.map((booking) => {
                      const customer = booking.user;
                      const isUpdating = updatingId === booking._id;

                      return (
                        <AppointmentCard
                          key={booking._id}
                          booking={booking}
                          customer={customer}
                          isUpdating={isUpdating}
                          handleStatusUpdate={handleStatusUpdate}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
