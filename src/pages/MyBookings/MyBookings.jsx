import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "../../layouts/Container/Container";
import { getMyBookings, cancelBooking } from "../../services/bookingService";
import {
  createReview,
  updateReview,
  getBookingReview,
} from "../../services/reviewService";
import EditBookingModal from "../../components/Booking/EditBookingModal";
import {
  CalendarDays,
  Clock3,
  IndianRupee,
  MapPin,
  Search,
  Scissors,
  Star,
  X,
  XCircle,
  Eye,
} from "lucide-react";

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
const displayId = (booking) =>
  `#${booking?._id?.slice(-6).toUpperCase() || "------"}`;
const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const dateLabel = (
  value,
  options = { day: "2-digit", month: "short", year: "numeric" },
) => {
  if (!value || Number.isNaN(new Date(value).getTime())) return "Not available";
  return new Date(value).toLocaleDateString("en-IN", options);
};
const dateTimeLabel = (value) => {
  if (!value || Number.isNaN(new Date(value).getTime())) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
const paymentMethodLabel = (method) =>
  method === "PAY_NOW"
    ? "Pay Now"
    : method === "PAY_AFTER_SERVICE"
      ? "Pay After Service"
      : method || "Not available";
const statusClass = (status) =>
  status === "Upcoming"
    ? "bg-blue-50 text-blue-700"
    : status === "Completed"
      ? "bg-green-50 text-green-700"
      : status === "Cancelled"
        ? "bg-red-50 text-red-700"
        : "bg-gray-100 text-gray-700";
const paymentClass = (status) =>
  status === "PAID"
    ? "bg-green-50 text-green-700"
    : status === "FAILED"
      ? "bg-red-50 text-red-700"
      : status === "REFUNDED"
        ? "bg-purple-50 text-purple-700"
        : status === "PENDING"
          ? "bg-yellow-50 text-yellow-700"
          : "bg-gray-100 text-gray-700";

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
function Pill({ children, className = "" }) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full px-3 py-1 text-xs font-bold ${className}`}
    >
      {children}
    </span>
  );
}

export default function MyBookings() {
  const [searchParams] = useSearchParams();
  const bookingIdFromNotification = searchParams.get("booking");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [reviewingBooking, setReviewingBooking] = useState(null);
  const [bookingReviews, setBookingReviews] = useState({});
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [busyBookingId, setBusyBookingId] = useState(null);

  const fetchBookings = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError("");
      const data = await getMyBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to load your bookings. Please try again.",
      );
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!bookingIdFromNotification || bookings.length === 0) return;
    const target = bookings.find(
      (booking) => String(booking._id) === String(bookingIdFromNotification),
    );
    if (!target) return;
    setActiveStatus(target.status);
    const timer = setTimeout(() => {
      document
        .getElementById(`booking-${bookingIdFromNotification}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
    return () => clearTimeout(timer);
  }, [bookingIdFromNotification, bookings]);

  useEffect(() => {
    let cancelled = false;
    const loadReviews = async () => {
      const completed = bookings.filter(
        (booking) => booking.status === "Completed",
      );
      if (!completed.length) {
        setBookingReviews({});
        return;
      }
      const results = await Promise.all(
        completed.map(async (booking) => {
          try {
            const data = await getBookingReview(booking._id);
            return [booking._id, data.review || null];
          } catch (err) {
            console.error(
              `Failed to fetch review for booking ${booking._id}:`,
              err,
            );
            return [booking._id, null];
          }
        }),
      );
      if (!cancelled) setBookingReviews(Object.fromEntries(results));
    };
    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [bookings]);

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
    const search = searchText.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchesStatus =
        activeStatus === "All" || booking.status === activeStatus;
      const matchesPayment =
        paymentStatus === "All" || booking.paymentStatus === paymentStatus;
      const services = (booking.services || [])
        .map((s) => s.name || "")
        .join(" ");
      const salonLocation = booking.salon?.location || {};
      const haystack = [
        booking._id,
        displayId(booking),
        booking.salon?.name,
        services,
        booking.date,
        booking.time,
        booking.paymentMethod,
        booking.paymentStatus,
        ...Object.values(salonLocation),
      ]
        .join(" ")
        .toLowerCase();
      return (
        matchesStatus &&
        matchesPayment &&
        (!search || haystack.includes(search))
      );
    });
  }, [bookings, activeStatus, paymentStatus, searchText]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    try {
      setBusyBookingId(bookingId);
      await cancelBooking(bookingId);
      await fetchBookings(false);
      setSelectedBooking(null);
      alert("Booking cancelled successfully.");
    } catch (err) {
      console.error("Cancel booking error:", err);
      alert(
        err?.response?.data?.message ||
          "Failed to cancel booking. Please try again.",
      );
    } finally {
      setBusyBookingId(null);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewingBooking) return;
    if (reviewRating < 1 || reviewRating > 5) {
      alert("Please select a rating.");
      return;
    }
    if (!reviewComment.trim()) {
      alert("Please write a review.");
      return;
    }
    try {
      setReviewSubmitting(true);
      const existing = bookingReviews[reviewingBooking._id];
      const response = existing
        ? await updateReview(existing._id, {
            rating: reviewRating,
            comment: reviewComment.trim(),
          })
        : await createReview({
            bookingId: reviewingBooking._id,
            rating: reviewRating,
            comment: reviewComment.trim(),
          });
      if (response.review)
        setBookingReviews((current) => ({
          ...current,
          [reviewingBooking._id]: response.review,
        }));
      alert(
        response.message ||
          (existing
            ? "Review updated successfully."
            : "Review submitted successfully."),
      );
      setReviewingBooking(null);
      setReviewRating(0);
      setReviewComment("");
    } catch (err) {
      console.error("Submit review error:", err);
      alert(
        err?.response?.data?.message ||
          "Failed to submit review. Please try again.",
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  const locationText = (salon) => {
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

  const openReview = (booking) => {
    const existing = bookingReviews[booking._id];
    setReviewingBooking(booking);
    setReviewRating(existing?.rating || 0);
    setReviewComment(existing?.comment || "");
  };

  const renderActions = (booking, compact = false) => (
    <div
      className={`flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end ${compact ? "" : "border-t border-gray-100 p-4"}`}
    >
      {booking.status === "Upcoming" && (
        <>
          <button
            type="button"
            onClick={() => setEditingBooking(booking)}
            className="w-full rounded-xl border border-purple-200 px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-50 sm:w-auto"
          >
            Edit Booking
          </button>
          <button
            type="button"
            disabled={busyBookingId === booking._id}
            onClick={() => handleCancelBooking(booking._id)}
            className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50 sm:w-auto"
          >
            {busyBookingId === booking._id ? "Cancelling…" : "Cancel Booking"}
          </button>
        </>
      )}
      {booking.status === "Completed" && (
        <button
          type="button"
          onClick={() => openReview(booking)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 sm:w-auto"
        >
          <Star size={16} />
          {bookingReviews[booking._id] ? "Edit Review" : "Write a Review"}
        </button>
      )}
      <button
        type="button"
        onClick={() => setSelectedBooking(booking)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
      >
        <Eye size={16} />
        View Details
      </button>
    </div>
  );

  const renderMobileCard = (booking) => (
    <article
      id={`booking-${booking._id}`}
      key={booking._id}
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="flex min-w-0 flex-col gap-3 border-b border-gray-100 p-4 sm:p-5">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs font-bold text-purple-700">
              Booking ID {displayId(booking)}
            </p>
            <h3 className="mt-1 break-words text-base font-bold text-slate-900">
              {booking.salon?.name || "Salon"}
            </h3>
          </div>
          <Pill className={statusClass(booking.status)}>{booking.status}</Pill>
        </div>
        <p className="flex items-start gap-2 text-sm text-gray-500">
          <MapPin size={16} className="mt-0.5 shrink-0 text-purple-600" />
          <span className="break-words">{locationText(booking.salon)}</span>
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4 sm:p-5">
        <Detail
          label="Date"
          value={dateLabel(booking.date, {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          icon={<CalendarDays size={14} />}
        />
        <Detail label="Time" value={booking.time} icon={<Clock3 size={14} />} />
        <Detail
          label="Amount"
          value={money(booking.totalPrice)}
          icon={<IndianRupee size={14} />}
        />
        <Detail
          label="Payment"
          value={booking.paymentStatus || "UNPAID"}
          icon={<IndianRupee size={14} />}
        />
        <div className="col-span-2 rounded-xl bg-gray-50 p-3 sm:p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <Scissors size={14} />
            Services
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(booking.services || []).length ? (
              booking.services.map((service, i) => (
                <span
                  key={service.id || service._id || `${service.name}-${i}`}
                  className="max-w-full rounded-lg bg-purple-50 px-2.5 py-2 text-xs font-semibold text-purple-700"
                >
                  {service.name} · {service.duration || 0} min ·{" "}
                  {money(service.price)}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No service details</span>
            )}
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Total duration:{" "}
            <strong className="text-slate-800">
              {booking.totalDuration ?? 0} min
            </strong>
          </p>
        </div>
        <div className="col-span-2 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
          <span>Payment method</span>
          <span className="font-semibold text-slate-800">
            {paymentMethodLabel(booking.paymentMethod)}
          </span>
        </div>
        <div className="col-span-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
          <span>Booked on</span>
          <span className="text-right font-semibold text-slate-800">
            {dateTimeLabel(booking.createdAt)}
          </span>
        </div>
      </div>
      {renderActions(booking)}
    </article>
  );

  return (
    <Container>
      <div className="mx-auto w-full max-w-7xl min-w-0 py-5 sm:py-7 lg:py-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-purple-600 sm:text-sm">
              Bookings
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              My Bookings
            </h1>
            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Manage your salon appointments and booking history.
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Total bookings:{" "}
            <strong className="text-slate-900">{bookings.length}</strong>
          </p>
        </header>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          <div
            className="flex min-w-max gap-2"
            role="tablist"
            aria-label="Booking status"
          >
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={activeStatus === tab.value}
                onClick={() => setActiveStatus(tab.value)}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${activeStatus === tab.value ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {tab.label}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs ${activeStatus === tab.value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}
                >
                  {counts[tab.value]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4 lg:flex-row">
          <label className="relative min-w-0 flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search booking ID, salon, service or location…"
              className="w-full min-w-0 rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
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
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <strong className="text-slate-900">
              {filteredBookings.length}
            </strong>{" "}
            {filteredBookings.length === 1 ? "booking" : "bookings"}
          </p>
          {(searchText ||
            paymentStatus !== "All" ||
            activeStatus !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchText("");
                setPaymentStatus("All");
                setActiveStatus("All");
              }}
              className="text-sm font-semibold text-purple-700 hover:text-purple-900"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-purple-600" />
            <p className="mt-4 text-sm text-gray-500">Loading your bookings…</p>
          </div>
        ) : error ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => fetchBookings()}
              className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm">
            <CalendarDays size={40} className="mx-auto text-gray-300" />
            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No bookings found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Try changing the status, search or payment filter.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-5 hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      {[
                        "Booking ID",
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
                        id={`booking-${booking._id}`}
                        key={booking._id}
                        className="transition hover:bg-gray-50/70"
                      >
                        <td className="px-4 py-4 font-mono text-xs font-bold text-purple-700">
                          {displayId(booking)}
                        </td>
                        <td className="max-w-[220px] px-4 py-4">
                          <p className="font-semibold text-slate-900">
                            {booking.salon?.name || "Salon"}
                          </p>
                          <p className="mt-1 truncate text-xs text-gray-500">
                            {locationText(booking.salon)}
                          </p>
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
                              .map((s) => s.name)
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
                          <Pill className={statusClass(booking.status)}>
                            {booking.status}
                          </Pill>
                        </td>
                        <td className="px-4 py-4">
                          <Pill className={paymentClass(booking.paymentStatus)}>
                            {booking.paymentStatus || "UNPAID"}
                          </Pill>
                        </td>
                        <td className="px-4 py-4">
                          {renderActions(booking, true)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:hidden">
              {filteredBookings.map(renderMobileCard)}
            </div>
          </>
        )}
      </div>

      {selectedBooking && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedBooking(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-details-title"
            className="flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
          >
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 p-4 sm:p-6">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-purple-600">
                  Appointment Details
                </p>
                <h2
                  id="booking-details-title"
                  className="mt-1 break-words text-lg font-bold text-slate-900 sm:text-xl"
                >
                  {bookingIdFromNotification &&
                  String(selectedBooking._id) ===
                    String(bookingIdFromNotification)
                    ? "Your Booking"
                    : selectedBooking.salon?.name || "Your Booking"}
                </h2>
                <p className="mt-1 font-mono text-xs text-purple-700">
                  {displayId(selectedBooking)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                aria-label="Close details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </header>
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Pill className={statusClass(selectedBooking.status)}>
                  {selectedBooking.status}
                </Pill>
                <Pill className={paymentClass(selectedBooking.paymentStatus)}>
                  {selectedBooking.paymentStatus || "UNPAID"}
                </Pill>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Detail
                  label="Salon"
                  value={selectedBooking.salon?.name}
                  icon={<MapPin size={14} />}
                />
                <Detail
                  label="Location"
                  value={locationText(selectedBooking.salon)}
                  icon={<MapPin size={14} />}
                />
                <Detail
                  label="Date"
                  value={dateLabel(selectedBooking.date, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  icon={<CalendarDays size={14} />}
                />
                <Detail
                  label="Time"
                  value={selectedBooking.time}
                  icon={<Clock3 size={14} />}
                />
                <Detail
                  label="Total Duration"
                  value={`${selectedBooking.totalDuration ?? 0} min`}
                  icon={<Clock3 size={14} />}
                />
                <Detail
                  label="Payment Method"
                  value={paymentMethodLabel(selectedBooking.paymentMethod)}
                  icon={<IndianRupee size={14} />}
                />
                <Detail
                  label="Total Amount"
                  value={money(selectedBooking.totalPrice)}
                  icon={<IndianRupee size={14} />}
                />
                <Detail
                  label="Booked On"
                  value={dateTimeLabel(selectedBooking.createdAt)}
                  icon={<CalendarDays size={14} />}
                />
              </div>
              <section className="overflow-hidden rounded-2xl border border-gray-100">
                <h3 className="border-b border-gray-100 px-4 py-3 font-bold text-slate-900 sm:px-5">
                  Booked Services
                </h3>
                <div className="divide-y divide-gray-100">
                  {(selectedBooking.services || []).map((service, index) => (
                    <div
                      key={
                        service.id || service._id || `${service.name}-${index}`
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
                      {money(selectedBooking.totalPrice)}
                    </span>
                  </div>
                </div>
              </section>
              {(selectedBooking.cashfreeOrderId ||
                selectedBooking.paymentOrderId ||
                selectedBooking.cashfreePaymentId ||
                selectedBooking.cashfreePaymentDate) && (
                <section className="rounded-2xl border border-gray-100 p-4">
                  <h3 className="font-bold text-slate-900">Payment Details</h3>
                  <div className="mt-3 space-y-3 text-sm">
                    {(selectedBooking.paymentOrderId ||
                      selectedBooking.cashfreeOrderId) && (
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="text-gray-500">Payment Order ID</span>
                        <span className="break-all text-right font-medium text-slate-800">
                          {selectedBooking.paymentOrderId ||
                            selectedBooking.cashfreeOrderId}
                        </span>
                      </div>
                    )}
                    {selectedBooking.cashfreePaymentId && (
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="text-gray-500">Transaction ID</span>
                        <span className="break-all text-right font-medium text-slate-800">
                          {selectedBooking.cashfreePaymentId}
                        </span>
                      </div>
                    )}
                    {selectedBooking.cashfreePaymentDate && (
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="text-gray-500">Payment Date</span>
                        <span className="text-right font-medium text-slate-800">
                          {dateTimeLabel(selectedBooking.cashfreePaymentDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </section>
              )}
              {selectedBooking.status === "Cancelled" &&
                selectedBooking.cancelledAt && (
                  <div className="rounded-2xl bg-red-50 p-4">
                    <p className="font-bold text-red-700">Cancelled on</p>
                    <p className="mt-1 text-sm text-red-600">
                      {dateTimeLabel(selectedBooking.cancelledAt)}
                    </p>
                  </div>
                )}
            </div>
            <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50 p-4 sm:flex-row sm:justify-end sm:p-5">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
              {selectedBooking.status === "Upcoming" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBooking(selectedBooking);
                      setSelectedBooking(null);
                    }}
                    className="rounded-xl border border-purple-200 px-5 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-50"
                  >
                    Edit Booking
                  </button>
                  <button
                    type="button"
                    disabled={busyBookingId === selectedBooking._id}
                    onClick={() => handleCancelBooking(selectedBooking._id)}
                    className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Cancel Booking
                  </button>
                </>
              )}
            </footer>
          </section>
        </div>
      )}

      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onUpdated={(updatedBooking) => {
            setBookings((current) =>
              current.map((booking) =>
                booking._id === updatedBooking._id ? updatedBooking : booking,
              ),
            );
            setEditingBooking(null);
          }}
        />
      )}

      {reviewingBooking && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !reviewSubmitting)
              setReviewingBooking(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-title"
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
          >
            <header className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <h2
                  id="review-title"
                  className="text-lg font-bold text-slate-900"
                >
                  {bookingReviews[reviewingBooking._id]
                    ? "Edit Review"
                    : "Write a Review"}
                </h2>
                <p className="mt-1 break-words text-sm text-gray-500">
                  Share your experience at{" "}
                  {reviewingBooking.salon?.name || "the salon"}
                </p>
              </div>
              <button
                type="button"
                disabled={reviewSubmitting}
                onClick={() => setReviewingBooking(null)}
                aria-label="Close review"
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                <XCircle size={21} />
              </button>
            </header>
            <div className="space-y-5 p-4 sm:p-6">
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-800">
                  How was your experience?
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      disabled={reviewSubmitting}
                      onClick={() => setReviewRating(star)}
                      aria-label={`${star} star${star > 1 ? "s" : ""}`}
                      className="rounded-lg p-1 transition hover:scale-110 disabled:opacity-50"
                    >
                      <Star
                        size={29}
                        className={
                          star <= reviewRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {reviewRating
                    ? `${reviewRating} out of 5 stars`
                    : "Select a rating from 1 to 5."}
                </p>
              </div>
              <div>
                <label
                  htmlFor="review-comment"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Your Review
                </label>
                <textarea
                  id="review-comment"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  disabled={reviewSubmitting}
                  rows={4}
                  maxLength={1000}
                  placeholder="Tell us about your experience…"
                  className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100 disabled:opacity-60"
                />
                <p className="mt-1 text-right text-xs text-gray-400">
                  {reviewComment.length}/1000
                </p>
              </div>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={reviewSubmitting}
                  onClick={() => setReviewingBooking(null)}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={reviewSubmitting}
                  onClick={handleSubmitReview}
                  className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
                >
                  <Star size={16} />
                  {reviewSubmitting ? "Submitting…" : "Submit Review"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </Container>
  );
}
