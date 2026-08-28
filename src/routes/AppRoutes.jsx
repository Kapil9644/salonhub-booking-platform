import SalonOwnerRoute from "../components/common/SalonOwnerRoute/SalonOwnerRoute";
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
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import MyBookings from "../pages/MyBookings/MyBookings";
import Services from "../pages/Services/Services";
import BecomePartner from "../pages/BecomePartner/BecomePartner";
import Offers from "../pages/Offers/Offers";
import Payment from "../pages/Payment/Payment";
import Notifications from "../pages/Notifications/Notifications";
import HelpSupport from "../pages/HelpSupport/HelpSupport";
import AboutUs from "../pages/AboutUs/AboutUs";
import BookingConfirmation from "../pages/BookingConfirmation/BookingConfirmation";
import SalonOwner from "../pages/SalonOwner/SalonOwner";
import SalonOwnerLayout from "../layouts/SalonOwnerLayout/SalonOwnerLayout";
import SalonOwnerDashboard from "../pages/SalonOwner/SalonOwnerDashboard";
import SalonProfile from "../pages/SalonOwner/SalonProfile";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import SalonApplications from "../pages/Admin/SalonApplications/SalonApplications";
import SalonOwnerServices from "../pages/SalonOwner/Services";
import WorkingHours from "../pages/SalonOwner/WorkingHours";
import SalonOwnerLogin from "../pages/SalonOwner/SalonOwnerLogin/SalonOwnerLogin";
import SalonOwnerSignup from "../pages/SalonOwner/SalonOwnerSignup/SalonOwnerSignup";
import SalonOwnerPublicLayout from "../layouts/SalonOwnerPublicLayout/SalonOwnerPublicLayout";
import SalonOwnerForgotPassword from "../pages/SalonOwner/SalonOwnerForgotPassword/SalonOwnerForgotPassword";
import SalonOwnerPublicRoute from "../components/common/SalonOwnerPublicRoute/SalonOwnerPublicRoute";
import SalonOwnerProfile from "../pages/SalonOwner/SalonOwnerProfile/SalonOwnerProfile";
import AdminRoute from "../components/common/AdminRoute/AdminRoute";
import AdminLogin from "../pages/Admin/Login/AdminLogin";
import AdminPublicRoute from "../components/common/AdminPublicRoute/AdminPublicRoute";
import AdminPublicLayout from "../layouts/AdminPublicLayout/AdminPublicLayout";

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
      {/* Main Website */}

      <Route element={<MainLayout />}>
        {/* Public Authentication Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
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

        <Route path="/services" element={<Services />} />
        <Route path="/partner" element={<BecomePartner />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/help-support" element={<HelpSupport />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      </Route>

      {/* Salon Owner Public Portal */}
      {/* Salon Owner Public Portal */}
      <Route element={<SalonOwnerPublicLayout />}>
        <Route path="/salon-owner" element={<SalonOwner />} />

        <Route element={<SalonOwnerPublicRoute />}>
          <Route path="/salon-owner/login" element={<SalonOwnerLogin />} />

          <Route path="/salon-owner/signup" element={<SalonOwnerSignup />} />

          <Route
            path="/salon-owner/forgot-password"
            element={<SalonOwnerForgotPassword />}
          />
        </Route>
      </Route>

      {/* Salon Owner Dashboard */}
      <Route element={<SalonOwnerRoute />}>
        <Route element={<SalonOwnerLayout />}>
          <Route
            path="/salon-owner/dashboard"
            element={<SalonOwnerDashboard />}
          />

          <Route path="/salon-owner/salon-profile" element={<SalonProfile />} />

          <Route
            path="/salon-owner/owner-profile"
            element={<SalonOwnerProfile />}
          />
          <Route
            path="/salon-owner/services"
            element={<SalonOwnerServices />}
          />

          <Route path="/salon-owner/working-hours" element={<WorkingHours />} />
        </Route>
      </Route>
      {/* Admin Entry */}
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

      {/* Admin Public Authentication */}
      <Route element={<AdminPublicLayout />}>
        <Route element={<AdminPublicRoute />}>
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>
      </Route>

      {/* Admin Protected Pages */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route
            path="/admin/salon-applications"
            element={<SalonApplications />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
