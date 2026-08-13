import { navigation } from "../../../data/navigation";
import { Link } from "react-router-dom";
import ActionButtons from "../ActionButtons/ActionButtons";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useRef } from "react";

export default function MobileMenu({ isMenuOpen, setIsMenuOpen }) {
  const { user } = useAuth();
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  if (!isMenuOpen) return null;

  return (
    <div
      ref={mobileMenuRef}
      className="border-t border-gray-100 bg-white shadow-lg lg:hidden"
    >
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        {/* User Profile */}
        {user && (
          <Link
            to="/profile"
            onClick={() => setIsMenuOpen(false)}
            className="mb-3 flex items-center gap-3 rounded-2xl bg-purple-50 px-4 py-3.5 text-slate-800 transition-colors duration-200 hover:bg-purple-100"
          >
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-lg text-white">
                👤
              </span>
            )}

            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500">Welcome back</p>

              <p className="truncate font-semibold text-slate-900">
                {user.fullName}
              </p>
            </div>
          </Link>
        )}

        {/* Account */}
        {user && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Account
            </p>

            <div className="divide-y divide-gray-100">
              {navigation.account.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center py-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-purple-600"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Explore */}
        <div className="mt-5 border-t border-gray-100 pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Explore
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {navigation.primary.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center py-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-purple-600"
              >
                {item.label}
              </Link>
            ))}
            {navigation.secondary.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-purple-600"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Utility Actions */}
        <div className="mt-4 border-t border-gray-100 pt-3">
          <div className="mt-1">
            <ActionButtons
              mobile={true}
              showUser={false}
              onClick={() => setIsMenuOpen(false)}
            />
          </div>
        </div>
      </nav>
    </div>
  );
}
