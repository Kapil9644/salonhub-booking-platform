import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  IndianRupee,
  MapPin,
  Search,
  Scissors,
  Eye,
  X,
  User,
  Phone,
  Mail,
  CreditCard,
  CheckCircle2,
  XCircle,
  RefreshCw,
  CalendarClock,
  CalendarRange,
  AlertTriangle,
} from "lucide-react";

import {
  getSalonOwnerAppointments,
  updateAppointmentStatus,
  markBookingPaymentReceived,
} from "../../services/salonOwnerBookingService";

const TABS = [
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

const getId = (booking) => String(booking?._id || "");

const displayId = (booking) =>
  `#${getId(booking).slice(-6).toUpperCase() || "------"}`;

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

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

// Date-only booking values are handled as local calendar dates to avoid UTC shifts.
const getLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getBookingDateKey = (value) => {
  if (!value) return "";
  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return getLocalDateKey(date);
};

const shiftDateKey = (dateKey, days) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return getLocalDateKey(date);
};

// This is a display-only indicator. It does not mutate the saved booking status.
const isPastDueAppointment = (booking, now = new Date()) => {
  if (booking?.status !== "Upcoming") return false;

  const dateKey = getBookingDateKey(booking.date);
  if (!dateKey) return false;

  const todayKey = getLocalDateKey(now);
  if (dateKey < todayKey) return true;
  if (dateKey > todayKey) return false;

  const match = String(booking.time || "")
    .trim()
    .match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (!match) return false;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();

  if (minutes > 59 || hours > (meridiem ? 12 : 23)) return false;
  if (meridiem && (hours < 1 || hours > 12)) return false;
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  const appointmentTime = new Date(now);
  appointmentTime.setHours(hours, minutes, 0, 0);
  return appointmentTime.getTime() < now.getTime();
};

const paymentMethodLabel = (method) => {
  if (method === "PAY_NOW") return "Pay Now";
  if (method === "PAY_AFTER_SERVICE") return "Pay After Service";
  return method || "Not available";
};

const getCustomer = (booking) => booking?.user || booking?.customer || {};

const getCustomerName = (booking) => {
  const customer = getCustomer(booking);

  return customer.fullName || customer.name || customer.username || "Customer";
};

const getPaymentStatus = (booking) =>
  String(booking?.paymentStatus || "UNPAID").toUpperCase();

const statusClass = (status) => {
  if (status === "Upcoming") return "bg-blue-50 text-blue-700";
  if (status === "Completed") return "bg-green-50 text-green-700";
  if (status === "Cancelled") return "bg-red-50 text-red-700";
  return "bg-gray-100 text-gray-700";
};

const paymentClass = (status) => {
  if (status === "PAID") return "bg-green-50 text-green-700";
  if (status === "FAILED") return "bg-red-50 text-red-700";
  if (status === "REFUNDED") return "bg-purple-50 text-purple-700";
  if (status === "PENDING") return "bg-yellow-50 text-yellow-700";
  return "bg-gray-100 text-gray-700";
};

function Pill({ children, className = "" }) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full px-3 py-1 text-xs font-bold ${className}`}
    >
      {children}
    </span>
  );
}

function Detail({ label, value, icon }) {
  return (
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
}

function locationText(salon) {
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
}

function CustomerDetails({ booking }) {
  const customer = getCustomer(booking);

  return (
    <section className="rounded-2xl border border-gray-100 p-4 sm:p-5">
      <h3 className="font-bold text-slate-900">Customer Details</h3>

      <div className="mt-4 flex min-w-0 items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-purple-100 text-purple-600">
          {customer.profileImage ? (
            <img
              src={customer.profileImage}
              alt={getCustomerName(booking)}
              className="h-full w-full object-cover"
            />
          ) : (
            <User size={22} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="break-words font-bold text-slate-900">
            {getCustomerName(booking)}
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
                Contact details are not available in this appointment response.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function BookingDetailsModal({
  booking,
  isUpdating,
  onClose,
  onStatusUpdate,
  onPaymentReceived,
}) {
  if (!booking) return null;

  const bookingId = getId(booking);
  const services = booking.services || [];
  const paymentStatus = getPaymentStatus(booking);
  const isPayAfterService = booking.paymentMethod === "PAY_AFTER_SERVICE";
  const canRecordPayment =
    booking.status === "Completed" &&
    isPayAfterService &&
    paymentStatus === "UNPAID";

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
        aria-labelledby="owner-booking-details-title"
        className="flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 p-4 sm:p-6">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-purple-600">
              Appointment Details
            </p>

            <h2
              id="owner-booking-details-title"
              className="mt-1 break-words text-lg font-bold text-slate-900 sm:text-xl"
            >
              {booking.salon?.name || booking.salonName || "Appointment"}
            </h2>

            <p className="mt-1 font-mono text-xs text-purple-700">
              Booking ID {displayId(booking)}
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
            <Pill className={statusClass(booking.status)}>
              {booking.status || "Unknown"}
            </Pill>

            <Pill className={paymentClass(paymentStatus)}>{paymentStatus}</Pill>
          </div>

          <CustomerDetails booking={booking} />

          <section className="rounded-2xl border border-gray-100 p-4 sm:p-5">
            <h3 className="font-bold text-slate-900">Salon Details</h3>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Detail
                label="Salon"
                value={booking.salon?.name || booking.salonName}
                icon={<Scissors size={14} />}
              />

              <Detail
                label="Location"
                value={locationText(booking.salon)}
                icon={<MapPin size={14} />}
              />
            </div>
          </section>

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
                value={`${booking.totalDuration ?? 0} minutes`}
                icon={<Clock3 size={14} />}
              />

              <Detail
                label="Payment Method"
                value={paymentMethodLabel(booking.paymentMethod)}
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

          <section className="overflow-hidden rounded-2xl border border-gray-100">
            <h3 className="border-b border-gray-100 px-4 py-3 font-bold text-slate-900 sm:px-5">
              Booked Services ({services.length})
            </h3>

            {services.length ? (
              <div className="divide-y divide-gray-100">
                {services.map((service, index) => (
                  <div
                    key={
                      service.id ||
                      service._id ||
                      `${service.name || "service"}-${index}`
                    }
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

          {(booking.paymentOrderId ||
            booking.cashfreeOrderId ||
            booking.cashfreePaymentId ||
            booking.cashfreePaymentDate) && (
            <section className="rounded-2xl border border-gray-100 p-4">
              <h3 className="font-bold text-slate-900">Payment Details</h3>

              <div className="mt-3 space-y-3 text-sm">
                {(booking.paymentOrderId || booking.cashfreeOrderId) && (
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="text-gray-500">Payment Order ID</span>
                    <span className="break-all text-right font-medium text-slate-800">
                      {booking.paymentOrderId || booking.cashfreeOrderId}
                    </span>
                  </div>
                )}

                {booking.cashfreePaymentId && (
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="text-gray-500">Transaction ID</span>
                    <span className="break-all text-right font-medium text-slate-800">
                      {booking.cashfreePaymentId}
                    </span>
                  </div>
                )}

                {booking.cashfreePaymentDate && (
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="text-gray-500">Payment Date</span>
                    <span className="text-right font-medium text-slate-800">
                      {dateTimeLabel(booking.cashfreePaymentDate)}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {booking.status === "Cancelled" && booking.cancelledAt && (
            <div className="rounded-2xl bg-red-50 p-4">
              <p className="font-bold text-red-700">Cancelled On</p>
              <p className="mt-1 text-sm text-red-600">
                {dateTimeLabel(booking.cancelledAt)}
              </p>
            </div>
          )}
        </div>

        <footer className="flex shrink-0 flex-col gap-2 border-t border-gray-100 bg-gray-50 p-4 sm:flex-row sm:flex-wrap sm:justify-end sm:p-5">
          {booking.status === "Upcoming" && (
            <>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onStatusUpdate(bookingId, "Completed")}
                className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 size={17} />
                Mark Completed
              </button>

              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onStatusUpdate(bookingId, "Cancelled")}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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
              onClick={() => onPaymentReceived(bookingId)}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 size={17} />
              Mark Payment Received
            </button>
          )}

          <button
            type="button"
            disabled={isUpdating}
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
          >
            Close
          </button>
        </footer>
      </section>
    </div>
  );
}

export default function SalonOwnerAppointments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedBookingId = searchParams.get("booking");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSalonOwnerAppointments();
      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to load appointments. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    if (!requestedBookingId || loading || bookings.length === 0) {
      return;
    }

    const matchingBooking = bookings.find(
      (booking) => getId(booking) === requestedBookingId,
    );

    if (matchingBooking) {
      // Remove filters so the requested appointment is not hidden.
      setActiveTab("All");
      setPaymentFilter("All");
      setDateFilter("all");
      setCustomStartDate("");
      setCustomEndDate("");
      setSearchText("");

      // Open the exact appointment's details modal.
      setSelectedBookingId(getId(matchingBooking));

      // Remove the query parameter without navigating away.
      setSearchParams({}, { replace: true });
    } else {
      console.warn("Requested appointment was not found:", requestedBookingId);
    }
  }, [requestedBookingId, loading, bookings, setSearchParams]);

  const counts = useMemo(
    () => ({
      All: bookings.length,
      Upcoming: bookings.filter((b) => b.status === "Upcoming").length,
      Completed: bookings.filter((b) => b.status === "Completed").length,
      Cancelled: bookings.filter((b) => b.status === "Cancelled").length,
    }),
    [bookings],
  );

  const filteredBookings = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return bookings.filter((booking) => {
      if (activeTab !== "All" && booking.status !== activeTab) {
        return false;
      }

      if (
        paymentFilter !== "All" &&
        getPaymentStatus(booking) !== paymentFilter
      ) {
        return false;
      }

      const bookingDate = getBookingDateKey(booking.date);
      if (!bookingDate) return false;

      const today = getLocalDateKey();
      if (dateFilter === "today" && bookingDate !== today) return false;

      // Includes today and the following three calendar days.
      if (
        dateFilter === "next3" &&
        (bookingDate < today || bookingDate > shiftDateKey(today, 3))
      ) {
        return false;
      }

      // The previous three calendar days exclude today.
      if (
        dateFilter === "previous3" &&
        (bookingDate < shiftDateKey(today, -3) || bookingDate >= today)
      ) {
        return false;
      }

      if (
        dateFilter === "custom" &&
        ((customStartDate && bookingDate < customStartDate) ||
          (customEndDate && bookingDate > customEndDate))
      ) {
        return false;
      }

      if (!query) return true;

      const customer = getCustomer(booking);
      const serviceNames = (booking.services || [])
        .map((service) => service.name || "")
        .join(" ");

      const searchableText = [
        getId(booking),
        displayId(booking),
        booking.bookingId,
        getCustomerName(booking),
        customer.phone,
        customer.email,
        booking.salon?.name,
        booking.salonName,
        locationText(booking.salon),
        serviceNames,
        booking.date,
        booking.time,
        booking.paymentMethod,
        booking.paymentStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [
    bookings,
    activeTab,
    paymentFilter,
    searchText,
    dateFilter,
    customStartDate,
    customEndDate,
  ]);

  const selectedBooking = useMemo(
    () =>
      bookings.find((booking) => getId(booking) === selectedBookingId) || null,
    [bookings, selectedBookingId],
  );

  const handleStatusUpdate = async (bookingId, status) => {
    const message =
      status === "Completed"
        ? "Mark this appointment as completed?"
        : "Cancel this appointment?";

    if (!window.confirm(message)) return;

    try {
      setUpdatingId(bookingId);

      const response = await updateAppointmentStatus(bookingId, status);

      setBookings((current) =>
        current.map((booking) => {
          if (getId(booking) !== bookingId) return booking;

          return {
            ...booking,
            ...(response?.booking || {}),
            status,
          };
        }),
      );
    } catch (err) {
      console.error("Update appointment error:", err);
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

      const response = await markBookingPaymentReceived(bookingId);

      setBookings((current) =>
        current.map((booking) => {
          if (getId(booking) !== bookingId) return booking;

          return {
            ...booking,
            ...(response?.booking || {}),
            paymentStatus: response?.booking?.paymentStatus || "PAID",
          };
        }),
      );

      window.alert("Payment recorded successfully.");
    } catch (err) {
      console.error("Record payment error:", err);
      window.alert(
        err?.response?.data?.message ||
          "Failed to record payment. Please try again.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFilters = () => {
    setActiveTab("All");
    setPaymentFilter("All");
    setDateFilter("all");
    setCustomStartDate("");
    setCustomEndDate("");
    setSearchText("");
  };

  const renderMobileCard = (booking) => (
    <article
      key={getId(booking)}
      className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Compact summary: always visible */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs font-bold text-purple-700">
              Booking ID {displayId(booking)}
            </p>

            <h3 className="mt-1 break-words font-bold text-slate-900">
              {getCustomerName(booking)}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {booking.salon?.name || booking.salonName || "Salon"}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1">
            <Pill className={statusClass(booking.status)}>
              {booking.status}
            </Pill>

            {isPastDueAppointment(booking) && (
              <Pill className="bg-amber-50 text-amber-700">Past Due</Pill>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-gray-500">{dateLabel(booking.date)}</span>
          <span className="font-bold text-slate-900">
            {money(booking.totalPrice)}
          </span>
        </div>

        {/* Click to open full details */}
        <button
          type="button"
          onClick={() => setSelectedBookingId(getId(booking))}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Eye size={16} />
          View Details
        </button>
      </div>
    </article>
  );

  if (loading) {
    return (
      <div className="w-full min-w-0">
        <p className="text-xs font-bold uppercase tracking-widest text-purple-600 sm:text-sm">
          Rupiva for Business
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Appointments
        </h1>

        <div className="mt-6 flex min-h-56 items-center justify-center rounded-2xl border border-gray-200 bg-white">
          <div className="text-center">
            <RefreshCw
              className="mx-auto animate-spin text-purple-600"
              size={30}
            />
            <p className="mt-3 text-sm text-gray-500">
              Loading appointments...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-purple-600 sm:text-sm">
            Rupiva for Business
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Appointments
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Manage customer bookings, services and payments.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAppointments}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-gray-50 sm:w-auto"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </header>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            label: "Total Appointments",
            count: counts.All,
            icon: CalendarDays,
            color: "bg-purple-50 text-purple-600",
          },
          {
            label: "Upcoming",
            count: counts.Upcoming,
            icon: Clock3,
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Completed",
            count: counts.Completed,
            icon: CheckCircle2,
            color: "bg-green-50 text-green-600",
          },
          {
            label: "Cancelled",
            count: counts.Cancelled,
            icon: XCircle,
            color: "bg-red-50 text-red-600",
          },
        ].map(({ label, count, icon: Icon, color }) => (
          <div
            key={label}
            className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}
              >
                <Icon size={20} />
              </span>
              <span className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {count}
              </span>
            </div>
            <p className="mt-3 text-xs font-medium text-gray-500 sm:text-sm">
              {label}
            </p>
          </div>
        ))}
      </section>

      <section className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
        <div
          className="flex min-w-max gap-2"
          role="tablist"
          aria-label="Appointment status"
        >
          {TABS.map((tab) => {
            const selected = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab.value)}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${
                  selected
                    ? "bg-purple-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    selected
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {counts[tab.value]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-xs text-amber-800 sm:text-sm">
        <AlertTriangle size={17} className="mt-0.5 shrink-0" />
        <p>
          <strong>Past Due</strong> means the scheduled date/time has passed
          while the saved status is still Upcoming. This is only a warning; it
          does not automatically mark the booking as Completed or change its
          database status.
        </p>
      </div>

      <section className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4 lg:flex-row">
        <label className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search booking ID, customer, phone, salon or service..."
            aria-label="Search appointments"
            className="w-full min-w-0 rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
        </label>

        <select
          value={paymentFilter}
          onChange={(event) => setPaymentFilter(event.target.value)}
          aria-label="Filter by payment status"
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 lg:w-56"
        >
          <option value="All">All Payment Status</option>
          {PAYMENT_STATUSES.filter((status) => status !== "All").map(
            (status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ),
          )}
        </select>

        <label className="flex min-w-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 lg:w-56">
          <CalendarRange size={17} className="shrink-0 text-purple-600" />
          <select
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            aria-label="Filter appointments by date"
            className="min-w-0 flex-1 bg-transparent py-3 text-sm text-gray-700 outline-none"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="next3">Next 3 Days</option>
            <option value="previous3">Previous 3 Days</option>
            <option value="custom">Custom Date Range</option>
          </select>
        </label>

        {dateFilter === "custom" && (
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto">
            <label className="min-w-0">
              <span className="mb-1 block text-xs font-semibold text-gray-500">
                From date
              </span>
              <input
                type="date"
                value={customStartDate}
                max={customEndDate || undefined}
                onChange={(event) => setCustomStartDate(event.target.value)}
                aria-label="Custom start date"
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </label>
            <label className="min-w-0">
              <span className="mb-1 block text-xs font-semibold text-gray-500">
                To date
              </span>
              <input
                type="date"
                value={customEndDate}
                min={customStartDate || undefined}
                onChange={(event) => setCustomEndDate(event.target.value)}
                aria-label="Custom end date"
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </label>
          </div>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <strong className="text-slate-900">{filteredBookings.length}</strong>{" "}
          of {bookings.length} appointments
        </p>

        {(searchText ||
          paymentFilter !== "All" ||
          activeTab !== "All" ||
          dateFilter !== "all" ||
          customStartDate ||
          customEndDate) && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-purple-700 hover:text-purple-900"
          >
            Clear filters
          </button>
        )}
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">{error}</p>
          <button
            type="button"
            onClick={fetchAppointments}
            className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm">
          <CalendarClock size={40} className="mx-auto text-gray-300" />
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            {bookings.length === 0
              ? "No appointments yet"
              : "No matching appointments"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {bookings.length === 0
              ? "Customer bookings for your salon will appear here."
              : "Try changing the status, search or payment filter."}
          </p>
          {bookings.length > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop column-wise table */}
          <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px] text-left">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    {[
                      "Booking ID",
                      "Customer",
                      "Date & Time",
                      "Services",
                      "Amount",
                      "Status",
                      "Payment",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-wide text-gray-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={getId(booking)}
                      className="transition hover:bg-gray-50/70"
                    >
                      <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-bold text-purple-700">
                        {displayId(booking)}
                      </td>

                      <td className="max-w-[210px] px-4 py-4">
                        <p className="break-words font-semibold text-slate-900">
                          {getCustomerName(booking)}
                        </p>
                        {getCustomer(booking).phone && (
                          <p className="mt-1 text-xs text-gray-500">
                            {getCustomer(booking).phone}
                          </p>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {dateLabel(booking.date)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {booking.time || "—"}
                        </p>
                      </td>

                      <td className="max-w-[220px] px-4 py-4">
                        <p className="line-clamp-2 text-sm font-medium text-slate-700">
                          {(booking.services || [])
                            .map((service) => service.name)
                            .filter(Boolean)
                            .join(", ") || "No services"}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {booking.totalDuration ?? 0} min
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-900">
                        {money(booking.totalPrice)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-col items-start gap-1">
                          <Pill className={statusClass(booking.status)}>
                            {booking.status}
                          </Pill>
                          {isPastDueAppointment(booking) && (
                            <Pill className="bg-amber-50 text-amber-700">
                              <AlertTriangle size={12} className="mr-1" />
                              Past Due
                            </Pill>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <Pill
                          className={paymentClass(getPaymentStatus(booking))}
                        >
                          {getPaymentStatus(booking)}
                        </Pill>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedBookingId(getId(booking))}
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

          {/* Mobile and tablet booking cards */}
          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:hidden">
            {filteredBookings.map(renderMobileCard)}
          </div>
        </>
      )}

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          isUpdating={updatingId === getId(selectedBooking)}
          onClose={() => setSelectedBookingId(null)}
          onStatusUpdate={handleStatusUpdate}
          onPaymentReceived={handlePaymentReceived}
        />
      )}
    </div>
  );
}
