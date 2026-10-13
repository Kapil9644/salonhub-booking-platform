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

// Reject salon application
const rejectSalon = async (req, res) => {
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

    salon.approvalStatus = "Rejected";
    salon.isListed = false;

    await salon.save();

    res.status(200).json({
      success: true,
      message: "Salon application rejected successfully.",
      salon,
    });
  } catch (error) {
    console.error("Reject salon error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get all salons for admin
const getAllSalons = async (req, res) => {
  try {
    const salons = await Salon.find({})
      .populate("owner", "fullName phone email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      salons,
    });
  } catch (error) {
    console.error("Get all salons error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getPendingSalons,
  approveSalon,
  rejectSalon,
  getAllSalons,
};
