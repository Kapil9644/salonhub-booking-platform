import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSalonOwnerAuth } from "../../../context/SalonOwnerAuthContext";

export default function SalonOwnerPublicRoute() {
  const { salonOwner, loading } = useSalonOwnerAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Already logged in as Salon Owner
  if (salonOwner) {
    return (
      <Navigate
        to="/salon-owner/dashboard"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
