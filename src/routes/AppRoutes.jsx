import ProtectedRoute from "../components/common/ProtectedRoute/ProtectedRoute";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Profile from "../pages/Profile/Profile";
import MainLayout from "../layouts/MainLayout/MainLayout";
import Booking from "../pages/Booking/Booking";
import Home from "../pages/Home/Home";
import Salons from "../pages/Salons/Salons";
import SalonDetails from "../pages/SalonDetails/SalonDetails";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import MyBookings from "../pages/MyBookings/MyBookings";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (user && !location.state?.from) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Main Website */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/salons" element={<Salons />} />
        <Route path="/salons/:id" element={<SalonDetails />} />
        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
