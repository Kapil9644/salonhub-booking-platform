const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      default: "Rupiva",
      trim: true,
      maxlength: 100,
    },

    supportEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    supportPhone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 20,
    },

    currency: {
      type: String,
      enum: ["INR"],
      default: "INR",
    },

    bookingCancellationHours: {
      type: Number,
      default: 2,
      min: 0,
      max: 720,
    },

    bookingAdvanceDays: {
      type: Number,
      default: 30,
      min: 1,
      max: 365,
    },

    platformCommission: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },

    allowPayNow: {
      type: Boolean,
      default: true,
    },

    allowPayAfterService: {
      type: Boolean,
      default: true,
    },

    emailNotifications: {
      type: Boolean,
      default: true,
    },

    bookingNotifications: {
      type: Boolean,
      default: true,
    },

    paymentNotifications: {
      type: Boolean,
      default: true,
    },

    requireAdminApproval: {
      type: Boolean,
      default: true,
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("AdminSettings", adminSettingsSchema);
