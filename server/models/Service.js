const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon",
      required: true,
    },

    // Main service category selected by salon owner
    category: {
      type: String,
      required: true,
      default: "Other",
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    // Optional connection to Rupiva's global service catalogue.
    // Salon owners are NOT required to use this.
    globalService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GlobalService",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

serviceSchema.index({ salon: 1, isActive: 1 });

module.exports = mongoose.model("Service", serviceSchema);
