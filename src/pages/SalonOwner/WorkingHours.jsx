import { useEffect, useState } from "react";
import { Clock3, Save } from "lucide-react";
import {
  getMyWorkingHours,
  updateMyWorkingHours,
} from "../../services/workingHoursService";

const days = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const defaultDay = (isOpen = true) => ({
  isOpen,
  openTime: "09:00",
  closeTime: "18:00",
});

const defaultWorkingHours = {
  monday: defaultDay(),
  tuesday: defaultDay(),
  wednesday: defaultDay(),
  thursday: defaultDay(),
  friday: defaultDay(),
  saturday: defaultDay(),
  sunday: defaultDay(false),
};

export default function WorkingHours() {
  const [workingHours, setWorkingHours] = useState(defaultWorkingHours);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchWorkingHours = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyWorkingHours();

        if (data?.workingHours) {
          setWorkingHours(data.workingHours);
        }
      } catch (error) {
        console.error("Failed to fetch working hours:", error);

        setError(
          error.response?.data?.message || "Failed to load working hours.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkingHours();
  }, []);

  const handleToggle = (day) => {
    setWorkingHours((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        isOpen: !previous[day].isOpen,
      },
    }));

    setSuccess("");
  };

  const handleTimeChange = (day, field, value) => {
    setWorkingHours((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        [field]: value,
      },
    }));

    setSuccess("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = await updateMyWorkingHours(workingHours);

      if (data?.workingHours) {
        setWorkingHours(data.workingHours);
      }

      setSuccess("Working hours updated successfully.");
    } catch (error) {
      console.error("Failed to update working hours:", error);

      setError(
        error.response?.data?.message || "Failed to update working hours.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <p className="text-gray-500">Loading working hours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
          Salon Management
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Working Hours
        </h1>

        <p className="mt-2 text-gray-500">
          Set the days and hours when your salon is available for appointments.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4">
          <p className="font-medium text-green-700">{success}</p>
        </div>
      )}

      {/* Working Hours */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <Clock3 size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Weekly Schedule
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Configure your salon's regular working hours.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {days.map((day) => {
            const schedule = workingHours[day.key];

            return (
              <div
                key={day.key}
                className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center"
              >
                {/* Day */}
                <div className="w-full lg:w-36">
                  <p className="font-semibold text-slate-900">{day.label}</p>
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(day.key)}
                    className={`relative h-7 w-12 rounded-full transition ${
                      schedule?.isOpen ? "bg-purple-600" : "bg-gray-300"
                    }`}
                    aria-label={`Toggle ${day.label}`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                        schedule?.isOpen ? "left-6" : "left-1"
                      }`}
                    />
                  </button>

                  <span
                    className={`text-sm font-medium ${
                      schedule?.isOpen ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {schedule?.isOpen ? "Open" : "Closed"}
                  </span>
                </div>

                {/* Time */}
                {schedule?.isOpen && (
                  <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-medium text-gray-500">
                        Opening Time
                      </label>

                      <input
                        type="time"
                        value={schedule.openTime || "09:00"}
                        onChange={(event) =>
                          handleTimeChange(
                            day.key,
                            "openTime",
                            event.target.value,
                          )
                        }
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      />
                    </div>

                    <div className="hidden text-gray-400 sm:block">to</div>

                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-medium text-gray-500">
                        Closing Time
                      </label>

                      <input
                        type="time"
                        value={schedule.closeTime || "18:00"}
                        onChange={(event) =>
                          handleTimeChange(
                            day.key,
                            "closeTime",
                            event.target.value,
                          )
                        }
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Save */}
        <div className="flex justify-end border-t border-gray-100 bg-gray-50 p-5">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />

            {saving ? "Saving..." : "Save Working Hours"}
          </button>
        </div>
      </div>
    </div>
  );
}
