import { useState } from "react";
import { Outlet } from "react-router-dom";
import SalonOwnerNavbar from "../../components/SalonOwner/SalonOwnerNavbar/SalonOwnerNavbar";
import SalonOwnerSidebar from "../../components/SalonOwner/SalonOwnerSidebar/SalonOwnerSidebar";

export default function SalonOwnerLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <SalonOwnerNavbar onMenuClick={() => setIsMobileMenuOpen(true)} />

      <div className="flex">
        <SalonOwnerSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        <main className="min-w-0 flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
