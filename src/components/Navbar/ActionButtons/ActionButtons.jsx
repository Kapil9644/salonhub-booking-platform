import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  if (mobile) {
    return (
      <div className="flex flex-col gap-3">
        {!user ? (
          <>
            <Link
              to="/login"
              onClick={onClick}
              className="rounded-2xl border border-purple-600 px-6 py-2 text-center font-medium text-purple-600 transition-all duration-200 hover:bg-purple-50"
            >
              Login
            </Link>

            <Link
              to="/signup"
              onClick={onClick}
              className="rounded-2xl bg-purple-600 px-6 py-2 text-center font-medium text-white transition-all duration-200 hover:bg-purple-700"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-0 py-2 text-left text-sm font-medium text-red-600 transition-colors duration-200 hover:text-red-700"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {user ? (
        showUser && (
          <div ref={accountMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsAccountOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-2xl px-3 py-2 font-medium text-slate-700 transition hover:bg-purple-50 hover:text-purple-600"
            >
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-lg">
                  👤
                </span>
              )}

              <span className="max-w-32 truncate text-base font-semibold">
                {user.fullName}
              </span>
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-xl">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-xs text-gray-500">Welcome back</p>
                  <p className="truncate font-semibold text-slate-900">
                    {user.fullName}
                  </p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsAccountOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-purple-50 hover:text-purple-600"
                >
                  My Account
                </Link>

                <Link
                  to="/my-bookings"
                  onClick={() => setIsAccountOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-purple-50 hover:text-purple-600"
                >
                  My Bookings
                </Link>

                <Link
                  to="/payment"
                  onClick={() => setIsAccountOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-purple-50 hover:text-purple-600"
                >
                  Payments
                </Link>

                <Link
                  to="/offers"
                  onClick={() => setIsAccountOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-purple-50 hover:text-purple-600"
                >
                  Offers
                </Link>

                <Link
                  to="/notifications"
                  onClick={() => setIsAccountOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-purple-50 hover:text-purple-600"
                >
                  Notifications
                </Link>

                <Link
                  to="/help-support"
                  onClick={() => setIsAccountOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-purple-50 hover:text-purple-600"
                >
                  Help
                </Link>

                <div className="my-1 border-t border-gray-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )
      ) : (
        <>
          <Link
            to="/login"
            className="rounded-2xl border border-purple-600 px-6 py-2 text-center font-medium text-purple-600 transition-all duration-200 hover:bg-purple-50"
          >
            Sign In
          </Link>
        </>
      )}
    </div>
  );
}
