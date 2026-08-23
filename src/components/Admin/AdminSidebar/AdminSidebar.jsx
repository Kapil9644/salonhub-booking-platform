import {
  LayoutDashboard,
  Store,
  Users,
  CalendarCheck,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

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
      label: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="hidden min-h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-gray-200 bg-white lg:block">
      <div className="flex h-full flex-col p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
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

        <div className="mt-auto border-t border-gray-100 pt-4">
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
  );
}
