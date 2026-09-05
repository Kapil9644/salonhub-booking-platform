import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navigation } from "../../../data/navigation";
import { ChevronDown } from "lucide-react";

export default function DesktopMenu() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef(null);
  const location = useLocation();

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

  const isActive = (href) => location.pathname === href;

  const isMoreActive = navigation.secondary.some(
    (item) => location.pathname === item.href,
  );

  return (
    <nav className="hidden items-center gap-7 lg:ml-5 lg:flex xl:ml-7 xl:gap-6">
      {navigation.primary.map((item) => {
        const active = isActive(item.href);

        return (
          <Link
            key={item.id}
            to={item.href}
            className={`relative whitespace-nowrap px-1 py-2 text-[15px] font-semibold transition-colors duration-200 xl:text-base ${
              active
                ? "text-purple-700"
                : "text-slate-700 hover:text-purple-600"
            }`}
          >
            {item.label}

            {active && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-purple-600" />
            )}
          </Link>
        );
      })}

      {/* More Menu */}
      <div ref={moreMenuRef} className="relative">
        <button
          type="button"
          onClick={() => setIsMoreOpen((prev) => !prev)}
          className={`relative flex items-center gap-1 px-1 py-2 text-[15px] font-semibold transition-colors duration-200 xl:text-base ${
            isMoreOpen || isMoreActive
              ? "text-purple-700"
              : "text-slate-700 hover:text-purple-600"
          }`}
        >
          More
          <ChevronDown
            size={16}
            strokeWidth={2}
            className={`transition-transform duration-200 ${
              isMoreOpen ? "rotate-180" : ""
            }`}
          />
          {isMoreActive && (
            <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-purple-600" />
          )}
        </button>

        {/* More Dropdown */}
        <div
          className={`absolute right-0 top-full z-50 mt-3 w-52 origin-top-right overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_14px_35px_rgba(15,23,42,0.14)] transition-all duration-200 ${
            isMoreOpen
              ? "visible translate-y-0 scale-100 opacity-100"
              : "invisible -translate-y-1 scale-95 opacity-0"
          }`}
        >
          {navigation.secondary.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.id}
                to={item.href}
                className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "bg-purple-50 text-purple-700"
                    : "text-slate-700 hover:bg-purple-50 hover:text-purple-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
