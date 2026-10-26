import { NavLink, useLocation } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  LayoutDashboard,
  LogOut,
  Scissors,
  Settings,
  Store,
  Star,
  Bell,
  User,
  X,
  CreditCard,
  MessageCircle,
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
    label: "Payments",
    path: "/salon-owner/payments",
    icon: CreditCard,
  },
  {
    label: "Notifications",
    path: "/salon-owner/notifications",
    icon: Bell,
  },
  {
    label: "Reviews & Feedback",
    path: "/salon-owner/reviews",
    icon: Star,
  },
  {
    label: "Help & Support",
    path: "/salon-owner/help-support",
    icon: MessageCircle,
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
  const location = useLocation();

  const handleLogout = () => {
    logoutSalonOwner();
    window.location.replace("/salon-owner");
  };

  const renderMenuItems = (mobile = false) =>
    menuItems.map((item) => {
      const Icon = item.icon;

      return (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={mobile ? onCloseMobileMenu : undefined}
          className={({ isActive }) =>
            [
              "group flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
              isActive
                ? "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-100"
                : "text-gray-600 hover:bg-gray-50 hover:text-purple-700",
            ].join(" ")
          }
        >
          <Icon size={18} strokeWidth={1.9} className="shrink-0" />
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
        </NavLink>
      );
    });

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 self-start border-r border-gray-200 bg-white lg:flex xl:top-16 xl:h-[calc(100dvh-4rem)] xl:w-60">
        <div className="flex min-h-0 w-full flex-col px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Workspace
          </p>

          <nav
            aria-label="Salon owner navigation"
            className="min-h-0 flex-1 space-y-1 overflow-y-auto"
          >
            {renderMenuItems()}
          </nav>

          <div className="mt-3 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onCloseMobileMenu}
          className="fixed inset-0 z-50 cursor-default bg-slate-950/40 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* Mobile drawer */}
      <aside
        id="salon-owner-mobile-menu"
        aria-label="Mobile navigation"
        aria-hidden={!isMobileMenuOpen}
        className={[
          "fixed inset-y-0 left-0 z-[60] flex w-[min(17rem,85vw)] flex-col border-r border-gray-200 bg-white shadow-xl",
          "transition-transform duration-200 ease-out lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 px-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white">
              <Store size={19} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-slate-900">Rupiva</p>
              <p className="text-[10px] text-gray-500">For Business</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobileMenu}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav
          aria-label="Mobile salon owner navigation"
          className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3"
          onKeyDown={(event) => {
            if (event.key === "Escape") onCloseMobileMenu?.();
          }}
        >
          <p className="mb-2 px-3 pt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Workspace
          </p>
          {renderMenuItems(true)}
        </nav>

        <div className="shrink-0 border-t border-gray-100 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
