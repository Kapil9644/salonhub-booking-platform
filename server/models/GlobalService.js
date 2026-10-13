const mongoose = require("mongoose");

const globalServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    detailedDescription: {
      type: String,
      default: "",
      trim: true,
    },

    highlights: {
      type: [String],
      default: [],
    },

    defaultDuration: {
      type: Number,
      default: 30,
      min: 1,
    },

    icon: {
      type: String,
      default: "Scissors",
      trim: true,
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

module.exports = mongoose.model("GlobalService", globalServiceSchema);
