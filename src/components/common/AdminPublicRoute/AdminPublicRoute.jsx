import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../../context/useAdminAuth";

export default function AdminPublicRoute() {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (admin?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
