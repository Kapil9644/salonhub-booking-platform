import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownUp,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Layers3,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Scissors,
  Sparkles,
  Tag,
  Trash2,
  X,
  XCircle,
} from "lucide-react";

import {
  createService,
  deleteService,
  getMyServices,
  updateService,
} from "../../services/serviceService";

import { SERVICE_CATEGORIES } from "../../constants/serviceCategories";

const emptyForm = {
  category: "",
  name: "",
  description: "",
  price: "",
  duration: "",
};

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

function formatPrice(price) {
  return Number(price || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

function Notice({ notice, onDismiss }) {
  if (!notice) return null;

  const success = notice.type === "success";
  const Icon = success ? CheckCircle2 : XCircle;

  return (
    <div
      role={success ? "status" : "alert"}
      className={`flex items-start gap-3 rounded-2xl border p-4 ${
        success
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      <Icon size={20} className="mt-0.5 shrink-0" />

      <p className="flex-1 break-words text-sm font-medium">{notice.message}</p>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="rounded-lg p-1 transition hover:bg-black/5"
      >
        <X size={17} />
      </button>
    </div>
  );
}

function ServiceSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 sm:p-6"
        >
          <div className="flex justify-between">
            <div className="h-12 w-12 rounded-2xl bg-purple-100" />
            <div className="h-7 w-20 rounded-full bg-slate-100" />
          </div>
          <div className="mt-6 h-4 w-24 rounded bg-purple-100" />
          <div className="mt-3 h-6 w-3/4 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-full rounded bg-slate-100" />
          <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
          <div className="mt-7 h-16 rounded-2xl bg-slate-100" />
          <div className="mt-5 h-11 rounded-xl bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

function ServiceCard({ service, onEdit, onDelete }) {
  const active = service.isActive !== false;

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/60">
      <div className="h-1.5 bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-500" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Card heading */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-700 transition group-hover:from-purple-600 group-hover:to-fuchsia-600 group-hover:text-white">
            <Scissors size={22} />
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
              active
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                active ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            {active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Category */}
        <div className="mt-5">
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700">
            <Tag size={13} className="shrink-0" />
            <span className="break-words">{service.category || "Other"}</span>
          </span>
        </div>

        {/* Name and description */}
        <h3 className="mt-3 break-words text-lg font-extrabold leading-7 text-slate-900 sm:text-xl">
          {service.name || "Untitled Service"}
        </h3>

        <p className="mt-2 min-h-[3.25rem] whitespace-pre-line break-words text-sm leading-6 text-slate-500 [overflow-wrap:anywhere]">
          {service.description || "No description provided for this service."}
        </p>

        {/* Price and duration */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="min-w-0 rounded-2xl bg-purple-50/80 p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-purple-700">
              <IndianRupee size={14} />
              Price
            </div>

            <p className="mt-2 break-words text-xl font-extrabold text-purple-800 sm:text-2xl">
              ₹{formatPrice(service.price)}
            </p>
          </div>

          <div className="min-w-0 rounded-2xl bg-slate-50 p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Clock3 size={14} />
              Duration
            </div>

            <p className="mt-2 break-words text-xl font-extrabold text-slate-800 sm:text-2xl">
              {service.duration || 0}
              <span className="ml-1 text-xs font-semibold text-slate-500">
                min
              </span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto grid grid-cols-[1fr_auto] gap-3 pt-5">
          <button
            type="button"
            onClick={() => onEdit(service)}
            className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white px-3 py-2.5 text-sm font-bold text-purple-700 transition hover:border-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-4 focus:ring-purple-100"
          >
            <Pencil size={16} />
            Edit Service
          </button>

          <button
            type="button"
            onClick={() => onDelete(service)}
            aria-label={`Delete ${service.name}`}
            title="Delete service"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition hover:border-red-200 hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const fetchServices = useCallback(async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const data = await getMyServices();
      setServices(Array.isArray(data?.services) ? data.services : []);
    } catch (fetchError) {
      console.error("Failed to fetch services:", fetchError);
      setError(getErrorMessage(fetchError, "Failed to load services."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const categoryCounts = useMemo(() => {
    return services.reduce((counts, service) => {
      const category = service.category || "Other";
      counts[category] = (counts[category] || 0) + 1;
      return counts;
    }, {});
  }, [services]);

  const filteredServices = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    const result = services.filter((service) => {
      const matchesSearch =
        !query ||
        [service.name, service.description, service.category].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query),
        );

      const matchesCategory =
        selectedCategory === "All" ||
        (service.category || "Other") === selectedCategory;

      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Active"
          ? service.isActive !== false
          : service.isActive === false);

      return matchesSearch && matchesCategory && matchesStatus;
    });

    return result.sort((a, b) => {
      if (sortBy === "priceLow") {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      if (sortBy === "priceHigh") {
        return Number(b.price || 0) - Number(a.price || 0);
      }

      if (sortBy === "duration") {
        return Number(a.duration || 0) - Number(b.duration || 0);
      }

      return String(a.name || "").localeCompare(String(b.name || ""));
    });
  }, [services, searchText, selectedCategory, selectedStatus, sortBy]);

  const activeCount = services.filter(
    (service) => service.isActive !== false,
  ).length;

  const inactiveCount = services.length - activeCount;

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const price = Number(formData.price);
    const duration = Number(formData.duration);

    if (!formData.category) {
      setError("Please select a service category.");
      return;
    }

    if (!name) {
      setError("Please enter a service name.");
      return;
    }

    if (!Number.isFinite(price) || price < 0 || formData.price === "") {
      setError("Please enter a valid price of ₹0 or more.");
      return;
    }

    if (
      !Number.isInteger(duration) ||
      duration < 1 ||
      formData.duration === ""
    ) {
      setError("Duration must be a whole number of at least 1 minute.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice(null);

    try {
      const payload = {
        category: formData.category,
        name,
        description: formData.description.trim(),
        price,
        duration,
      };

      if (editingId) {
        await updateService(editingId, payload);
      } else {
        await createService(payload);
      }

      resetForm();

      setNotice({
        type: "success",
        message: editingId
          ? "Service updated successfully."
          : "Service added successfully.",
      });

      await fetchServices(true);
    } catch (saveError) {
      console.error("Failed to save service:", saveError);
      setError(getErrorMessage(saveError, "Failed to save service."));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service._id);

    setFormData({
      category: service.category || "Other",
      name: service.name || "",
      description: service.description || "",
      price: service.price ?? "",
      duration: service.duration ?? "",
    });

    setError("");
    setNotice(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (service) => {
    const confirmed = window.confirm(
      `Delete "${service.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(service._id);
    setError("");
    setNotice(null);

    try {
      await deleteService(service._id);

      if (editingId === service._id) {
        resetForm();
      }

      setNotice({
        type: "success",
        message: `"${service.name}" was deleted successfully.`,
      });

      await fetchServices(true);
    } catch (deleteError) {
      console.error("Failed to delete service:", deleteError);
      setError(getErrorMessage(deleteError, "Failed to delete service."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-7 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-600 sm:text-sm">
            <Sparkles size={15} />
            Salon Management
          </p>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Services
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Manage your salon menu, pricing and service duration in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchServices(true)}
          disabled={refreshing || saving || Boolean(deletingId)}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-purple-200 hover:bg-purple-50 disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <Notice notice={notice} onDismiss={() => setNotice(null)} />

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <XCircle size={19} className="mt-0.5 shrink-0" />
          <p className="flex-1 break-words">{error}</p>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
            className="rounded-lg p-1 hover:bg-red-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-600 p-5 text-white shadow-md shadow-purple-200/50">
          <div className="absolute -right-4 -top-5 h-24 w-24 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-purple-100">
                Total Services
              </p>
              <p className="mt-2 text-3xl font-extrabold">{services.length}</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <Layers3 size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Active Services
              </p>
              <p className="mt-2 text-3xl font-extrabold text-emerald-700">
                {activeCount}
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Inactive Services
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-700">
                {inactiveCount}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
              <Scissors size={24} />
            </div>
          </div>
        </div>
      </section>

      {/* Add / edit form */}
      <section
        id="service-form"
        className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm"
      >
        <div className="flex items-start gap-3 border-b border-slate-100 bg-gradient-to-r from-purple-50/80 to-white p-5 sm:p-7">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            {editingId ? <Pencil size={20} /> : <Plus size={22} />}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
              {editingId ? "Edit Service" : "Add New Service"}
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              {editingId
                ? "Update the details and save your changes."
                : "Add a service that customers can discover and book."}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-50"
            >
              <X size={16} />
              <span className="hidden sm:inline">Cancel edit</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="min-w-0 sm:col-span-2 lg:col-span-1">
              <label
                htmlFor="service-category"
                className="text-sm font-bold text-slate-700"
              >
                Service Category <span className="text-red-500">*</span>
              </label>

              <div className="relative mt-2">
                <Tag
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-purple-500"
                />
                <select
                  id="service-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={saving}
                  className="min-h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:bg-slate-50"
                >
                  <option value="">Select category</option>
                  {SERVICE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="min-w-0">
              <label
                htmlFor="service-name"
                className="text-sm font-bold text-slate-700"
              >
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                id="service-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Hair Smoothening"
                maxLength={100}
                required
                disabled={saving}
                className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:bg-slate-50"
              />
            </div>

            <div className="min-w-0">
              <label
                htmlFor="service-price"
                className="text-sm font-bold text-slate-700"
              >
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-2">
                <IndianRupee
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="service-price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 999"
                  min="0"
                  step="0.01"
                  required
                  disabled={saving}
                  className="min-h-12 w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:bg-slate-50"
                />
              </div>
            </div>

            <div className="min-w-0">
              <label
                htmlFor="service-duration"
                className="text-sm font-bold text-slate-700"
              >
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-2">
                <Clock3
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="service-duration"
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 60"
                  min="1"
                  step="1"
                  required
                  disabled={saving}
                  className="min-h-12 w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:bg-slate-50"
                />
              </div>
            </div>

            <div className="min-w-0 sm:col-span-2">
              <label
                htmlFor="service-description"
                className="text-sm font-bold text-slate-700"
              >
                Description
              </label>
              <textarea
                id="service-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this service includes..."
                maxLength={500}
                rows={3}
                disabled={saving}
                className="mt-2 min-h-12 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:bg-slate-50"
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {formData.description.length}/500
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={saving || Boolean(deletingId)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <RefreshCw size={17} className="animate-spin" />
                  Saving...
                </>
              ) : editingId ? (
                <>
                  <CheckCircle2 size={17} />
                  Update Service
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Add Service
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Categories */}
      {!loading && services.length > 0 && (
        <section>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <Layers3 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                Service Categories
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select a category to filter your service cards.
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2.5 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                selectedCategory === "All"
                  ? "border-purple-600 bg-purple-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-purple-200 hover:bg-purple-50"
              }`}
            >
              All ({services.length})
            </button>

            {Object.entries(categoryCounts).map(([category, count]) => (
              <button
                type="button"
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "border-purple-600 bg-purple-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-purple-200 hover:bg-purple-50"
                }`}
              >
                {category} ({count})
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Service listing */}
      <section className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              Your Services
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredServices.length} of {services.length} services
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[460px]">
            <div className="relative min-w-0">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search services..."
                aria-label="Search services"
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              />
            </div>

            <div className="flex min-w-0 gap-2">
              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
                aria-label="Filter by service status"
                className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <label className="relative flex min-w-0 flex-1 items-center">
                <ArrowDownUp
                  size={15}
                  className="pointer-events-none absolute left-3 text-slate-400"
                />
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  aria-label="Sort services"
                  className="min-h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-2 text-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                >
                  <option value="name">Name A–Z</option>
                  <option value="priceLow">Price: Low–High</option>
                  <option value="priceHigh">Price: High–Low</option>
                  <option value="duration">Shortest duration</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {loading ? (
          <ServiceSkeleton />
        ) : error && services.length === 0 ? (
          <div className="rounded-3xl border border-red-100 bg-white p-8 text-center sm:p-12">
            <XCircle size={34} className="mx-auto text-red-400" />
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Could not load services
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => fetchServices()}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white hover:bg-purple-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-purple-200 bg-white px-5 py-12 text-center sm:px-10 sm:py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <Scissors size={30} />
            </div>
            <h3 className="mt-5 text-xl font-extrabold text-slate-900">
              Your service menu is empty
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add your first service above with its category, price and
              duration. Your service list will appear here.
            </p>
            <button
              type="button"
              onClick={() =>
                document.getElementById("service-category")?.focus()
              }
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
            >
              <Plus size={17} />
              Start Adding a Service
            </button>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center sm:px-10 sm:py-14">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Search size={25} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No matching services
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Try a different search term or clear your filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchText("");
                setSelectedCategory("All");
                setSelectedStatus("All");
              }}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-purple-200 px-5 py-3 text-sm font-bold text-purple-700 transition hover:bg-purple-50"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {deletingId && (
          <p role="status" className="text-center text-sm text-slate-500">
            Deleting service...
          </p>
        )}
      </section>
    </main>
  );
}
