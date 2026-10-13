import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Mail,
  Phone,
  Search,
  User,
  Users,
  X,
} from "lucide-react";

import { getAllCustomers } from "../../../services/adminUserService";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllCustomers();

      setCustomers(
        Array.isArray(response?.customers) ? response.customers : [],
      );
    } catch (error) {
      console.error("Failed to load customers:", error);

      setCustomers([]);

      setError(error?.response?.data?.message || "Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      const searchableText = [
        customer?.fullName,
        customer?.name,
        customer?.email,
        customer?.phone,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [customers, searchText]);

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
          Customer Management
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">Customers</h1>

        <p className="mt-2 text-gray-500">
          View and manage customers registered on Rupiva.
        </p>
      </div>

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <section className="sticky top-16 z-30 mt-8 bg-gray-50 py-2">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search customer, phone or email..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          />

          {searchText && (
            <button
              type="button"
              onClick={() => setSearchText("")}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X size={17} />
            </button>
          )}
        </div>
      </section>

      {/* =====================================================
          COUNT
      ====================================================== */}

      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
          <Users size={21} />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Total Customers</p>

          <p className="text-xl font-bold text-slate-900">{customers.length}</p>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-purple-600" />

          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading customers...
          </p>
        </div>
      )}

      {/* =====================================================
          DESKTOP TABLE
      ====================================================== */}

      {!loading && !error && (
        <section className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="hidden lg:block">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
              {filteredCustomers.length > 0 && (
                <div className="border-t border-gray-100 bg-gray-50 pl-0 py-3 text-xs font-medium text-gray-500">
                  Showing {filteredCustomers.length} of {customers.length}{" "}
                  customers
                </div>
              )}
              <div className="grid grid-cols-[1.5fr_1.4fr_1fr_0.8fr_0.7fr] gap-5 text-xs font-bold uppercase tracking-wide text-gray-500">
                <span>Customer</span>
                <span>Email</span>
                <span>Phone</span>
                <span>Joined On</span>
                <span>Action</span>
              </div>
            </div>

            {filteredCustomers.length === 0 ? (
              <EmptyState searchText={searchText} />
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => {
                  const name =
                    customer?.fullName || customer?.name || "Unnamed Customer";

                  return (
                    <div
                      key={customer._id}
                      className="grid grid-cols-[1.5fr_1.4fr_1fr_0.8fr_0.7fr] items-center gap-5 px-6 py-5 transition hover:bg-gray-50"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar name={name} image={customer?.profileImage} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {name}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">Customer</p>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm text-gray-600">
                          {customer?.email || "Not available"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">
                          {customer?.phone || "Not available"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {formatDate(customer?.createdAt)}
                        </p>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => setSelectedCustomer(customer)}
                          className="rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* =================================================
              MOBILE / TABLET CARDS
          ================================================== */}

          <div className="lg:hidden">
            {filteredCustomers.length === 0 ? (
              <EmptyState searchText={searchText} />
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredCustomers.length > 0 && (
                  <div className="border-t border-gray-100 bg-gray-50 px-6 py-3 text-xs font-medium text-gray-500">
                    Showing {filteredCustomers.length} of {customers.length}{" "}
                    customers
                  </div>
                )}
                {filteredCustomers.map((customer) => {
                  const name =
                    customer?.fullName || customer?.name || "Unnamed Customer";

                  return (
                    <div
                      key={customer._id}
                      className="p-5 transition hover:bg-gray-50 sm:p-6"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar name={name} image={customer?.profileImage} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-bold text-slate-900">
                            {name}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">Customer</p>

                          <div className="mt-4 space-y-2.5">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail
                                size={15}
                                className="shrink-0 text-gray-400"
                              />

                              <span className="truncate">
                                {customer?.email || "Not available"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone
                                size={15}
                                className="shrink-0 text-gray-400"
                              />

                              <span>{customer?.phone || "Not available"}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <CalendarDays
                                size={15}
                                className="shrink-0 text-gray-400"
                              />

                              <span>
                                Joined On {formatDate(customer?.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedCustomer(customer)}
                        className="mt-5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
                      >
                        View Details
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          CUSTOMER DETAILS MODAL
      ====================================================== */}

      {selectedCustomer && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedCustomer(null);
            }
          }}
        >
          <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-purple-600">
                  Customer Details
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {selectedCustomer?.fullName ||
                    selectedCustomer?.name ||
                    "Customer"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-slate-900"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar
                  name={
                    selectedCustomer?.fullName ||
                    selectedCustomer?.name ||
                    "Customer"
                  }
                  image={selectedCustomer?.profileImage}
                  large
                />

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {selectedCustomer?.fullName ||
                    selectedCustomer?.name ||
                    "Unnamed Customer"}
                </h3>

                <span className="mt-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                  Customer
                </span>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <DetailItem
                  label="Full Name"
                  value={selectedCustomer?.fullName || selectedCustomer?.name}
                  icon={<User size={14} />}
                />

                <DetailItem
                  label="Email"
                  value={selectedCustomer?.email}
                  icon={<Mail size={14} />}
                />

                <DetailItem
                  label="Phone"
                  value={selectedCustomer?.phone}
                  icon={<Phone size={14} />}
                />

                <DetailItem
                  label="Joined On"
                  value={formatDate(selectedCustomer?.createdAt)}
                  icon={<CalendarDays size={14} />}
                />
              </div>
            </div>

            <div className="flex shrink-0 justify-end border-t border-gray-100 bg-gray-50 p-5">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   AVATAR
========================================================= */
function Avatar({ name, image, large = false }) {
  const [imageError, setImageError] = useState(false);

  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const sizeClass = large ? "h-20 w-20 text-2xl" : "h-11 w-11 text-sm";

  if (image && !imageError) {
    return (
      <img
        src={image}
        alt={name || "Customer"}
        className={`${sizeClass} shrink-0 rounded-full object-cover`}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-600`}
    >
      {initial}
    </div>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {icon}
        <span>{label}</span>
      </div>

      <p className="mt-2 break-words text-sm font-semibold text-slate-900">
        {value || "Not available"}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ searchText }) {
  return (
    <div className="px-5 py-14 text-center sm:px-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        <Users size={25} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No customers found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {searchText
          ? "Try searching with a different name, phone number or email."
          : "No customers are registered on Rupiva yet."}
      </p>
    </div>
  );
}
