import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSalonOwnerAuth } from "../../../context/SalonOwnerAuthContext";

export default function SalonOwnerRoute() {
  const { salonOwner, loading } = useSalonOwnerAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Salon Owner is not logged in
  if (!salonOwner) {
    return (
      <Navigate
        to="/salon-owner/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
