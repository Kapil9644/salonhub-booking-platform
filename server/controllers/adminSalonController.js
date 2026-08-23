const Salon = require("../models/Salon");

// Get all pending salon applications
const getPendingSalons = async (req, res) => {
  try {
    const salons = await Salon.find({
      approvalStatus: "Pending",
    })
      .populate("owner", "fullName phone email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      salons,
    });
  } catch (error) {
    console.error("Get pending salons error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getPendingSalons,
};
