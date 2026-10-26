import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarCheck,
  Check,
  CheckCheck,
  Clock3,
  CreditCard,
  Info,
  LoaderCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import {
  getMySalonOwnerNotifications,
  markSalonOwnerNotificationAsRead,
  markAllSalonOwnerNotificationsAsRead,
} from "../../../services/salonOwnerNotificationService";

const getNotificationIcon = (type) => {
  switch (type) {
    case "NEW_BOOKING":
    case "BOOKING_CONFIRMED":
    case "BOOKING_REMINDER":
      return CalendarCheck;

    case "PAYMENT_SUCCESS":
    case "PAYMENT_UPDATE":
    case "PAYOUT_UPDATE":
      return CreditCard;

    case "NEW_REVIEW":
    case "REVIEW_REMINDER":
      return Sparkles;

    case "BOOKING_CANCELLED":
      return Info;

    default:
      return Bell;
  }
};

const formatDate = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (timeValue) => {
  if (!timeValue) return "";

  // Handles values such as "14:00", "02:00 PM" and "09:30 AM".
  const time = String(timeValue).trim();
  const match = time.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);

  if (!match) return time;

  let hours = Number(match[1]);
  const minutes = match[2];
  const meridiem = match[3]?.toUpperCase();

  if (meridiem) {
    if (hours < 1 || hours > 12) return time;
    return `${String(hours).padStart(2, "0")}:${minutes} ${meridiem}`;
  }

  if (hours > 23 || Number(minutes) > 59) return time;

  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${String(hours).padStart(2, "0")}:${minutes} ${suffix}`;
};

const getNotificationTime = (createdAt) => {
  if (!createdAt) return "";

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getBookingId = (notification) => {
  const booking = notification.relatedBooking;

  if (typeof booking === "string") return booking;
  return booking?._id || booking?.id || "";
};

const getBookingDetails = (notification) => {
  const booking =
    notification.relatedBooking &&
    typeof notification.relatedBooking === "object"
      ? notification.relatedBooking
      : null;

  const date = formatDate(booking?.date);
  const time = formatTime(booking?.time);

  return {
    date,
    time,
    salonName: booking?.salon?.name || booking?.salonName || "",
  };
};

const getNotificationMessage = (notification) => {
  const bookingDetails = getBookingDetails(notification);
  const message = notification.message || "";

  // Show booking date and time directly when the related booking is populated.
  if (
    notification.type === "NEW_BOOKING" &&
    bookingDetails.date &&
    bookingDetails.time
  ) {
    const salonName =
      bookingDetails.salonName ||
      message.match(/for (.+?) on /i)?.[1] ||
      "your salon";

    return `A new booking has been received for ${salonName} on ${bookingDetails.date} at ${bookingDetails.time}.`;
  }

  return message;
};

const isBookingNotification = (notification) => {
  return (
    [
      "NEW_BOOKING",
      "BOOKING_CONFIRMED",
      "BOOKING_CANCELLED",
      "BOOKING_REMINDER",
    ].includes(notification.type) && Boolean(getBookingId(notification))
  );
};

export default function SalonOwnerNotifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [markingAll, setMarkingAll] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const data = await getMySalonOwnerNotifications();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch salon owner notifications:", err);
      setError(
        err?.response?.data?.message ||
          "Couldn't load notifications. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  const handleMarkAsRead = async (notificationId) => {
    const target = notifications.find((item) => item._id === notificationId);

    if (!target || target.isRead || busyId || markingAll) return;

    setBusyId(notificationId);
    setError("");
    setSuccessMessage("");

    try {
      await markSalonOwnerNotificationAsRead(notificationId);

      setNotifications((current) =>
        current.map((item) =>
          item._id === notificationId ? { ...item, isRead: true } : item,
        ),
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      setError(
        err?.response?.data?.message ||
          "Couldn't mark this notification as read.",
      );
    } finally {
      setBusyId("");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || markingAll || busyId) return;

    setMarkingAll(true);
    setError("");
    setSuccessMessage("");

    try {
      await markAllSalonOwnerNotificationsAsRead();

      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true })),
      );

      setSuccessMessage("All notifications marked as read.");
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      setError(
        err?.response?.data?.message ||
          "Couldn't mark all notifications as read.",
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const handleViewBooking = async (notification) => {
    const bookingId = getBookingId(notification);
    if (!bookingId) return;

    // Navigate even if marking as read fails.
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id);
    }

    navigate(
      `/salon-owner/appointments?booking=${encodeURIComponent(bookingId)}`,
    );
  };

  return (
    <main className="min-h-full min-w-0 bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                <Bell size={23} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-purple-700">
                  Rupiva for Business
                </p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  Notifications
                </h1>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Stay on top of new bookings, cancellations, and salon updates.
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={markingAll || Boolean(busyId)}
                className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-bold text-purple-700 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {markingAll ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <CheckCheck size={17} />
                )}
                {markingAll ? "Updating..." : "Mark all as read"}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-semibold text-slate-500 sm:text-sm">
              Total notifications
            </p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">
              {loading ? "—" : notifications.length}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50/70 p-4 shadow-sm sm:p-5">
            <p className="text-xs font-semibold text-purple-700 sm:text-sm">
              Unread
            </p>
            <p className="mt-2 text-2xl font-extrabold text-purple-800">
              {loading ? "—" : unreadCount}
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={fetchNotifications}
              className="inline-flex shrink-0 items-center gap-2 self-start font-bold underline underline-offset-2 sm:self-auto"
            >
              <RefreshCw size={14} /> Try again
            </button>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800"
          >
            {successMessage}
          </div>
        )}

        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Recent activity
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              {loading
                ? "Fetching your latest updates…"
                : unreadCount > 0
                  ? `${unreadCount} notification${unreadCount === 1 ? "" : "s"} need your attention`
                  : "You're all caught up."}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchNotifications}
            disabled={loading}
            aria-label="Refresh notifications"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-purple-200 hover:text-purple-700 disabled:opacity-50"
          >
            {loading ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <RefreshCw size={17} />
            )}
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-12 shadow-sm">
            <LoaderCircle size={30} className="animate-spin text-purple-600" />
            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading notifications…
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center shadow-sm sm:py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
              <Bell size={28} />
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-slate-900">
              You're all caught up!
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              New bookings, cancellations, and other salon updates will appear
              here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const unread = !notification.isRead;
              const canViewBooking = isBookingNotification(notification);
              const isMarkingThis = busyId === notification._id;
              const bookingDetails = getBookingDetails(notification);

              return (
                <article
                  key={notification._id}
                  className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
                    unread ? "border-purple-200" : "border-slate-200"
                  }`}
                >
                  {unread && (
                    <span className="absolute bottom-0 left-0 top-0 w-1 bg-purple-600" />
                  )}

                  <div className="flex min-w-0 gap-3 p-4 sm:gap-4 sm:p-5">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        unread
                          ? "bg-purple-100 text-purple-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-center gap-2">
                          <h3 className="break-words text-sm font-extrabold text-slate-900 sm:text-base">
                            {notification.title}
                          </h3>
                          {unread && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-purple-600" />
                          )}
                        </div>

                        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-slate-400">
                          <Clock3 size={13} />
                          {getNotificationTime(notification.createdAt)}
                        </span>
                      </div>

                      <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                        {getNotificationMessage(notification)}
                      </p>

                      {notification.type === "NEW_BOOKING" &&
                        bookingDetails.date &&
                        bookingDetails.time && (
                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-600">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarCheck
                                size={14}
                                className="text-purple-600"
                              />
                              Booking date: {bookingDetails.date}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Clock3 size={14} className="text-purple-600" />
                              {bookingDetails.time}
                            </span>
                          </div>
                        )}

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {canViewBooking && (
                          <button
                            type="button"
                            onClick={() => handleViewBooking(notification)}
                            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full bg-purple-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                          >
                            <CalendarCheck size={14} />
                            View Booking
                          </button>
                        )}

                        {unread && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsRead(notification._id)}
                            disabled={Boolean(busyId) || markingAll}
                            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-2 text-xs font-bold text-purple-700 transition hover:bg-purple-100 disabled:opacity-50"
                          >
                            {isMarkingThis ? (
                              <LoaderCircle
                                size={14}
                                className="animate-spin"
                              />
                            ) : (
                              <Check size={14} />
                            )}
                            Mark as read
                          </button>
                        )}

                        {!unread && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                            <CheckCheck size={14} />
                            Read
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-500">
          <Info size={16} className="mt-0.5 shrink-0 text-purple-600" />
          <p>
            Select View Booking to open the associated appointment. Booking
            dates are shown when the notification includes the related booking
            details.
          </p>
        </div>
      </section>
    </main>
  );
}
