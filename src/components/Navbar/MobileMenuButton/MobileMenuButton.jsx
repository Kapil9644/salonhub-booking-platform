import { Menu, X } from "lucide-react";

export default function MobileMenuButton({ isMenuOpen, setIsMenuOpen }) {
  return (
    <button
      type="button"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      aria-expanded={isMenuOpen}
      className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-800 transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200 lg:hidden"
    >
      {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
    </button>
  );
}
