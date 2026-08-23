const bookingRoutes = require("./routes/bookingRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const salonRoutes = require("./routes/salonRoutes");
const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes");
const connectDB = require("./config/db");
const adminSalonRoutes = require("./routes/adminSalonRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/salons", salonRoutes);
app.use("/api/admin/salons", adminSalonRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to SalonHub API 🚀",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
