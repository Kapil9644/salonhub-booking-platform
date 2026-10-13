import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Search,
  Store,
  User,
  X,
} from "lucide-react";

import { getAllSalons } from "../../../services/adminSalonService";

const STATUS_TABS = [
  {
    key: "All",
    label: "All",
    icon: Store,
  },
  {
    key: "Approved",
    label: "Approved",
    icon: CheckCircle2,
  },
  {
    key: "Pending",
    label: "Pending",
    icon: Clock3,
  },
  {
    key: "Rejected",
    label: "Rejected",
    icon: AlertCircle,
  },
];

const getStatusClasses = (status) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";

    case "Pending":
      return "bg-amber-100 text-amber-700";

    case "Rejected":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getListingClasses = (isListed) => {
  return isListed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600";
};

export default function Salons() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [selectedSalon, setSelectedSalon] = useState(null);

  const fetchSalons = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllSalons();

      setSalons(data?.salons || []);
    } catch (error) {
      console.error("Failed to fetch salons:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load salons. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalons();
  }, []);

  const filteredSalons = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return salons.filter((salon) => {
      const matchesStatus =
        selectedStatus === "All" || salon.approvalStatus === selectedStatus;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableText = [
        salon.name,
        salon.about,
        salon.phone,
        salon.email,
        salon.location?.address,
        salon.location?.area,
        salon.location?.city,
        salon.location?.state,
        salon.location?.pincode,
        salon.owner?.fullName,
        salon.owner?.phone,
        salon.owner?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [salons, searchText, selectedStatus]);

  const statusCounts = useMemo(() => {
    return {
      All: salons.length,
      Approved: salons.filter((salon) => salon.approvalStatus === "Approved")
        .length,
      Pending: salons.filter((salon) => salon.approvalStatus === "Pending")
        .length,
      Rejected: salons.filter((salon) => salon.approvalStatus === "Rejected")
        .length,
    };
  }, [salons]);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
          Salon Management
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">Salons</h1>

        <p className="mt-2 text-gray-500">
          View and manage all salons registered on Rupiva.
        </p>
      </div>

      {/* Search */}
      {/* Search */}
      <section className="sticky top-16 z-30 mt-3 bg-gray-50 py-2">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search salon, owner, location, phone or email..."
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
          />

          {searchText && (
            <button
              type="button"
              onClick={() => setSearchText("")}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X size={17} />
            </button>
          )}
        </div>
      </section>

      {/* Status tabs */}
      <div className="mt-6 overflow-x-auto pb-1">
        <div className="flex min-w-max gap-2">
          {STATUS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedStatus === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedStatus(tab.key)}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-purple-600 text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                <Icon size={17} />

                <span>{tab.label}</span>

                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {statusCounts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-semibold">Unable to load salons</p>

            <p className="mt-1">{error}</p>

            <button
              type="button"
              onClick={fetchSalons}
              className="mt-3 font-semibold underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600" />

            <p className="mt-4 text-sm font-medium text-gray-500">
              Loading salons...
            </p>
          </div>
        </section>
      ) : filteredSalons.length === 0 ? (
        /* Empty */
        <section className="mt-6 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-500">
            <Store size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No salons found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            {searchText
              ? "No salons match your search. Try another name, owner, location or contact detail."
              : `There are no ${selectedStatus.toLowerCase()} salons right now.`}
          </p>

          {(searchText || selectedStatus !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchText("");
                setSelectedStatus("All");
              }}
              className="mt-5 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Clear Filters
            </button>
          )}
        </section>
      ) : (
        /* Salon list */
        <section className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            {/* Result count */}
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-xs text-gray-500 sm:px-6">
              Showing {filteredSalons.length} of {salons.length} salons
            </div>
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Salon
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Owner
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Location
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Listing
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredSalons.map((salon) => (
                  <tr
                    key={salon._id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-purple-100 text-purple-600">
                          {salon.profileImage ? (
                            <img
                              src={salon.profileImage}
                              alt={salon.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Store size={22} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {salon.name || "Unnamed Salon"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {salon.phone || "Phone not available"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-900">
                        {salon.owner?.fullName || "Unknown"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {salon.owner?.email || "Email not available"}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-start gap-2">
                        <MapPin
                          size={17}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />

                        <div>
                          <p className="font-medium text-slate-800">
                            {salon.location?.area ||
                              salon.location?.city ||
                              "Location not set"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {salon.location?.city || ""}
                            {salon.location?.state
                              ? `, ${salon.location.state}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                          salon.approvalStatus,
                        )}`}
                      >
                        {salon.approvalStatus || "Unknown"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getListingClasses(
                          salon.isListed,
                        )}`}
                      >
                        {salon.isListed ? "Listed" : "Hidden"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedSalon(salon)}
                        className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet cards */}
          <div className="divide-y divide-gray-100 lg:hidden">
            {/* Result count */}
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-xs text-gray-500 sm:px-6">
              Showing {filteredSalons.length} of {salons.length} salons
            </div>
            {filteredSalons.map((salon) => (
              <div key={salon._id} className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-purple-100 text-purple-600">
                    {salon.profileImage ? (
                      <img
                        src={salon.profileImage}
                        alt={salon.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Store size={25} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h2 className="font-bold text-slate-900">
                          {salon.name || "Unnamed Salon"}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {salon.owner?.fullName || "Unknown owner"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          salon.approvalStatus,
                        )}`}
                      >
                        {salon.approvalStatus || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      <MapPin size={15} />
                      Location
                    </div>

                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {salon.location?.area ||
                        salon.location?.city ||
                        "Not available"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {salon.location?.city || ""}
                      {salon.location?.state ? `, ${salon.location.state}` : ""}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      <Store size={15} />
                      Listing
                    </div>

                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getListingClasses(
                        salon.isListed,
                      )}`}
                    >
                      {salon.isListed ? "Listed" : "Hidden"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedSalon(salon)}
                  className="mt-4 w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Details Modal */}
      {selectedSalon && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedSalon(null);
            }
          }}
        >
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex shrink-0 items-start justify-between border-b border-gray-100 p-5 sm:p-6">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-purple-100 text-purple-600">
                  {selectedSalon.profileImage ? (
                    <img
                      src={selectedSalon.profileImage}
                      alt={selectedSalon.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Store size={26} />
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
                    {selectedSalon.name || "Unnamed Salon"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">Salon details</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSalon(null)}
                className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-slate-900"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal content */}
            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem
                  label="Salon Name"
                  value={selectedSalon.name}
                  icon={<Store size={15} />}
                />

                <DetailItem
                  label="Approval Status"
                  value={selectedSalon.approvalStatus}
                  icon={<CheckCircle2 size={15} />}
                />

                <DetailItem
                  label="Owner"
                  value={selectedSalon.owner?.fullName}
                  icon={<User size={15} />}
                />

                <DetailItem
                  label="Owner Email"
                  value={selectedSalon.owner?.email}
                  icon={<Mail size={15} />}
                />

                <DetailItem
                  label="Salon Phone"
                  value={selectedSalon.phone}
                  icon={<Phone size={15} />}
                />

                <DetailItem
                  label="Owner Phone"
                  value={selectedSalon.owner?.phone}
                  icon={<Phone size={15} />}
                />

                <DetailItem
                  label="Salon Email"
                  value={selectedSalon.email}
                  icon={<Mail size={15} />}
                />

                <DetailItem
                  label="Listing Status"
                  value={selectedSalon.isListed ? "Listed" : "Hidden"}
                  icon={<Store size={15} />}
                />

                <DetailItem
                  label="Area"
                  value={selectedSalon.location?.area}
                  icon={<MapPin size={15} />}
                />

                <DetailItem
                  label="City"
                  value={selectedSalon.location?.city}
                  icon={<MapPin size={15} />}
                />

                <DetailItem
                  label="State"
                  value={selectedSalon.location?.state}
                  icon={<MapPin size={15} />}
                />

                <DetailItem
                  label="Pincode"
                  value={selectedSalon.location?.pincode}
                  icon={<MapPin size={15} />}
                />
              </div>

              <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <MapPin size={15} />
                  Address
                </div>

                <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">
                  {selectedSalon.location?.address || "Not available"}
                </p>
              </div>

              <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  About
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {selectedSalon.about || "No description available."}
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex shrink-0 justify-end border-t border-gray-100 bg-gray-50 p-5">
              <button
                type="button"
                onClick={() => setSelectedSalon(null)}
                className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
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
