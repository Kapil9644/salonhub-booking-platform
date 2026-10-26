import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Store,
  ArrowRight,
  Phone,
  LockKeyhole,
  ShieldCheck,
  Scissors,
  Sparkles,
  CalendarDays,
  CheckCircle2,
  Zap,
} from "lucide-react";

import { loginSalonOwner as loginSalonOwnerApi } from "../../../services/authService";
import { useSalonOwnerAuth } from "../../../context/SalonOwnerAuthContext";

const features = [
  {
    icon: CalendarDays,
    text: "Keep your appointments organized",
  },
  {
    icon: Scissors,
    text: "Manage services and salon timings",
  },
  {
    icon: ShieldCheck,
    text: "Access your business dashboard",
  },
];

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

    if (loading) return;

    try {
      setLoading(true);

      const data = await loginSalonOwnerApi(formData);

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
    <main className="relative flex min-h-[calc(100vh-56px)] items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-violet-100 px-4 py-3 sm:px-6 sm:py-4">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-[55%] h-72 w-72 rounded-full bg-fuchsia-300/40 blur-3xl sm:h-96 sm:w-96" />

        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-purple-400/30 blur-3xl sm:h-[32rem] sm:w-[32rem]" />

        <div className="absolute right-[20%] top-[30%] h-64 w-64 rounded-full bg-indigo-300/30 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />

        {/* Decorative wave shapes */}
        <div className="absolute -right-28 -top-32 hidden h-80 w-[70%] rotate-[-12deg] rounded-[45%] bg-gradient-to-r from-indigo-800 via-purple-700 to-fuchsia-500 opacity-90 sm:block" />

        <div className="absolute -right-36 -top-20 hidden h-64 w-[65%] rotate-[-12deg] rounded-[45%] border-[35px] border-white/20 sm:block" />

        <div className="absolute -bottom-44 -left-32 hidden h-80 w-[55%] rotate-[-15deg] rounded-[45%] bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-500 opacity-90 sm:block" />

        <div className="absolute -bottom-32 -left-20 hidden h-64 w-[50%] rotate-[-15deg] rounded-[45%] border-[28px] border-white/20 sm:block" />

        <Sparkles className="absolute bottom-10 right-8 h-8 w-8 text-white/80 sm:bottom-14 sm:right-12 sm:h-12 sm:w-12" />
      </div>

      {/* Main layout */}
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-7 lg:grid-cols-2 lg:gap-10">
        {/* LEFT: Welcome panel */}
        <section className="mx-auto w-full max-w-xl lg:mx-0">
          {/* Brand */}
          <Link
            to="/salon-owner"
            className="mb-7 inline-flex items-center gap-3 rounded-2xl transition hover:opacity-80 sm:mb-10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 text-white shadow-lg shadow-purple-300/50 sm:h-14 sm:w-14">
              <Zap size={29} fill="currentColor" strokeWidth={1.8} />
            </div>

            <div>
              <p className="text-2xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-3xl">
                Rupiva
              </p>
              <p className="text-sm font-medium tracking-wide text-slate-600 sm:text-base">
                For Business
              </p>
            </div>
          </Link>

          {/* Welcome badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/80 px-4 py-2 text-sm font-bold text-purple-800 shadow-md shadow-purple-200/20 backdrop-blur-md sm:mb-6">
            <Sparkles size={17} className="text-purple-600" />
            Rupiva For Business
          </div>

          {/* Heading */}
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-950 xl:text-5xl">
            Welcome
            <span className="mt-1 block bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 bg-clip-text pb-1 text-transparent">
              back, Partner!
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-700 sm:mt-5 sm:text-base sm:leading-7 md:text-lg md:leading-8">
            Your salon, your business, your growth. Sign in to manage your
            appointments, services, schedule and payments in one place.
          </p>

          {/* Feature list */}
          <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-3.5">
            {features.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 text-sm font-semibold text-slate-800 sm:gap-4 sm:text-base"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-100 bg-white/90 text-purple-700 shadow-sm sm:h-11 sm:w-11">
                  <Icon size={20} />
                </span>

                <span>{text}</span>

                <CheckCircle2
                  size={16}
                  className="ml-auto shrink-0 text-emerald-600"
                />
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT: Login card */}
        <section className="mx-auto w-full max-w-lg lg:ml-auto">
          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/65 p-5 shadow-2xl shadow-purple-900/10 backdrop-blur-2xl sm:p-7 md:p-9 lg:p-8 xl:p-10">
            {/* Card glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-fuchsia-300/35 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-indigo-300/25 blur-3xl" />

            <div className="relative">
              {/* Card heading */}
              <div className="mb-6 sm:mb-8">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.17em] text-purple-700 sm:text-sm">
                  Salon Partner Portal
                </p>

                <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                  Owner Login
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-700 sm:text-base">
                  Welcome back! Enter your details to continue.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-bold text-slate-800 sm:text-base"
                  >
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={21}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      required
                      placeholder="Enter your phone number"
                      className="min-h-12 w-full rounded-xl border border-purple-200 bg-white/65 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 sm:min-h-14 sm:text-base"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-slate-800 sm:text-base"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={21}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password"
                      className="min-h-12 w-full rounded-xl border border-purple-200 bg-white/65 py-3 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 sm:min-h-14 sm:text-base"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-purple-100 hover:text-purple-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Forgot password */}
                <div className="-mt-1 flex justify-end">
                  <Link
                    to="/salon-owner/forgot-password"
                    className="text-sm font-bold text-purple-700 transition hover:text-fuchsia-700 hover:underline sm:text-base"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-purple-300/50 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-400/40 focus:outline-none focus:ring-4 focus:ring-purple-300/60 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:min-h-14 sm:text-base"
                >
                  {loading ? "Logging in..." : "Login to Dashboard"}

                  {!loading && (
                    <ArrowRight
                      size={20}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              {/* Signup divider */}
              <div className="my-6 flex items-center gap-3 sm:my-7">
                <div className="h-px flex-1 bg-purple-200/80" />
                <span className="whitespace-nowrap text-xs font-medium text-slate-600 sm:text-sm">
                  NEW TO RUPIVA?
                </span>
                <div className="h-px flex-1 bg-purple-200/80" />
              </div>

              {/* Signup link */}
              <p className="text-center text-sm leading-6 text-slate-700 sm:text-base">
                Don&apos;t have a salon account?{" "}
                <Link
                  to="/salon-owner/signup"
                  className="font-extrabold text-purple-700 transition hover:text-fuchsia-700 hover:underline"
                >
                  Become a Salon Partner
                </Link>
              </p>

              {/* Security footer */}
              <div className="mt-6 flex items-center justify-center gap-2 border-t border-purple-200/70 pt-5 text-xs font-medium text-slate-600 sm:mt-7 sm:text-sm">
                <ShieldCheck size={17} className="shrink-0 text-purple-700" />
                Secure access to your salon account
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-4 text-center">
            <Link
              to="/salon-owner"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white/60 hover:text-purple-800"
            >
              <ArrowRight size={15} className="rotate-180" />
              Back to Salon Owner Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
