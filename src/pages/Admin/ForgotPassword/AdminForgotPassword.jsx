import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import api from "../../../services/api";

export default function AdminForgotPassword() {
  const [step, setStep] = useState(1);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/admin-auth/forgot-password", {
        phone: phone.trim(),
      });

      setMessage(response.data.message);
      setStep(2);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to process password reset request.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!otp.trim()) {
      setError("OTP is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/admin-auth/verify-otp", {
        phone: phone.trim(),
        otp: otp.trim(),
      });

      setResetToken(response.data.resetToken);
      setMessage(response.data.message);
      setStep(3);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to verify OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
        {/* Header */}
        <div className="mb-7">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
            <ShieldCheck className="text-purple-600" size={24} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            {step === 1
              ? "Forgot Admin Password?"
              : step === 2
                ? "Verify OTP"
                : "Create New Password"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {step === 1
              ? "Enter your registered admin phone number to receive an OTP and reset your password."
              : step === 2
                ? `Enter the 6-digit OTP sent for ${phone}.`
                : "Create a new password for your admin account."}
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Step 1 — Phone Number */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <label
              htmlFor="admin-phone"
              className="text-sm font-medium text-slate-700"
            >
              Admin Phone Number
            </label>

            <input
              id="admin-phone"
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter registered phone number"
              autoComplete="tel"
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2 — OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <label
              htmlFor="admin-otp"
              className="text-sm font-medium text-slate-700"
            >
              Enter OTP
            </label>

            <input
              id="admin-otp"
              type="text"
              name="otp"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter 6-digit OTP"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-lg font-semibold tracking-[0.35em] text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="mt-6 w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setResetToken("");
                setMessage("");
                setError("");
              }}
              className="mt-3 w-full text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              Change Phone Number
            </button>
          </form>
        )}

        {/* Step 3 — New Password */}
        {step === 3 && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              setMessage("");
              setError("");

              if (newPassword.length < 6) {
                setError("Password must be at least 6 characters long.");
                return;
              }

              if (newPassword !== confirmPassword) {
                setError("Passwords do not match.");
                return;
              }

              if (!resetToken) {
                setError(
                  "Reset session has expired. Please request a new OTP.",
                );
                return;
              }

              try {
                setLoading(true);

                const response = await api.post("/admin-auth/reset-password", {
                  resetToken,
                  newPassword,
                });

                setMessage(response.data.message);

                setNewPassword("");
                setConfirmPassword("");
                setOtp("");
                setResetToken("");

                setTimeout(() => {
                  window.location.href = "/admin/login";
                }, 1500);
              } catch (error) {
                setError(
                  error.response?.data?.message ||
                    "Unable to reset password. Please try again.",
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            {/* New Password */}
            <div>
              <label
                htmlFor="admin-new-password"
                className="text-sm font-medium text-slate-700"
              >
                New Password
              </label>

              <input
                id="admin-new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                autoComplete="new-password"
                required
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Confirm Password */}
            <div className="mt-4">
              <label
                htmlFor="admin-confirm-password"
                className="text-sm font-medium text-slate-700"
              >
                Confirm New Password
              </label>

              <input
                id="admin-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                autoComplete="new-password"
                required
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Back to Login */}
        <Link
          to="/admin/login"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
        >
          <ArrowLeft size={16} />
          Back to Admin Login
        </Link>
      </div>
    </div>
  );
}
