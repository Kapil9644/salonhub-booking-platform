import ProtectedRoute from "../components/common/ProtectedRoute/ProtectedRoute";
import { Routes, Route } from "react-router-dom";
import Profile from "../pages/Profile/Profile";
import MainLayout from "../layouts/MainLayout/MainLayout";
import Booking from "../pages/Booking/Booking";
import Home from "../pages/Home/Home";
import Salons from "../pages/Salons/Salons";
import SalonDetails from "../pages/SalonDetails/SalonDetails";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

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
      </Route>
    </Routes>
  );
}
