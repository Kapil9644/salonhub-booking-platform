import { navigation } from "../../../data/navigation";
import { Link } from "react-router-dom";
import ActionButtons from "../ActionButtons/ActionButtons";
import { useAuth } from "../../../context/AuthContext";

export default function MobileMenu({ isMenuOpen, setIsMenuOpen }) {
  const { user } = useAuth();

  if (!isMenuOpen) return null;

  return (
    <div className="absolute left-0 top-full w-full bg-white shadow-lg lg:hidden">
      <nav className="flex flex-col p-6">
        {/* User Name */}
        {user && (
          <Link
            to="/profile"
            onClick={() => setIsMenuOpen(false)}
            className="border-b border-gray-100 py-4 text-slate-700 transition-colors duration-300 hover:text-purple-600"
          >
            👤 {user.fullName}
          </Link>
        )}
        {/* Navigation Links */}
        {navigation.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            onClick={() => setIsMenuOpen(false)}
            className="border-b border-gray-100 py-4 text-slate-700 transition-colors duration-300 hover:text-purple-600"
          >
            {item.label}
          </Link>
        ))}

        {/* Login / Signup / Logout */}
        <div className="mt-6 flex flex-col gap-3">
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
