import { navigation } from "../../../data/navigation";
import { Link } from "react-router-dom";
import ActionButtons from "../ActionButtons/ActionButtons";

export default function MobileMenu({ isMenuOpen, setIsMenuOpen }) {
  if (!isMenuOpen) return null;

  return (
    <div className="absolute left-0 top-full w-full bg-white shadow-lg lg:hidden">
      <nav className="flex flex-col p-6">
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
        {/* Login & Signup */}
        <div className="mt-6 flex flex-col gap-3">
          <ActionButtons mobile={true} onClick={() => setIsMenuOpen(false)} />
        </div>
      </nav>
    </div>
  );
}
