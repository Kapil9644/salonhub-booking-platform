import {
  LayoutDashboard,
  Store,
  Users,
  CalendarCheck,
  Settings,
  LogOut,
  X,
  CreditCard,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../../context/useAdminAuth";

export default function AdminSidebar({ isMobileOpen = false, onMobileClose }) {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Salon Applications",
      path: "/admin/salon-applications",
      icon: Store,
    },
    {
      label: "Salons",
      path: "/admin/salons",
      icon: Store,
    },
    {
      label: "Customers",
      path: "/admin/customers",
      icon: Users,
    },
    {
      label: "Appointments",
      path: "/admin/appointments",
      icon: CalendarCheck,
    },
    {
      label: "Payments",
      path: "/admin/payments",
      icon: CreditCard,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    onMobileClose?.();

    logout();
    navigate("/admin/login", { replace: true });
  };

  const handleNavigation = () => {
    onMobileClose?.();
  };

  const renderMenuItems = () => (
    <nav className="space-y-1">
      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleNavigation}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-purple-600"
              }`
            }
          >
            <Icon size={19} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-gray-200 bg-white lg:block">
        <div className="flex h-full flex-col p-4">
          {renderMenuItems()}

          <div className="mt-0 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={19} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={onMobileClose}
          className="fixed inset-0 top-16 z-40 bg-slate-900/40 lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed bottom-0 left-0 top-16 z-50 w-72 max-w-[85vw] border-r border-gray-200 bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-4">
          {/* Mobile Sidebar Header */}
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                Administration
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Admin Menu
              </h2>
            </div>

            <button
              type="button"
              onClick={onMobileClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-slate-900"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">{renderMenuItems()}</div>

          {/* Logout */}
          <div className=" border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={19} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
