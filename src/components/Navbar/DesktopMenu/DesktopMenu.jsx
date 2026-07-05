import { navigation } from "../../../data/navigation";

export default function DesktopMenu() {
  return (
    <nav className="hidden lg:flex items-center gap-8">
      {navigation.map((item) => (
        <a
          key={item.id}
          href={item.href}
          className="text-slate-700 hover:text-purple-600 transition-colors duration-300 font-medium"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}