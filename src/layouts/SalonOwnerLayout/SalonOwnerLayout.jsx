import { Outlet } from "react-router-dom";
import SalonOwnerNavbar from "../../components/SalonOwner/SalonOwnerNavbar/SalonOwnerNavbar";
import SalonOwnerSidebar from "../../components/SalonOwner/SalonOwnerSidebar/SalonOwnerSidebar";

export default function SalonOwnerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SalonOwnerNavbar />

      <div className="flex">
        <SalonOwnerSidebar />

        <main className="min-w-0 flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
