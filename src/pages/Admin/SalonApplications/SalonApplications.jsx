import { useEffect, useState } from "react";
import { Clock3, MapPin, Store, User } from "lucide-react";
import {
  getPendingSalons,
  approveSalon,
} from "../../../services/adminSalonService";

export default function SalonApplications() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState(null);

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
    } catch (error) {
      console.error("Failed to approve salon:", error);

      setError(
        error.response?.data?.message || "Failed to approve salon application.",
      );
    } finally {
      setApprovingId(null);
    }
  };

  return (
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

      {/* Loading */}
      {loading && (
        <div className="mt-8 rounded-3xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <p className="text-gray-500">Loading salon applications...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-700">{error}</p>
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
      {!loading && !error && salons.length > 0 && (
        <div className="mt-8 space-y-5">
          {salons.map((salon) => (
            <div
              key={salon._id}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                    <Store size={23} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {salon.name}
                    </h2>

                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={16} className="text-purple-600" />

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
                  disabled
                  className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-400"
                >
                  View Details
                </button>

                <button
                  type="button"
                  onClick={() => handleApprove(salon._id)}
                  disabled={approvingId === salon._id}
                  className="rounded-full bg-green-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {approvingId === salon._id ? "Approving..." : "Approve"}
                </button>

                <button
                  type="button"
                  disabled
                  className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
