import { NavLink } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  LayoutDashboard,
  LogOut,
  Scissors,
  Settings,
  Store,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    path: "/salon-owner/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Salon",
    path: "/salon-owner/profile",
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

export default function SalonOwnerSidebar() {
  return (
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
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600">
            <LogOut size={19} />

            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
