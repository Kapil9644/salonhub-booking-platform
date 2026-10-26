const AdminSettings = require("../models/AdminSettings");

const getPublicSupportSettings = async (req, res) => {
  try {
    const settings = await AdminSettings.findOne()
      .select("platformName supportEmail supportPhone")
      .lean();

    return res.status(200).json({
      success: true,
      settings: {
        platformName: settings?.platformName || "Rupiva",
        supportEmail: settings?.supportEmail || "support@rupiva.com",
        supportPhone: settings?.supportPhone || "+919644319427",
      },
    });
  } catch (error) {
    console.error("Public support settings error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load support details.",
    });
  }
};

module.exports = { getPublicSupportSettings };
