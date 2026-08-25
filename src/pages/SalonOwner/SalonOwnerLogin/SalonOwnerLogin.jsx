import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Store } from "lucide-react";

import { loginUser } from "../../../services/authService";
import { useSalonOwnerAuth } from "../../../context/SalonOwnerAuthContext";

export default function SalonOwnerLogin() {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { loginSalonOwner } = useSalonOwnerAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(formData);

      // Make sure this account is a salon owner
      if (data.user?.role !== "salon") {
        alert("This account is not registered as a Salon Owner.");
        return;
      }

      loginSalonOwner(data.user, data.token);

      alert("Salon Owner Login Successful 🎉");

      navigate("/salon-owner/dashboard", { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || "Salon Owner Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        {/* Login Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-7">
            <div className="mb-2 flex items-center gap-2">
              <Store size={22} className="text-purple-600" />

              <h2 className="text-2xl font-bold text-slate-900">
                Salon Owner Login
              </h2>
            </div>

            <p className="text-sm text-gray-500">
              Login to manage your salon, services and business.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <Link
                to="/salon-owner/forgot-password"
                className="text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login as Salon Owner"}
            </button>
          </form>

          {/* Signup */}
          <p className="mt-7 text-center text-sm text-gray-500">
            Don't have a salon account?{" "}
            <Link
              to="/salon-owner/signup"
              className="font-semibold text-purple-600 hover:text-purple-700"
            >
              Become a Salon Partner
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
