import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Scissors, Trash2, Tag } from "lucide-react";

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

export default function Services() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyServices();

      setServices(data.services || []);
    } catch (error) {
      console.error("Failed to fetch services:", error);

      setError(error.response?.data?.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      setError("Please select a service category.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        category: formData.category,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        duration: Number(formData.duration),
      };

      if (editingId) {
        await updateService(editingId, payload);
      } else {
        await createService(payload);
      }

      resetForm();

      await fetchServices();
    } catch (error) {
      console.error("Failed to save service:", error);

      setError(error.response?.data?.message || "Failed to save service.");
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (serviceId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteService(serviceId);

      if (editingId === serviceId) {
        resetForm();
      }

      await fetchServices();
    } catch (error) {
      console.error("Failed to delete service:", error);

      setError(error.response?.data?.message || "Failed to delete service.");
    }
  };

  const categoryCounts = useMemo(() => {
    return services.reduce((acc, service) => {
      const category = service.category || "Other";

      acc[category] = (acc[category] || 0) + 1;

      return acc;
    }, {});
  }, [services]);

  return (
    <div className="mx-auto max-w-7xl">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
            Salon Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">Services</h1>

          <p className="mt-2 text-gray-500">
            Add and manage the services offered by your salon.
          </p>
        </div>

        <div className="rounded-2xl bg-purple-50 px-4 py-3">
          <p className="text-xs font-medium text-purple-600">Total Services</p>

          <p className="mt-1 text-2xl font-bold text-purple-700">
            {services.length}
          </p>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}
      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {/* =====================================================
          ADD / EDIT FORM
      ====================================================== */}
      <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            {editingId ? <Pencil size={20} /> : <Plus size={21} />}
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingId ? "Edit Service" : "Add New Service"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {editingId
                ? "Update the service information below."
                : "Add a service that customers can book."}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-5 md:grid-cols-2"
        >
          {/* SERVICE CATEGORY */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Service Type
            </label>

            <div className="relative mt-2">
              <Tag
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-11 py-3.5 pr-10 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              >
                <option value="">Select service type</option>

                {SERVICE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <p className="mt-1.5 text-xs text-gray-400">
              Select the category that best matches this service.
            </p>
          </div>

          {/* SERVICE NAME */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Service Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Hair Smoothening"
              required
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 999"
              min="0"
              required
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          {/* DURATION */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Duration
            </label>

            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 60"
              min="1"
              required
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

            <p className="mt-1 text-xs text-gray-400">Duration in minutes.</p>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Description
            </label>

            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Short description"
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end md:col-span-2">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={18} />

              {saving
                ? "Saving..."
                : editingId
                  ? "Update Service"
                  : "Add Service"}
            </button>
          </div>
        </form>
      </section>

      {/* =====================================================
          CATEGORY SUMMARY
      ====================================================== */}
      {!loading && services.length > 0 && (
        <section className="mt-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Service Categories
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your services grouped by service type.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <div
                key={category}
                className="rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700"
              >
                {category}
                <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          SERVICES LIST
      ====================================================== */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Services</h2>

            <p className="mt-1 text-sm text-gray-500">
              {services.length} service
              {services.length !== 1 ? "s" : ""} added
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-5 rounded-3xl border border-gray-200 bg-white py-14 text-center shadow-sm">
            <p className="text-gray-500">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="mt-5 rounded-3xl border border-dashed border-gray-300 bg-white py-14 text-center">
            <Scissors className="mx-auto text-gray-400" size={34} />

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No Services Added
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Add your first service using the form above.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <Scissors size={20} />
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      service.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* CATEGORY */}
                <div className="mt-5">
                  <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                    {service.category || "Other"}
                  </span>
                </div>

                {/* NAME */}
                <h3 className="mt-3 text-xl font-bold text-slate-900">
                  {service.name}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-2 min-h-10 text-sm leading-5 text-gray-500">
                  {service.description || "No description provided."}
                </p>

                {/* PRICE + DURATION */}
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                  <div>
                    <p className="text-xs text-gray-400">Price</p>

                    <p className="mt-1 text-lg font-bold text-purple-600">
                      ₹{service.price}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-400">Duration</p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {service.duration} min
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(service)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(service._id)}
                    className="inline-flex items-center justify-center rounded-xl border border-red-200 px-4 py-2.5 text-red-600 transition hover:bg-red-50"
                    aria-label={`Delete ${service.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
