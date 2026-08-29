import { useEffect, useState } from "react";
import { LockKeyhole, LogIn, ShieldCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { useAdminAuth } from "../../../context/useAdminAuth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Automatically dismiss error after 5 seconds
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleCloseError = () => {
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.phone || !formData.password) {
      setError("Phone number and password are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/admin-auth/login", formData);

      if (!response.data?.admin || !response.data?.token) {
        throw new Error("Invalid admin login response.");
      }

      if (response.data.admin.role !== "admin") {
        throw new Error("Admin access required.");
      }

      login(response.data.admin, response.data.token);

      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        error.response?.data?.message || error.message || "Admin login failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
            <ShieldCheck size={28} />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to access the Rupiva Admin Panel.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">{error}</p>

              <button
                type="button"
                onClick={handleCloseError}
                aria-label="Close error message"
                className="shrink-0 rounded-lg p-1 text-red-500 transition hover:bg-red-100 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone */}
            <div>
              <label
                htmlFor="admin-phone"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Phone Number
              </label>

              <input
                id="admin-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter admin phone number"
                autoComplete="tel"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="admin-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3.5 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={19} />

              {loading ? "Signing in..." : "Admin Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
