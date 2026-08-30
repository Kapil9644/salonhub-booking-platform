import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  User,
  XCircle,
} from "lucide-react";

export default function AppointmentCard({
  booking,
  customer,
  isUpdating,
  handleStatusUpdate,
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      {/* Top */}
      <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Booking ID #{booking._id.slice(-6).toUpperCase()}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={16} />

              {booking.date
                ? new Date(booking.date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "--"}
            </span>

            <span>•</span>

            <span className="flex items-center gap-1.5">
              <Clock3 size={16} />

              {booking.time || "--"}
            </span>
          </div>
        </div>

        {/* Status */}
        <span
          className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
            booking.status === "Upcoming"
              ? "bg-blue-100 text-blue-700"
              : booking.status === "Completed"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {booking.status}
        </span>
      </div>

      {/* Customer */}
      <div className="border-b border-gray-100 p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Customer
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-purple-100">
            {customer?.profileImage ? (
              <img
                src={customer.profileImage}
                alt={customer?.fullName || "Customer"}
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={25} className="text-purple-600" />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-slate-900">
              {customer?.fullName || "Customer"}
            </h3>

            <div className="mt-1 flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:gap-4">
              {customer?.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone size={14} />

                  {customer.phone}
                </span>
              )}

              {customer?.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={14} />

                  {customer.email}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Services</p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {booking.services?.length || 0}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Duration</p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {booking.totalDuration || 0} min
            </p>
          </div>

          <div className="rounded-2xl bg-purple-50 p-4">
            <p className="text-sm text-gray-500">Total</p>

            <p className="mt-1 text-lg font-bold text-purple-600">
              ₹{booking.totalPrice || 0}
            </p>
          </div>
        </div>

        {/* Services */}
        {booking.services?.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-500">
              Booked Services
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {booking.services.map((service) => (
                <div
                  key={service.id || service._id}
                  className="rounded-xl bg-purple-100 px-3 py-2"
                >
                  <p className="text-sm font-semibold text-purple-700">
                    {service.name}
                  </p>

                  <p className="mt-0.5 text-xs text-purple-600">
                    {service.duration} min
                    {" • "}₹{service.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {booking.status === "Upcoming" && (
          <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => handleStatusUpdate(booking._id, "Completed")}
              disabled={isUpdating}
              className="flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 size={18} />

              {isUpdating ? "Updating..." : "Mark Completed"}
            </button>

            <button
              type="button"
              onClick={() => handleStatusUpdate(booking._id, "Cancelled")}
              disabled={isUpdating}
              className="flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XCircle size={18} />

              {isUpdating ? "Updating..." : "Cancel Appointment"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
