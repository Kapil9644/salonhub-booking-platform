import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  Search,
  User,
  X,
  Eye,
  CreditCard,
  Scissors,
  CheckCircle2,
  RefreshCw,
  XCircle,
} from "lucide-react";

import {
  getAllBookings,
  updateAdminBookingStatus,
  markAdminBookingPaymentReceived,
} from "../../../services/adminBookingService";

const STATUS_TABS = [
  { label: "All", value: "All" },
  { label: "Upcoming", value: "Upcoming" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

const PAYMENT_STATUSES = [
  "All",
  "PENDING",
  "UNPAID",
  "PAID",
  "FAILED",
  "REFUNDED",
];

const getBookingDisplayId = (booking) =>
  `#${booking?._id?.slice(-6).toUpperCase() || "------"}`;

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Not available";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Not available";

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPaymentMethod = (method) => {
  if (method === "PAY_NOW") return "Pay Now";
  if (method === "PAY_AFTER_SERVICE") return "Pay After Service";
  return method || "Not available";
};

const formatPrice = (price) => `₹${Number(price || 0).toLocaleString("en-IN")}`;

const getStatusClasses = (status) => {
  if (status === "Upcoming") return "bg-blue-50 text-blue-700";
  if (status === "Completed") return "bg-green-50 text-green-700";
  if (status === "Cancelled") return "bg-red-50 text-red-700";
  return "bg-gray-100 text-gray-700";
};

const getPaymentClasses = (status) => {
  if (status === "PAID") return "bg-green-50 text-green-700";
  if (status === "FAILED") return "bg-red-50 text-red-700";
  if (status === "REFUNDED") return "bg-purple-50 text-purple-700";
  if (status === "PENDING") return "bg-yellow-50 text-yellow-700";
  if (status === "UNPAID") return "bg-orange-50 text-orange-700";
  return "bg-gray-100 text-gray-700";
};

const getCustomerName = (booking) =>
  booking?.user?.fullName || booking?.user?.name || "Unknown Customer";

const getSalonLocation = (salon) => {
  const location = salon?.location || {};
  return (
    [
      location.address,
      location.area,
      location.city,
      location.state,
      location.pincode,
    ]
      .filter(Boolean)
      .join(", ") || "Location unavailable"
  );
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(
        status,
      )}`}
    >
      {status || "Unknown"}
    </span>
  );
}

function PaymentBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getPaymentClasses(
        status,
      )}`}
    >
      {status || "Not available"}
    </span>
  );
}

function DetailItem({ label, value, icon }) {
  return (
    <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 break-words text-sm font-semibold text-slate-900">
        {value || "Not available"}
      </p>
    </div>
  );
}

function AppointmentDetailsModal({
  booking,
  isUpdating,
  onClose,
  onStatusUpdate,
  onPaymentReceived,
}) {
  if (!booking) return null;

  const customer = booking.user || {};
  const salon = booking.salon || {};
  const services = Array.isArray(booking.services) ? booking.services : [];
  const paymentStatus = String(booking.paymentStatus || "UNPAID").toUpperCase();

  const canRecordPayment =
    booking.status === "Completed" &&
    booking.paymentMethod === "PAY_AFTER_SERVICE" &&
    paymentStatus === "UNPAID";

  const salonLocation =
    [
      salon.location?.address,
      salon.location?.area,
      salon.location?.city,
      salon.location?.state,
      salon.location?.pincode,
    ]
      .filter(Boolean)
      .join(", ") || "Location unavailable";

  const dateLabel = (value, options) => {
    if (!value || Number.isNaN(new Date(value).getTime())) {
      return "Not available";
    }

    return new Date(value).toLocaleDateString(
      "en-IN",
      options || {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );
  };

  const dateTimeLabel = (value) => {
    if (!value || Number.isNaN(new Date(value).getTime())) {
      return "Not available";
    }

    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

  const Detail = ({ label, value, icon }) => (
    <div className="min-w-0 rounded-xl bg-gray-50 p-3 sm:p-4">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:text-xs">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 break-words text-sm font-semibold text-slate-900">
        {value || "Not available"}
      </p>
    </div>
  );

  const Pill = ({ children, className = "" }) => (
    <span
      className={`inline-flex max-w-full items-center rounded-full px-3 py-1 text-xs font-bold ${className}`}
    >
      {children}
    </span>
  );

  const statusClass =
    {
      Upcoming: "bg-blue-50 text-blue-700",
      Completed: "bg-green-50 text-green-700",
      Cancelled: "bg-red-50 text-red-700",
    }[booking.status] || "bg-gray-100 text-gray-700";

  const paymentClass =
    {
      PAID: "bg-green-50 text-green-700",
      FAILED: "bg-red-50 text-red-700",
      REFUNDED: "bg-purple-50 text-purple-700",
      PENDING: "bg-yellow-50 text-yellow-700",
      UNPAID: "bg-orange-50 text-orange-700",
    }[paymentStatus] || "bg-gray-100 text-gray-700";

  const orderId =
    booking.paymentOrderId || booking.cashfreeOrderId || booking.orderId;

  const transactionId =
    booking.cashfreePaymentId || booking.transactionId || booking.paymentId;

  const paymentDate =
    booking.cashfreePaymentDate ||
    booking.paymentDate ||
    booking.paidAt ||
    booking.paidOn;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isUpdating) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-appointment-title"
        className="flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 p-4 sm:p-6">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-purple-600">
              Appointment Details
            </p>
            <h2
              id="admin-appointment-title"
              className="mt-1 break-words text-lg font-bold text-slate-900 sm:text-xl"
            >
              {customer.fullName || customer.name || "Customer"}
            </h2>
            <p className="mt-1 font-mono text-xs text-purple-700">
              Booking ID {getBookingDisplayId(booking)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            aria-label="Close appointment details"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-wrap gap-2">
            <Pill className={statusClass}>{booking.status || "Unknown"}</Pill>
            <Pill className={paymentClass}>{paymentStatus}</Pill>
          </div>

          {/* Customer Details */}
          <section className="rounded-2xl border border-gray-100 p-4 sm:p-5">
            <h3 className="font-bold text-slate-900">Customer Details</h3>
            <div className="mt-4 flex min-w-0 items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-purple-100 text-purple-600">
                {customer.profileImage ? (
                  <img
                    src={customer.profileImage}
                    alt={customer.fullName || customer.name || "Customer"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={22} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="break-words font-bold text-slate-900">
                  {customer.fullName || customer.name || "Unknown Customer"}
                </p>
                <div className="mt-2 space-y-2 text-sm text-gray-600">
                  {customer.phone && (
                    <p className="flex items-start gap-2 break-all">
                      <Phone size={15} className="mt-0.5 shrink-0" />
                      {customer.phone}
                    </p>
                  )}
                  {customer.email && (
                    <p className="flex items-start gap-2 break-all">
                      <Mail size={15} className="mt-0.5 shrink-0" />
                      {customer.email}
                    </p>
                  )}
                  {!customer.phone && !customer.email && (
                    <p className="text-xs text-gray-500">
                      Contact details are not available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Salon Details */}
          <section className="rounded-2xl border border-gray-100 p-4 sm:p-5">
            <h3 className="font-bold text-slate-900">Salon Details</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Detail
                label="Salon"
                value={salon.name}
                icon={<Scissors size={14} />}
              />
              <Detail
                label="Location"
                value={salonLocation}
                icon={<MapPin size={14} />}
              />
            </div>
          </section>

          {/* Booking Information */}
          <section>
            <h3 className="mb-3 font-bold text-slate-900">
              Booking Information
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Detail
                label="Appointment Date"
                value={dateLabel(booking.date, {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                icon={<CalendarDays size={14} />}
              />
              <Detail
                label="Appointment Time"
                value={booking.time}
                icon={<Clock3 size={14} />}
              />
              <Detail
                label="Total Duration"
                value={
                  booking.totalDuration != null
                    ? `${booking.totalDuration} minutes`
                    : "Not available"
                }
                icon={<Clock3 size={14} />}
              />
              <Detail
                label="Payment Method"
                value={formatPaymentMethod(booking.paymentMethod)}
                icon={<CreditCard size={14} />}
              />
              <Detail
                label="Total Amount"
                value={money(booking.totalPrice)}
                icon={<IndianRupee size={14} />}
              />
              <Detail
                label="Booked On"
                value={dateTimeLabel(booking.createdAt)}
                icon={<CalendarDays size={14} />}
              />
            </div>
          </section>

          {/* Booked Services */}
          <section className="overflow-hidden rounded-2xl border border-gray-100">
            <h3 className="border-b border-gray-100 px-4 py-3 font-bold text-slate-900 sm:px-5">
              Booked Services ({services.length})
            </h3>

            {services.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {services.map((service, index) => (
                  <div
                    key={`${service.id || service._id || service.name}-${index}`}
                    className="flex items-start justify-between gap-3 px-4 py-3 sm:px-5"
                  >
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-slate-900">
                        {service.name || "Service"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {service.duration ?? 0} minutes
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-slate-900">
                      {money(service.price)}
                    </p>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-3 bg-gray-50 px-4 py-4 sm:px-5">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-bold text-purple-700">
                    {money(booking.totalPrice)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="p-5 text-sm text-gray-500">
                Service details are not available.
              </p>
            )}
          </section>

          {/* Payment Details */}
          <section className="rounded-2xl border border-gray-100 p-4 sm:p-5">
            <h3 className="font-bold text-slate-900">Payment Details</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Detail
                label="Payment Method"
                value={formatPaymentMethod(booking.paymentMethod)}
                icon={<CreditCard size={14} />}
              />
              <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Payment Status
                </p>
                <div className="mt-2">
                  <Pill className={paymentClass}>{paymentStatus}</Pill>
                </div>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Booking Status
                </p>
                <div className="mt-2">
                  <Pill className={statusClass}>{booking.status}</Pill>
                </div>
              </div>
              <Detail
                label="Booked On"
                value={dateTimeLabel(booking.createdAt)}
                icon={<CalendarDays size={14} />}
              />
            </div>
          </section>

          {/* Transaction Details */}
          <section className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
            <h3 className="font-bold text-slate-900">Transaction Details</h3>
            <div className="mt-4 space-y-4">
              {[
                ["Payment Order ID", orderId],
                ["Transaction ID", transactionId],
                [
                  "Payment Date",
                  paymentDate ? dateTimeLabel(paymentDate) : null,
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between"
                >
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="break-all text-sm font-semibold text-slate-800 sm:max-w-[65%] sm:text-right">
                    {value || "Not available"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {booking.status === "Cancelled" && booking.cancelledAt && (
            <section className="rounded-2xl bg-red-50 p-4">
              <p className="font-bold text-red-700">Cancellation Information</p>
              <p className="mt-1 text-sm text-red-600">
                Cancelled on {dateTimeLabel(booking.cancelledAt)}
              </p>
            </section>
          )}
        </div>

        {/* Fixed action footer */}
        <footer className="flex shrink-0 flex-col gap-2 border-t border-gray-100 bg-gray-50 p-4 sm:flex-row sm:flex-wrap sm:justify-end sm:p-5">
          {booking.status === "Upcoming" && (
            <>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onStatusUpdate(booking._id, "Completed")}
                className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle2 size={17} />
                {isUpdating ? "Updating..." : "Mark Completed"}
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onStatusUpdate(booking._id, "Cancelled")}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                <XCircle size={17} />
                Cancel Appointment
              </button>
            </>
          )}

          {canRecordPayment && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onPaymentReceived(booking._id)}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle2 size={17} />
              {isUpdating ? "Recording Payment..." : "Mark Payment Received"}
            </button>
          )}

          <button
            type="button"
            disabled={isUpdating}
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Close
          </button>
        </footer>
      </section>
    </div>
  );
}

export default function Appointments() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllBookings();
      setBookings(Array.isArray(response?.bookings) ? response.bookings : []);
    } catch (err) {
      console.error("Load admin bookings error:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to load appointments. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus =
        activeStatus === "All" || booking.status === activeStatus;

      const matchesPayment =
        paymentStatus === "All" || booking.paymentStatus === paymentStatus;

      const serviceNames = (booking.services || [])
        .map((service) => service.name || "")
        .join(" ");

      const searchableText = [
        booking._id,
        getBookingDisplayId(booking),
        getCustomerName(booking),
        booking.user?.email,
        booking.user?.phone,
        booking.salon?.name,
        getSalonLocation(booking.salon),
        serviceNames,
        booking.date,
        booking.time,
        booking.paymentMethod,
        booking.paymentStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        matchesPayment &&
        (!search || searchableText.includes(search))
      );
    });
  }, [bookings, activeStatus, paymentStatus, searchText]);

  const statusCounts = useMemo(
    () => ({
      All: bookings.length,
      Upcoming: bookings.filter((b) => b.status === "Upcoming").length,
      Completed: bookings.filter((b) => b.status === "Completed").length,
      Cancelled: bookings.filter((b) => b.status === "Cancelled").length,
    }),
    [bookings],
  );

  const handleStatusUpdate = async (bookingId, status) => {
    const message =
      status === "Completed"
        ? "Mark this appointment as completed?"
        : "Cancel this appointment?";

    if (!window.confirm(message)) return;

    try {
      setUpdatingId(bookingId);

      const response = await updateAdminBookingStatus(bookingId, status);

      const updatedBooking = {
        ...bookings.find((booking) => booking._id === bookingId),
        ...(response?.booking || {}),
        status,
      };

      setBookings((current) =>
        current.map((booking) =>
          booking._id === bookingId ? updatedBooking : booking,
        ),
      );

      setSelectedBooking((current) =>
        current?._id === bookingId
          ? { ...current, ...updatedBooking }
          : current,
      );
    } catch (err) {
      console.error("Admin appointment update error:", err);
      window.alert(
        err?.response?.data?.message ||
          "Failed to update appointment. Please try again.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentReceived = async (bookingId) => {
    if (
      !window.confirm(
        "Confirm that you have received the payment from the customer?",
      )
    ) {
      return;
    }

    try {
      setUpdatingId(bookingId);

      const response = await markAdminBookingPaymentReceived(bookingId);

      const updatedBooking = {
        ...bookings.find((booking) => booking._id === bookingId),
        ...(response?.booking || {}),
        paymentStatus: response?.booking?.paymentStatus || "PAID",
      };

      setBookings((current) =>
        current.map((booking) =>
          booking._id === bookingId ? updatedBooking : booking,
        ),
      );

      setSelectedBooking((current) =>
        current?._id === bookingId
          ? { ...current, ...updatedBooking }
          : current,
      );

      window.alert("Payment recorded successfully.");
    } catch (err) {
      console.error("Admin payment update error:", err);
      window.alert(
        err?.response?.data?.message ||
          "Failed to record payment. Please try again.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFilters = () => {
    setActiveStatus("All");
    setPaymentStatus("All");
    setSearchText("");
  };

  return (
    <div className="mx-auto w-full max-w-7xl min-w-0 space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-purple-600 sm:text-sm">
            Rupiva Administration
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            All Appointments
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Monitor bookings, customers, salons and payments across Rupiva.
          </p>
        </div>

        <button
          type="button"
          onClick={loadBookings}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            label: "Total Appointments",
            count: statusCounts.All,
            color: "purple",
          },
          { label: "Upcoming", count: statusCounts.Upcoming, color: "blue" },
          { label: "Completed", count: statusCounts.Completed, color: "green" },
          { label: "Cancelled", count: statusCounts.Cancelled, color: "red" },
        ].map(({ label, count, color }) => {
          const colors = {
            purple: "bg-purple-50 text-purple-600",
            blue: "bg-blue-50 text-blue-600",
            green: "bg-green-50 text-green-600",
            red: "bg-red-50 text-red-600",
          };

          return (
            <div
              key={label}
              className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                {label}
              </p>
              <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                {count}
              </p>
              <span
                className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${colors[color]}`}
              >
                Booking overview
              </span>
            </div>
          );
        })}
      </section>

      <section className="overflow-x-auto">
        <div className="flex min-w-max gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          {STATUS_TABS.map((tab) => {
            const isActive = activeStatus === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveStatus(tab.value)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {statusCounts[tab.value]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search booking, customer, salon, service..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
        </div>

        <select
          value={paymentStatus}
          onChange={(event) => setPaymentStatus(event.target.value)}
          aria-label="Filter by payment status"
          className="rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-medium text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 sm:w-56"
        >
          {PAYMENT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status === "All" ? "All Payment Status" : status}
            </option>
          ))}
        </select>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-bold text-slate-900">
            {filteredBookings.length}
          </span>{" "}
          of {bookings.length} appointments
        </p>

        {(searchText || paymentStatus !== "All" || activeStatus !== "All") && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-purple-600 hover:text-purple-800"
          >
            Clear filters
          </button>
        )}
      </div>

      {loading && (
        <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-purple-600" />
          <p className="mt-4 text-sm text-gray-500">Loading appointments...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">{error}</p>
          <button
            type="button"
            onClick={loadBookings}
            className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filteredBookings.length === 0 && (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <CalendarDays size={42} className="mx-auto text-gray-300" />
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            No appointments found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Try changing your search or filters.
          </p>
          {(searchText ||
            paymentStatus !== "All" ||
            activeStatus !== "All") && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {!loading && !error && filteredBookings.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px]">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    {[
                      "Booking ID",
                      "Customer",
                      "Salon",
                      "Date & Time",
                      "Services",
                      "Amount",
                      "Status",
                      "Payment",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="transition hover:bg-gray-50/70"
                    >
                      <td className="px-5 py-4">
                        <p className="font-mono text-xs font-bold text-purple-700">
                          {getBookingDisplayId(booking)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {getCustomerName(booking)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {booking.user?.phone || "No phone"}
                        </p>
                        <p className="mt-1 max-w-[190px] truncate text-xs text-gray-500">
                          {booking.user?.email || "No email"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {booking.salon?.name || "Unknown Salon"}
                        </p>
                        <p className="mt-1 max-w-[200px] text-xs leading-5 text-gray-500">
                          {getSalonLocation(booking.salon)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {formatDate(booking.date)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {booking.time || "Time unavailable"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="max-w-[210px] space-y-1">
                          {(booking.services || [])
                            .slice(0, 2)
                            .map((service, index) => (
                              <p
                                key={`${service.id || service.name}-${index}`}
                                className="truncate text-sm font-medium text-slate-700"
                              >
                                {service.name || "Service"}
                              </p>
                            ))}
                          {(booking.services || []).length > 2 && (
                            <p className="text-xs text-purple-600">
                              +{booking.services.length - 2} more services
                            </p>
                          )}
                          <p className="text-xs text-gray-400">
                            {booking.totalDuration != null
                              ? `${booking.totalDuration} min total`
                              : "Duration unavailable"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">
                          {formatPrice(booking.totalPrice)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatPaymentMethod(booking.paymentMethod)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={booking.status} />
                      </td>

                      <td className="px-5 py-4">
                        <PaymentBadge status={booking.paymentStatus} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(booking)}
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Responsive mobile and tablet cards */}
          <div className="grid min-w-0 grid-cols-1 gap-4 lg:hidden">
            {filteredBookings.map((booking) => (
              <article
                key={booking._id}
                className="min-w-0 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-4 sm:p-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <CalendarDays size={21} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-bold text-purple-700">
                        Booking ID {getBookingDisplayId(booking)}
                      </p>
                      <h3 className="mt-1 break-words font-bold text-slate-900">
                        {getCustomerName(booking)}
                      </h3>
                      <p className="mt-1 break-words text-sm text-gray-500">
                        {booking.salon?.name || "Unknown Salon"}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="space-y-4 p-4 sm:p-5">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <DetailItem
                      label="Customer Phone"
                      value={booking.user?.phone}
                      icon={<Phone size={14} />}
                    />
                    <DetailItem
                      label="Customer Email"
                      value={booking.user?.email}
                      icon={<Mail size={14} />}
                    />
                    <DetailItem
                      label="Date"
                      value={formatDate(booking.date)}
                      icon={<CalendarDays size={14} />}
                    />
                    <DetailItem
                      label="Time"
                      value={booking.time}
                      icon={<Clock3 size={14} />}
                    />
                  </div>

                  <div className="rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                        <MapPin size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Salon Location
                        </p>
                        <p className="mt-1 break-words text-sm font-medium leading-6 text-slate-800">
                          {getSalonLocation(booking.salon)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
                      <h4 className="font-bold text-slate-900">
                        Booked Services ({(booking.services || []).length})
                      </h4>
                      <Scissors size={17} className="text-purple-600" />
                    </div>

                    {(booking.services || []).length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {(booking.services || []).map((service, index) => (
                          <div
                            key={`${service.id || service._id || service.name}-${index}`}
                            className="flex items-start justify-between gap-3 px-4 py-3"
                          >
                            <div className="min-w-0">
                              <p className="break-words text-sm font-semibold text-slate-800">
                                {service.name || "Service"}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {service.duration != null
                                  ? `${service.duration} minutes`
                                  : "Duration unavailable"}
                              </p>
                            </div>
                            <p className="shrink-0 text-sm font-bold text-slate-900">
                              {formatPrice(service.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="p-4 text-sm text-gray-500">
                        No service details available.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-purple-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                        Total Amount
                      </p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        {formatPrice(booking.totalPrice)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {booking.totalDuration != null
                          ? `${booking.totalDuration} minutes`
                          : "Duration unavailable"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        <CreditCard size={14} />
                        Payment
                      </div>
                      <p className="mt-2 break-words text-sm font-semibold text-slate-900">
                        {formatPaymentMethod(booking.paymentMethod)}
                      </p>
                      <div className="mt-2">
                        <PaymentBadge status={booking.paymentStatus} />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedBooking(booking)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
                  >
                    <User size={17} />
                    View Complete Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {selectedBooking && (
        <AppointmentDetailsModal
          booking={selectedBooking}
          isUpdating={updatingId === selectedBooking._id}
          onClose={() => setSelectedBooking(null)}
          onStatusUpdate={handleStatusUpdate}
          onPaymentReceived={handlePaymentReceived}
        />
      )}
    </div>
  );
}
