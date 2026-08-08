import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until AuthContext finishes checking localStorage
  if (loading) {
    return <p>Loading...</p>;
  }

  // If no user after loading, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // User is logged in
  return children;
};

export default ProtectedRoute;
