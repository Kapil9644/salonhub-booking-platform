import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Scissors,
  Phone,
  LockKeyhole,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useNotification } from "../../context/NotificationContext";

const Login = () => {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { error: showError } = useNotification();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(formData);

      if (data.user?.role !== "customer") {
        showError("This account is not registered as a customer.");
        return;
      }

      login(data.user, data.token);

      navigate(location.state?.from?.pathname || "/", {
        replace: true,
      });
    } catch (err) {
      showError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100";

  return (
    <main className="min-h-[calc(100svh-170px)] bg-slate-50 px-3 py-6 sm:px-6 sm:py-10">
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
              <Sparkles size={14} /> Welcome back
            </span>
            <h2 className="max-w-sm text-4xl font-bold leading-tight xl:text-5xl">
              Great style is just a booking away.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-purple-100">
              Sign in to explore salons, manage appointments and make time for
              yourself.
            </p>

            <div className="mt-8 space-y-3 text-sm text-white/90">
              {[
                "Explore services near you",
                "Manage your upcoming bookings",
                "Find your favourite salons",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 size={17} className="shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs text-purple-100">
            Your style journey continues with Rupiva.
          </p>
        </aside>

        {/* Login form */}
        <section className="flex min-w-0 flex-col justify-center p-5 sm:p-8 lg:p-10">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-lg font-extrabold tracking-tight text-purple-700 lg:hidden"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100">
              <Scissors size={21} />
            </span>
            Rupiva
          </Link>

          <div className="mb-7">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              <Sparkles size={13} /> Welcome to Rupiva
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your details to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="loginPhone"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Phone number
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="loginPhone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label
                  htmlFor="loginPassword"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-purple-700 transition hover:text-fuchsia-700 sm:text-sm"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="loginPassword"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-purple-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-fuchsia-600 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && (
                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-0.5"
                />
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to Rupiva?{" "}
            <Link
              to="/signup"
              className="font-semibold text-purple-700 transition hover:text-fuchsia-700"
            >
              Create an account
            </Link>
          </p>

          <p className="mt-7 text-center text-xs text-slate-400">
            Your personal style journey starts here.
          </p>
        </section>
      </div>
    </main>
  );
};

export default Login;
