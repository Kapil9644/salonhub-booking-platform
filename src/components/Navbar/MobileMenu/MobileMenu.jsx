import { navigation } from "../../../data/navigation";

export default function MobileMenu({
  isMenuOpen,
  setIsMenuOpen,
}) {
  if (!isMenuOpen) return null;

  return (
    <div className="absolute left-0 top-full w-full bg-white shadow-lg lg:hidden">
      <nav className="flex flex-col p-6">
        {navigation.map((item) => (
          <a
            key={item.id}
            href={item.href}
            onClick={() => setIsMenuOpen(false)}
            className="border-b border-gray-100 py-4 text-slate-700 transition-colors duration-300 hover:text-purple-600"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}