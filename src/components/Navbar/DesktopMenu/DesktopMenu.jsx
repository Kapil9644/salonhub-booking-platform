import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { navigation } from "../../../data/navigation";
import { ChevronDown } from "lucide-react";

export default function DesktopMenu() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };

    if (isMoreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMoreOpen]);

  return (
    <nav className="hidden items-center gap-6 lg:flex">
      {navigation.primary.map((item) => (
        <Link
          key={item.id}
          to={item.href}
          className="text-base font-semibold text-slate-700 transition-colors duration-200 hover:text-purple-600"
        >
          {item.label}
        </Link>
      ))}

      {/* More Menu */}
      <div ref={moreMenuRef} className="relative">
        <button
          type="button"
          onClick={() => setIsMoreOpen((prev) => !prev)}
          className="flex items-center gap-1 text-base font-semibold text-slate-700 transition-colors duration-200 hover:text-purple-600"
        >
          More
          <ChevronDown
            size={16}
            strokeWidth={2}
            className={`transition-transform duration-200 ${
              isMoreOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          className={`absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-xl transition-all duration-200 ${
            isMoreOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-1 opacity-0"
          }`}
        >
          {navigation.secondary.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className="block px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-purple-50 hover:text-purple-600"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
