import { Link } from "react-router-dom";
import { Store, ArrowLeft } from "lucide-react";

export default function SalonOwnerForgotPassword() {
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

        <form>
          <label className="text-sm font-medium text-slate-700">
            Phone Number
          </label>

          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Continue
          </button>
        </form>

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
