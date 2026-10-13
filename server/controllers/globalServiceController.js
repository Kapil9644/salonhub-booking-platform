const GlobalService = require("../models/GlobalService");

// Get all active global services
const getGlobalServices = async (req, res) => {
  try {
    const services = await GlobalService.find({
      isActive: true,
    }).sort({
      category: 1,
      name: 1,
    });

    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("Get global services error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get a single global service
const getGlobalServiceById = async (req, res) => {
  try {
    const service = await GlobalService.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Global service not found.",
      });
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Get global service error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getGlobalServices,
  getGlobalServiceById,
};
