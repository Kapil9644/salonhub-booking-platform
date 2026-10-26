import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Store,
  ArrowRight,
  UserRound,
  Phone,
  Mail,
  LockKeyhole,
  ShieldCheck,
  Scissors,
  CalendarDays,
  Sparkles,
  CheckCircle2,
  Zap,
} from "lucide-react";

import { registerSalonOwner } from "../../../services/authService";
import { useSalonOwnerAuth } from "../../../context/SalonOwnerAuthContext";

export default function SalonOwnerSignup() {
  const navigate = useNavigate();
  const { loginSalonOwner } = useSalonOwnerAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full min-w-0 rounded-xl border border-purple-200/80 bg-white/75 py-3 pl-11 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100";

  const features = [
    {
      icon: CalendarDays,
      title: "Manage appointments",
      description: "Keep your bookings organised.",
    },
    {
      icon: Scissors,
      title: "Manage your services",
      description: "Showcase services and pricing.",
    },
    {
      icon: ShieldCheck,
      title: "One business dashboard",
      description: "Manage your salon in one place.",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;

      const data = await registerSalonOwner(registrationData);

      loginSalonOwner(data.user, data.token);

      alert("Salon Partner Account Created Successfully 🎉");

      navigate("/salon-owner/dashboard", { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || "Salon Owner Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  return (
    <main className="relative isolate min-h-[calc(100vh-56px)] overflow-hidden bg-gradient-to-br from-fuchsia-100 via-white to-violet-200 px-4 py-4 sm:px-6 lg:px-8">
      {/* Decorative background waves */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-36 -z-10 h-80 w-[65%] rotate-[-8deg] rounded-[45%] bg-gradient-to-r from-violet-800 via-purple-600 to-fuchsia-500 opacity-95 sm:h-96"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-24 -z-10 h-72 w-[60%] rotate-[-8deg] rounded-[45%] border-[22px] border-white/20 sm:h-80"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-52 -left-28 -z-10 h-80 w-[65%] rotate-[12deg] rounded-[45%] bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-400 opacity-90 sm:h-96"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-44 -left-24 -z-10 h-72 w-[60%] rotate-[12deg] rounded-[45%] border-[22px] border-white/20 sm:h-80"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-1/3 -z-10 h-56 w-56 rounded-full bg-fuchsia-300/30 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-start gap-6 lg:min-h-[calc(100vh-88px)] lg:grid-cols-2 lg:items-center lg:gap-10">
        {/* LEFT BRANDING SECTION */}
        <section className="flex min-w-0 flex-col justify-center pt-1 sm:pt-2 lg:py-5">
          {/* Brand */}
          <Link
            to="/salon-owner"
            className="mb-5 inline-flex w-fit items-center gap-3 rounded-xl transition hover:opacity-80 sm:mb-6"
            aria-label="Rupiva For Business home"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-300/50">
              <Zap size={27} fill="white" strokeWidth={2.2} />
            </span>

            <span>
              <span className="block text-2xl font-extrabold leading-7 tracking-tight text-slate-950">
                Rupiva
              </span>
              <span className="text-sm font-medium text-slate-600">
                For Business
              </span>
            </span>
          </Link>

          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-purple-200/80 bg-white/80 px-4 py-2 text-xs font-bold text-purple-700 shadow-sm backdrop-blur sm:mb-5 sm:text-sm">
            <Sparkles size={16} />
            Rupiva For Business
          </div>

          <h1 className="max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl xl:text-6xl">
            Start your
            <span className="mt-1 block bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
              salon journey.
            </span>
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
            Your salon, your business, your growth. Join Rupiva and manage your
            services, appointments, schedule and payments in one place.
          </p>

          <div className="mt-5 grid max-w-lg gap-3 sm:mt-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/65 p-3 shadow-sm backdrop-blur-sm transition hover:border-purple-200 hover:bg-white/90 sm:p-3.5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-100 bg-white text-purple-600 shadow-sm">
                  <Icon size={20} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-slate-900">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-slate-600 sm:text-sm">
                    {description}
                  </span>
                </span>

                <CheckCircle2 size={17} className="shrink-0 text-emerald-500" />
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-600 sm:mt-6 sm:text-sm">
            <ShieldCheck size={17} className="shrink-0 text-purple-600" />
            Your business journey starts here.
          </div>
        </section>

        {/* RIGHT SIGNUP CARD */}
        <section className="w-full min-w-0 lg:py-3">
          <div className="mx-auto w-full max-w-lg rounded-3xl border border-white/80 bg-white/65 p-5 shadow-2xl shadow-purple-900/10 backdrop-blur-xl sm:p-7 lg:p-8">
            {/* Form heading */}
            <div className="mb-5 sm:mb-6">
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-purple-700">
                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-600" />
                Salon Partner Portal
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                Create Your Account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Join Rupiva and grow your salon business.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              {/* Full name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1.5 block text-sm font-semibold text-slate-800"
                >
                  Owner Full Name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-semibold text-slate-800"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-semibold text-slate-800"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-semibold text-slate-800"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className={inputClass}
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-purple-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p className="mt-1.5 text-xs text-slate-500">
                  Use at least 6 characters.
                </p>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-semibold text-slate-800"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-purple-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {formData.confirmPassword.length > 0 && (
                  <p
                    className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${
                      passwordsMatch ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {passwordsMatch ? <CheckCircle2 size={14} /> : null}
                    {passwordsMatch
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-300/50 transition hover:-translate-y-0.5 hover:from-purple-800 hover:to-fuchsia-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Salon Account
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-purple-200/70" />
              <span className="text-[11px] font-medium text-slate-500">
                ALREADY A PARTNER?
              </span>
              <div className="h-px flex-1 bg-purple-200/70" />
            </div>

            <p className="text-center text-sm leading-6 text-slate-700">
              Already have an account?{" "}
              <Link
                to="/salon-owner/login"
                className="font-bold text-purple-700 transition hover:text-fuchsia-700"
              >
                Sign in
              </Link>
            </p>

            {/* Security note */}
            <div className="mt-5 flex items-center justify-center gap-2 border-t border-purple-100/80 pt-4 text-xs text-slate-500">
              <ShieldCheck size={15} className="shrink-0 text-purple-600" />
              Secure registration for salon partners
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
