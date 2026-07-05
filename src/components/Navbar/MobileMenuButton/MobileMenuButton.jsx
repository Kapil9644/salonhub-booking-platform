import { Menu, X } from "lucide-react";

export default function MobileMenuButton({
  isMenuOpen,
  setIsMenuOpen,
}) {
  return (
    <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className="lg:hidden text-slate-800"
    >
      {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
    </button>
  );
}