import { useEffect, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Moon,
  Sun,
} from "lucide-react";

const days = [
  { key: "monday", label: "Monday", short: "Mon", value: 1 },
  { key: "tuesday", label: "Tuesday", short: "Tue", value: 2 },
  { key: "wednesday", label: "Wednesday", short: "Wed", value: 3 },
  { key: "thursday", label: "Thursday", short: "Thu", value: 4 },
  { key: "friday", label: "Friday", short: "Fri", value: 5 },
  { key: "saturday", label: "Saturday", short: "Sat", value: 6 },
  { key: "sunday", label: "Sunday", short: "Sun", value: 0 },
];

const parseTime = (value) => {
  if (!value || typeof value !== "string") return null;

  const time = value.trim();

  // Supports 24-hour values such as 09:30 or 21:00.
  const twentyFourHour = time.match(/^(\d{1,2}):(\d{2})$/);

  if (twentyFourHour) {
    const hours = Number(twentyFourHour[1]);
    const minutes = Number(twentyFourHour[2]);

    if (hours > 23 || minutes > 59) return null;

    return hours * 60 + minutes;
  }

  // Supports values such as 9:30 AM or 8:00 PM.
  const twelveHour = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (twelveHour) {
    let hours = Number(twelveHour[1]);
    const minutes = Number(twelveHour[2]);
    const period = twelveHour[3].toUpperCase();

    if (hours < 1 || hours > 12 || minutes > 59) return null;

    if (period === "AM") {
      hours = hours === 12 ? 0 : hours;
    } else {
      hours = hours === 12 ? 12 : hours + 12;
    }

    return hours * 60 + minutes;
  }

  return null;
};

const formatTime = (value) => {
  if (!value) return "Time unavailable";

  const minutes = parseTime(value);

  if (minutes === null) return value;

  const date = new Date();
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getTodayStatus = (schedule, now) => {
  if (!schedule?.isOpen) {
    return { isOpenNow: false, label: "Closed Today" };
  }

  const open = parseTime(schedule.openTime);
  const close = parseTime(schedule.closeTime);

  if (open === null || close === null) {
    return { isOpenNow: null, label: "Hours Listed" };
  }

  const current = now.getHours() * 60 + now.getMinutes();

  // Equal opening and closing times are treated as unavailable,
  // not as a 24-hour opening.
  if (open === close) {
    return { isOpenNow: false, label: "Closed Now" };
  }

  let isOpenNow;

  if (close > open) {
    isOpenNow = current >= open && current < close;
  } else {
    // Overnight hours, e.g. 6:00 PM to 2:00 AM.
    isOpenNow = current >= open || current < close;
  }

  return {
    isOpenNow,
    label: isOpenNow ? "Open Now" : "Closed Now",
  };
};

export default function WorkingHours({ workingHours }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  const today = now.getDay();
  const todayInfo = days.find((day) => day.value === today);
  const todaySchedule = workingHours?.[todayInfo?.key];
  const status = getTodayStatus(todaySchedule, now);

  return (
    <section
      id="salon-working-hours"
      className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:mt-7 sm:rounded-3xl"
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded((previous) => !previous)}
        aria-expanded={isExpanded}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-slate-50/70 sm:px-6 sm:py-5"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            <CalendarClock size={21} />
          </span>

          <span className="min-w-0">
            <span className="block text-lg font-bold text-slate-900 sm:text-xl">
              Working Hours
            </span>
            <span className="mt-0.5 block text-sm text-slate-500">
              Opening and closing schedule
            </span>
          </span>
        </span>

        <ChevronDown
          size={20}
          className={`shrink-0 text-slate-500 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Today's status */}
      <div className="px-4 pb-4 sm:px-6">
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl border p-3.5 sm:p-4 ${
            status.isOpenNow === true
              ? "border-emerald-100 bg-emerald-50"
              : status.isOpenNow === false
                ? "border-rose-100 bg-rose-50"
                : "border-amber-100 bg-amber-50"
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                status.isOpenNow === true
                  ? "bg-white text-emerald-600"
                  : status.isOpenNow === false
                    ? "bg-white text-rose-500"
                    : "bg-white text-amber-600"
              }`}
            >
              {status.isOpenNow === true ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </span>

            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">{status.label}</p>
              <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">
                {todayInfo?.label}
                {todaySchedule?.isOpen &&
                todaySchedule.openTime &&
                todaySchedule.closeTime
                  ? ` · ${formatTime(todaySchedule.openTime)} – ${formatTime(todaySchedule.closeTime)}`
                  : " · Check the schedule below"}
              </p>
            </div>
          </div>

          {status.isOpenNow === true && (
            <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
          )}
        </div>
      </div>

      {/* Weekly schedule */}
      {isExpanded && (
        <div className="border-t border-slate-100 px-3 pb-4 pt-3 sm:px-5 sm:pb-5">
          <div className="mb-3 flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-slate-800">
              Weekly Schedule
            </h3>
            <span className="text-xs text-slate-400">Local time</span>
          </div>

          <div className="space-y-1">
            {days.map((day) => {
              const schedule = workingHours?.[day.key];
              const isToday = today === day.value;
              const isOpen = Boolean(schedule?.isOpen);

              return (
                <div
                  key={day.key}
                  className={`flex min-h-[58px] items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition sm:px-4 ${
                    isToday
                      ? "border-purple-200 bg-purple-50"
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        isToday
                          ? "bg-purple-700 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {day.short}
                    </span>

                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          isToday ? "text-purple-800" : "text-slate-700"
                        }`}
                      >
                        {day.label}
                      </p>

                      {isToday && (
                        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-600">
                          Today
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {isOpen ? (
                      <>
                        <p className="text-xs font-semibold text-slate-800 sm:text-sm">
                          {formatTime(schedule.openTime)}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          to {formatTime(schedule.closeTime)}
                        </p>
                      </>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                        Closed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-4 px-2 text-xs leading-5 text-slate-500">
            Hours are shown in your device&apos;s local time. Please confirm
            special holiday hours with the salon.
          </p>
        </div>
      )}
    </section>
  );
}
