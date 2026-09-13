import {
  Bell,
  CalendarCheck,
  Check,
  CheckCheck,
  Clock3,
  Gift,
  Info,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "booking",
      title: "Booking Confirmed",
      message: "Your salon appointment has been successfully confirmed.",
      time: "10 minutes ago",
      unread: true,
      icon: CalendarCheck,
    },
    {
      id: 2,
      type: "reminder",
      title: "Appointment Reminder",
      message: "Your upcoming salon appointment is scheduled for tomorrow.",
      time: "2 hours ago",
      unread: true,
      icon: Clock3,
    },
    {
      id: 3,
      type: "offer",
      title: "New Offer Available",
      message:
        "A new beauty offer is waiting for you. Check out the latest Rupiva deals.",
      time: "Yesterday",
      unread: false,
      icon: Gift,
    },
    {
      id: 4,
      type: "info",
      title: "Welcome to Rupiva",
      message:
        "Discover salons, choose your services and book your preferred time slot.",
      time: "2 days ago",
      unread: false,
      icon: Sparkles,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  const removeNotification = (id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                <Bell size={22} />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-purple-600">
                  Rupiva
                </p>

                <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Notifications
                </h1>

                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  Stay updated with your bookings and Rupiva activity.
                </p>
              </div>
            </div>

            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-2 text-xs font-bold text-purple-700 transition hover:bg-purple-100"
                  >
                    <CheckCheck size={15} />
                    Mark all read
                  </button>
                )}

                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={15} />
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Notification List */}
      <section>
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {notifications.length > 0 ? (
            <>
              {/* Summary */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">
                  {notifications.length}{" "}
                  {notifications.length === 1
                    ? "Notification"
                    : "Notifications"}
                </p>

                {unreadCount > 0 && (
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                    {unreadCount} Unread
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {notifications.map((notification) => {
                  const Icon = notification.icon;

                  return (
                    <article
                      key={notification.id}
                      className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                        notification.unread
                          ? "border-purple-200"
                          : "border-slate-200"
                      }`}
                    >
                      {notification.unread && (
                        <div className="absolute bottom-0 left-0 top-0 w-1 bg-purple-600" />
                      )}

                      <div className="flex gap-3 p-4 sm:gap-4 sm:p-5">
                        {/* Icon */}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            notification.unread
                              ? "bg-purple-100 text-purple-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Icon size={19} />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                                  {notification.title}
                                </h2>

                                {notification.unread && (
                                  <span className="h-2 w-2 shrink-0 rounded-full bg-purple-600" />
                                )}
                              </div>

                              <p className="mt-1 text-sm leading-6 text-slate-600">
                                {notification.message}
                              </p>

                              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                                <Clock3 size={13} />
                                {notification.time}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeNotification(notification.id)
                              }
                              className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                              aria-label="Remove notification"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {notification.unread && (
                            <button
                              type="button"
                              onClick={() => markAsRead(notification.id)}
                              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 transition hover:bg-purple-100"
                            >
                              <Check size={14} />
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                <Bell size={27} />
              </div>

              <h2 className="mt-4 text-xl font-extrabold text-slate-900">
                You're all caught up!
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                You don't have any notifications right now. We'll show your
                important booking updates and other activity here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Information */}
      <section className="bg-white">
        <div className="mx-auto flex max-w-5xl items-start gap-3 px-4 py-6 sm:px-6 lg:px-8">
          <Info size={17} className="mt-0.5 shrink-0 text-purple-500" />

          <p className="text-xs leading-5 text-slate-500">
            Notifications may include appointment confirmations, reminders,
            booking updates, offers and important account information.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Notifications;
