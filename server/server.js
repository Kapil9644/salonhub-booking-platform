const bookingRoutes = require("./routes/bookingRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const salonRoutes = require("./routes/salonRoutes");
const authRoutes = require("./routes/authRoutes");
const salonOwnerAuthRoutes = require("./routes/salonOwnerAuthRoutes");
const locationRoutes = require("./routes/locationRoutes");
const connectDB = require("./config/db");
const adminSalonRoutes = require("./routes/adminSalonRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const globalServiceRoutes = require("./routes/globalServiceRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const workingHoursRoutes = require("./routes/workingHoursRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const salonOwnerBookingRoutes = require("./routes/salonOwnerBookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const app = express();
const notificationRoutes = require("./routes/notificationRoutes");
const salonOwnerNotificationRoutes = require("./routes/salonOwnerNotificationRoutes");
const { startBookingReminderJob } = require("./jobs/bookingReminderJob");
const adminBookingRoutes = require("./routes/adminBookingRoutes");
const adminPaymentRoutes = require("./routes/adminPaymentRoutes");

// Connect Database
connectDB();

// Middleware
app.use(cors());

app.use(
  express.json({
    limit: "100kb",
    verify: (req, res, buf) => {
      if (req.originalUrl === "/api/payments/webhook") {
        req.rawBody = buf.toString("utf8");
      }
    },
  }),
);
app.use("/api/auth", authRoutes);
app.use("/api/salon-owner-auth", salonOwnerAuthRoutes);
app.use("/api/admin-auth", adminAuthRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/salon-owner/appointments", salonOwnerBookingRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/salons", salonRoutes);
app.use("/api/admin/salons", adminSalonRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/global-services", globalServiceRoutes);
app.use("/api/working-hours", workingHoursRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/salon-owner/notifications", salonOwnerNotificationRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);
app.use("/api/admin/settings", require("./routes/adminSettingsRoutes"));

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Rupiva API 🚀",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  startBookingReminderJob();
});
