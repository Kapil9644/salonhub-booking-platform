import { NavLink } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  LayoutDashboard,
  LogOut,
  Scissors,
  Settings,
  Store,
  User,
  X,
} from "lucide-react";
import { useSalonOwnerAuth } from "../../../context/SalonOwnerAuthContext";

const menuItems = [
  {
    label: "Dashboard",
    path: "/salon-owner/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Owner Profile",
    path: "/salon-owner/owner-profile",
    icon: User,
  },
  {
    label: "My Salon",
    path: "/salon-owner/salon-profile",
    icon: Store,
  },
  {
    label: "Services",
    path: "/salon-owner/services",
    icon: Scissors,
  },
  {
    label: "Working Hours",
    path: "/salon-owner/working-hours",
    icon: Clock3,
  },
  {
    label: "Appointments",
    path: "/salon-owner/appointments",
    icon: CalendarDays,
  },
  {
    label: "Settings",
    path: "/salon-owner/settings",
    icon: Settings,
  },
];

export default function SalonOwnerSidebar({
  isMobileMenuOpen,
  onCloseMobileMenu,
}) {
  const { logoutSalonOwner } = useSalonOwnerAuth();

  const handleLogout = () => {
    logoutSalonOwner();
    window.location.replace("/salon-owner");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden min-h-[calc(100vh-64px)] w-64 shrink-0 border-r border-gray-200 bg-white lg:block">
        <div className="flex h-full flex-col p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={19} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          onClick={onCloseMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600">
              <Store size={19} className="text-white" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">Rupiva</h2>
              <p className="text-xs text-gray-500">For Business</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobileMenu}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-slate-900"
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile Logout */}
        <div className="border-t border-gray-100 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
