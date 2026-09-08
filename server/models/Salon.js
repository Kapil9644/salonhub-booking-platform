const mongoose = require("mongoose");

const salonSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      address: {
        type: String,
        default: "",
        trim: true,
      },

      area: {
        type: String,
        default: "",
        trim: true,
      },

      city: {
        type: String,
        default: "",
        trim: true,
      },

      state: {
        type: String,
        default: "",
        trim: true,
      },

      pincode: {
        type: String,
        default: "",
        trim: true,
      },
      latitude: {
        type: Number,
        default: null,
      },

      longitude: {
        type: Number,
        default: null,
      },
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    isListed: {
      type: Boolean,
      default: false,
    },

    isOpen: {
      type: Boolean,
      default: false,
    },
    statusOverride: {
      type: String,
      enum: ["auto", "open", "closed"],
      default: "auto",
    },

    statusOverrideDate: {
      type: String,
      default: "",
    },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Salon", salonSchema);
