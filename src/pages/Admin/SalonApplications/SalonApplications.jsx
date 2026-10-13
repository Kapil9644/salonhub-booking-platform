import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Store,
  User,
  X,
} from "lucide-react";

import {
  getPendingSalons,
  approveSalon,
  rejectSalon,
} from "../../../services/adminSalonService";

export default function SalonApplications() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  const [selectedSalon, setSelectedSalon] = useState(null);
  const [salonToReject, setSalonToReject] = useState(null);

  useEffect(() => {
    const fetchPendingSalons = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPendingSalons();

        setSalons(data.salons || []);
      } catch (error) {
        console.error("Failed to fetch pending salons:", error);

        setError(
          error.response?.data?.message || "Failed to load salon applications.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPendingSalons();
  }, []);

  const handleApprove = async (salonId) => {
    try {
      setApprovingId(salonId);
      setError("");

      await approveSalon(salonId);

      setSalons((currentSalons) =>
        currentSalons.filter((salon) => salon._id !== salonId),
      );

      setSelectedSalon((currentSalon) =>
        currentSalon?._id === salonId ? null : currentSalon,
      );
    } catch (error) {
      console.error("Failed to approve salon:", error);

      setError(
        error.response?.data?.message || "Failed to approve salon application.",
      );
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async () => {
    if (!salonToReject) return;

    try {
      setRejectingId(salonToReject._id);
      setError("");

      await rejectSalon(salonToReject._id);

      setSalons((currentSalons) =>
        currentSalons.filter((salon) => salon._id !== salonToReject._id),
      );

      setSelectedSalon((currentSalon) =>
        currentSalon?._id === salonToReject._id ? null : currentSalon,
      );

      setSalonToReject(null);
    } catch (error) {
      console.error("Failed to reject salon:", error);

      setError(
        error.response?.data?.message || "Failed to reject salon application.",
      );
    } finally {
      setRejectingId(null);
    }
  };

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
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
            Salon Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Salon Applications
          </h1>

          <p className="mt-2 text-gray-500">
            Review salon owners who have submitted their salons for approval.
          </p>
        </div>

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-700">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white py-16 text-center shadow-sm">
            <p className="text-gray-500">Loading salon applications...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && salons.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <Clock3 size={26} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No Pending Applications
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              There are currently no salon applications waiting for admin
              approval.
            </p>
          </div>
        )}

        {/* Applications */}
        {!loading && salons.length > 0 && (
          <div className="mt-8 space-y-5">
            {salons.map((salon) => (
              <div
                key={salon._id}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    {salon.profileImage ? (
                      <img
                        src={salon.profileImage}
                        alt={salon.name}
                        className="h-12 w-12 shrink-0 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                        <Store size={23} />
                      </div>
                    )}

                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {salon.name}
                      </h2>

                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <MapPin
                          size={16}
                          className="shrink-0 text-purple-600"
                        />

                        <span>
                          {[
                            salon.location?.area,
                            salon.location?.city,
                            salon.location?.state,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Location not provided"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="flex w-fit items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                    <Clock3 size={15} />
                    Pending
                  </span>
                </div>

                {/* Details */}
                <div className="grid gap-4 p-6 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                      <User size={14} />
                      Owner
                    </div>

                    <p className="mt-2 font-semibold text-slate-900">
                      {salon.owner?.fullName || "Not available"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Contact
                    </p>

                    <p className="mt-2 font-semibold text-slate-900">
                      {salon.owner?.phone || salon.phone || "Not available"}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {salon.owner?.email || salon.email || "No email provided"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4 sm:col-span-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      About Salon
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {salon.about || "No description provided."}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedSalon(salon)}
                    className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApprove(salon._id)}
                    disabled={
                      approvingId === salon._id || rejectingId === salon._id
                    }
                    className="rounded-full bg-green-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {approvingId === salon._id ? "Approving..." : "Approve"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSalonToReject(salon)}
                    disabled={
                      approvingId === salon._id || rejectingId === salon._id
                    }
                    className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedSalon && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedSalon(null);
            }
          }}
        >
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 p-5 sm:p-6">
              <div className="flex min-w-0 items-center gap-4">
                {selectedSalon.profileImage ? (
                  <img
                    src={selectedSalon.profileImage}
                    alt={selectedSalon.name}
                    className="h-14 w-14 shrink-0 rounded-2xl object-cover sm:h-16 sm:w-16"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 sm:h-16 sm:w-16">
                    <Store size={28} />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                    Salon Application
                  </p>

                  <h2 className="mt-1 truncate text-xl font-bold text-slate-900 sm:text-2xl">
                    {selectedSalon.name}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSalon(null)}
                className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-slate-900"
                aria-label="Close"
              >
                <X size={21} />
              </button>
            </div>

            {/* Content */}
            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
              <div className="space-y-5">
                {/* Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-yellow-50 p-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">
                      Application Status
                    </p>

                    <p className="mt-1 font-bold text-yellow-800">
                      {selectedSalon.approvalStatus || "Pending"}
                    </p>
                  </div>

                  <span className="flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                    <Clock3 size={15} />
                    Pending Review
                  </span>
                </div>

                {/* Salon Information */}
                <section className="rounded-2xl border border-gray-200 p-5">
                  <h3 className="text-lg font-bold text-slate-900">
                    Salon Information
                  </h3>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <DetailItem label="Salon Name" value={selectedSalon.name} />

                    <DetailItem
                      label="Phone"
                      value={selectedSalon.phone}
                      icon={<Phone size={15} />}
                    />

                    <DetailItem
                      label="Email"
                      value={selectedSalon.email}
                      icon={<Mail size={15} />}
                    />

                    <DetailItem
                      label="Listed"
                      value={selectedSalon.isListed ? "Yes" : "No"}
                    />

                    <div className="sm:col-span-2">
                      <DetailItem label="About" value={selectedSalon.about} />
                    </div>
                  </div>
                </section>

                {/* Owner Information */}
                <section className="rounded-2xl border border-gray-200 p-5">
                  <h3 className="text-lg font-bold text-slate-900">
                    Owner Information
                  </h3>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <DetailItem
                      label="Full Name"
                      value={selectedSalon.owner?.fullName}
                      icon={<User size={15} />}
                    />

                    <DetailItem
                      label="Phone"
                      value={selectedSalon.owner?.phone}
                      icon={<Phone size={15} />}
                    />

                    <DetailItem
                      label="Email"
                      value={selectedSalon.owner?.email}
                      icon={<Mail size={15} />}
                    />
                  </div>
                </section>

                {/* Location */}
                <section className="rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center gap-2">
                    <MapPin size={19} className="text-purple-600" />

                    <h3 className="text-lg font-bold text-slate-900">
                      Location
                    </h3>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <DetailItem
                        label="Address"
                        value={selectedSalon.location?.address}
                      />
                    </div>

                    <DetailItem
                      label="Area"
                      value={selectedSalon.location?.area}
                    />

                    <DetailItem
                      label="City"
                      value={selectedSalon.location?.city}
                    />

                    <DetailItem
                      label="State"
                      value={selectedSalon.location?.state}
                    />

                    <DetailItem
                      label="Pincode"
                      value={selectedSalon.location?.pincode}
                    />
                  </div>
                </section>

                {/* Application Information */}
                <section className="rounded-2xl border border-gray-200 p-5">
                  <h3 className="text-lg font-bold text-slate-900">
                    Application Information
                  </h3>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <DetailItem
                      label="Submitted On"
                      value={formatDate(selectedSalon.createdAt)}
                      icon={<CalendarDays size={15} />}
                    />

                    <DetailItem
                      label="Last Updated"
                      value={formatDate(selectedSalon.updatedAt)}
                      icon={<CalendarDays size={15} />}
                    />

                    <DetailItem
                      label="Business Status"
                      value={selectedSalon.isOpen ? "Open" : "Closed"}
                    />

                    <DetailItem
                      label="Status Mode"
                      value={selectedSalon.statusOverride || "Auto"}
                    />
                  </div>
                </section>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelectedSalon(null)}
                className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-gray-100"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => handleApprove(selectedSalon._id)}
                disabled={
                  approvingId === selectedSalon._id ||
                  rejectingId === selectedSalon._id
                }
                className="rounded-full bg-green-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {approvingId === selectedSalon._id
                  ? "Approving..."
                  : "Approve Salon"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedSalon(null);
                  setSalonToReject(selectedSalon);
                }}
                disabled={
                  approvingId === selectedSalon._id ||
                  rejectingId === selectedSalon._id
                }
                className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {salonToReject && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSalonToReject(null);
            }
          }}
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertTriangle size={26} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Reject Salon Application?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to reject{" "}
              <span className="font-semibold text-slate-800">
                {salonToReject.name}
              </span>
              ? This application will be removed from the pending list.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSalonToReject(null)}
                disabled={rejectingId === salonToReject._id}
                className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReject}
                disabled={rejectingId === salonToReject._id}
                className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {rejectingId === salonToReject._id
                  ? "Rejecting..."
                  : "Yes, Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailItem({ label, value, icon }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
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
