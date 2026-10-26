import {
  ArrowLeft,
  BadgeCheck,
  CalendarCheck,
  Check,
  Clock3,
  CreditCard,
  Home,
  MapPin,
  Receipt,
  Scissors,
  ShieldCheck,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../../layouts/Container/Container";

const formatCurrency = (amount) =>
  `₹${Number(amount ?? 0).toLocaleString("en-IN")}`;

const formatDate = (date) => {
  if (!date) return "--";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "--";

  return parsedDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatPaymentStatus = (status) => {
  const normalized = String(status || "").toUpperCase();

  const statuses = {
    PAID: {
      label: "Payment successful",
      description: "Your payment has been received.",
      style: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      dot: "bg-emerald-500",
    },
    UNPAID: {
      label: "Payment due",
      description: "Payment is due at the salon after your service.",
      style: "bg-amber-50 text-amber-700 ring-amber-200",
      dot: "bg-amber-500",
    },
    PENDING: {
      label: "Payment pending",
      description: "Your payment is awaiting confirmation.",
      style: "bg-amber-50 text-amber-700 ring-amber-200",
      dot: "bg-amber-500",
    },
    FAILED: {
      label: "Payment failed",
      description: "Check your payment status before trying again.",
      style: "bg-rose-50 text-rose-700 ring-rose-200",
      dot: "bg-rose-500",
    },
    REFUNDED: {
      label: "Payment refunded",
      description: "Your payment has been marked as refunded.",
      style: "bg-sky-50 text-sky-700 ring-sky-200",
      dot: "bg-sky-500",
    },
  };

  return (
    statuses[normalized] || {
      label: normalized || "Status unavailable",
      description: "Check My Bookings for the latest payment information.",
      style: "bg-slate-50 text-slate-700 ring-slate-200",
      dot: "bg-slate-400",
    }
  );
};

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const booking = state?.booking;
  const paymentDetails = state?.paymentDetails;

  if (!booking) {
    return (
      <Container>
        <main className="mx-auto flex min-h-[55vh] w-full max-w-xl items-center justify-center py-8">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-9">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <CalendarCheck size={27} />
            </div>

            <h1 className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl">
              Booking details unavailable
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Your booking details may still be available in My Bookings.
            </p>

            <button
              type="button"
              onClick={() => navigate("/my-bookings")}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
            >
              <CalendarCheck size={17} />
              View My Bookings
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-3 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-violet-700"
            >
              <ArrowLeft size={16} />
              Back to Home
            </button>
          </div>
        </main>
      </Container>
    );
  }

  const paymentStatus = formatPaymentStatus(
    paymentDetails?.status || booking.paymentStatus,
  );

  const paymentMethod = paymentDetails?.method || booking.paymentMethod || "";

  const isPaid =
    String(
      paymentDetails?.status || booking.paymentStatus || "",
    ).toUpperCase() === "PAID";

  const isPayAfterService = paymentMethod === "PAY_AFTER_SERVICE";

  const bookingId = booking._id
    ? String(booking._id).slice(-6).toUpperCase()
    : "--";

  const salon = booking.salon || {};
  const salonLocation = salon.location || {};

  const fullAddress = [
    salonLocation.address,
    salonLocation.area,
    salonLocation.city,
    salonLocation.state,
    salonLocation.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const services = Array.isArray(booking.services) ? booking.services : [];

  const totalDuration =
    booking.totalDuration ??
    services.reduce(
      (total, service) => total + Number(service.duration || 0),
      0,
    );

  const totalPrice = booking.totalPrice ?? 0;

  return (
    <Container>
      <main className="mx-auto w-full max-w-6xl py-3 sm:py-5">
        {/* Compact success banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-600 px-3 py-3.5 text-center text-white shadow-lg shadow-violet-200/50 sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-12 h-44 w-44 rounded-full border border-white/10" />

          <div className="relative mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-emerald-600 shadow">
              <Check size={24} strokeWidth={3} />
            </div>
          </div>

          <p className="relative mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-100 sm:text-xs">
            Rupiva · Appointment update
          </p>

          <h1 className="relative mt-1.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Booking Confirmed!
          </h1>

          <p className="relative mx-auto mt-2 max-w-lg text-xs leading-5 text-violet-100 sm:text-sm">
            Your salon appointment has been booked. Keep these details handy for
            your visit.
          </p>

          <div className="relative mx-auto mt-3 inline-flex max-w-full items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-left backdrop-blur-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <Receipt size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] text-violet-100">Booking reference</p>
              <p className="break-all text-sm font-bold tracking-wider">
                #{bookingId}
              </p>
            </div>
          </div>
        </section>

        {/* Responsive two-column content */}
        <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:gap-5">
          {/* LEFT: Appointment and services */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <CalendarCheck size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-base font-bold text-slate-900">
                  Your appointment
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Your salon visit details
                </p>
              </div>

              <BadgeCheck
                size={22}
                className="shrink-0 text-emerald-600"
                aria-label="Booking confirmation"
              />
            </div>

            {/* Date and time */}
            <div className="grid grid-cols-1 gap-2.5 p-3.5 sm:grid-cols-2 sm:p-4">
              <div className="flex min-w-0 items-start gap-2.5 rounded-xl bg-violet-50/70 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm">
                  <CalendarCheck size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] text-slate-500">Appointment date</p>
                  <p className="mt-1 break-words text-sm font-bold leading-5 text-slate-900">
                    {formatDate(booking.date)}
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 items-start gap-2.5 rounded-xl bg-violet-50/70 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm">
                  <Clock3 size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] text-slate-500">Appointment time</p>
                  <p className="mt-1 break-words text-sm font-bold leading-5 text-slate-900">
                    {booking.time || "--"}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {totalDuration} minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Salon details */}
            <div className="mx-3.5 rounded-xl border border-slate-200 p-3.5 sm:mx-4 sm:p-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Scissors size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
                    Your salon
                  </p>

                  <h3 className="mt-1 break-words text-sm font-bold text-slate-900 sm:text-base">
                    {salon.name || "Salon details unavailable"}
                  </h3>

                  {fullAddress ? (
                    <div className="mt-1.5 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
                      <MapPin
                        size={14}
                        className="mt-0.5 shrink-0 text-violet-600"
                      />
                      <span className="min-w-0 break-words">{fullAddress}</span>
                    </div>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-500">
                      Salon address unavailable.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Services list */}
            <div className="px-4 pb-4 pt-4 sm:px-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Selected services
                </h3>

                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                  {services.length}{" "}
                  {services.length === 1 ? "service" : "services"}
                </span>
              </div>

              <div className="mt-3 divide-y divide-slate-100">
                {services.length > 0 ? (
                  services.map((service, index) => (
                    <div
                      key={
                        service.id || service._id || `${service.name}-${index}`
                      }
                      className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-start gap-2.5">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                          <Scissors size={16} />
                        </div>

                        <div className="min-w-0">
                          <p className="break-words text-sm font-semibold text-slate-800">
                            {service.name || "Salon service"}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {service.duration ?? "--"} minutes
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 pt-1 text-sm font-bold text-slate-900">
                        {formatCurrency(service.price)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="py-3 text-sm text-slate-500">
                    Service details unavailable.
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="mt-4 rounded-xl bg-slate-50 p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-600">
                      Total booking amount
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {totalDuration} minutes total
                    </p>
                  </div>

                  <p className="shrink-0 text-xl font-extrabold text-violet-700">
                    {formatCurrency(totalPrice)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: Payment and actions */}
          <div className="min-w-0 space-y-4 lg:sticky lg:top-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <CreditCard size={21} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-bold text-slate-900">
                    Payment information
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Payment method and status
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2.5 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {paymentMethod === "PAY_NOW"
                      ? "Online payment"
                      : paymentMethod === "PAY_AFTER_SERVICE"
                        ? "Pay after service"
                        : "Payment method"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {isPayAfterService
                      ? "Payment due at the salon."
                      : paymentMethod === "PAY_NOW"
                        ? "Online payment status."
                        : "Payment method information unavailable."}
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit max-w-full shrink-0 items-center gap-2 rounded-full px-3 py-2 text-[11px] font-bold ring-1 ring-inset ${paymentStatus.style}`}
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${paymentStatus.dot}`}
                  />
                  {paymentStatus.label}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-sm text-slate-500">
                  {isPaid ? "Amount paid" : "Booking amount"}
                </span>

                <span className="shrink-0 text-xl font-extrabold text-slate-900">
                  {formatCurrency(paymentDetails?.amount ?? totalPrice)}
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {paymentStatus.description}
              </p>

              {paymentDetails?.orderId && (
                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-medium text-slate-500">
                    Payment order ID
                  </p>
                  <p className="mt-1 break-all text-xs font-semibold text-slate-700">
                    {paymentDetails.orderId}
                  </p>
                </div>
              )}

              {paymentDetails?.transactionId && (
                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-medium text-slate-500">
                    Transaction ID
                  </p>
                  <p className="mt-1 break-all text-xs font-semibold text-slate-700">
                    {paymentDetails.transactionId}
                  </p>
                </div>
              )}

              {paymentDetails?.paymentDate && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">Payment date</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {new Date(paymentDetails.paymentDate).toLocaleString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </span>
                </div>
              )}

              {isPayAfterService && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-800">
                  <ShieldCheck size={17} className="mt-0.5 shrink-0" />
                  <p>
                    Your appointment is booked. Complete the payment at the
                    salon after receiving your service.
                  </p>
                </div>
              )}
            </section>

            {/* Next steps */}
            <section className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                <BadgeCheck size={19} />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900">
                  You’re all set!
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Review your appointment details before visiting the salon. You
                  can access your booking anytime from My Bookings.
                </p>
              </div>
            </section>

            {/* Action buttons */}
            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => navigate("/my-bookings")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
              >
                <CalendarCheck size={17} />
                View My Bookings
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100"
              >
                <Home size={17} />
                Back to Home
              </button>
            </div>

            <p className="px-2 text-center text-[11px] leading-5 text-slate-400">
              Thank you for choosing Rupiva. Book · Style · Shine.
            </p>
          </div>
        </div>
      </main>
    </Container>
  );
}
