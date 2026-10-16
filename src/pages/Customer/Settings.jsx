import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  CalendarCheck,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Heart,
  LockKeyhole,
  LogOut,
  Mail,
  MessageSquare,
  Moon,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Check,
  LoaderCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_SETTINGS = {
  bookingUpdates: true,
  bookingReminders: true,
  promotionalOffers: false,
  emailNotifications: true,
  smsNotifications: true,
};

const readSettings = () => {
  try {
    const saved = localStorage.getItem("rupiva_customer_settings");
    return saved
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

function SettingToggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
        checked ? "bg-purple-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  onClick,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full min-w-0 items-center gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50 sm:p-3.5"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          danger ? "bg-rose-50 text-rose-600" : "bg-purple-50 text-purple-600"
        }`}
      >
        <Icon size={19} />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm font-semibold ${
            danger ? "text-rose-700" : "text-slate-800"
          }`}
        >
          {title}
        </span>
        {description && (
          <span className="mt-1 block text-xs leading-5 text-slate-500">
            {description}
          </span>
        )}
      </span>

      <ChevronRight
        size={17}
        className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5"
      />
    </button>
  );
}

export default function CustomerSettings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [settings, setSettings] = useState(readSettings);
  const [saved, setSaved] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        "rupiva_customer_settings",
        JSON.stringify(settings),
      );
    } catch (error) {
      console.error("Could not save customer settings:", error);
    }
  }, [settings]);

  const changeSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(true);
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      if (typeof logout === "function") {
        await logout();
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }

    navigate("/", { replace: true });
  };

  const notificationOptions = [
    {
      key: "bookingUpdates",
      title: "Booking updates",
      description: "Changes to your booking and cancellation status.",
    },
    {
      key: "bookingReminders",
      title: "Appointment reminders",
      description: "Reminders before your scheduled appointment.",
    },
    {
      key: "promotionalOffers",
      title: "Offers and promotions",
      description: "Updates about deals, discounts and special offers.",
    },
  ];

  const deliveryOptions = [
    {
      key: "emailNotifications",
      title: "Email notifications",
      description: "Receive account updates through email.",
    },
    {
      key: "smsNotifications",
      title: "SMS notifications",
      description: "Receive account updates through text messages.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50/80 px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-purple-200 hover:text-purple-700"
            >
              <ArrowLeft size={19} />
            </button>

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-purple-600">
                Account preferences
              </p>
              <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
                Settings
              </h1>
            </div>
          </div>

          {saved && (
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-600">
              <Check size={15} />
              <span className="hidden sm:inline">Saved</span>
            </span>
          )}
        </header>

        {/* Intro card */}
        <section className="mb-5 flex items-center gap-4 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
            <SlidersHorizontal size={23} />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 sm:text-base">
              Make Rupiva work for you
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              Manage notifications, account preferences and security shortcuts.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
          {/* Notifications */}
          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Bell size={19} />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Notifications
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Choose which updates you prefer.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {notificationOptions.map((item) => (
                <div key={item.key} className="flex items-center gap-3 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <SettingToggle
                    label={item.title}
                    checked={settings[item.key]}
                    onChange={(value) => changeSetting(item.key, value)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Delivery preferences */}
          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MessageSquare size={19} />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Delivery preferences
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Select your preferred notification channels.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {deliveryOptions.map((item) => (
                <div key={item.key} className="flex items-center gap-3 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <SettingToggle
                    label={item.title}
                    checked={settings[item.key]}
                    onChange={(value) => changeSetting(item.key, value)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Account */}
          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <UserRound size={19} />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">Account</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Manage your Rupiva account.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              <SettingRow
                icon={UserRound}
                title="Personal information"
                description="Update your name, email and profile photo."
                onClick={() => navigate("/profile")}
              />
              <SettingRow
                icon={CalendarCheck}
                title="My bookings"
                description="View and manage your appointments."
                onClick={() => navigate("/my-bookings")}
              />
              <SettingRow
                icon={Heart}
                title="Favourite salons"
                description="Find your saved salons."
                onClick={() => navigate("/favorites")}
              />
              <SettingRow
                icon={CreditCard}
                title="Payments and refunds"
                description="Review payment and refund status."
                onClick={() => navigate("/payment")}
              />
            </div>
          </section>

          {/* Security and support */}
          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <ShieldCheck size={19} />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Security & support
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Account assistance and security.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              <SettingRow
                icon={LockKeyhole}
                title="Password and security"
                description="Review your account security options."
                onClick={() =>
                  navigate("/profile", {
                    state: { openSecurity: true },
                  })
                }
              />
              <SettingRow
                icon={CircleHelp}
                title="Help and support"
                description="Get help with bookings and your account."
                onClick={() => navigate("/help")}
              />
              <SettingRow
                icon={LogOut}
                title={loggingOut ? "Signing out..." : "Sign out"}
                description="Log out of your Rupiva account."
                danger
                onClick={handleLogout}
              />
            </div>
          </section>
        </div>

        <footer className="mt-6 flex items-center justify-center gap-2 pb-2 text-xs text-slate-400">
          <ShieldCheck size={14} />
          Rupiva account settings
        </footer>
      </div>
    </main>
  );
}
