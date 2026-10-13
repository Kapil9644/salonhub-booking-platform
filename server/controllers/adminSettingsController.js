const AdminSettings = require("../models/AdminSettings");

const DEFAULT_SETTINGS = {
  platformName: "Rupiva",
  supportEmail: "",
  supportPhone: "",
  currency: "INR",
  bookingCancellationHours: 2,
  bookingAdvanceDays: 30,
  platformCommission: 10,
  allowPayNow: true,
  allowPayAfterService: true,
  emailNotifications: true,
  bookingNotifications: true,
  paymentNotifications: true,
  requireAdminApproval: true,
  maintenanceMode: false,
};

// GET /api/admin/settings
const getAdminSettings = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne().lean();

    if (!settings) {
      settings = await AdminSettings.create(DEFAULT_SETTINGS);
      settings = settings.toObject();
    }

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get admin settings error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not load admin settings.",
    });
  }
};

// PUT /api/admin/settings
const updateAdminSettings = async (req, res) => {
  try {
    const allowedFields = Object.keys(DEFAULT_SETTINGS);
    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid settings were provided.",
      });
    }

    const currentSettings = await AdminSettings.findOne();

    if (!currentSettings) {
      const settings = await AdminSettings.create({
        ...DEFAULT_SETTINGS,
        ...updates,
      });

      return res.status(200).json({
        success: true,
        message: "Admin settings saved successfully.",
        settings,
      });
    }

    for (const [field, value] of Object.entries(updates)) {
      currentSettings.set(field, value);
    }

    await currentSettings.save();

    return res.status(200).json({
      success: true,
      message: "Admin settings saved successfully.",
      settings: currentSettings,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "One or more settings values are invalid.",
      });
    }

    console.error("Update admin settings error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not save admin settings.",
    });
  }
};

module.exports = {
  getAdminSettings,
  updateAdminSettings,
};
