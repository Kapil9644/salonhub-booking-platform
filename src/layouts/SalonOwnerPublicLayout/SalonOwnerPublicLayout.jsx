import { Outlet } from "react-router-dom";
import SalonOwnerNavbar from "../../components/SalonOwner/SalonOwnerNavbar/SalonOwnerNavbar";

export default function SalonOwnerPublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SalonOwnerNavbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
