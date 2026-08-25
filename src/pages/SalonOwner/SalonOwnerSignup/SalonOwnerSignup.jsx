import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Scissors, Store } from "lucide-react";

import { registerUser } from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext";

export default function SalonOwnerSignup() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // IMPORTANT:
      // Salon owner account is always registered with role = salon.
      const registrationData = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        role: "salon",
      };

      const data = await registerUser(registrationData);

      login(data.user, data.token);

      alert("Salon Partner Account Created Successfully 🎉");

      navigate("/salon-owner/dashboard", {
        replace: true,
      });
    } catch (error) {
      alert(error.response?.data?.message || "Salon Owner Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        {/* Signup Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-7">
            <div className="mb-2 flex items-center gap-2">
              <Store size={22} className="text-purple-600" />

              <h2 className="text-2xl font-bold text-slate-900">
                Become a Salon Partner
              </h2>
            </div>

            <p className="text-sm text-gray-500">
              Create your business account and start managing your salon.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Owner Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

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

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
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
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <div className="relative mt-2">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="rounded-xl bg-purple-50 p-4 text-sm text-purple-700">
              Your account will be created as a Salon Owner. You can create and
              manage your salon profile after registration.
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Salon Partner Account"}
            </button>
          </form>

          {/* Login */}
          <p className="mt-7 text-center text-sm text-gray-500">
            Already have a salon account?{" "}
            <Link
              to="/salon-owner/login"
              className="font-semibold text-purple-600 hover:text-purple-700"
            >
              Login as Salon Owner
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
