import { Link } from "react-router-dom";
import { navigation } from "../../../data/navigation";

export default function DesktopMenu() {
  return (
    <nav className="hidden items-center gap-7 lg:flex">
      {navigation.map((item) => (
        <Link
          key={item.id}
          to={item.href}
          className="text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-purple-600"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
