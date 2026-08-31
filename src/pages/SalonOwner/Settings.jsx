import { Bell, Eye, LockKeyhole, EyeOff, Store, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getMySalon, toggleSalonVisibility } from "../../services/salonService";

export default function Settings() {
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingVisibility, setUpdatingVisibility] = useState(false);

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const data = await getMySalon();
        setSalon(data.salon || null);
      } catch (error) {
        console.error("Failed to fetch salon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, []);

  const handleToggleVisibility = async () => {
    try {
      setUpdatingVisibility(true);

      const data = await toggleSalonVisibility();

      setSalon((currentSalon) => ({
        ...currentSalon,
        isListed: data.isListed,
      }));
    } catch (error) {
      console.error("Toggle salon visibility error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update salon visibility. Please try again.",
      );
    } finally {
      setUpdatingVisibility(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
          Rupiva for Business
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">Settings</h1>

        <p className="mt-2 text-gray-500">
          Manage your salon account and preferences.
        </p>
      </div>

      {/* Settings */}
      <div className="mt-8 space-y-5">
        {/* Account */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100">
              <User size={22} className="text-purple-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">Account</h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your salon owner account information.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">Account Profile</p>

            <p className="mt-1 font-semibold text-slate-900">
              Manage your profile from Owner Profile.
            </p>
          </div>
        </section>

        {/* Salon */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100">
              <Store size={22} className="text-purple-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Salon Settings
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your salon visibility and business preferences.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-gray-50 p-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    salon?.isListed ? "bg-green-100" : "bg-gray-200"
                  }`}
                >
                  {salon?.isListed ? (
                    <Eye size={21} className="text-green-600" />
                  ) : (
                    <EyeOff size={21} className="text-gray-500" />
                  )}
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Salon Visibility
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {loading
                      ? "Checking salon visibility..."
                      : salon?.isListed
                        ? "Your salon is currently visible to customers."
                        : "Your salon is currently hidden from customers."}
                  </p>

                  {!loading && salon && (
                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        salon.isListed
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {salon.isListed ? "Listed" : "Hidden"}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleVisibility}
                disabled={loading || !salon || updatingVisibility}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  salon?.isListed
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {updatingVisibility
                  ? "Updating..."
                  : salon?.isListed
                    ? "Hide Salon"
                    : "List Salon"}
              </button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100">
              <Bell size={22} className="text-purple-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Notifications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage notifications related to your salon.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-gray-50 p-4">
            <div>
              <p className="font-semibold text-slate-900">
                Appointment Notifications
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Receive updates about customer appointments.
              </p>
            </div>

            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
              Coming Soon
            </span>
          </div>
        </section>

        {/* Security */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100">
              <LockKeyhole size={22} className="text-purple-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">Security</h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your account security.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-gray-50 p-4">
            <div>
              <p className="font-semibold text-slate-900">Change Password</p>

              <p className="mt-1 text-sm text-gray-500">
                Update your salon owner account password.
              </p>
            </div>

            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
              Coming Soon
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
