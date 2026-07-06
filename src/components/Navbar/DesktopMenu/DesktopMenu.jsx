import { Link } from "react-router-dom";
import { navigation } from "../../../data/navigation";

export default function DesktopMenu() {
  return (
    <nav className="hidden lg:flex items-center gap-8">
      {navigation.map((item) => (
        <Link
          key={item.id}
          to={item.href}
          className="text-slate-700 hover:text-purple-600 transition-colors duration-300 font-medium"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}