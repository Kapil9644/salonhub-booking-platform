import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Store, ArrowLeft } from "lucide-react";

import {
  salonOwnerForgotPassword,
  salonOwnerVerifyOtp,
  salonOwnerResetPassword,
} from "../../../services/authService";

export default function SalonOwnerForgotPassword() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    try {
      setLoading(true);

      await salonOwnerForgotPassword(phone);

      alert("OTP sent successfully.");

      setStep(2);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      alert("Please enter the OTP.");
      return;
    }

    if (otp.trim().length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const data = await salonOwnerVerifyOtp(phone, otp);

      setResetToken(data.resetToken);

      alert("OTP verified successfully.");

      setStep(3);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "OTP verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("Please enter and confirm your new password.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!resetToken) {
      alert("Reset session expired. Please request a new OTP.");
      setStep(1);
      return;
    }

    try {
      setLoading(true);

      await salonOwnerResetPassword(resetToken, newPassword);

      alert(
        "Password reset successfully. Please login with your new password.",
      );

      setPhone("");
      setOtp("");
      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");

      navigate("/salon-owner/login", {
        replace: true,
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Password reset failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
            <Store className="text-purple-600" size={24} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Forgot Password?
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Enter your registered phone number and we'll help you reset your
            Salon Owner account password.
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <label className="text-sm font-medium text-slate-700">
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </form>
        )}

        {step === 2 && (
          <div>
            <label className="text-sm font-medium text-slate-700">
              Enter OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              inputMode="numeric"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <label className="text-sm font-medium text-slate-700">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              minLength={6}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

            <label className="mt-5 block text-sm font-medium text-slate-700">
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              minLength={6}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        <Link
          to="/salon-owner/login"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
        >
          <ArrowLeft size={16} />
          Back to Salon Owner Login
        </Link>
      </div>
    </div>
  );
}
