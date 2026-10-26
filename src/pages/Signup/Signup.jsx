import { useState } from "react";
import { registerUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Scissors,
  UserRound,
  Phone,
  Mail,
  LockKeyhole,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useNotification } from "../../context/NotificationContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { error: showError, success: showSuccess } = useNotification();

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isSalonOwnerSignup = location.pathname === "/salon-owner/signup";

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      showError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError("Passwords do not match. Please try again.");
      return;
    }

    try {
      setLoading(true);

      const registrationData = {
        ...formData,
        role: isSalonOwnerSignup ? "salon" : "customer",
      };

      const data = await registerUser(registrationData);

      login(data.user, data.token);

      showSuccess("Account created successfully!");

      navigate(isSalonOwnerSignup ? "/salon-owner/dashboard" : "/", {
        replace: true,
      });
    } catch (err) {
      showError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100";

  return (
    <main className="min-h-[calc(100svh-170px)] bg-slate-50 px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-purple-950/5 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Branding panel */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-purple-800 via-purple-700 to-fuchsia-600 p-8 text-white lg:flex xl:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full border border-white/10" />

          <Link to="/" className="relative z-10 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-purple-700 shadow-lg">
              <Scissors size={27} />
            </span>
            <span>
              <span className="block text-2xl font-extrabold tracking-tight">
                Rupiva
              </span>
              <span className="text-[10px] tracking-[0.25em] text-purple-100">
                BOOK · STYLE · SHINE
              </span>
            </span>
          </Link>

          <div className="relative z-10 py-12">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium">
              <Sparkles size={14} /> Your style, your choice
            </span>
            <h2 className="max-w-sm text-4xl font-bold leading-tight xl:text-5xl">
              Your next great look starts here.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-purple-100">
              Discover trusted salons, explore services and book your next
              appointment with ease.
            </p>

            <div className="mt-8 space-y-3 text-sm text-white/90">
              {[
                "Find salons that match your style",
                "Book appointments at your convenience",
                "Keep your bookings in one place",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 size={17} className="shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs text-purple-100">
            Look good. Feel confident. Be you.
          </p>
        </aside>

        {/* Signup form */}
        <section className="min-w-0 p-5 sm:p-8 lg:p-10">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-lg font-extrabold tracking-tight text-purple-700 lg:hidden"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100">
              <Scissors size={21} />
            </span>
            Rupiva
          </Link>

          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              <Sparkles size={13} /> Join Rupiva
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {isSalonOwnerSignup
                ? "Become a salon partner"
                : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {isSalonOwnerSignup
                ? "Get started with your salon on Rupiva."
                : "Book your favourite salon services in a few easy steps."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Full name
              </label>
              <div className="relative">
                <UserRound
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="signupPhone"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Phone number
                </label>
                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="signupPhone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    inputMode="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signupEmail"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="signupEmail"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="signupPassword"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="signupPassword"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  required
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-purple-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Confirm password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  minLength={8}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-purple-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating account..."
                : isSalonOwnerSignup
                  ? "Create salon account"
                  : "Create account"}
              {!loading && (
                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-0.5"
                />
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to={isSalonOwnerSignup ? "/salon-owner/login" : "/login"}
              className="font-semibold text-purple-700 hover:text-fuchsia-700"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-5 text-center text-xs leading-5 text-slate-400">
            By creating an account, you agree to use Rupiva responsibly.
          </p>
        </section>
      </div>
    </main>
  );
};

export default Signup;
