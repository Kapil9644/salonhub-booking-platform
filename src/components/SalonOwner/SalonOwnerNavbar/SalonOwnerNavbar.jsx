import { useEffect, useState } from "react";
import { Bell, Menu, Store, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMySalonOwnerNotifications } from "../../../services/salonOwnerNotificationService";
import { getMySalon } from "../../../services/salonService";
import { useSalonOwnerAuth } from "../../../context/SalonOwnerAuthContext";

export default function SalonOwnerNavbar({ onMenuClick }) {
  const { salonOwner } = useSalonOwnerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [salonName, setSalonName] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const isPublicSalonOwnerPage = [
    "/salon-owner",
    "/salon-owner/login",
    "/salon-owner/signup",
  ].includes(location.pathname);

  useEffect(() => {
    if (isPublicSalonOwnerPage) {
      setSalonName("");
      setUnreadCount(0);
      return;
    }

    let active = true;

    const fetchSalonName = async () => {
      try {
        const data = await getMySalon();
        if (active) setSalonName(data.salon?.name || "");
      } catch (error) {
        console.error("Failed to fetch salon name:", error);
        if (active) setSalonName("");
      }
    };

    const fetchUnreadNotifications = async () => {
      try {
        const data = await getMySalonOwnerNotifications();
        if (active) setUnreadCount(data.unreadCount || 0);
      } catch (error) {
        console.error("Failed to fetch notification count:", error);
        if (active) setUnreadCount(0);
      }
    };

    fetchSalonName();
    fetchUnreadNotifications();

    return () => {
      active = false;
    };
  }, [isPublicSalonOwnerPage, location.pathname]);

  const ownerName = salonOwner?.fullName || "Salon Owner";
  const ownerImage = salonOwner?.profileImage || "";

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur sm:h-16">
      <div className="mx-auto flex h-full w-full items-center justify-between gap-2 px-3 sm:px-5 lg:px-6">
        {/* Left: menu and brand */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-600 transition hover:bg-purple-50 hover:text-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={21} />
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                isPublicSalonOwnerPage
                  ? "/salon-owner"
                  : "/salon-owner/dashboard",
              )
            }
            className="flex min-w-0 items-center gap-2 text-left"
            aria-label="Rupiva for Business home"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm sm:h-10 sm:w-10">
              <Store size={20} />
            </span>

            <span className="min-w-0">
              <span className="block text-base font-extrabold leading-5 tracking-tight text-slate-900 sm:text-lg">
                Rupiva
              </span>
              <span className="block text-[10px] leading-4 text-gray-500 sm:text-xs">
                For Business
              </span>
            </span>
          </button>
        </div>

        {/* Right: notifications and owner */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {!isPublicSalonOwnerPage && (
            <button
              type="button"
              onClick={() => navigate("/salon-owner/notifications")}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-purple-50 hover:text-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              aria-label={
                unreadCount
                  ? `Notifications, ${unreadCount} unread`
                  : "Notifications"
              }
            >
              <Bell size={20} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-purple-600 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          )}

          <div className="flex min-w-0 items-center gap-2">
            {/* Owner Account — clickable profile */}
            <button
              type="button"
              onClick={() => navigate("/salon-owner/owner-profile")}
              className="flex min-w-0 items-center gap-2 rounded-xl p-1 text-left transition hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 sm:gap-2.5"
              aria-label="Open owner profile"
            >
              {/* Owner Photo */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-purple-100 text-purple-700 sm:h-9 sm:w-9">
                {ownerImage && !isPublicSalonOwnerPage ? (
                  <img
                    src={ownerImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={18} />
                )}
              </div>

              {/* Owner Name + Salon */}
              <div className="hidden min-w-0 sm:block">
                <p className="max-w-36 truncate text-sm font-semibold leading-5 text-slate-900 lg:max-w-48">
                  {isPublicSalonOwnerPage ? "Salon Owner" : ownerName}
                </p>

                <p className="max-w-36 truncate text-[11px] leading-4 text-gray-500 lg:max-w-48">
                  {isPublicSalonOwnerPage
                    ? "For Business"
                    : salonName || "Salon Owner"}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
