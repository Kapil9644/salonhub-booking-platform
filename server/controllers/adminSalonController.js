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

// Approve salon application
const approveSalon = async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon application not found.",
      });
    }

    if (salon.approvalStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This salon application has already been processed.",
      });
    }

    salon.approvalStatus = "Approved";
    salon.isListed = true;

    await salon.save();

    res.status(200).json({
      success: true,
      message: "Salon approved successfully.",
      salon,
    });
  } catch (error) {
    console.error("Approve salon error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getPendingSalons,
  approveSalon,
};
