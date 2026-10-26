import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Clock3,
  CreditCard,
  Eye,
  EyeOff,
  MapPin,
  RefreshCw,
  Scissors,
  Store,
  XCircle,
  Settings,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getMySalon } from "../../services/salonService";
import { getSalonOwnerAppointments } from "../../services/salonOwnerBookingService";

const cardBase =
  "min-w-0 rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:border-purple-200 hover:shadow-md";

const getErrorStatus = (error) =>
  error?.response?.status ?? error?.status ?? null;

const isMissingSalonError = (error) => getErrorStatus(error) === 404;

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

function SectionTitle({ title, subtitle, action, onAction }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2.5">
      <div className="min-w-0">
        <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-purple-700 transition hover:bg-purple-50 sm:text-sm"
        >
          {action}
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

function StatCard({ label, value, description, icon: Icon, tone }) {
  const tones = {
    purple: "bg-purple-100 text-purple-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-rose-100 text-rose-700",
  };

  return (
    <div className={`${cardBase} p-3.5 sm:p-5`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium leading-5 text-slate-500 sm:text-sm">
            {label}
          </p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>
        </div>

        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${
            tones[tone] || tones.purple
          }`}
        >
          <Icon size={19} />
        </span>
      </div>

      <p className="mt-2 text-[11px] leading-4 text-slate-500 sm:text-xs">
        {description}
      </p>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, valueClass = "" }) {
  return (
    <div className="flex min-w-0 items-start gap-3 py-2.5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
        <Icon size={17} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500">{label}</p>
        <p
          className={`mt-1 break-words text-sm font-semibold text-slate-800 ${valueClass}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    Approved: {
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      label: "Approved",
    },
    Rejected: {
      icon: XCircle,
      className: "bg-rose-50 text-rose-700 ring-rose-200",
      label: "Rejected",
    },
    Pending: {
      icon: AlertCircle,
      className: "bg-amber-50 text-amber-700 ring-amber-200",
      label: "Pending Approval",
    },
  };

  const normalizedStatus =
    status === "Approved"
      ? "Approved"
      : status === "Rejected"
        ? "Rejected"
        : "Pending";

  const item = config[normalizedStatus];
  const Icon = item.icon;

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${item.className}`}
    >
      <Icon size={14} />
      {item.label}
    </span>
  );
}

function getTodayWorkingHours(workingHours) {
  if (!workingHours) return null;

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const day = days[new Date().getDay()];

  return {
    day,
    schedule: workingHours[day],
  };
}

function isToday(dateValue) {
  if (!dateValue) return false;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1440px] animate-pulse space-y-5 pb-6">
      <div>
        <div className="h-3 w-36 rounded bg-purple-100" />
        <div className="mt-3 h-8 w-52 max-w-full rounded-lg bg-slate-200" />
        <div className="mt-2 h-4 w-72 max-w-full rounded bg-slate-100" />
      </div>

      <div className="h-36 rounded-3xl bg-purple-100/70 sm:h-40" />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-28 rounded-2xl border border-slate-100 bg-white p-4"
          >
            <div className="h-3 w-24 rounded bg-slate-100" />
            <div className="mt-4 h-7 w-12 rounded bg-slate-200" />
            <div className="mt-3 h-3 w-28 max-w-full rounded bg-slate-100" />
          </div>
        ))}
      </div>

      <div className="h-40 rounded-2xl bg-slate-100" />
      <div className="h-36 rounded-2xl bg-slate-100" />

      <p className="text-center text-xs text-slate-500">
        Loading your business dashboard...
      </p>
    </div>
  );
}

function ErrorBanner({ message, onRetry, compact = false }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between ${
        compact ? "mt-3" : ""
      }`}
    >
      <div className="flex min-w-0 items-start gap-2.5">
        <AlertCircle className="mt-0.5 shrink-0 text-rose-600" size={19} />
        <p className="break-words text-sm leading-5 text-rose-800">{message}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 sm:text-sm"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      )}
    </div>
  );
}

const QUICK_ACTIONS = [
  {
    title: "Manage Services",
    description: "Update your offerings",
    icon: Scissors,
    path: "/salon-owner/services",
    iconStyle: "bg-purple-100 text-purple-700",
  },
  {
    title: "Working Hours",
    description: "Set your availability",
    icon: Clock,
    path: "/salon-owner/working-hours",
    iconStyle: "bg-blue-100 text-blue-700",
  },
  {
    title: "Appointments",
    description: "Manage your bookings",
    icon: CalendarCheck,
    path: "/salon-owner/appointments",
    iconStyle: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Payments",
    description: "Review payment details",
    icon: CreditCard,
    path: "/salon-owner/payments",
    iconStyle: "bg-amber-100 text-amber-700",
  },
];

export default function SalonOwnerDashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    salon: null,
    servicesCount: 0,
    workingHours: null,
  });

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [salonError, setSalonError] = useState("");
  const [appointmentsError, setAppointmentsError] = useState("");
  const [salonNotFound, setSalonNotFound] = useState(false);

  const fetchDashboardData = useCallback(async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setSalonError("");
    setAppointmentsError("");

    try {
      const [salonResult, appointmentResult] = await Promise.allSettled([
        getMySalon(),
        getSalonOwnerAppointments(),
      ]);

      if (salonResult.status === "fulfilled") {
        const salonData = salonResult.value;
        const salon = salonData?.salon || null;

        setDashboardData({
          salon,
          servicesCount: Number(salonData?.servicesCount) || 0,
          workingHours: salonData?.workingHours || null,
        });

        setSalonNotFound(!salon);
      } else if (isMissingSalonError(salonResult.reason)) {
        // A 404 is treated as a missing profile, not a general API failure.
        setDashboardData({
          salon: null,
          servicesCount: 0,
          workingHours: null,
        });
        setSalonNotFound(true);
      } else {
        console.error("Failed to fetch salon profile:", salonResult.reason);

        setSalonError(
          getErrorMessage(
            salonResult.reason,
            "We couldn't load your salon profile. Please try again.",
          ),
        );

        // Do not incorrectly show "No Salon Profile Found" for API errors.
        setSalonNotFound(false);
      }

      if (appointmentResult.status === "fulfilled") {
        const appointmentData = appointmentResult.value;

        setAppointments(
          Array.isArray(appointmentData?.bookings)
            ? appointmentData.bookings
            : [],
        );
      } else {
        console.error(
          "Failed to fetch salon owner appointments:",
          appointmentResult.reason,
        );

        setAppointmentsError(
          getErrorMessage(
            appointmentResult.reason,
            "We couldn't load your latest appointments.",
          ),
        );
      }
    } catch (error) {
      // Safety net for unexpected errors in the dashboard process.
      console.error("Failed to fetch salon dashboard:", error);

      setAppointmentsError(
        "Something went wrong while loading dashboard information.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const { salon, servicesCount, workingHours } = dashboardData;

  const todayAppointments = useMemo(
    () => appointments.filter((booking) => isToday(booking?.date)),
    [appointments],
  );

  const upcomingAppointments = useMemo(
    () => appointments.filter((booking) => booking?.status === "Upcoming"),
    [appointments],
  );

  const completedAppointments = useMemo(
    () => appointments.filter((booking) => booking?.status === "Completed"),
    [appointments],
  );

  const cancelledAppointments = useMemo(
    () => appointments.filter((booking) => booking?.status === "Cancelled"),
    [appointments],
  );

  const todayHours = useMemo(
    () => getTodayWorkingHours(workingHours),
    [workingHours],
  );

  if (loading) {
    return <DashboardSkeleton />;
  }

  const hasSalonLoadError = Boolean(salonError);
  const approval = salon ? salon.approvalStatus : null;

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-6 overflow-x-hidden pb-6">
      {/* Page heading */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-purple-700 sm:text-xs">
            <Sparkles size={13} />
            Rupiva for Business
          </p>

          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
            Welcome to your business overview. Keep track of your salon and
            daily bookings in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchDashboardData({ silent: true })}
          disabled={refreshing}
          className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh dashboard"}
        </button>
      </header>

      {/* Independent API errors */}
      <ErrorBanner
        message={salonError}
        onRetry={() => fetchDashboardData({ silent: true })}
      />

      <ErrorBanner
        message={appointmentsError}
        onRetry={() => fetchDashboardData({ silent: true })}
      />

      {/* Welcome / salon overview */}
      {salon ? (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-800 via-purple-700 to-fuchsia-700 text-white shadow-lg shadow-purple-200/60">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border-[28px] border-white/10 sm:h-64 sm:w-64"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 right-1/4 h-40 w-40 rounded-full bg-fuchsia-400/20 blur-2xl"
          />

          <div className="relative flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/15 shadow-sm sm:h-[72px] sm:w-[72px]">
                {salon.profileImage ? (
                  <img
                    src={salon.profileImage}
                    alt={salon.name || "Salon"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store size={28} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-purple-100 sm:text-xs">
                  Your business
                </p>

                <h2 className="mt-1 break-words text-xl font-extrabold sm:text-2xl">
                  {salon.name || "My Salon"}
                </h2>

                <p className="mt-2 flex min-w-0 items-start gap-1.5 text-xs leading-5 text-purple-100 sm:text-sm">
                  <MapPin size={15} className="mt-0.5 shrink-0" />
                  <span className="break-words">
                    {[salon.location?.area, salon.location?.city]
                      .filter(Boolean)
                      .join(", ") || "Location not set"}
                  </span>
                </p>

                <div className="mt-3">
                  <StatusBadge status={approval} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
              <button
                type="button"
                onClick={() => navigate("/salon-owner/salon-profile")}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-purple-800 shadow-sm transition hover:bg-purple-50"
              >
                <Settings size={16} />
                Manage salon
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="relative border-t border-white/15 bg-black/10 px-5 py-3 sm:px-7">
            <p className="text-xs leading-5 text-purple-50 sm:text-sm">
              {approval === "Pending"
                ? "Your salon is awaiting admin approval. It may not be visible to customers until approved."
                : approval === "Approved"
                  ? "Your salon is approved. Keep your services and working hours up to date."
                  : approval === "Rejected"
                    ? "Your salon application was rejected. Review your salon information and contact Rupiva support."
                    : "Manage your salon profile, services and business availability from your dashboard."}
            </p>
          </div>
        </section>
      ) : hasSalonLoadError ? (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <AlertCircle size={22} />
            </span>

            <div className="min-w-0">
              <h2 className="font-bold text-slate-900">
                Salon profile status unavailable
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                We couldn't confirm whether your salon profile exists. Please
                retry before making changes.
              </p>
              <button
                type="button"
                onClick={() => fetchDashboardData({ silent: true })}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800"
              >
                <RefreshCw size={15} />
                Retry
              </button>
            </div>
          </div>
        </section>
      ) : salonNotFound ? (
        <section className="relative overflow-hidden rounded-3xl border border-purple-100 bg-white p-5 text-center shadow-sm sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-50"
          />

          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
            <Store size={27} />
          </div>

          <h2 className="relative mt-4 text-lg font-bold text-slate-900 sm:text-xl">
            No Salon Profile Found
          </h2>

          <p className="relative mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500 sm:text-sm">
            Set up your salon profile to manage your business, services, working
            hours and bookings on Rupiva.
          </p>

          <button
            type="button"
            onClick={() => navigate("/salon-owner/salon-profile")}
            className="relative mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-fuchsia-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-purple-200 transition hover:from-purple-800 hover:to-fuchsia-700"
          >
            <Store size={17} />
            Set up my salon
            <ArrowRight size={16} />
          </button>
        </section>
      ) : null}

      {/* Appointment statistics */}
      <section>
        <SectionTitle
          title="Appointment overview"
          subtitle="A quick look at your booking activity"
          action="View all appointments"
          onAction={() => navigate("/salon-owner/appointments")}
        />

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard
            label="Today's bookings"
            value={todayAppointments.length}
            description="Appointments scheduled today"
            icon={CalendarDays}
            tone="purple"
          />

          <StatCard
            label="Upcoming"
            value={upcomingAppointments.length}
            description="Bookings marked as upcoming"
            icon={Clock3}
            tone="blue"
          />

          <StatCard
            label="Completed"
            value={completedAppointments.length}
            description="Successfully completed"
            icon={CalendarCheck}
            tone="green"
          />

          <StatCard
            label="Cancelled"
            value={cancelledAppointments.length}
            description="Cancelled bookings"
            icon={Activity}
            tone="red"
          />
        </div>
      </section>

      {/* Business overview */}
      <section>
        <SectionTitle
          title="Business overview"
          subtitle="Your services and customer visibility"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className={`${cardBase} p-4 sm:p-5`}>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                <Scissors size={21} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500">Active services</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">
                  {servicesCount}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Services offered by your salon
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/salon-owner/services")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-purple-700 transition hover:bg-purple-50"
                aria-label="Manage services"
                title="Manage services"
              >
                <ArrowRight size={19} />
              </button>
            </div>
          </div>

          <div className={`${cardBase} p-4 sm:p-5`}>
            <div className="flex items-center gap-3">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                  salon?.isListed
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {salon?.isListed ? <Eye size={21} /> : <EyeOff size={21} />}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500">Salon visibility</p>
                <p
                  className={`mt-1 text-xl font-extrabold ${
                    salon?.isListed ? "text-emerald-700" : "text-slate-600"
                  }`}
                >
                  {salon?.isListed ? "Listed" : "Hidden"}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {salon?.isListed
                    ? "Your salon is listed for customers"
                    : "Your salon is currently hidden"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operating status */}
      {salon && (
        <section>
          <SectionTitle
            title="Operating status"
            subtitle="Check your salon's current availability"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className={`${cardBase} p-4 sm:p-5`}>
              <InfoRow
                icon={Store}
                label="Salon status"
                value={salon.isOpen ? "Open" : "Closed"}
                valueClass={
                  salon.isOpen ? "text-emerald-700" : "text-slate-700"
                }
              />

              <p className="ml-12 text-xs leading-5 text-slate-500">
                This reflects the current salon status saved in your profile.
              </p>
            </div>

            <div className={`${cardBase} p-4 sm:p-5`}>
              <InfoRow
                icon={Clock3}
                label="Today's working hours"
                value={
                  todayHours?.schedule
                    ? todayHours.schedule.isOpen
                      ? `${todayHours.schedule.openTime || "--"} – ${
                          todayHours.schedule.closeTime || "--"
                        }`
                      : "Closed today"
                    : "Hours not available"
                }
              />

              {todayHours?.day && (
                <p className="ml-12 text-xs capitalize text-slate-500">
                  {todayHours.day}
                </p>
              )}

              <button
                type="button"
                onClick={() => navigate("/salon-owner/working-hours")}
                className="ml-12 mt-3 inline-flex items-center gap-1 rounded-lg py-1 text-xs font-semibold text-purple-700 transition hover:text-purple-900"
              >
                Manage working hours
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Quick actions */}
      <section>
        <SectionTitle
          title="Quick actions"
          subtitle="Get to your most-used tools faster"
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.path}
                type="button"
                onClick={() => navigate(action.path)}
                className="group flex min-h-32 min-w-0 flex-col items-start rounded-2xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md sm:min-h-36 sm:p-4"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-105 ${action.iconStyle}`}
                >
                  <Icon size={20} />
                </span>

                <span className="mt-3 flex w-full items-center justify-between gap-1">
                  <span className="min-w-0 break-words text-xs font-bold text-slate-800 sm:text-sm">
                    {action.title}
                  </span>
                  <ArrowRight
                    size={15}
                    className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-purple-700"
                  />
                </span>

                <span className="mt-1 text-[11px] leading-4 text-slate-500 sm:text-xs">
                  {action.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
