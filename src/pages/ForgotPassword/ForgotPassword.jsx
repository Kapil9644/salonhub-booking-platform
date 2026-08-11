import { useState, useEffect } from "react";
import {
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../../services/authService";
import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await forgotPassword(phone);

    setSuccess(data.message);
    setOtpMessage(data.message);
    setResendTimer(90);
  };

  const handleVerifyOtp = async () => {
    const data = await verifyOtp(phone, otp);

    console.log("RESET TOKEN:", data.resetToken);

    setResetToken(data.resetToken);

    console.log(data);
  };
  const handleResetPassword = async () => {
    console.log("Reset Password button clicked");

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const data = await resetPassword(resetToken, newPassword);

    console.log(data);

    if (data.success) {
      alert("Password reset successfully. Please login again.");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-fit bg-gray-50 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-gray-400 bg-white p-6 shadow-lg sm:p-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
              <Phone className="text-purple-600" size={26} />
            </div>

            <h1 className="mt-5 text-3xl font-bold text-gray-900">
              Forgot Password?
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Enter your registered phone number and we'll send you an OTP to
              reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8">
            <div>
              <label htmlFor="phone" className="font-medium text-gray-700">
                Phone Number
              </label>

              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>
            {success && !resetToken && (
              <div className="mt-6">
                <label htmlFor="otp" className="font-medium text-gray-700">
                  OTP
                </label>

                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  maxLength="6"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="mt-4 w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
                >
                  Verify OTP
                </button>
              </div>
            )}

            {resetToken && (
              <div>
                <div className="mt-6">
                  <label
                    htmlFor="newPassword"
                    className="font-medium text-gray-700"
                  >
                    New Password
                  </label>

                  <div className="relative mt-2">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-purple-600"
                      aria-label={
                        showNewPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showNewPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="confirmPassword"
                    className="font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>

                  <div className="relative mt-2">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-purple-600"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="mt-6 w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
                >
                  Reset Password
                </button>
              </div>
            )}
            {!resetToken && (
              <button
                type="submit"
                disabled={success && resendTimer > 0}
                className="mt-6 w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {success ? "Resend OTP" : "Send OTP"}
              </button>
            )}

            {success && !resetToken && resendTimer > 0 && (
              <p className="mt-3 text-center text-sm text-gray-500">
                You can resend OTP in {resendTimer} seconds.
              </p>
            )}

            {otpMessage && !resetToken && resendTimer > 0 && (
              <p className="mt-4 text-center text-sm font-medium text-green-600">
                {otpMessage}
              </p>
            )}
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 font-medium text-purple-600 transition hover:text-purple-700"
            >
              <ArrowLeft size={18} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
