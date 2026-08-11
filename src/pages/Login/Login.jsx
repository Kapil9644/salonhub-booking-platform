import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(formData);

      login(data.user, data.token);

      alert("Login Successful 🎉");

      navigate(location.state?.from?.pathname || "/");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-fit bg-gray-50 px-4 py-10 sm:py-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
        SalonHub Login
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md rounded-2xl border border-gray-400 bg-white p-6 shadow-lg sm:p-8"
      >
        <div>
          <label>Phone Number</label>
          <br />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-purple-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div className="mt-2 text-right">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-purple-600 transition hover:text-purple-700"
          >
            Forgot Password?
          </Link>
        </div>
        <br />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-purple-600 transition hover:text-purple-700"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
