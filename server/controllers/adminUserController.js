const User = require("../models/User");

// Get all customers for admin
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({
      role: "customer",
    })
      .select("fullName email phone role profileImage createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("Get all customers error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getAllCustomers,
};
