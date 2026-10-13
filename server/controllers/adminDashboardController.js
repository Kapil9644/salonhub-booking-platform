const User = require("../models/User");
const Salon = require("../models/Salon");
const Booking = require("../models/Booking");

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalSalons,
      pendingApplications,
      totalCustomers,
      totalAppointments,
    ] = await Promise.all([
      Salon.countDocuments(),

      Salon.countDocuments({
        approvalStatus: "Pending",
      }),

      User.countDocuments({
        role: "customer",
      }),

      Booking.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalSalons,
        pendingApplications,
        totalCustomers,
        totalAppointments,
      },
    });
  } catch (error) {
    console.error("Get admin dashboard stats error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getDashboardStats,
};
