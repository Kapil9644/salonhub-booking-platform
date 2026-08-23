import { useEffect, useState } from "react";
import { CalendarCheck, Clock3, Eye, EyeOff, Store } from "lucide-react";
import { getMySalon } from "../../services/salonService";

export default function SalonOwnerDashboard() {
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        setLoading(true);

        const data = await getMySalon();

        setSalon(data.salon || null);
      } catch (error) {
        console.error("Failed to fetch salon:", error);
        setSalon(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, []);

  const getApprovalStatus = () => {
    if (!salon) return null;

    if (salon.approvalStatus === "Approved") {
      return {
        label: "Approved",
        className: "bg-green-100 text-green-700",
      };
    }

    if (salon.approvalStatus === "Rejected") {
      return {
        label: "Rejected",
        className: "bg-red-100 text-red-700",
      };
    }

    return {
      label: "Pending Approval",
      className: "bg-yellow-100 text-yellow-700",
    };
  };

  const approval = getApprovalStatus();

  if (loading) {
    return (
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
          SalonHub for Business
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">Dashboard</h1>

        <div className="mt-8 rounded-3xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <p className="text-gray-500">Loading salon information...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
          SalonHub for Business
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">Dashboard</h1>

        <p className="mt-2 text-gray-500">
          Manage your salon and appointments from one place.
        </p>
      </div>

      {/* Salon Overview */}
      {salon ? (
        <section className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-purple-100 text-purple-600">
                {salon.profileImage ? (
                  <img
                    src={salon.profileImage}
                    alt={salon.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store size={28} />
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {salon.name}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {salon.location?.area || "Location not set"}
                  {salon.location?.city ? `, ${salon.location.city}` : ""}
                </p>
              </div>
            </div>

            {approval && (
              <span
                className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${approval.className}`}
              >
                {approval.label}
              </span>
            )}
          </div>

          <div className="border-t border-gray-100 bg-gray-50 px-6 py-5 sm:px-8">
            {salon.approvalStatus === "Pending" && (
              <p className="text-sm leading-6 text-gray-600">
                Your salon profile is waiting for admin approval. Customers will
                not be able to see your salon until it has been approved.
              </p>
            )}

            {salon.approvalStatus === "Approved" && (
              <p className="text-sm leading-6 text-gray-600">
                Your salon has been approved. You can now manage its services,
                working hours and visibility.
              </p>
            )}

            {salon.approvalStatus === "Rejected" && (
              <p className="text-sm leading-6 text-gray-600">
                Your salon application was rejected. Please review your salon
                information and contact SalonHub support.
              </p>
            )}
          </div>
        </section>
      ) : (
        <section className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white py-14 text-center">
          <Store className="mx-auto text-gray-400" size={34} />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            No Salon Profile
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Create your salon profile to start managing your business on
            SalonHub.
          </p>
        </section>
      )}

      {/* Stats */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Appointments</p>

              <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
            </div>

            <CalendarCheck className="text-purple-600" size={22} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>

              <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
            </div>

            <Clock3 className="text-purple-600" size={22} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Services</p>

              <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
            </div>

            <Store className="text-purple-600" size={22} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Salon Visibility</p>

              <p className="mt-2 font-semibold text-slate-900">
                {salon?.isListed ? "Listed" : "Hidden"}
              </p>
            </div>

            {salon?.isListed ? (
              <Eye className="text-green-600" size={22} />
            ) : (
              <EyeOff className="text-gray-400" size={22} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
