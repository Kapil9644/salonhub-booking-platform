import { navigation } from "../../../data/navigation";
import { Link } from "react-router-dom";
import ActionButtons from "../ActionButtons/ActionButtons";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import {
  X,
  UserRound,
  ChevronDown,
  ChevronUp,
  Compass,
  Handshake,
} from "lucide-react";

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

  useEffect(() => {
    if (!isMenuOpen) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMenuOpen]);

  if (!isMenuOpen) return null;

  return (
    <div
      ref={mobileMenuRef}
      className="fixed right-3 top-3 z-[60] flex max-h-[calc(100vh-24px)] w-[min(70vw,300px)] flex-col overflow-hidden overscroll-contain rounded-3xl border border-purple-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.20)] lg:hidden"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-purple-600">
            Rupiva
          </p>
          <p className="mt-0.5 text-sm font-medium text-slate-500">
            Book • Style • Shine
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-slate-600 transition-all duration-200 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
        >
          <X size={19} strokeWidth={2} />
        </button>
      </div>

      <nav className="min-h-0 overflow-y-auto px-4 py-4">
        {/* User Profile */}
        {user && (
          <Link
            to="/profile"
            onClick={() => setIsMenuOpen(false)}
            className="mb-4 flex min-w-0 items-center gap-3 rounded-2xl border border-purple-100 bg-purple-50 px-3 py-3 transition-all duration-200 hover:bg-purple-100"
          >
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white"
              />
            ) : (
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white ring-2 ring-white">
                <UserRound size={19} strokeWidth={2} />
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-gray-500">
                Welcome back
              </p>

              <p className="truncate text-sm font-bold text-slate-900">
                {user.fullName}
              </p>

              <p className="mt-0.5 text-xs text-purple-600">View profile</p>
            </div>
          </Link>
        )}

        {/* Account */}
        {user && (
          <div className="border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() =>
                setActiveSection((prev) =>
                  prev === "account" ? null : "account",
                )
              }
              className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-xs font-bold uppercase tracking-[0.12em] text-gray-500 transition-colors duration-200 hover:bg-gray-50 hover:text-purple-600"
            >
              <span className="flex items-center gap-2">
                <UserRound size={15} strokeWidth={2} />
                Account
              </span>

              {activeSection === "account" ? (
                <ChevronUp size={16} strokeWidth={2} />
              ) : (
                <ChevronDown size={16} strokeWidth={2} />
              )}
            </button>

            {activeSection === "account" && (
              <div className="mt-2 space-y-1">
                {navigation.account.map((item) => (
                  <Link
                    key={item.id}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-purple-50 hover:text-purple-700"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Explore */}
        <div
          className={
            user
              ? "mt-4 border-t border-gray-100 pt-4"
              : "border-t border-gray-100 pt-4"
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
              className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-xs font-bold uppercase tracking-[0.12em] text-gray-500 transition-colors duration-200 hover:bg-gray-50 hover:text-purple-600"
            >
              <span className="flex items-center gap-2">
                <Compass size={15} strokeWidth={2} />
                Explore
              </span>

              {activeSection === "explore" ? (
                <ChevronUp size={16} strokeWidth={2} />
              ) : (
                <ChevronDown size={16} strokeWidth={2} />
              )}
            </button>
          ) : (
            <div className="px-2 py-2">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                <Compass size={15} strokeWidth={2} />
                Explore
              </span>
            </div>
          )}

          {(!user || activeSection === "explore") && (
            <div className="mt-2 space-y-1">
              {navigation.primary.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-purple-50 hover:text-purple-700"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                to="/partner"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-purple-50 hover:text-purple-700"
              >
                <Handshake size={17} strokeWidth={2} />
                Become Partner
              </Link>
            </div>
          )}
        </div>

        {/* Utility Actions */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <ActionButtons
            mobile={true}
            showUser={false}
            onClick={() => setIsMenuOpen(false)}
          />
        </div>
      </nav>
    </div>
  );
}
