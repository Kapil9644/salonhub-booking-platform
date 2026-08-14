import { navigation } from "../../../data/navigation";
import { Link } from "react-router-dom";
import ActionButtons from "../ActionButtons/ActionButtons";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export default function MobileMenu({ isMenuOpen, setIsMenuOpen }) {
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState(
    user ? "account" : "explore",
  );

  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  if (!isMenuOpen) return null;

  return (
    <div
      ref={mobileMenuRef}
      className="fixed right-0 top-0 z-[60] w-[48vw] min-w-[150px] max-w-[200px] max-h-screen overflow-y-auto border-l border-b border-gray-100 bg-white shadow-2xl lg:hidden"
    >
      <div className="flex items-center justify-end px-3 pt-3">
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors duration-200 hover:bg-gray-100 hover:text-slate-900"
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>

      <nav className="w-full px-3 py-4">
        {/* User Profile */}
        {user && (
          <Link
            to="/profile"
            onClick={() => setIsMenuOpen(false)}
            className="mb-3 flex min-w-0 items-center gap-2 rounded-2xl bg-purple-50 px-2.5 py-2.5 text-slate-800 transition-colors duration-200 hover:bg-purple-100"
          >
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm text-white">
                👤
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="whitespace-nowrap text-[9px] font-medium text-gray-500">
                Welcome back
              </p>

              <p className="truncate font-semibold text-slate-900">
                {user.fullName}
              </p>
            </div>
          </Link>
        )}

        {/* Account */}
        {user && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Account
            </p>

            <div className="divide-y divide-gray-100">
              {navigation.account.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center py-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-purple-600"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Explore */}
        <div
          className={
            user
              ? "mt-5 border-t border-gray-100 pt-4"
              : "border-t border-gray-100 pt-3"
          }
        >
          {user ? (
            <button
              type="button"
              onClick={() =>
                setActiveSection((prev) =>
                  prev === "explore" ? null : "explore",
                )
              }
              className="flex w-full items-center justify-between py-1 text-xs font-semibold uppercase tracking-wider text-gray-500 transition-colors duration-200 hover:text-purple-600"
            >
              <span>Explore</span>

              <span className="text-sm leading-none">
                {activeSection === "explore" ? "−" : "+"}
              </span>
            </button>
          ) : (
            <div className="py-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Explore
              </span>
            </div>
          )}

          {(!user || activeSection === "explore") && (
            <div className="mt-2 flex flex-col">
              {navigation.primary.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center py-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-purple-600"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                to="/partner"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center py-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-purple-600"
              >
                Become Partner
              </Link>
            </div>
          )}
        </div>

        {/* Utility Actions */}
        <div className="mt-4 border-t border-gray-100 pt-3">
          <div className="mt-1">
            <ActionButtons
              mobile={true}
              showUser={false}
              onClick={() => setIsMenuOpen(false)}
            />
          </div>
        </div>
      </nav>
    </div>
  );
}
