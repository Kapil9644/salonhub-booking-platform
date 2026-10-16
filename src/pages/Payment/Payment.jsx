import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  History,
  Landmark,
  LockKeyhole,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getMyPaymentHistory } from "../../services/paymentService";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const dateLabel = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalize = (value) => String(value || "").toUpperCase();

const statusStyle = (status) => {
  const value = normalize(status);

  if (["PAID", "SUCCESS", "REFUNDED"].includes(value)) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (value === "FAILED") {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }

  if (["PENDING", "PROCESSING"].includes(value)) {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }

  return "bg-slate-100 text-slate-600 ring-slate-200";
};

function SummaryCard({ icon: Icon, label, value, note, color = "purple" }) {
  const colors = {
    purple: "bg-purple-50 text-purple-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[color]}`}
        >
          <Icon size={21} />
        </span>
        <span className="text-xs font-medium text-slate-400">Rupiva</span>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-2xl font-extrabold text-slate-900">
        {value}
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{note}</p>
    </article>
  );
}

function PaymentMethodCard({ icon: Icon, title, description, tag }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          <Icon size={23} />
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
          {tag}
        </span>
      </div>

      <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
      <p className="mt-1 flex-1 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </article>
  );
}

function SectionButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition ${
        active
          ? "bg-purple-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
      }`}
    >
      <Icon size={17} />
      {children}
    </button>
  );
}

export default function Payment() {
  const [result, setResult] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeSection, setActiveSection] = useState("overview");

  const fetchHistory = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyPaymentHistory(page, 10);
      const rows = Array.isArray(response?.data) ? response.data : [];

      setResult(response);
      setTransactions(rows);
      setPagination(
        response?.pagination || {
          page,
          limit: 10,
          total: rows.length,
          pages: 1,
        },
      );
    } catch (err) {
      console.error("Customer payment history error:", err);
      setError(
        err.response?.data?.message ||
          "Payment information could not be loaded. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(1);
  }, [fetchHistory]);

  const summary = result?.summary || {};

  // Fallback calculations keep the page useful if the API summary is incomplete.
  const totalTransactions = Number(
    summary.totalTransactions ?? pagination.total ?? transactions.length,
  );

  const calculatedPaidAmount = transactions.reduce((total, item) => {
    const status = normalize(item.paymentStatus);

    return ["PAID", "REFUNDED"].includes(status)
      ? total + Number(item.amount || 0)
      : total;
  }, 0);

  const calculatedRefundAmount = transactions.reduce((total, item) => {
    return normalize(item.refundStatus) === "SUCCESS"
      ? total + Number(item.refundAmount || 0)
      : total;
  }, 0);

  const paidAmount =
    Number(summary.paidAmount) > 0
      ? Number(summary.paidAmount)
      : calculatedPaidAmount;

  const refundedAmount =
    Number(summary.refundedAmount) > 0
      ? Number(summary.refundedAmount)
      : calculatedRefundAmount;

  const paidTransactions = transactions.filter((item) =>
    ["PAID", "REFUNDED"].includes(normalize(item.paymentStatus)),
  ).length;

  const pendingRefunds = transactions.filter((item) =>
    ["PENDING", "PROCESSING"].includes(normalize(item.refundStatus)),
  ).length;

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((item) => {
      const paymentStatus = normalize(item.paymentStatus);
      const refundStatus = normalize(item.refundStatus);
      const booking = item.bookingData || {};
      const salon = booking.salon || {};

      if (statusFilter === "REFUNDED") {
        if (paymentStatus !== "REFUNDED" && refundStatus !== "SUCCESS") {
          return false;
        }
      } else if (statusFilter !== "ALL" && paymentStatus !== statusFilter) {
        return false;
      }

      const serviceNames = (booking.services || []).map((service) =>
        typeof service === "string" ? service : service?.name || "",
      );

      const searchable = [
        item.orderId,
        item.cashfreeOrderId,
        item.cashfreePaymentId,
        item.cashfreeRefundId,
        salon.name,
        booking.salonName,
        ...serviceNames,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return !query || searchable.includes(query);
    });
  }, [transactions, search, statusFilter]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Heading */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">
              <ShieldCheck size={17} />
              SECURE PAYMENTS
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Payments & Wallet
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Manage your booking payments, payment options and refunds in one
              place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchHistory(pagination.page || 1)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 p-6 text-white shadow-lg sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 h-48 w-48 rounded-full bg-white/5" />

          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
                <LockKeyhole size={14} />
                Secure checkout with Cashfree
              </span>

              <h2 className="mt-4 max-w-xl text-2xl font-extrabold sm:text-3xl">
                Every booking. Every payment. All in one place.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-purple-100 sm:text-base">
                Pay securely during booking and track your transaction and
                refund updates from your Rupiva account.
              </p>

              <Link
                to="/salons"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-purple-700 transition hover:bg-purple-50"
              >
                Explore salons
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="hidden h-32 w-32 items-center justify-center rounded-3xl border border-white/20 bg-white/10 md:flex">
              <CreditCard size={66} strokeWidth={1.3} />
            </div>
          </div>
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={History}
            label="Total Transactions"
            value={loading && !result ? "—" : totalTransactions}
            note="All recorded payment attempts"
          />

          <SummaryCard
            icon={Banknote}
            label="Recorded Payments"
            value={money(paidAmount)}
            note={`${paidTransactions} paid or refunded transactions on this page`}
            color="green"
          />

          <SummaryCard
            icon={RotateCcw}
            label="Successful Refunds"
            value={money(refundedAmount)}
            note="Only refunds marked SUCCESS are counted here"
            color="orange"
          />

          <SummaryCard
            icon={Clock3}
            label="Refunds in Progress"
            value={loading && !result ? "—" : pendingRefunds}
            note="Pending or processing on this page"
            color="blue"
          />
        </section>

        {/* Tabs */}
        <nav className="flex max-w-full gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2">
          <SectionButton
            active={activeSection === "overview"}
            onClick={() => setActiveSection("overview")}
            icon={CreditCard}
          >
            Overview
          </SectionButton>

          <SectionButton
            active={activeSection === "methods"}
            onClick={() => setActiveSection("methods")}
            icon={Wallet}
          >
            Payment methods
          </SectionButton>

          <SectionButton
            active={activeSection === "history"}
            onClick={() => setActiveSection("history")}
            icon={History}
          >
            Transaction history
          </SectionButton>
        </nav>

        {/* Overview */}
        {activeSection === "overview" && (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Quick payment options
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Payment methods available during checkout.
                  </p>
                </div>

                <span className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <CreditCard size={21} />
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <PaymentMethodCard
                  icon={Smartphone}
                  title="UPI"
                  description="Use a supported UPI app or UPI ID if offered in the Cashfree checkout."
                  tag="At checkout"
                />

                <PaymentMethodCard
                  icon={CreditCard}
                  title="Credit & debit cards"
                  description="Choose an eligible card option shown in the secure payment window."
                  tag="At checkout"
                />

                <PaymentMethodCard
                  icon={Landmark}
                  title="Net banking"
                  description="Choose from the supported banks presented by the payment gateway."
                  tag="At checkout"
                />

                <PaymentMethodCard
                  icon={Banknote}
                  title="Other methods"
                  description="Availability depends on the payment gateway configuration and eligibility."
                  tag="If available"
                />
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-800">
                <LockKeyhole className="mt-0.5 shrink-0" size={18} />
                <p>
                  These are payment categories, not saved payment instruments.
                  Actual options appear at checkout. Never share your UPI PIN or
                  card OTP with anyone.
                </p>
              </div>
            </section>

            <div className="space-y-6">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="bg-slate-900 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                      <Wallet size={23} />
                    </span>

                    <span className="rounded-full bg-amber-300/15 px-3 py-1 text-xs font-semibold text-amber-200">
                      Coming soon
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-slate-300">Rupiva Wallet</p>
                  <p className="mt-1 text-2xl font-extrabold">
                    Wallet not enabled
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Wallet balance, top-ups and wallet payments will be
                    available after the wallet backend is implemented.
                  </p>
                </div>

                <div className="space-y-3 p-5">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 size={17} className="text-purple-600" />
                    Payment history available
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Clock3 size={17} className="text-purple-600" />
                    Wallet top-ups are not active yet
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <RotateCcw size={21} />
                  </span>

                  <div>
                    <h2 className="font-extrabold text-slate-900">
                      Refund tracking
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      View refund statuses and references for eligible prepaid
                      bookings. A cancelled booking does not by itself confirm
                      that a refund has completed.
                    </p>

                    <button
                      type="button"
                      onClick={() => setActiveSection("history")}
                      className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-purple-700 hover:text-purple-900"
                    >
                      View transactions
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Payment methods */}
        {activeSection === "methods" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              Payment methods
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              The actual options depend on Cashfree checkout configuration.
              Rupiva does not currently provide saved-card management or an
              active wallet top-up feature on this page.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <PaymentMethodCard
                icon={Smartphone}
                title="UPI"
                description="UPI apps or UPI ID, when offered in checkout."
                tag="Gateway option"
              />

              <PaymentMethodCard
                icon={CreditCard}
                title="Credit / debit card"
                description="Supported card networks and eligible cards."
                tag="Gateway option"
              />

              <PaymentMethodCard
                icon={Landmark}
                title="Net banking"
                description="Participating banks displayed by the gateway."
                tag="Gateway option"
              />

              <PaymentMethodCard
                icon={Wallet}
                title="Rupiva Wallet"
                description="Wallet balance, add-money and wallet payments are not implemented yet."
                tag="Coming soon"
              />
            </div>

            <Link
              to="/salons"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white hover:bg-purple-700"
            >
              Book a service to pay
              <ArrowUpRight size={17} />
            </Link>
          </section>
        )}

        {/* Transaction history */}
        {activeSection === "history" && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Transaction history
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {pagination.total || 0} recorded transactions
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="relative block">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search order or salon..."
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100 sm:w-64"
                    />
                  </label>

                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-purple-400"
                  >
                    <option value="ALL">All statuses</option>
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="m-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => fetchHistory(pagination.page || 1)}
                  className="mt-2 font-bold underline"
                >
                  Try again
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex min-h-52 flex-col items-center justify-center p-8 text-slate-500">
                <RefreshCw size={28} className="animate-spin text-purple-600" />
                <p className="mt-3 text-sm">Loading transactions...</p>
              </div>
            ) : !error && filteredTransactions.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center px-5 py-12 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <History size={29} />
                </span>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {transactions.length
                    ? "No matching transactions"
                    : "No transactions yet"}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {transactions.length
                    ? "Try a different search term or payment status."
                    : "Your recorded prepaid booking payment attempts will appear here."}
                </p>

                {transactions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("ALL");
                    }}
                    className="mt-4 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredTransactions.map((item) => {
                  const booking = item.bookingData || {};
                  const salon = booking.salon || {};

                  const services = (booking.services || [])
                    .map((service) =>
                      typeof service === "string"
                        ? service
                        : service?.name || "",
                    )
                    .filter(Boolean);

                  const paymentStatus =
                    normalize(item.paymentStatus) || "UNKNOWN";
                  const refundStatus =
                    normalize(item.refundStatus) || "NOT_REQUESTED";

                  const refundLabel =
                    refundStatus === "NOT_REQUESTED"
                      ? "NOT REQUESTED"
                      : refundStatus.replaceAll("_", " ");

                  const refundMessage =
                    refundStatus === "SUCCESS"
                      ? `Refund completed: ${money(item.refundAmount)}`
                      : refundStatus === "FAILED"
                        ? `Refund failed — attempted amount: ${money(item.refundAmount)}`
                        : ["PENDING", "PROCESSING"].includes(refundStatus)
                          ? `Refund being processed: ${money(item.refundAmount)}`
                          : "";

                  return (
                    <article
                      key={item._id || item.orderId}
                      className="p-5 transition hover:bg-slate-50/70 sm:p-6"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex min-w-0 gap-3">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <CreditCard size={22} />
                          </span>

                          <div className="min-w-0">
                            <h3 className="break-words font-bold text-slate-900">
                              {salon.name ||
                                booking.salonName ||
                                "Salon booking payment"}
                            </h3>

                            <p className="mt-1 break-words text-xs text-slate-500">
                              Order ID: {item.orderId || "Unavailable"}
                            </p>

                            {services.length > 0 && (
                              <p className="mt-1 text-sm text-slate-600">
                                {services.join(", ")}
                              </p>
                            )}

                            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                              <CalendarDays size={14} />
                              {dateLabel(item.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="md:text-right">
                          <p className="text-2xl font-extrabold text-slate-900">
                            {money(item.amount)}
                          </p>

                          <span
                            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${statusStyle(paymentStatus)}`}
                          >
                            {paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <p className="text-xs text-slate-500">
                            Payment method
                          </p>
                          <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                            {item.paymentMethod || "PAY_NOW"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Payment reference
                          </p>
                          <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                            {item.cashfreePaymentId ||
                              item.cashfreeOrderId ||
                              "Not available"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Refund status
                          </p>

                          <span
                            className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${statusStyle(refundStatus)}`}
                          >
                            {refundLabel}
                          </span>

                          {refundMessage && (
                            <p
                              className={`mt-1 text-sm font-semibold ${
                                refundStatus === "SUCCESS"
                                  ? "text-emerald-700"
                                  : refundStatus === "FAILED"
                                    ? "text-rose-700"
                                    : "text-amber-700"
                              }`}
                            >
                              {refundMessage}
                            </p>
                          )}

                          {item.cashfreeRefundId && (
                            <p className="mt-1 break-all text-xs text-slate-500">
                              Refund reference: {item.cashfreeRefundId}
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 p-4 sm:flex-row sm:px-6">
              <p className="text-sm text-slate-500">
                Page {pagination.page || 1} of{" "}
                {Math.max(1, pagination.pages || 1)}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={loading || (pagination.page || 1) <= 1}
                  onClick={() => fetchHistory((pagination.page || 1) - 1)}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    loading || (pagination.page || 1) >= (pagination.pages || 1)
                  }
                  onClick={() => fetchHistory((pagination.page || 1) + 1)}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </section>
        )}

        <footer className="flex flex-col items-center justify-between gap-2 pb-4 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
          <p>Rupiva · Book. Style. Shine.</p>
          <p className="inline-flex items-center gap-1.5">
            <BadgeCheck size={14} />
            Payment options are provided by the payment gateway at checkout.
          </p>
        </footer>
      </div>
    </main>
  );
}
