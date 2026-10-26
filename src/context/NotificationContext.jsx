import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

const NotificationContext = createContext(null);

const notificationStyles = {
  success: {
    icon: CheckCircle2,
    className: "border-green-200 bg-green-50 text-green-800",
  },
  error: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50 text-red-800",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-amber-200 bg-amber-50 text-amber-900",
  },
  info: {
    icon: Info,
    className: "border-blue-200 bg-blue-50 text-blue-800",
  },
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const timers = useRef(new Map());
  const nextId = useRef(0);

  const dismissNotification = useCallback((id) => {
    const timer = timers.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }

    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
  }, []);

  const notify = useCallback(
    (message, type = "info") => {
      if (!message) return;

      const id = ++nextId.current;
      const safeType = notificationStyles[type] ? type : "info";

      setNotifications((current) => [
        ...current,
        { id, message: String(message), type: safeType },
      ]);

      const timer = setTimeout(() => {
        dismissNotification(id);
      }, 5000);

      timers.current.set(id, timer);
    },
    [dismissNotification],
  );

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current.clear();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notify, dismissNotification }}>
      {children}
      <div
        className="pointer-events-none fixed left-1/2 top-28 z-[9999] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 flex-col gap-3"
        aria-live="polite"
        aria-relevant="additions"
      >
        {notifications.map((notification) => {
          const style = notificationStyles[notification.type];
          const Icon = style.icon;

          return (
            <div
              key={notification.id}
              role={notification.type === "error" ? "alert" : "status"}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg ${style.className}`}
            >
              <Icon size={21} className="mt-0.5 shrink-0" />

              <p className="min-w-0 flex-1 break-words text-sm font-medium">
                {notification.message}
              </p>

              <button
                type="button"
                onClick={() => dismissNotification(notification.id)}
                aria-label="Dismiss notification"
                title="Close notification"
                className="shrink-0 rounded-md p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current"
              >
                <X size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used inside NotificationProvider");
  }

  const { notify } = context;

  return {
    notify,
    success: (message) => notify(message, "success"),
    error: (message) => notify(message, "error"),
    warning: (message) => notify(message, "warning"),
    info: (message) => notify(message, "info"),
  };
}
