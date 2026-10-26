import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  RotateCcw,
  Save,
  Sparkles,
  X,
} from "lucide-react";

import {
  getMyWorkingHours,
  updateMyWorkingHours,
} from "../../services/workingHoursService";

const days = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
];

const defaultDay = (isOpen = true) => ({
  isOpen,
  openTime: "09:00",
  closeTime: "18:00",
});

const defaultWorkingHours = {
  monday: defaultDay(),
  tuesday: defaultDay(),
  wednesday: defaultDay(),
  thursday: defaultDay(),
  friday: defaultDay(),
  saturday: defaultDay(),
  sunday: defaultDay(false),
};

function normalizeSchedule(data) {
  const source = data?.workingHours || data || {};

  return Object.fromEntries(
    days.map(({ key }) => {
      const day = source[key] || defaultWorkingHours[key];

      return [
        key,
        {
          isOpen: day.isOpen ?? defaultWorkingHours[key].isOpen,
          openTime: day.openTime || "09:00",
          closeTime: day.closeTime || "18:00",
        },
      ];
    }),
  );
}

function cloneSchedule(schedule) {
  return Object.fromEntries(days.map(({ key }) => [key, { ...schedule[key] }]));
}

function formatTime(value) {
  if (!value) return "";

  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return value;
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function validateSchedule(schedule) {
  for (const day of days) {
    const item = schedule[day.key];

    if (!item?.isOpen) continue;

    if (!item.openTime || !item.closeTime) {
      return `${day.label}: Please select both opening and closing times.`;
    }

    if (item.closeTime <= item.openTime) {
      return `${day.label}: Closing time must be later than opening time. Overnight hours are not supported by this form.`;
    }
  }

  return "";
}

function Notice({ type, message, onClose }) {
  if (!message) return null;

  const success = type === "success";

  return (
    <div
      role={success ? "status" : "alert"}
      className={`flex items-start gap-3 rounded-2xl border p-4 ${
        success
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      {success ? (
        <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
      ) : (
        <AlertCircle size={20} className="mt-0.5 shrink-0" />
      )}

      <p className="flex-1 break-words text-sm font-medium">{message}</p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss message"
        className="rounded-lg p-1 transition hover:bg-black/5"
      >
        <X size={17} />
      </button>
    </div>
  );
}

function DayRow({ day, schedule, onToggle, onTimeChange, disabled }) {
  const isOpen = Boolean(schedule?.isOpen);

  return (
    <div
      className={`grid gap-4 p-4 transition sm:p-5 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-center ${
        isOpen ? "bg-white" : "bg-slate-50/80"
      }`}
    >
      <div className="flex items-center justify-between gap-4 lg:justify-start">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
              isOpen
                ? "bg-purple-100 text-purple-700"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {day.short}
          </div>

          <div className="min-w-0">
            <p className="font-bold text-slate-900">{day.label}</p>
            <p
              className={`mt-0.5 text-xs font-semibold ${
                isOpen ? "text-emerald-600" : "text-slate-500"
              }`}
            >
              {isOpen ? "Open for bookings" : "Day off"}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isOpen}
          aria-label={`${isOpen ? "Close" : "Open"} ${day.label}`}
          disabled={disabled}
          onClick={() => onToggle(day.key)}
          className={`relative h-7 w-12 shrink-0 rounded-full transition focus:outline-none focus:ring-4 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-60 ${
            isOpen ? "bg-purple-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
              isOpen ? "left-6" : "left-1"
            }`}
          />
        </button>
      </div>

      {isOpen ? (
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
          <div className="min-w-0">
            <label
              htmlFor={`${day.key}-open`}
              className="mb-1.5 block text-xs font-bold text-slate-500"
            >
              Opening time
            </label>
            <input
              id={`${day.key}-open`}
              type="time"
              value={schedule.openTime}
              disabled={disabled}
              onChange={(event) =>
                onTimeChange(day.key, "openTime", event.target.value)
              }
              required
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:bg-slate-100"
            />
          </div>

          <span className="hidden pb-3 text-sm font-medium text-slate-400 sm:block">
            to
          </span>

          <div className="min-w-0">
            <label
              htmlFor={`${day.key}-close`}
              className="mb-1.5 block text-xs font-bold text-slate-500"
            >
              Closing time
            </label>
            <input
              id={`${day.key}-close`}
              type="time"
              value={schedule.closeTime}
              disabled={disabled}
              onChange={(event) =>
                onTimeChange(day.key, "closeTime", event.target.value)
              }
              required
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:bg-slate-100"
            />
          </div>

          <p className="text-xs text-slate-500 sm:col-span-3">
            {formatTime(schedule.openTime)} – {formatTime(schedule.closeTime)}
          </p>
        </div>
      ) : (
        <div className="flex min-h-12 items-center rounded-xl border border-dashed border-slate-200 px-4 text-sm text-slate-400">
          Closed all day
        </div>
      )}
    </div>
  );
}

export default function WorkingHours() {
  const [workingHours, setWorkingHours] = useState(() =>
    cloneSchedule(defaultWorkingHours),
  );
  const [savedWorkingHours, setSavedWorkingHours] = useState(() =>
    cloneSchedule(defaultWorkingHours),
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copySource, setCopySource] = useState("monday");
  const [copyTargets, setCopyTargets] = useState([
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ]);

  const fetchWorkingHours = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyWorkingHours();
      const normalized = normalizeSchedule(data);

      setWorkingHours(cloneSchedule(normalized));
      setSavedWorkingHours(cloneSchedule(normalized));
    } catch (fetchError) {
      console.error("Failed to fetch working hours:", fetchError);
      setError(
        fetchError?.response?.data?.message ||
          "Failed to load working hours. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkingHours();
  }, [fetchWorkingHours]);

  const isDirty = useMemo(
    () =>
      days.some(({ key }) => {
        const current = workingHours[key];
        const saved = savedWorkingHours[key];

        return (
          current?.isOpen !== saved?.isOpen ||
          current?.openTime !== saved?.openTime ||
          current?.closeTime !== saved?.closeTime
        );
      }),
    [workingHours, savedWorkingHours],
  );

  const openDays = days.filter(({ key }) => workingHours[key]?.isOpen).length;

  const validationError = useMemo(
    () => validateSchedule(workingHours),
    [workingHours],
  );

  const handleToggle = (day) => {
    setWorkingHours((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        isOpen: !previous[day]?.isOpen,
      },
    }));

    setSuccess("");
    setError("");
  };

  const handleTimeChange = (day, field, value) => {
    setWorkingHours((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        [field]: value,
      },
    }));

    setSuccess("");
    setError("");
  };

  const handleCancel = () => {
    setWorkingHours(cloneSchedule(savedWorkingHours));
    setError("");
    setSuccess("");
  };

  const handleCopySchedule = () => {
    const source = workingHours[copySource];

    if (!source || copyTargets.length === 0) {
      setError("Select at least one day to copy the schedule to.");
      return;
    }

    setWorkingHours((previous) => {
      const next = { ...previous };

      copyTargets.forEach((target) => {
        if (target !== copySource) {
          next[target] = { ...source };
        }
      });

      return next;
    });

    setError("");
    setSuccess(
      `Schedule copied to ${copyTargets
        .filter((target) => target !== copySource)
        .map(
          (target) => days.find((day) => day.key === target)?.label || target,
        )
        .join(", ")}. Save to apply the changes.`,
    );
  };

  const handleSave = async () => {
    const issue = validateSchedule(workingHours);

    if (issue) {
      setError(issue);
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = cloneSchedule(workingHours);
      const data = await updateMyWorkingHours(payload);
      const normalized = data?.workingHours
        ? normalizeSchedule(data.workingHours)
        : payload;

      setWorkingHours(cloneSchedule(normalized));
      setSavedWorkingHours(cloneSchedule(normalized));
      setSuccess("Your weekly working hours have been saved successfully.");
    } catch (saveError) {
      console.error("Failed to update working hours:", saveError);

      setError(
        saveError?.response?.data?.message ||
          "Failed to update working hours. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="h-28 animate-pulse rounded-3xl bg-purple-100" />
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          {days.map((day) => (
            <div
              key={day.key}
              className="flex animate-pulse items-center gap-4 border-b border-slate-100 p-5"
            >
              <div className="h-11 w-11 rounded-xl bg-slate-100" />
              <div className="h-4 w-28 rounded bg-slate-100" />
              <div className="ml-auto h-11 w-32 rounded-xl bg-slate-100" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-purple-600 sm:text-sm">
            <Sparkles size={15} />
            Salon Management
          </p>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Working Hours
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Set your salon’s weekly schedule so customers know when they can
            book appointments.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchWorkingHours}
          disabled={saving}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-purple-200 hover:bg-purple-50 disabled:opacity-60 sm:self-auto"
        >
          <RotateCcw size={16} />
          Reload schedule
        </button>
      </header>

      <Notice type="error" message={error} onClose={() => setError("")} />

      <Notice type="success" message={success} onClose={() => setSuccess("")} />

      {isDirty && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold">Unsaved changes</p>
            <p className="mt-1 text-sm">
              Your edited schedule has not been saved yet.
            </p>
          </div>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-purple-700 to-violet-600 p-5 text-white shadow-lg shadow-purple-100">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-purple-100">Open Days</p>
              <p className="mt-2 text-3xl font-extrabold">
                {openDays}
                <span className="ml-1 text-base font-semibold text-purple-100">
                  / 7
                </span>
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <Clock3 size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Closed Days</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {7 - openDays}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Days unavailable for bookings
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Schedule Status
          </p>
          <p
            className={`mt-2 text-xl font-extrabold ${
              validationError ? "text-red-600" : "text-emerald-700"
            }`}
          >
            {validationError ? "Needs attention" : "Ready to save"}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {validationError
              ? "Review the highlighted time settings"
              : isDirty
                ? "You have unsaved changes"
                : "Your latest saved schedule is loaded"}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
              <Clock3 size={23} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                Weekly Schedule
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Switch a day on or off and set its opening and closing times.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {days.map((day) => (
            <DayRow
              key={day.key}
              day={day}
              schedule={workingHours[day.key]}
              onToggle={handleToggle}
              onTimeChange={handleTimeChange}
              disabled={saving}
            />
          ))}
        </div>

        <div className="border-t border-slate-100 bg-slate-50/80 p-4 sm:p-6">
          {validationError && (
            <p className="mb-4 flex items-start gap-2 text-sm font-medium text-red-600">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              {validationError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving || !isDirty}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw size={16} />
              Discard changes
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !isDirty || Boolean(validationError)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving schedule...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Working Hours
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            <Copy size={20} />
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Copy a daily schedule
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Copy one day’s open/closed status and times to other days. This
              changes the form only; save your schedule to apply it.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <label
              htmlFor="copy-source"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Copy schedule from
            </label>
            <select
              id="copy-source"
              value={copySource}
              disabled={saving}
              onChange={(event) => setCopySource(event.target.value)}
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            >
              {days.map((day) => (
                <option key={day.key} value={day.key}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-bold text-slate-700">
              Apply to
            </legend>

            <div className="flex flex-wrap gap-2">
              {days
                .filter((day) => day.key !== copySource)
                .map((day) => {
                  const checked = copyTargets.includes(day.key);

                  return (
                    <label
                      key={day.key}
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                        checked
                          ? "border-purple-300 bg-purple-50 text-purple-700"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={saving}
                        onChange={(event) => {
                          setCopyTargets((previous) =>
                            event.target.checked
                              ? [...previous, day.key]
                              : previous.filter((key) => key !== day.key),
                          );
                        }}
                        className="accent-purple-600"
                      />
                      {day.short}
                    </label>
                  );
                })}
            </div>
          </fieldset>
        </div>

        <button
          type="button"
          onClick={handleCopySchedule}
          disabled={saving || copyTargets.length === 0}
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-5 py-3 text-sm font-bold text-purple-700 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Copy size={16} />
          Copy Schedule
        </button>
      </section>

      <p className="flex items-start gap-2 px-1 text-xs leading-5 text-slate-500">
        <Check size={15} className="mt-0.5 shrink-0 text-emerald-600" />
        Only save after checking each day. These hours configure your weekly
        schedule; appointment availability may also depend on your booking
        rules.
      </p>
    </main>
  );
}
