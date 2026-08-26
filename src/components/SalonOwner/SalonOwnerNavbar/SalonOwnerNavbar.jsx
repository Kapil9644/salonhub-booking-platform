import { useEffect, useState } from "react";
import { Bell, Menu, Store, User } from "lucide-react";
import { getMySalon } from "../../../services/salonService";
import { useSalonOwnerAuth } from "../../../context/SalonOwnerAuthContext";

export default function SalonOwnerNavbar({ onMenuClick }) {
  const { salonOwner } = useSalonOwnerAuth();

  const [salonName, setSalonName] = useState("");

  useEffect(() => {
    const fetchSalonName = async () => {
      try {
        const data = await getMySalon();

        setSalonName(data.salon?.name || "");
      } catch (error) {
        console.error("Failed to fetch salon name:", error);
        setSalonName("");
      }
    };

    fetchSalonName();
  }, []);

  const ownerName = salonOwner?.fullName || "Salon Owner";

  const ownerImage = salonOwner?.profileImage || "";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Left Side */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 hover:text-purple-600 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Brand */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600">
              <Store size={21} className="text-white" />
            </div>

            <div className="min-w-0">
              <h1 className="font-bold text-slate-900">SalonHub</h1>

              <p className="text-xs text-gray-500">For Business</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button
            type="button"
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-purple-600"
            aria-label="Notifications"
          >
            <Bell size={21} />
          </button>

          {/* Owner Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Owner Photo */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-purple-100 font-semibold text-purple-600">
              {ownerImage ? (
                <img
                  src={ownerImage}
                  alt={ownerName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={18} />
              )}
            </div>

            {/* Owner Name + Salon */}
            <div className="hidden min-w-0 sm:block">
              <p className="max-w-[180px] truncate text-sm font-semibold text-slate-900">
                {ownerName}
              </p>

              <p className="max-w-[180px] truncate text-xs text-gray-500">
                {salonName ? `${salonName} Owner` : "Salon Owner"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
