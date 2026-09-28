import { useEffect, useState } from "react";
import { Bell, CheckCheck, CalendarCheck } from "lucide-react";
import {
  getMySalonOwnerNotifications,
  markSalonOwnerNotificationAsRead,
  markAllSalonOwnerNotificationsAsRead,
} from "../../../services/salonOwnerNotificationService";

export default function SalonOwnerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const data = await getMySalonOwnerNotifications();

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch salon owner notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markSalonOwnerNotificationAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllSalonOwnerNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "NEW_BOOKING":
        return <CalendarCheck size={20} />;

      default:
        return <Bell size={20} />;
    }
  };

  const getNotificationTime = (createdAt) => {
    if (!createdAt) return "";

    const createdDate = new Date(createdAt);

    if (Number.isNaN(createdDate.getTime())) return "";

    return createdDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-full bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>

            <p className="mt-1 text-sm text-gray-500">
              Stay updated with your salon activity.
            </p>
          </div>

          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck size={17} />
            Mark all as read
          </button>
        </div>

        {/* Notifications */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Bell size={20} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Recent Notifications
                </h2>

                <p className="text-xs text-gray-500">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${
                        unreadCount > 1 ? "s" : ""
                      }`
                    : "All notifications are read"}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center px-5 py-12">
              <p className="text-sm text-gray-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-5 py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <Bell size={28} />
              </div>

              <h3 className="text-base font-semibold text-gray-800">
                No notifications yet
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500">
                New bookings, cancellations, reviews, and payment updates will
                appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`relative flex gap-4 px-5 py-4 transition ${
                    notification.isRead ? "bg-white" : "bg-purple-50/40"
                  }`}
                >
                  {!notification.isRead && (
                    <span className="absolute left-0 top-0 h-full w-1 bg-purple-600" />
                  )}

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      notification.isRead
                        ? "bg-gray-100 text-gray-500"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {notification.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-gray-600">
                          {notification.message}
                        </p>
                      </div>

                      <span className="shrink-0 text-xs text-gray-400">
                        {getNotificationTime(notification.createdAt)}
                      </span>
                    </div>

                    {!notification.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="mt-3 text-xs font-semibold text-purple-600 hover:text-purple-700"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
