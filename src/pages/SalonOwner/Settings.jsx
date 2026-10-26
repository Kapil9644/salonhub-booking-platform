import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Store,
  UserRound,
  KeyRound,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMySalon,
  toggleSalonVisibility,
  getSalonOwnerNotificationPreferences,
  updateSalonOwnerNotificationPreferences,
  changeSalonOwnerPassword,
} from "../../services/salonService";

const DEFAULT_PREFERENCES = {
  newBooking: true,
  bookingCancelled: true,
  bookingUpdates: true,
};

function SettingSection({ icon: Icon, title, description, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-100 p-4 sm:gap-4 sm:p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700 sm:h-12 sm:w-12">
          <Icon size={21} />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
        </div>
      </div>
      <div className="space-y-4 p-4 sm:p-6">{children}</div>
    </section>
  );
}

function StatusPill({ children, tone = "neutral" }) {
  const tones = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    neutral: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Notice({ type = "error", children, onDismiss }) {
  const success = type === "success";
  const Icon = success ? CheckCircle2 : AlertCircle;

  return (
    <div
      role={success ? "status" : "alert"}
      className={`flex items-start gap-3 rounded-xl border p-3.5 text-sm ${
        success
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          className="shrink-0 rounded-md px-1 font-semibold hover:opacity-70"
        >
          ×
        </button>
      )}
    </div>
  );
}

function PreferenceRow({ title, description, checked, disabled, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? "bg-purple-700" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          required
          className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 hover:text-purple-700"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
}

export default function Settings() {
  const navigate = useNavigate();

  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [updatingVisibility, setUpdatingVisibility] = useState(false);
  const [notice, setNotice] = useState(null);

  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const [savingPreference, setSavingPreference] = useState("");
  const [preferencesError, setPreferencesError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);

  const fetchSalon = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const data = await getMySalon();
      setSalon(data?.salon || null);
    } catch (error) {
      console.error("Failed to fetch salon:", error);
      setLoadError(
        error?.response?.data?.message ||
          "We couldn't load your salon settings. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPreferences = useCallback(async () => {
    setPreferencesLoading(true);
    setPreferencesError("");

    try {
      const data = await getSalonOwnerNotificationPreferences();
      const saved =
        data?.preferences ||
        data?.notificationPreferences ||
        data?.data?.preferences ||
        data?.data?.notificationPreferences ||
        data;

      setPreferences({
        newBooking:
          typeof saved?.newBooking === "boolean" ? saved.newBooking : true,
        bookingCancelled:
          typeof saved?.bookingCancelled === "boolean"
            ? saved.bookingCancelled
            : true,
        bookingUpdates:
          typeof saved?.bookingUpdates === "boolean"
            ? saved.bookingUpdates
            : true,
      });
    } catch (error) {
      console.error("Failed to load notification preferences:", error);
      setPreferencesError(
        error?.response?.data?.message ||
          "Couldn't load notification preferences. Please retry.",
      );
    } finally {
      setPreferencesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalon();
    fetchPreferences();
  }, [fetchSalon, fetchPreferences]);

  const handleToggleVisibility = async () => {
    if (!salon || updatingVisibility || loading || loadError) return;

    setNotice(null);
    setUpdatingVisibility(true);

    try {
      const data = await toggleSalonVisibility();
      const nextVisibility =
        typeof data?.isListed === "boolean"
          ? data.isListed
          : typeof data?.salon?.isListed === "boolean"
            ? data.salon.isListed
            : !salon.isListed;

      setSalon((current) =>
        current ? { ...current, isListed: nextVisibility } : current,
      );

      setNotice({
        type: "success",
        message: nextVisibility
          ? "Your salon is now visible to customers."
          : "Your salon is now hidden from customer listings.",
      });
    } catch (error) {
      console.error("Toggle salon visibility error:", error);
      setNotice({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Failed to update salon visibility. Please try again.",
      });
    } finally {
      setUpdatingVisibility(false);
    }
  };

  const handlePreferenceChange = async (key, value) => {
    if (savingPreference || preferencesLoading) return;

    const previousPreferences = { ...preferences };
    const nextPreferences = { ...preferences, [key]: value };

    setPreferences(nextPreferences);
    setSavingPreference(key);
    setPreferencesError("");
    setNotice(null);

    try {
      const data =
        await updateSalonOwnerNotificationPreferences(nextPreferences);

      const saved =
        data?.preferences ||
        data?.notificationPreferences ||
        data?.data?.preferences ||
        data?.data?.notificationPreferences;

      if (saved) {
        setPreferences({
          newBooking:
            typeof saved.newBooking === "boolean"
              ? saved.newBooking
              : nextPreferences.newBooking,
          bookingCancelled:
            typeof saved.bookingCancelled === "boolean"
              ? saved.bookingCancelled
              : nextPreferences.bookingCancelled,
          bookingUpdates:
            typeof saved.bookingUpdates === "boolean"
              ? saved.bookingUpdates
              : nextPreferences.bookingUpdates,
        });
      }

      setNotice({
        type: "success",
        message: "Notification preference saved.",
      });
    } catch (error) {
      console.error("Failed to update notification preference:", error);
      setPreferences(previousPreferences);
      setPreferencesError(
        error?.response?.data?.message ||
          "Couldn't save that preference. Your previous setting was restored.",
      );
    } finally {
      setSavingPreference("");
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({
        type: "error",
        message: "Please fill in all password fields.",
      });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        message: "Your new password must contain at least 8 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        message: "New password and confirm password do not match.",
      });
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordMessage({
        type: "error",
        message:
          "Your new password must be different from your current password.",
      });
      return;
    }

    setChangingPassword(true);

    try {
      const response = await changeSalonOwnerPassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage({
        type: "success",
        message: response?.message || "Your password was changed successfully.",
      });
    } catch (error) {
      console.error("Change password error:", error);
      setPasswordMessage({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Password change failed. Please check your current password and try again.",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const isListed = Boolean(salon?.isListed);

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 pb-8 sm:space-y-7">
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 via-purple-600 to-violet-500 p-5 text-white shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-8 -top-12 h-44 w-44 rounded-full border-[24px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-16 right-24 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold tracking-wide text-purple-50">
              <Settings2 size={14} /> RUPIVA FOR BUSINESS
            </div>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Settings
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-purple-50 sm:text-base">
              Manage salon visibility, notification preferences, and account
              security in one place.
            </p>
          </div>

          <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 sm:flex">
            <Settings2 size={27} />
          </div>
        </div>
      </header>

      {notice && (
        <Notice type={notice.type} onDismiss={() => setNotice(null)}>
          {notice.message}
        </Notice>
      )}

      {loadError && (
        <Notice>
          <p>{loadError}</p>
          <button
            type="button"
            onClick={fetchSalon}
            className="mt-2 inline-flex items-center gap-2 font-bold underline underline-offset-2"
          >
            <RefreshCw size={14} /> Try again
          </button>
        </Notice>
      )}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
            <Store size={21} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Salon listing
            </p>
            <div className="mt-1">
              {loading ? (
                <span className="text-sm font-semibold text-slate-500">
                  Checking status…
                </span>
              ) : loadError ? (
                <span className="text-sm font-semibold text-slate-500">
                  Unavailable
                </span>
              ) : (
                <StatusPill tone={isListed ? "success" : "neutral"}>
                  {isListed ? "Listed" : "Hidden"}
                </StatusPill>
              )}
            </div>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <ShieldCheck size={21} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Settings access
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              Salon owner account
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-5">
        <SettingSection
          icon={UserRound}
          title="Account"
          description="Manage your salon owner profile and account information."
        >
          <button
            type="button"
            onClick={() => navigate("/salon-owner/owner-profile")}
            className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50/60 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-purple-100 group-hover:text-purple-700">
              <UserRound size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900">Owner Profile</p>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                Update your personal and account details.
              </p>
            </div>
            <ChevronRight
              size={19}
              className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-purple-700"
            />
          </button>
        </SettingSection>

        <SettingSection
          icon={Store}
          title="Salon Settings"
          description="Control whether customers can discover your salon."
        >
          <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    isListed
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {loading ? (
                    <LoaderCircle size={21} className="animate-spin" />
                  ) : isListed ? (
                    <Eye size={21} />
                  ) : (
                    <EyeOff size={21} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900">
                      Salon visibility
                    </h3>
                    {!loading && !loadError && (
                      <StatusPill tone={isListed ? "success" : "neutral"}>
                        {isListed ? "Listed" : "Hidden"}
                      </StatusPill>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {loading
                      ? "Loading your current listing status…"
                      : loadError
                        ? "Refresh settings to check your salon status."
                        : isListed
                          ? "Your salon can appear in customer search and listings."
                          : "Your salon is hidden from customer listings. Existing bookings may still need to be managed."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleVisibility}
                disabled={
                  loading || Boolean(loadError) || !salon || updatingVisibility
                }
                className={`inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${
                  isListed
                    ? "bg-slate-900 hover:bg-slate-800 focus:ring-slate-400"
                    : "bg-purple-700 hover:bg-purple-800 focus:ring-purple-400"
                }`}
              >
                {updatingVisibility ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Updating…
                  </>
                ) : isListed ? (
                  <>
                    <EyeOff size={16} /> Hide salon
                  </>
                ) : (
                  <>
                    <Eye size={16} /> List salon
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs leading-5 text-slate-500">
            Changing visibility affects how customers discover your salon.
          </p>
        </SettingSection>

        <SettingSection
          icon={Bell}
          title="Notifications"
          description="Choose which appointment events you want to receive notifications for."
        >
          {preferencesError && (
            <Notice>
              <p>{preferencesError}</p>
              <button
                type="button"
                onClick={fetchPreferences}
                className="mt-2 inline-flex items-center gap-2 font-bold underline underline-offset-2"
              >
                <RefreshCw size={14} /> Retry loading
              </button>
            </Notice>
          )}

          {preferencesLoading ? (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-5 text-sm text-slate-600">
              <LoaderCircle
                size={18}
                className="animate-spin text-purple-700"
              />
              Loading notification preferences…
            </div>
          ) : (
            <div className="space-y-3">
              <PreferenceRow
                title="New bookings"
                description="Get notified when a customer books an appointment."
                checked={preferences.newBooking}
                disabled={Boolean(savingPreference)}
                onChange={(value) =>
                  handlePreferenceChange("newBooking", value)
                }
              />

              <PreferenceRow
                title="Booking cancellations"
                description="Get notified when a booking is cancelled."
                checked={preferences.bookingCancelled}
                disabled={Boolean(savingPreference)}
                onChange={(value) =>
                  handlePreferenceChange("bookingCancelled", value)
                }
              />

              <PreferenceRow
                title="Booking updates"
                description="Get notified when appointment details or status change."
                checked={preferences.bookingUpdates}
                disabled={Boolean(savingPreference)}
                onChange={(value) =>
                  handlePreferenceChange("bookingUpdates", value)
                }
              />

              {savingPreference && (
                <p className="flex items-center gap-2 text-xs text-slate-500">
                  <LoaderCircle size={14} className="animate-spin" />
                  Saving preference…
                </p>
              )}
            </div>
          )}

          <p className="text-xs leading-5 text-slate-500">
            Your choices are saved to your account. Actual notification creation
            must also respect these preferences on the server.
          </p>
        </SettingSection>

        <SettingSection
          icon={LockKeyhole}
          title="Security"
          description="Change your account password securely."
        >
          {passwordMessage && (
            <Notice
              type={passwordMessage.type}
              onDismiss={() => setPasswordMessage(null)}
            >
              {passwordMessage.message}
            </Notice>
          )}

          <div className="space-y-4">
            {!isPasswordFormOpen ? (
              <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                    <KeyRound size={19} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Change Password
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Update your password to keep your account secure.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPasswordMessage(null);
                    setIsPasswordFormOpen(true);
                  }}
                  className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-purple-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-800 sm:w-auto"
                >
                  <KeyRound size={17} />
                  Change Password
                </button>
              </div>
            ) : (
              <div className="space-y-4 rounded-xl border border-purple-200 bg-purple-50/30 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Update Password
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Enter your current password and choose a new one.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPasswordFormOpen(false);
                      setPasswordMessage(null);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <PasswordField
                    label="Current password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    show={showCurrentPassword}
                    onToggle={() => setShowCurrentPassword((v) => !v)}
                    autoComplete="current-password"
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <PasswordField
                      label="New password"
                      value={newPassword}
                      onChange={setNewPassword}
                      show={showNewPassword}
                      onToggle={() => setShowNewPassword((v) => !v)}
                      autoComplete="new-password"
                    />

                    <PasswordField
                      label="Confirm new password"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      show={showConfirmPassword}
                      onToggle={() => setShowConfirmPassword((v) => !v)}
                      autoComplete="new-password"
                    />
                  </div>

                  <p className="text-xs leading-5 text-slate-500">
                    Use at least 8 characters. Your new password must match the
                    confirmation field and differ from your current password.
                  </p>

                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-purple-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {changingPassword ? (
                      <>
                        <LoaderCircle size={17} className="animate-spin" />
                        Updating password...
                      </>
                    ) : (
                      <>
                        <KeyRound size={17} />
                        Save New Password
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </SettingSection>
      </div>

      <footer className="flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
        <p>
          Settings are saved through your salon owner account. If a change
          fails, an error message will appear and the previous saved setting
          will be retained.
        </p>
      </footer>
    </main>
  );
}
