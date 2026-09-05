import { Menu, X } from "lucide-react";

export default function MobileMenuButton({ isMenuOpen, setIsMenuOpen }) {
  return (
    <button
      type="button"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      aria-expanded={isMenuOpen}
      className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 lg:hidden ${
        isMenuOpen
          ? "border-purple-200 bg-purple-50 text-purple-700"
          : "border-gray-200 bg-white text-slate-700 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
      }`}
    >
      {isMenuOpen ? (
        <X size={23} strokeWidth={2} />
      ) : (
        <Menu size={23} strokeWidth={2} />
      )}
    </button>
  );
}
