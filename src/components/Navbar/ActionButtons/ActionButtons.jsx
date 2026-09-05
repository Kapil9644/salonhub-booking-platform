import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  CircleHelp,
  CreditCard,
  LogIn,
  LogOut,
  Tag,
  UserRound,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function ActionButtons({
  mobile = false,
  onClick = () => {},
  showUser = true,
}) {
  const { user, logout } = useAuth();
  console.log("Navbar User:", user);

  const navigate = useNavigate();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setIsAccountOpen(false);
      }
    };

    if (isAccountOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAccountOpen]);

  const handleLogout = () => {
    setIsAccountOpen(false);
    onClick();
    logout();
    navigate("/");
  };

  /* =========================
     MOBILE
  ========================= */
  if (mobile) {
    return (
      <div className="flex flex-col gap-3">
        {!user ? (
          <>
            <Link
              to="/login"
              onClick={onClick}
              className="flex items-center justify-center gap-2 rounded-xl border border-purple-600 px-5 py-2.5 text-sm font-semibold text-purple-600 transition-all duration-200 hover:bg-purple-50"
            >
              <LogIn size={17} strokeWidth={2} />
              Login
            </Link>

            <Link
              to="/signup"
              onClick={onClick}
              className="flex items-center justify-center rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-purple-700"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-2 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50"
          >
            <LogOut size={17} strokeWidth={2} />
            <span>Logout</span>
          </button>
        )}
      </div>
    );
  }

  /* =========================
     DESKTOP
  ========================= */
  return (
    <div className="flex items-center gap-2.5">
      {user ? (
        showUser && (
          <>
            {/* Notification */}
            <Link
              to="/notifications"
              aria-label="Notifications"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600"
            >
              <Bell size={21} strokeWidth={2} />
            </Link>

            {/* Account */}
            <div ref={accountMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsAccountOpen((prev) => !prev)}
                className={`flex h-12 max-w-[190px] items-center gap-2 rounded-full border px-2.5 transition-all duration-200 ${
                  isAccountOpen
                    ? "border-purple-200 bg-purple-50"
                    : "border-gray-200 bg-gray-50 hover:border-purple-200 hover:bg-purple-50"
                }`}
              >
                {/* Avatar */}
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white"
                  />
                ) : (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 ring-2 ring-white">
                    <UserRound size={18} strokeWidth={2} />
                  </span>
                )}

                {/* Customer Name */}
                <span className="min-w-0 max-w-[105px] truncate text-left text-sm font-semibold text-slate-800">
                  {user.fullName}
                </span>

                {/* Dropdown Arrow */}
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={`shrink-0 text-slate-500 transition-transform duration-200 ${
                    isAccountOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Account Dropdown */}
              {isAccountOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
                  {/* Profile Header */}
                  <div className="mb-1 flex items-center gap-3 rounded-xl bg-purple-50 px-3 py-3">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white">
                        <UserRound size={20} strokeWidth={2} />
                      </span>
                    )}

                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-gray-500">
                        Welcome back
                      </p>

                      <p className="truncate text-sm font-bold text-slate-900">
                        {user.fullName}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-purple-50 hover:text-purple-700"
                  >
                    <UserRound size={17} strokeWidth={2} />
                    My Account
                  </Link>

                  <Link
                    to="/my-bookings"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-purple-50 hover:text-purple-700"
                  >
                    <CalendarDays size={17} strokeWidth={2} />
                    My Bookings
                  </Link>

                  <Link
                    to="/payment"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-purple-50 hover:text-purple-700"
                  >
                    <CreditCard size={17} strokeWidth={2} />
                    Payments
                  </Link>

                  <Link
                    to="/offers"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-purple-50 hover:text-purple-700"
                  >
                    <Tag size={17} strokeWidth={2} />
                    Offers
                  </Link>

                  <Link
                    to="/notifications"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-purple-50 hover:text-purple-700"
                  >
                    <Bell size={17} strokeWidth={2} />
                    Notifications
                  </Link>

                  <Link
                    to="/help-support"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-purple-50 hover:text-purple-700"
                  >
                    <CircleHelp size={17} strokeWidth={2} />
                    Help
                  </Link>

                  <div className="my-1.5 border-t border-gray-100" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50"
                  >
                    <LogOut size={17} strokeWidth={2} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Book Now */}
            <Link
              to="/salons"
              className="inline-flex h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-purple-600 px-5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-purple-700 hover:shadow-md"
            >
              Book Now
            </Link>
          </>
        )
      ) : (
        <>
          <Link
            to="/login"
            className="inline-flex h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-xl border border-purple-600 px-5 text-sm font-semibold text-purple-600 transition-all duration-200 hover:bg-purple-50"
          >
            Sign In
          </Link>

          <Link
            to="/signup"
            className="inline-flex h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-purple-600 px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-purple-700"
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
}
