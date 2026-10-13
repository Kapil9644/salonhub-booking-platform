import { useCallback, useEffect, useState } from "react";
import {
  getAdminPaymentSummary,
  getAdminPayments,
  getAdminPaymentDetails,
  exportAdminPaymentsCsv,
} from "../../../services/adminPaymentService";

const STATUS_OPTIONS = ["ALL", "PAID", "PENDING", "FAILED", "REFUNDED"];

const money = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const dateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
};

const shortId = (value) =>
  value ? `${value.slice(0, 14)}${value.length > 14 ? "…" : ""}` : "—";

const displayBookingId = (value) =>
  value ? `#${String(value).slice(-6).toUpperCase()}` : "—";

const statusStyle = (status) => {
  const styles = {
    PAID: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
    FAILED: "bg-rose-50 text-rose-700 ring-rose-200",
    REFUNDED: "bg-blue-50 text-blue-700 ring-blue-200",
  };

  return styles[status] || "bg-slate-100 text-slate-700 ring-slate-200";
};

function MetricCard({ title, value, subtitle, accent = "purple" }) {
  const accents = {
    purple: "bg-purple-50 text-purple-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-rose-50 text-rose-700",
    blue: "bg-blue-50 text-blue-700",
  };

  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span
          className={`rounded-lg px-2 py-1 text-xs font-bold ${accents[accent]}`}
        >
          {accent === "green"
            ? "PAID"
            : title === "Total Transactions"
              ? "ALL"
              : "LIVE DATA"}
        </span>
      </div>
      <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

export default function Payments() {
  const [exporting, setExporting] = useState(false);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    hasMore: false,
  });

  const [status, setStatus] = useState("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const data = await getAdminPaymentSummary();
      setSummary(data.summary || {});
    } catch (err) {
      console.error("Payment summary error:", err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (status !== "ALL") params.status = status;
      if (search) params.search = search;
      if (from) params.from = from;
      if (to) params.to = to;

      const data = await getAdminPayments(params);

      setTransactions(data.transactions || []);
      setPagination((previous) => ({
        ...previous,
        ...(data.pagination || {}),
      }));
    } catch (err) {
      console.error("Payments list error:", err);
      setError(
        err.response?.data?.message || "Unable to load payment transactions.",
      );
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, status, search, from, to]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const applyFilters = (event) => {
    event.preventDefault();

    if (from && to && from > to) {
      setError("Start date cannot be after the end date.");
      return;
    }

    setError("");
    setPagination((previous) => ({ ...previous, page: 1 }));
    setSearch(searchInput.trim());
  };

  const clearFilters = () => {
    setStatus("ALL");
    setSearchInput("");
    setSearch("");
    setFrom("");
    setTo("");
    setError("");
    setPagination((previous) => ({ ...previous, page: 1 }));
  };

  const changeStatus = (value) => {
    setStatus(value);
    setPagination((previous) => ({ ...previous, page: 1 }));
  };

  const changePage = (page) => {
    setPagination((previous) => ({ ...previous, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDetails = async (transaction) => {
    setSelectedPayment(null);
    setActionError("");
    setDetailLoading(true);

    try {
      const data = await getAdminPaymentDetails(transaction._id);
      setSelectedPayment({
        transaction: data.transaction,
        booking: data.booking,
      });
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Unable to load payment details.",
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const currentSummary = summary || {};
  const statValue = (key) =>
    summaryLoading
      ? "…"
      : Number(currentSummary[key] || 0).toLocaleString("en-IN");

  const handleExportPayments = async () => {
    try {
      setExporting(true);

      const params = {};

      if (status !== "ALL") {
        params.status = status;
      }

      if (search) {
        params.search = search;
      }

      if (from) {
        params.from = from;
      }

      if (to) {
        params.to = to;
      }

      await exportAdminPaymentsCsv(params);
    } catch (error) {
      setError(
        error.response?.data?.message || "Could not download payment report.",
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-3 sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1600px] space-y-5">
        {/* Header */}
        <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-600">
              Finance & Operations
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Payments
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor customer transactions and payment statuses.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              loadSummary();
              loadPayments();
            }}
            disabled={loading || summaryLoading}
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            ↻ Refresh data
          </button>
        </header>

        {/* Metrics */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-7">
          <MetricCard
            title="Total Transactions"
            value={statValue("totalTransactions")}
            subtitle="All recorded payment attempts"
          />
          <MetricCard
            title="Successful Payments"
            value={statValue("successfulCount")}
            subtitle={
              summaryLoading
                ? "Loading…"
                : `${money(currentSummary.successfulAmount)} paid amount`
            }
            accent="green"
          />
          <MetricCard
            title="Pending"
            value={statValue("pendingCount")}
            subtitle="Awaiting final status"
            accent="amber"
          />
          <MetricCard
            title="Failed"
            value={statValue("failedCount")}
            subtitle="Unsuccessful attempts"
            accent="red"
          />
          <MetricCard
            title="Refunded"
            value={statValue("refundedCount")}
            subtitle="Marked as refunded"
            accent="blue"
          />
        </section>

        {/* Filters */}
        <section className="sticky top-16 z-30 rounded-2xl border border-slate-200 bg-white p-4 shadow-md sm:p-5">
          <form
            onSubmit={applyFilters}
            className="grid grid-cols-1 items-end gap-2 xl:grid-cols-[minmax(220px,1.6fr)_minmax(100px,0.75fr)_minmax(100px,0.75fr)_minmax(120px,0.9fr)_auto]"
          >
            <div className="min-w-0 xl:col-span-1">
              <label
                htmlFor="payment-search"
                className="mb-1.5 block text-xs font-semibold text-slate-600"
              >
                Search transactions
              </label>
              <input
                id="payment-search"
                type="search"
                maxLength={100}
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Booking ID, order ID, Cashfree reference…"
                className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label
                htmlFor="payment-from"
                className="mb-1.5 block text-xs font-semibold text-slate-600"
              >
                From date
              </label>
              <input
                id="payment-from"
                type="date"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label
                htmlFor="payment-to"
                className="mb-1.5 block text-xs font-semibold text-slate-600"
              >
                To date
              </label>
              <input
                id="payment-to"
                type="date"
                value={to}
                onChange={(event) => setTo(event.target.value)}
                min={from || undefined}
                className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label
                htmlFor="payment-status"
                className="mb-1.5 block text-xs font-semibold text-slate-600"
              >
                Payment status
              </label>
              <select
                id="payment-status"
                value={status}
                onChange={(event) => changeStatus(event.target.value)}
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option === "ALL" ? "All statuses" : option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap items-end justify-start gap-2 xl:col-span-1">
              <button
                type="submit"
                className="min-h-10 rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Apply filters
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="min-h-10 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear filters
              </button>
            </div>
          </form>
        </section>

        {/* Transactions */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="font-bold text-slate-900">All transactions</h2>
              <p className="mt-1 text-xs text-slate-500">
                {loading
                  ? "Loading transactions…"
                  : `Showing ${transactions.length} of ${pagination.total} transactions`}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <span className="text-xs text-slate-500">
                Page {pagination.page} of {Math.max(1, pagination.totalPages)}
              </span>
              <button
                type="button"
                onClick={handleExportPayments}
                disabled={exporting}
                className="min-h-10 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {exporting ? "Preparing CSV..." : "Download CSV"}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="m-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
            >
              {error}
            </div>
          )}

          {actionError && (
            <div
              role="alert"
              className="m-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
            >
              {actionError}
            </div>
          )}

          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading payment records…
            </div>
          ) : transactions.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-2xl text-purple-600">
                ₹
              </div>
              <h3 className="mt-3 font-bold text-slate-900">
                No transactions found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="divide-y divide-slate-100 md:hidden">
                {transactions.map((item) => (
                  <article key={item._id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-all text-sm font-bold text-slate-900">
                          {item.orderId || "—"}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-purple-700">
                          Booking ID: {displayBookingId(item.bookingId)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {dateTime(item.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyle(item.paymentStatus)}`}
                      >
                        {item.paymentStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">Customer</p>
                        <p className="mt-1 truncate font-medium text-slate-800">
                          {item.user?.fullName || "Unknown customer"}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {item.user?.email || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Amount</p>
                        <p className="mt-1 font-bold text-slate-900">
                          {money(item.amount, item.currency)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openDetails(item)}
                      className="min-h-10 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold text-purple-700 hover:bg-purple-50"
                    >
                      View transaction
                    </button>
                  </article>
                ))}
              </div>

              {/* Desktop/tablet table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[950px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Booking ID</th>
                      <th className="px-5 py-3 font-semibold">Order / Date</th>
                      <th className="px-5 py-3 font-semibold">Customer</th>
                      <th className="px-5 py-3 font-semibold">Amount</th>
                      <th className="px-5 py-3 font-semibold">Method</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 text-right font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((item) => (
                      <tr
                        key={item._id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-purple-700">
                            {displayBookingId(item.bookingId)}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {shortId(item.orderId)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {dateTime(item.createdAt)}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">
                            {item.user?.fullName || "Unknown customer"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.user?.email || "—"}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-900">
                          {money(item.amount, item.currency)}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {item.paymentMethod || "—"}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyle(item.paymentStatus)}`}
                          >
                            {item.paymentStatus}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => openDetails(item)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50"
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-xs text-slate-500">
                  {pagination.total} total records
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pagination.page <= 1 || loading}
                    onClick={() => changePage(pagination.page - 1)}
                    className="min-h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="min-w-16 text-center text-sm font-semibold text-slate-700">
                    {pagination.page} / {Math.max(1, pagination.totalPages)}
                  </span>
                  <button
                    type="button"
                    disabled={!pagination.hasMore || loading}
                    onClick={() => changePage(pagination.page + 1)}
                    className="min-h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        <p className="text-xs leading-5 text-slate-500">
          Amounts shown are recorded transaction amounts, not net platform
          revenue. Verify payment reconciliation and settlement data separately.
        </p>
      </div>

      {/* Transaction details modal */}
      {(detailLoading || selectedPayment) && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !detailLoading) {
              setSelectedPayment(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-detail-title"
            className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6"
          >
            {detailLoading ? (
              <p className="py-12 text-center text-sm text-slate-500">
                Loading transaction details…
              </p>
            ) : selectedPayment ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                      Transaction record
                    </p>
                    <h2
                      id="payment-detail-title"
                      className="mt-1 text-xl font-bold text-slate-900"
                    >
                      Payment details
                    </h2>
                  </div>
                  <button
                    type="button"
                    aria-label="Close payment details"
                    onClick={() => setSelectedPayment(null)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Recorded amount</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    {money(
                      selectedPayment.transaction.amount,
                      selectedPayment.transaction.currency,
                    )}
                  </p>
                  <span
                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyle(selectedPayment.transaction.paymentStatus)}`}
                  >
                    {selectedPayment.transaction.paymentStatus}
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    [
                      "Booking ID",
                      displayBookingId(
                        selectedPayment.transaction.bookingId ||
                          selectedPayment.booking?._id,
                      ),
                    ],
                    ["Order ID", selectedPayment.transaction.orderId],
                    [
                      "Cashfree Order ID",
                      selectedPayment.transaction.cashfreeOrderId,
                    ],
                    [
                      "Payment Reference",
                      selectedPayment.transaction.cashfreePaymentId,
                    ],
                    [
                      "Payment Method",
                      selectedPayment.transaction.paymentMethod,
                    ],
                    [
                      "Created At",
                      dateTime(selectedPayment.transaction.createdAt),
                    ],
                    [
                      "Payment Date",
                      dateTime(selectedPayment.transaction.cashfreePaymentDate),
                    ],
                    ["Customer", selectedPayment.transaction.user?.fullName],
                    ["Customer Email", selectedPayment.transaction.user?.email],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="min-w-0 border-b border-slate-100 pb-3"
                    >
                      <dt className="text-xs font-medium text-slate-500">
                        {label}
                      </dt>
                      <dd className="mt-1 break-words text-sm font-semibold text-slate-800">
                        {value || "—"}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5">
                  <h3 className="font-bold text-slate-900">Related booking</h3>
                  {selectedPayment.booking ? (
                    <div className="mt-2 rounded-xl border border-slate-200 p-4 text-sm">
                      <p>
                        <span className="text-slate-500">Booking ID: </span>
                        <span className="break-all font-medium">
                          {selectedPayment.booking._id}
                        </span>
                      </p>
                      <p className="mt-2">
                        <span className="text-slate-500">Status: </span>
                        <span className="font-medium">
                          {selectedPayment.booking.status || "—"}
                        </span>
                      </p>
                      <p className="mt-2">
                        <span className="text-slate-500">Payment status: </span>
                        <span className="font-medium">
                          {selectedPayment.booking.paymentStatus || "—"}
                        </span>
                      </p>
                      <p className="mt-2">
                        <span className="text-slate-500">Appointment: </span>
                        <span className="font-medium">
                          {selectedPayment.booking.date || "—"} ·{" "}
                          {selectedPayment.booking.time || "—"}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                      No booking linked to this payment order was found.
                    </p>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedPayment(null)}
                    className="min-h-10 rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Close details
                  </button>
                </div>
              </>
            ) : null}
          </section>
        </div>
      )}
    </div>
  );
}
