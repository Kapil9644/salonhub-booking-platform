import { useCallback, useEffect, useState } from "react";
import {
  RefreshCw,
  Search,
  Download,
  CreditCard,
  IndianRupee,
  Clock3,
  CircleAlert,
  CheckCircle2,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  ReceiptText,
  CalendarDays,
} from "lucide-react";
import {
  getSalonOwnerPayments,
  exportSalonOwnerPayments,
} from "../../services/salonOwnerPaymentService";

const STATUSES = [
  { label: "All statuses", value: "ALL" },
  { label: "Paid", value: "PAID" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
  { label: "Refunded", value: "REFUNDED" },
];

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const dateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const shortId = (value) => {
  if (!value) return "—";
  return value.length > 18 ? `${value.slice(0, 15)}…` : value;
};

const paymentBadge = {
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
  REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
};

const refundLabel = {
  NOT_REQUESTED: "Not requested",
  PENDING: "Pending",
  PROCESSING: "Processing",
  SUCCESS: "Completed",
  FAILED: "Failed",
};

function SummaryCard({ label, value, description, icon: Icon, tone }) {
  const iconTone = {
    purple: "bg-purple-50 text-purple-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            iconTone[tone] || iconTone.purple
          }`}
        >
          <Icon size={20} />
        </span>
        <span className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          {value}
        </span>
      </div>
      <p className="mt-3 text-xs font-semibold text-slate-500 sm:text-sm">
        {label}
      </p>
      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </article>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-slate-100 py-3 sm:grid-cols-[145px_1fr] sm:gap-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <div className="break-words text-sm font-semibold text-slate-800">
        {children || "—"}
      </div>
    </div>
  );
}

export default function SalonOwnerPayments() {
  const [salon, setSalon] = useState(null);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const [draftSearch, setDraftSearch] = useState("");
  const [draftStatus, setDraftStatus] = useState("ALL");
  const [draftFrom, setDraftFrom] = useState("");
  const [draftTo, setDraftTo] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    status: "ALL",
    from: "",
    to: "",
  });

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSalonOwnerPayments({
        ...filters,
        page,
        limit: 20,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load payments.");
      }

      setSalon(response.salon || null);
      setSummary(response.summary || null);
      setTransactions(Array.isArray(response.data) ? response.data : []);
      setPagination(
        response.pagination || {
          page,
          limit: 20,
          total: 0,
          pages: 0,
        },
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load salon payments.",
      );
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const applyFilters = (event) => {
    event.preventDefault();

    if (draftFrom && draftTo && draftFrom > draftTo) {
      setError("From date must be earlier than or equal to To date.");
      return;
    }

    setPage(1);
    setFilters({
      search: draftSearch.trim(),
      status: draftStatus,
      from: draftFrom,
      to: draftTo,
    });
  };

  const clearFilters = () => {
    setDraftSearch("");
    setDraftStatus("ALL");
    setDraftFrom("");
    setDraftTo("");
    setPage(1);
    setFilters({ search: "", status: "ALL", from: "", to: "" });
  };

  const downloadCsv = async () => {
    try {
      setExporting(true);
      await exportSalonOwnerPayments(filters);
    } catch (err) {
      setError(
        err.response?.data?.message || "CSV export failed. Please try again.",
      );
    } finally {
      setExporting(false);
    }
  };

  const totalPages = pagination.pages || 0;

  return (
    <main className="w-full min-w-0 space-y-5 text-slate-900 sm:space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-purple-600">
            Rupiva for Business
          </p>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Payments</h1>
          <p className="mt-1 text-sm text-slate-500">
            {salon?.name || "Your salon"} · Transactions and refund tracking
          </p>
        </div>

        <button
          type="button"
          onClick={loadPayments}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <CircleAlert size={18} className="mt-0.5 shrink-0" />
          <div className="flex-1">{error}</div>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setError("")}
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Admin-style summary cards */}
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <SummaryCard
          label="Transactions"
          value={summary?.transactionCount ?? "—"}
          description="Recorded payment attempts"
          icon={ReceiptText}
          tone="purple"
        />
        <SummaryCard
          label="Successful Payments"
          value={money(summary?.paidAmount)}
          description={`${summary?.successfulCount ?? 0} paid transactions`}
          icon={IndianRupee}
          tone="green"
        />
        <SummaryCard
          label="Pending"
          value={summary?.pendingCount ?? "—"}
          description="Awaiting final status"
          icon={Clock3}
          tone="amber"
        />
        <SummaryCard
          label="Failed"
          value={summary?.failedCount ?? "—"}
          description="Unsuccessful attempts"
          icon={CircleAlert}
          tone="red"
        />
        <SummaryCard
          label="Refunded"
          value={summary?.refundedCount ?? "—"}
          description={`${money(summary?.refundedAmount)} recorded`}
          icon={RotateCcw}
          tone="blue"
        />
      </section>

      {/* Admin-style filters */}
      <form
        onSubmit={applyFilters}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(210px,1.6fr)_minmax(145px,0.8fr)_minmax(145px,0.8fr)_minmax(160px,0.9fr)_auto_auto] xl:items-end">
          <label className="block min-w-0">
            <span className="mb-2 block text-xs font-semibold text-slate-600">
              Search transactions
            </span>
            <span className="relative block">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={draftSearch}
                onChange={(event) => setDraftSearch(event.target.value)}
                placeholder="Order ID, customer, service..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </span>
          </label>

          <label className="block min-w-0">
            <span className="mb-2 block text-xs font-semibold text-slate-600">
              From date
            </span>
            <input
              type="date"
              value={draftFrom}
              max={draftTo || undefined}
              onChange={(event) => setDraftFrom(event.target.value)}
              className="w-full min-w-0 rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-purple-400"
            />
          </label>

          <label className="block min-w-0">
            <span className="mb-2 block text-xs font-semibold text-slate-600">
              To date
            </span>
            <input
              type="date"
              value={draftTo}
              min={draftFrom || undefined}
              onChange={(event) => setDraftTo(event.target.value)}
              className="w-full min-w-0 rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-purple-400"
            />
          </label>

          <label className="block min-w-0">
            <span className="mb-2 block text-xs font-semibold text-slate-600">
              Payment status
            </span>
            <select
              value={draftStatus}
              onChange={(event) => setDraftStatus(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-purple-400"
            >
              {STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
          >
            <Search size={15} />
            Apply Filters
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Clear Filters
          </button>
        </div>
      </form>

      {/* Transactions table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="font-extrabold text-slate-900">All transactions</h2>
            <p className="mt-1 text-xs text-slate-500">
              {loading
                ? "Loading transactions..."
                : `Showing ${transactions.length} of ${pagination.total} transactions`}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-xs text-slate-500">
              Page {pagination.page || page} of {totalPages || 1}
            </span>
            <button
              type="button"
              onClick={downloadCsv}
              disabled={exporting || loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <Download size={16} />
              {exporting ? "Exporting..." : "Download CSV"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 p-8">
            <RefreshCw size={28} className="animate-spin text-purple-600" />
            <p className="text-sm text-slate-500">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-10 text-center">
            <ReceiptText size={36} className="mx-auto text-slate-300" />
            <h3 className="mt-3 font-bold text-slate-800">
              No transactions found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try changing the filters or clearing them.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[950px] table-fixed text-left">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="w-[12%] px-4 py-4">Booking ID</th>
                    <th className="w-[19%] px-4 py-4">Order / Date</th>
                    <th className="w-[21%] px-4 py-4">Customer</th>
                    <th className="w-[13%] px-4 py-4">Amount</th>
                    <th className="w-[12%] px-4 py-4">Method</th>
                    <th className="w-[11%] px-4 py-4">Status</th>
                    <th className="w-[12%] px-4 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((transaction) => {
                    const status = transaction.paymentStatus || "PENDING";
                    const customer = transaction.user || {};

                    return (
                      <tr
                        key={transaction._id || transaction.orderId}
                        className="align-middle hover:bg-slate-50"
                      >
                        <td className="break-words px-4 py-4 text-xs font-bold text-purple-700">
                          {transaction.bookingId || "—"}
                        </td>
                        <td className="px-4 py-4">
                          <p
                            title={transaction.orderId}
                            className="break-all text-xs font-bold text-slate-900"
                          >
                            {shortId(transaction.orderId)}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {dateTime(
                              transaction.cashfreePaymentDate ||
                                transaction.createdAt,
                            )}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="break-words text-sm font-semibold text-slate-800">
                            {customer.fullName || customer.name || "Customer"}
                          </p>
                          <p className="mt-1 break-all text-xs text-slate-500">
                            {customer.email || ""}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm font-extrabold text-slate-900">
                          {money(transaction.amount)}
                        </td>
                        <td className="break-words px-4 py-4 text-xs text-slate-600">
                          {transaction.paymentMethod || "—"}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                              paymentBadge[status] ||
                              "border-slate-200 bg-slate-50 text-slate-600"
                            }`}
                          >
                            {status}
                          </span>
                          {transaction.refundStatus &&
                            transaction.refundStatus !== "NOT_REQUESTED" && (
                              <p className="mt-1 text-[10px] font-semibold text-purple-700">
                                Refund:{" "}
                                {refundLabel[transaction.refundStatus] ||
                                  transaction.refundStatus}
                              </p>
                            )}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => setSelected(transaction)}
                            className="whitespace-nowrap rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-purple-700 hover:border-purple-200 hover:bg-purple-50"
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile transaction cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {transactions.map((transaction) => {
                const customer = transaction.user || {};
                const status = transaction.paymentStatus || "PENDING";

                return (
                  <article
                    key={transaction._id || transaction.orderId}
                    className="space-y-3 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-all text-sm font-bold text-slate-900">
                          {transaction.orderId || "Transaction"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {dateTime(
                            transaction.cashfreePaymentDate ||
                              transaction.createdAt,
                          )}
                        </p>
                        <p className="mt-2 break-words text-sm font-semibold text-slate-700">
                          {customer.fullName || customer.name || "Customer"}
                        </p>
                        <p className="break-all text-xs text-slate-500">
                          {customer.email || ""}
                        </p>
                      </div>
                      <p className="shrink-0 text-base font-extrabold">
                        {money(transaction.amount)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                            paymentBadge[status] ||
                            "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          {status}
                        </span>
                        <span className="text-xs text-slate-500">
                          {transaction.paymentMethod || "—"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelected(transaction)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-purple-700"
                      >
                        View details
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Page {pagination.page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </section>

      <p className="text-xs leading-5 text-slate-500">
        Transactions and refunds shown here are based on recorded payment data.
        Settlement status is separate from the customer's payment status.
      </p>

      {/* Transaction details modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-details-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <CreditCard size={21} />
                </div>
                <div>
                  <h2
                    id="payment-details-title"
                    className="text-lg font-extrabold text-slate-900"
                  >
                    Transaction details
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {selected.orderId}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close transaction details"
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">
                Transaction amount
              </p>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                {money(selected.amount)}
              </p>
              <span
                className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                  paymentBadge[selected.paymentStatus] ||
                  "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {selected.paymentStatus || "Unknown"}
              </span>
            </div>

            <div className="mt-4">
              <DetailRow label="Salon">
                {selected.bookingData?.salon?.name || salon?.name}
              </DetailRow>
              <DetailRow label="Customer">
                {selected.user?.fullName ||
                  selected.user?.name ||
                  selected.user?.email ||
                  "Customer"}
              </DetailRow>
              <DetailRow label="Customer email">
                {selected.user?.email}
              </DetailRow>
              <DetailRow label="Services">
                {(selected.bookingData?.services || [])
                  .map((service) => service.name)
                  .filter(Boolean)
                  .join(", ")}
              </DetailRow>
              <DetailRow label="Order ID">{selected.orderId}</DetailRow>
              <DetailRow label="Cashfree order ID">
                {selected.cashfreeOrderId}
              </DetailRow>
              <DetailRow label="Payment ID">
                {selected.cashfreePaymentId}
              </DetailRow>
              <DetailRow label="Payment date">
                {dateTime(selected.cashfreePaymentDate || selected.createdAt)}
              </DetailRow>
              <DetailRow label="Payment method">
                {selected.paymentMethod}
              </DetailRow>
              <DetailRow label="Settlement status">
                {selected.settlementStatus}
              </DetailRow>
              <DetailRow label="Refund status">
                {refundLabel[selected.refundStatus] ||
                  selected.refundStatus ||
                  "Not requested"}
              </DetailRow>
              <DetailRow label="Refund amount">
                {money(selected.refundAmount)}
              </DetailRow>
              <DetailRow label="Refund reference">
                {selected.cashfreeRefundId}
              </DetailRow>
              <DetailRow label="Refund reason">
                {selected.refundReason}
              </DetailRow>
            </div>

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-5 w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white hover:bg-purple-700"
            >
              Close details
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
