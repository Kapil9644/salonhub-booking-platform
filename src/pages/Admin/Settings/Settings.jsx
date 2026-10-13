import { useEffect, useState } from "react";
import {
  getAdminSettings,
  updateAdminSettings,
} from "../../../services/adminSettingsService";
import {
  Settings as SettingsIcon,
  CalendarDays,
  CreditCard,
  Bell,
  ShieldCheck,
  Store,
  Save,
  RotateCcw,
} from "lucide-react";

const initialSettings = {
  platformName: "Rupiva",
  supportEmail: "",
  supportPhone: "",
  currency: "INR",
  bookingCancellationHours: 2,
  bookingAdvanceDays: 30,
  platformCommission: 10,
  allowPayNow: true,
  allowPayAfterService: true,
  emailNotifications: true,
  bookingNotifications: true,
  paymentNotifications: true,
  requireAdminApproval: true,
  maintenanceMode: false,
};

const sections = [
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "booking", label: "Booking Rules", icon: CalendarDays },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "platform", label: "Platform", icon: Store },
];

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-purple-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
        {...props}
      />
    </label>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <div className="mt-4 divide-y divide-slate-100">{children}</div>
    </section>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(initialSettings);
  const [activeSection, setActiveSection] = useState("general");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => {
      setNotice("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const response = await getAdminSettings();

        if (response.success && response.settings && isMounted) {
          setSettings({
            ...initialSettings,
            ...response.settings,
          });
        }
      } catch (error) {
        if (isMounted) {
          setNotice(
            error.response?.data?.message ||
              "Settings did not load. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const update = (key, value) => {
    setSettings((previous) => ({ ...previous, [key]: value }));
    setNotice("");
  };

  const reset = () => {
    setSettings(initialSettings);
    setNotice("Form values reset. Save functionality is not connected yet.");
  };

  const save = async (event) => {
    event.preventDefault();

    setIsSaving(true);
    setNotice("");

    try {
      const payload = {
        ...settings,
        bookingCancellationHours: Number(settings.bookingCancellationHours),
        bookingAdvanceDays: Number(settings.bookingAdvanceDays),
        platformCommission: Number(settings.platformCommission),
      };

      const response = await updateAdminSettings(payload);

      if (response.success) {
        setSettings({
          ...initialSettings,
          ...response.settings,
        });
        setNotice(response.message || "Settings saved successfully!");
      } else {
        setNotice("Settings save nahi hui. Please try again.");
      }
    } catch (error) {
      setNotice(
        error.response?.data?.message ||
          "Settings save karte waqt error aaya. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-3 sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-600">
              Administration
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Settings
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage Rupiva platform preferences and operating rules.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <button
              type="submit"
              form="admin-settings-form"
              disabled={isSaving || isLoading}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-purple-600 px-4 text-sm font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </header>

        {notice && (
          <div
            role="status"
            className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
          >
            <span>{notice}</span>

            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Close notification"
              className="shrink-0 rounded-md px-2 py-1 text-lg font-semibold hover:bg-amber-100"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
          <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 lg:sticky lg:top-20 lg:flex-col">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                    activeSection === section.id
                      ? "bg-purple-100 text-purple-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={18} />
                  {section.label}
                </button>
              );
            })}
          </nav>

          <form id="admin-settings-form" onSubmit={save} className="space-y-5">
            {activeSection === "general" && (
              <SectionCard
                title="General Settings"
                description="Basic platform identity and customer support details."
              >
                <div className="grid gap-4 py-2 sm:grid-cols-2">
                  <Field
                    label="Platform name"
                    value={settings.platformName}
                    onChange={(e) => update("platformName", e.target.value)}
                    required
                  />
                  <Field
                    label="Support email"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => update("supportEmail", e.target.value)}
                    placeholder="support@example.com"
                  />
                  <Field
                    label="Support phone"
                    type="tel"
                    value={settings.supportPhone}
                    onChange={(e) => update("supportPhone", e.target.value)}
                    placeholder="Customer support number"
                  />
                  <label>
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Currency
                    </span>
                    <select
                      value={settings.currency}
                      onChange={(e) => update("currency", e.target.value)}
                      className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    >
                      <option value="INR">INR — Indian Rupee</option>
                    </select>
                  </label>
                </div>
              </SectionCard>
            )}

            {activeSection === "booking" && (
              <SectionCard
                title="Booking Rules"
                description="Configure booking windows and cancellation rules."
              >
                <div className="grid gap-4 py-4 sm:grid-cols-2">
                  <Field
                    label="Cancellation cutoff (hours)"
                    type="number"
                    min="0"
                    max="720"
                    value={settings.bookingCancellationHours}
                    onChange={(e) =>
                      update("bookingCancellationHours", e.target.value)
                    }
                  />
                  <Field
                    label="Booking advance window (days)"
                    type="number"
                    min="1"
                    max="365"
                    value={settings.bookingAdvanceDays}
                    onChange={(e) =>
                      update("bookingAdvanceDays", e.target.value)
                    }
                  />
                </div>
              </SectionCard>
            )}

            {activeSection === "payments" && (
              <SectionCard
                title="Payments & Commission"
                description="Review payment methods and proposed platform commission."
              >
                <div className="py-2">
                  <Field
                    label="Platform commission (%)"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.platformCommission}
                    onChange={(e) =>
                      update("platformCommission", e.target.value)
                    }
                  />
                </div>
                <Toggle
                  label="Pay now"
                  description="Allow customers to pay online during booking."
                  checked={settings.allowPayNow}
                  onChange={(value) => update("allowPayNow", value)}
                />
                <Toggle
                  label="Pay after service"
                  description="Allow customers to pay at the salon."
                  checked={settings.allowPayAfterService}
                  onChange={(value) => update("allowPayAfterService", value)}
                />
              </SectionCard>
            )}

            {activeSection === "notifications" && (
              <SectionCard
                title="Notifications"
                description="Choose which notification categories should be enabled."
              >
                <Toggle
                  label="Email notifications"
                  description="Enable platform email notifications."
                  checked={settings.emailNotifications}
                  onChange={(value) => update("emailNotifications", value)}
                />
                <Toggle
                  label="Booking notifications"
                  description="Enable booking-related notifications."
                  checked={settings.bookingNotifications}
                  onChange={(value) => update("bookingNotifications", value)}
                />
                <Toggle
                  label="Payment notifications"
                  description="Enable payment-related notifications."
                  checked={settings.paymentNotifications}
                  onChange={(value) => update("paymentNotifications", value)}
                />
              </SectionCard>
            )}

            {activeSection === "security" && (
              <SectionCard
                title="Security & Approvals"
                description="Administrative controls for platform operations."
              >
                <Toggle
                  label="Require admin approval"
                  description="Require administrator approval for salon applications."
                  checked={settings.requireAdminApproval}
                  onChange={(value) => update("requireAdminApproval", value)}
                />
              </SectionCard>
            )}

            {activeSection === "platform" && (
              <SectionCard
                title="Platform Operations"
                description="Controls for planned maintenance and platform availability."
              >
                <Toggle
                  label="Maintenance mode"
                  description="Preview setting only; this does not block customer access yet."
                  checked={settings.maintenanceMode}
                  onChange={(value) => update("maintenanceMode", value)}
                />
              </SectionCard>
            )}

            <p className="text-xs leading-5 text-slate-500">
              Settings are saved in the database when you click Save changes.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
