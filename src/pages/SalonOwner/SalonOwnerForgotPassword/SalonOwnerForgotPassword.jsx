import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Store,
  ArrowLeft,
  ArrowRight,
  Phone,
  ShieldCheck,
  KeyRound,
  LockKeyhole,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (!/^\d{6}$/.test(otp)) {
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

      navigate("/salon-owner/login", { replace: true });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Password reset failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const goBackToPhone = () => {
    setOtp("");
    setResetToken("");
    setStep(1);
  };

  const steps = [
    { number: 1, label: "Phone" },
    { number: 2, label: "Verify OTP" },
    { number: 3, label: "New Password" },
  ];

  const inputClass =
    "min-h-12 w-full rounded-xl border border-purple-100 bg-white/75 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100";

  const features = [
    {
      icon: Phone,
      text: "Verify your registered phone number",
    },
    {
      icon: KeyRound,
      text: "Confirm your identity with an OTP",
    },
    {
      icon: LockKeyhole,
      text: "Create a new secure password",
    },
  ];

  return (
    <main className="relative isolate min-h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-fuchsia-50 via-white to-violet-100 px-4 py-5 text-slate-950 sm:px-6 sm:py-7 lg:py-8">
      {/* Decorative gradient waves */}
      <div className="pointer-events-none absolute -right-24 -top-36 -z-10 h-80 w-[70%] rotate-[-10deg] rounded-[45%] bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-500 opacity-90 blur-[1px] sm:h-96" />
      <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-[65%] rotate-[-10deg] rounded-[45%] border-[18px] border-white/25 sm:h-80" />
      <div className="pointer-events-none absolute -bottom-36 -left-24 -z-10 h-72 w-[60%] rotate-[12deg] rounded-[45%] bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-400 opacity-90 sm:h-96" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 -z-10 h-64 w-[60%] rotate-[12deg] rounded-[45%] border-[18px] border-white/25 sm:h-80" />
      <div className="pointer-events-none absolute left-1/3 top-1/3 -z-10 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-7 lg:grid-cols-2 lg:gap-12">
        {/* Welcome section */}
        <section className="hidden self-center lg:block">
          <Link
            to="/salon-owner"
            className="mb-7 inline-flex items-center gap-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-300/50">
              <Store size={30} />
            </span>
            <span>
              <span className="block text-3xl font-extrabold tracking-tight">
                Rupiva
              </span>
              <span className="text-base font-medium text-slate-600">
                For Business
              </span>
            </span>
          </Link>

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white/85 px-4 py-2 text-sm font-bold text-purple-700 shadow-md shadow-purple-100/60">
            <Sparkles size={17} />
            Rupiva For Business
          </div>

          <h1 className="mt-6 max-w-xl text-5xl font-extrabold leading-[1.12] tracking-tight xl:text-6xl">
            Secure your
            <span className="mt-1 block bg-gradient-to-r from-purple-700 to-fuchsia-500 bg-clip-text text-transparent">
              salon account.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-8 text-slate-700 xl:text-lg">
            Forgot your password? No worries. Follow a few simple steps to
            securely regain access to your Rupiva business account.
          </p>

          <div className="mt-8 space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 text-sm font-semibold text-slate-800 xl:text-base"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-100 bg-white/90 text-purple-600 shadow-sm">
                  <Icon size={19} />
                </span>
                {text}
              </div>
            ))}
          </div>
        </section>

        {/* Password recovery card */}
        <section className="mx-auto w-full max-w-md rounded-3xl border border-white/80 bg-white/75 p-5 shadow-2xl shadow-purple-900/15 backdrop-blur-xl sm:p-7 md:p-8">
          <div className="mb-5 flex items-center gap-3 lg:hidden">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-md shadow-purple-200">
              <Store size={25} />
            </span>
            <span>
              <span className="block text-xl font-extrabold">Rupiva</span>
              <span className="text-xs text-slate-500">For Business</span>
            </span>
          </div>

          <div className="mb-6">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-purple-700">
              Salon Partner Portal
            </p>

            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {step === 1
                ? "Forgot Password?"
                : step === 2
                  ? "Verify Your OTP"
                  : "Create New Password"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {step === 1
                ? "Enter your registered phone number to get started."
                : step === 2
                  ? "Enter the 6-digit OTP sent to your registered phone."
                  : "Choose a new password for your salon account."}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mb-7 flex items-start">
            {steps.map((item, index) => (
              <div
                key={item.number}
                className={`flex items-start ${
                  index < steps.length - 1 ? "flex-1" : "shrink-0"
                }`}
              >
                <div className="flex min-w-0 flex-col items-center gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                      step >= item.number
                        ? "bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-md shadow-purple-200"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {step > item.number ? (
                      <CheckCircle2 size={19} />
                    ) : (
                      item.number
                    )}
                  </div>
                  <span
                    className={`whitespace-nowrap text-[10px] font-semibold sm:text-xs ${
                      step >= item.number ? "text-purple-700" : "text-slate-400"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 mt-4 h-1 flex-1 rounded-full ${
                      step > item.number
                        ? "bg-gradient-to-r from-purple-600 to-fuchsia-500"
                        : "bg-slate-100"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Phone number */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label
                  htmlFor="recoveryPhone"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Registered Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="recoveryPhone"
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    placeholder="Enter your phone number"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-fuchsia-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:from-purple-800 hover:to-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Sending OTP..." : "Send Verification OTP"}
                {!loading && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="rounded-xl border border-purple-100 bg-purple-50/80 p-3 text-sm leading-6 text-purple-800">
                Verification code requested for{" "}
                <span className="font-bold">{phone}</span>.
              </div>

              <div>
                <label
                  htmlFor="recoveryOtp"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  6-Digit Verification Code
                </label>

                <div className="relative">
                  <KeyRound
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="recoveryOtp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    required
                    className={`${inputClass} pr-4 text-center font-bold tracking-[0.3em]`}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-fuchsia-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:from-purple-800 hover:to-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Verifying OTP..." : "Verify OTP"}
                {!loading && <ArrowRight size={18} />}
              </button>

              <button
                type="button"
                onClick={goBackToPhone}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 py-1 text-sm font-semibold text-purple-700 transition hover:text-fuchsia-700 disabled:opacity-50"
              >
                <ArrowLeft size={16} />
                Change phone number
              </button>
            </div>
          )}

          {/* Step 3: New password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  New Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-purple-50 hover:text-purple-700"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Use at least 6 characters.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Confirm New Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-purple-50 hover:text-purple-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                {confirmPassword && (
                  <p
                    className={`mt-2 text-xs font-semibold ${
                      newPassword === confirmPassword
                        ? "text-emerald-600"
                        : "text-rose-500"
                    }`}
                  >
                    {newPassword === confirmPassword
                      ? "✓ Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-fuchsia-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:from-purple-800 hover:to-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-purple-100 pt-5">
            <Link
              to="/salon-owner/login"
              className="flex items-center justify-center gap-2 text-sm font-bold text-purple-700 transition hover:text-fuchsia-700"
            >
              <ArrowLeft size={16} />
              Back to Salon Owner Login
            </Link>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={16} className="text-purple-600" />
              Secure password recovery
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
