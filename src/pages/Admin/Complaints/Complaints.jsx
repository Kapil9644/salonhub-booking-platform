import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  MessageSquareWarning,
  Clock3,
  CheckCircle2,
  CircleAlert,
  X,
  Save,
  UserRound,
  CalendarDays,
  LoaderCircle,
} from "lucide-react";
import api from "../../../services/api";

const STATUSES = ["Open", "In Progress", "Resolved", "Closed"];

const statusStyles = {
  Open: "bg-amber-100 text-amber-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Resolved: "bg-emerald-100 text-emerald-800",
  Closed: "bg-gray-100 text-gray-700",
};

const getComplaintList = (data) => {
  if (Array.isArray(data)) return data;
  return data?.complaints || data?.data?.complaints || data?.data || [];
};

const getErrorMessage = (error) =>
  error?.response?.data?.message || "Something went wrong. Please try again.";

const formatDate = (date) => {
  if (!date) return "—";
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [complaintType, setComplaintType] = useState("customer");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [editStatus, setEditStatus] = useState("Open");
  const [adminResponse, setAdminResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Admin-only endpoint; authentication is handled by the shared API client.
      const response = await api.get("/complaints/admin");
      setComplaints(getComplaintList(response.data));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const filteredComplaints = useMemo(() => {
    const term = search.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const submitterType = complaint.submitterType || "customer";

      const matchesType = submitterType === complaintType;

      const person =
        complaintType === "salon" ? complaint.salonOwner : complaint.customer;

      const personName =
        typeof person === "object"
          ? person?.name ||
            person?.fullName ||
            person?.username ||
            person?.email ||
            ""
          : "";

      const matchesSearch =
        !term ||
        [
          complaint.complaintId,
          complaint.subject,
          complaint.category,
          complaint.description,
          personName,
          typeof person === "object" ? person?.email : "",
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "All" || complaint.status === statusFilter;

      return matchesType && matchesSearch && matchesStatus;
    });
  }, [complaints, search, statusFilter, complaintType]);

  const counts = useMemo(
    () => ({
      total: complaints.length,
      open: complaints.filter((item) => item.status === "Open").length,
      progress: complaints.filter((item) => item.status === "In Progress")
        .length,
      resolved: complaints.filter(
        (item) => item.status === "Resolved" || item.status === "Closed",
      ).length,
    }),
    [complaints],
  );

  const openDetails = (complaint) => {
    setSelected(complaint);
    setEditStatus(complaint.status || "Open");
    setAdminResponse(complaint.adminResponse || "");
    setNotice("");
  };

  const saveComplaint = async () => {
    if (!selected?._id) {
      setError("This complaint does not have a valid database ID.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await api.patch(`/complaints/admin/${selected._id}`, {
        status: editStatus,
        adminResponse: adminResponse.trim(),
      });

      const updated =
        response.data?.complaint ||
        response.data?.data?.complaint ||
        response.data?.data ||
        response.data;

      setComplaints((current) =>
        current.map((item) =>
          item._id === selected._id
            ? {
                ...item,
                ...updated,
                status: editStatus,
                adminResponse: adminResponse.trim(),
              }
            : item,
        ),
      );

      setSelected((current) =>
        current
          ? {
              ...current,
              ...updated,
              status: editStatus,
              adminResponse: adminResponse.trim(),
            }
          : current,
      );
      setNotice("Complaint updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );

  const selectedPerson =
    selected?.submitterType === "salon"
      ? selected?.salonOwner
      : selected?.customer;

  const selectedPersonLabel =
    selected?.submitterType === "salon" ? "Salon" : "Customer";

  const selectedPersonName =
    typeof selectedPerson === "object" && selectedPerson
      ? selectedPerson.name ||
        selectedPerson.fullName ||
        selectedPerson.username ||
        selectedPerson.email ||
        selectedPersonLabel
      : selectedPersonLabel;
  const selectedDisplayName =
    selected?.submitterType === "salon"
      ? selected?.salonName || "Salon name unavailable"
      : selectedPersonName;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-purple-700">
            Administration
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Complaint Management
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Review customer complaints, update their status, and send responses.
          </p>
        </div>

        <button
          type="button"
          onClick={loadComplaints}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setComplaintType("customer")}
          className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
            complaintType === "customer"
              ? "border-purple-300 bg-purple-50 ring-2 ring-purple-100"
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <span className="rounded-xl bg-purple-100 p-3 text-purple-700">
            <UserRound size={22} />
          </span>
          <span>
            <span className="block font-bold text-slate-900">
              Customer Complaints
            </span>
            <span className="mt-1 block text-sm text-gray-500">
              Customer issues and support requests
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setComplaintType("salon")}
          className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
            complaintType === "salon"
              ? "border-purple-300 bg-purple-50 ring-2 ring-purple-100"
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <span className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
            <MessageSquareWarning size={22} />
          </span>
          <span>
            <span className="block font-bold text-slate-900">
              Salon Complaints
            </span>
            <span className="mt-1 block text-sm text-gray-500">
              Salon owner issues and support requests
            </span>
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total complaints"
          value={counts.total}
          icon={MessageSquareWarning}
          color="bg-purple-100 text-purple-700"
        />
        <StatCard
          title="Open"
          value={counts.open}
          icon={CircleAlert}
          color="bg-amber-100 text-amber-700"
        />
        <StatCard
          title="In progress"
          value={counts.progress}
          icon={Clock3}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          title="Resolved / Closed"
          value={counts.resolved}
          icon={CheckCircle2}
          color="bg-emerald-100 text-emerald-700"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="relative min-w-0 flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search ID, subject, category or customer..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-purple-400"
          >
            <option value="All">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 p-12 text-gray-500">
            <LoaderCircle className="animate-spin" size={22} />
            Loading complaints...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquareWarning className="mx-auto text-gray-300" size={40} />
            <h2 className="mt-3 font-semibold text-slate-800">
              No complaints found
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Try changing the search or status filter.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Complaint</th>

                    <th className="px-5 py-4">
                      {complaintType === "salon" ? "Salon Owner" : "Customer"}
                    </th>

                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Submitted</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredComplaints.map((item) => {
                    const person =
                      complaintType === "salon"
                        ? item.salonOwner
                        : item.customer;

                    const personName =
                      typeof person === "object" && person
                        ? person.name ||
                          person.fullName ||
                          person.username ||
                          person.email ||
                          (complaintType === "salon"
                            ? "Salon Owner"
                            : "Customer")
                        : complaintType === "salon"
                          ? "Salon Owner"
                          : "Customer";

                    return (
                      <tr
                        key={item._id || item.complaintId}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-bold text-purple-700">
                            {item.complaintId}
                          </p>
                          <p className="mt-1 max-w-xs truncate font-medium text-slate-800">
                            {item.subject}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">
                            {personName}
                          </p>
                          {typeof person === "object" && person?.email && (
                            <p className="mt-1 text-xs text-gray-500">
                              {person.email}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {item.category || "—"}
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status] || statusStyles.Open}`}
                          >
                            {item.status || "Open"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => openDetails(item)}
                            className="rounded-lg bg-purple-50 px-3 py-2 font-semibold text-purple-700 hover:bg-purple-100"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {filteredComplaints.map((item) => (
                <article
                  key={item._id || item.complaintId}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="break-all text-sm font-bold text-purple-700">
                      {item.complaintId}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status] || statusStyles.Open}`}
                    >
                      {item.status || "Open"}
                    </span>
                  </div>
                  <h3 className="mt-2 font-semibold text-slate-900">
                    {item.subject}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.category} · {formatDate(item.createdAt)}
                  </p>
                  <button
                    type="button"
                    onClick={() => openDetails(item)}
                    className="mt-3 w-full rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    Manage complaint
                  </button>
                </article>
              ))}
            </div>
          </>
        )}

        {!loading && (
          <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
            Showing {filteredComplaints.length} of {complaints.length}{" "}
            complaints
          </div>
        )}
      </section>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-gray-100 bg-white p-5">
              <div className="min-w-0">
                <p className="break-all text-sm font-bold text-purple-700">
                  {selected.complaintId}
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Complaint details
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close complaint details"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Subject
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {selected.subject}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category
                  </p>
                  <p className="mt-1 text-sm text-slate-800">
                    {selected.category || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Submitted
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-800">
                    <CalendarDays size={15} /> {formatDate(selected.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {selectedPersonLabel}
                  </p>

                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-800">
                    <UserRound size={15} />
                    <span className="break-words">{selectedDisplayName}</span>
                  </p>

                  {typeof selectedPerson === "object" &&
                    selectedPerson?.email && (
                      <p className="mt-1 break-all text-xs text-gray-500">
                        {selectedPerson.email}
                      </p>
                    )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Booking ID
                  </p>
                  <p className="mt-1 break-all text-sm text-slate-800">
                    {selected.bookingId?._id ||
                      selected.bookingId ||
                      "Not provided"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {complaintType === "salon"
                    ? "Salon Owner Description"
                    : "Customer Description"}
                </p>

                <p className="mt-2 whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-6 text-slate-700">
                  {selected.description}
                </p>
              </div>

              <div>
                <label
                  htmlFor="complaint-status"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Update status
                </label>
                <select
                  id="complaint-status"
                  value={editStatus}
                  onChange={(event) => setEditStatus(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="admin-response"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Response to{" "}
                  {complaintType === "salon" ? "salon owner" : "customer"}
                </label>

                <textarea
                  id="admin-response"
                  value={adminResponse}
                  onChange={(event) => setAdminResponse(event.target.value)}
                  maxLength={2000}
                  rows={4}
                  placeholder={`Write an update or response for the ${
                    complaintType === "salon" ? "salon owner" : "customer"
                  }...`}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {adminResponse.length}/2000
                </p>
              </div>
              {notice && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                  {notice}
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={saveComplaint}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )}
                  {saving ? "Saving..." : "Reply & Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
