import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

import {
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../../services/authService";

import { useNotification } from "../../context/NotificationContext";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { success, error } = useNotification();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setTimeout(() => {
      setResendTimer((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const cleanPhone = phone.trim();

    if (!cleanPhone) {
      error("Please enter your registered phone number.");
      return;
    }

    try {
      setLoading(true);

      const data = await forgotPassword(cleanPhone);

      success(data?.message || "OTP sent successfully.");
      setStep("otp");
      setResendTimer(90);
      setOtp("");
    } catch (err) {
      error(
        err.response?.data?.message || "Unable to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp.trim())) {
      error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const data = await verifyOtp(phone.trim(), otp.trim());

      if (!data?.resetToken) {
        error("OTP verified, but the reset token was not received.");
        return;
      }

      setResetToken(data.resetToken);
      setStep("reset");
      success("OTP verified successfully. Set your new password.");
    } catch (err) {
      error(
        err.response?.data?.message ||
          "Invalid or expired OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      error("Your new password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      error("Passwords do not match. Please check both fields.");
      return;
    }

    try {
      setLoading(true);

      const data = await resetPassword(resetToken, newPassword);

      if (data?.success) {
        success("Password reset successfully. Redirecting to login...");

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1200);
      } else {
        error(data?.message || "Unable to reset password. Please try again.");
      }
    } catch (err) {
      error(
        err.response?.data?.message ||
          "Unable to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || loading) return;

    try {
      setLoading(true);

      const data = await forgotPassword(phone.trim());

      success(data?.message || "A new OTP has been sent.");
      setOtp("");
      setResendTimer(90);
    } catch (err) {
      error(
        err.response?.data?.message ||
          "Unable to resend OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: "phone", label: "Phone" },
    { id: "otp", label: "Verify" },
    { id: "reset", label: "Reset" },
  ];

  const currentStepIndex = steps.findIndex((item) => item.id === step);

  return (
    <main className="relative flex min-h-[calc(100vh-180px)] items-center justify-center overflow-hidden bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute -left-24 top-12 h-56 w-56 rounded-full bg-purple-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-8 h-64 w-64 rounded-full bg-fuchsia-200/30 blur-3xl" />

      <section className="relative w-full max-w-md overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-[0_20px_60px_-25px_rgba(109,40,217,0.25)]">
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600" />

        <div className="p-5 sm:p-8">
          <div className="mb-6 flex items-center justify-center gap-2">
            {steps.map((item, index) => {
              const completed = index < currentStepIndex;
              const active = index === currentStepIndex;

              return (
                <div key={item.id} className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${
                      active || completed
                        ? "bg-purple-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {completed ? <CheckCircle2 size={16} /> : index + 1}
                  </div>

                  <span
                    className={`text-xs font-medium sm:text-sm ${
                      active ? "text-purple-700" : "text-slate-400"
                    }`}
                  >
                    {item.label}
                  </span>

                  {index < steps.length - 1 && (
                    <div className="mx-1 h-px w-6 bg-slate-200 sm:w-10" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mb-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 ring-8 ring-purple-50">
              {step === "phone" && <Phone size={25} />}
              {step === "otp" && <ShieldCheck size={25} />}
              {step === "reset" && <LockKeyhole size={25} />}
            </div>

            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {step === "phone" && "Forgot Password?"}
              {step === "otp" && "Verify Your OTP"}
              {step === "reset" && "Create New Password"}
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              {step === "phone" &&
                "Enter your registered phone number to receive a password reset OTP."}
              {step === "otp" &&
                `Enter the 6-digit OTP sent to your registered number ${phone}.`}
              {step === "reset" &&
                "Choose a strong password to secure your Rupiva account."}
            </p>
          </div>

          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Registered phone number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:from-purple-700 hover:to-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <LoaderCircle size={18} className="animate-spin" />}
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  6-digit verification code
                </label>

                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="••••••"
                  maxLength={6}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-center text-xl font-bold tracking-[0.5em] text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:from-purple-700 hover:to-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <LoaderCircle size={18} className="animate-spin" />}
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                  }}
                  className="font-medium text-slate-500 transition hover:text-purple-700"
                >
                  Change number
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading || resendTimer > 0}
                  className="font-semibold text-purple-700 transition hover:text-purple-900 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  {resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  New password
                </label>

                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword((value) => !value)}
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:text-purple-700"
                  >
                    {showNewPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Confirm new password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:text-purple-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:from-purple-700 hover:to-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <LoaderCircle size={18} className="animate-spin" />}
                {loading ? "Resetting password..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 transition hover:text-purple-900"
            >
              <ArrowLeft size={17} />
              Back to Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ForgotPassword;
