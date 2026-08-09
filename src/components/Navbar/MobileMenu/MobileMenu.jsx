import { navigation } from "../../../data/navigation";
import { Link } from "react-router-dom";
import ActionButtons from "../ActionButtons/ActionButtons";
import { useAuth } from "../../../context/AuthContext";

export default function MobileMenu({ isMenuOpen, setIsMenuOpen }) {
  const { user } = useAuth();

  if (!isMenuOpen) return null;

  return (
    <div className="border-t border-gray-100 bg-white shadow-lg lg:hidden">
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        {/* User Profile */}
        {user && (
          <Link
            to="/profile"
            onClick={() => setIsMenuOpen(false)}
            className="mb-3 flex items-center gap-3 rounded-2xl bg-purple-50 px-4 py-3.5 text-slate-800 transition-colors duration-200 hover:bg-purple-100"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-lg text-white">
              👤
            </span>

            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500">Welcome back</p>

              <p className="truncate font-semibold text-slate-900">
                {user.fullName}
              </p>
            </div>
          </Link>
        )}

        {/* Navigation Links */}
        <div className="divide-y divide-gray-100">
          {navigation.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center py-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-purple-600"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Login / Signup / Logout */}
        <div className="mt-5 border-t border-gray-100 pt-5">
          <ActionButtons
            mobile={true}
            showUser={false}
            onClick={() => setIsMenuOpen(false)}
          />
        </div>
      </nav>
    </div>
  );
}
