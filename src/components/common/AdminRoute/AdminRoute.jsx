import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../../context/useAdminAuth";

export default function AdminRoute() {
  const { admin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!admin) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    );
  }

  if (admin.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
