import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import api from "../../services/api";

export default function PasswordSecurity() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const { success: showSuccess, error: showError } = useNotification();

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleVisibility = (field) => {
    setShow((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword.length < 8) {
      showError("New password must contain at least 8 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      showError("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/change-password", form);

      showSuccess(response.data?.message || "Password changed successfully.");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      showError(
        err.response?.data?.message ||
          "Unable to change password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "currentPassword",
      label: "Current password",
      placeholder: "Enter your current password",
    },
    {
      name: "newPassword",
      label: "New password",
      placeholder: "Create a new password",
    },
    {
      name: "confirmPassword",
      label: "Confirm new password",
      placeholder: "Re-enter your new password",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/settings"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-rose-600"
        >
          <ArrowLeft size={18} />
          Back to Settings
        </Link>

        <div className="mb-7 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <LockKeyhole size={27} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Password & Security
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Keep your Rupiva account safe and secure.
            </p>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-start gap-3 border-b border-slate-100 p-5 sm:p-6">
            <ShieldCheck className="mt-1 shrink-0 text-emerald-600" size={23} />

            <div>
              <h2 className="font-semibold text-slate-900">
                Change your password
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Verify your current password before setting a new one. Use at
                least 8 characters and avoid reusing an old password.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
            {fields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {field.label}
                </label>

                <div className="relative">
                  <input
                    id={field.name}
                    name={field.name}
                    type={show[field.name] ? "text" : "password"}
                    value={form[field.name]}
                    onChange={updateField}
                    placeholder={field.placeholder}
                    autoComplete={
                      field.name === "currentPassword"
                        ? "current-password"
                        : "new-password"
                    }
                    required
                    minLength={field.name !== "currentPassword" ? 8 : undefined}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                  />

                  <button
                    type="button"
                    onClick={() => toggleVisibility(field.name)}
                    aria-label={
                      show[field.name] ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-slate-800"
                  >
                    {show[field.name] ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-rose-600 px-5 py-3.5 font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Updating password..." : "Update password"}
            </button>
          </form>
        </section>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Never share your password or verification codes with anyone.
        </p>
      </div>
    </main>
  );
}
