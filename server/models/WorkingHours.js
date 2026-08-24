const mongoose = require("mongoose");

const workingHoursSchema = new mongoose.Schema(
  {
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon",
      required: true,
      unique: true,
    },

    monday: {
      isOpen: {
        type: Boolean,
        default: true,
      },
      openTime: {
        type: String,
        default: "09:00",
      },
      closeTime: {
        type: String,
        default: "18:00",
      },
    },

    tuesday: {
      isOpen: {
        type: Boolean,
        default: true,
      },
      openTime: {
        type: String,
        default: "09:00",
      },
      closeTime: {
        type: String,
        default: "18:00",
      },
    },

    wednesday: {
      isOpen: {
        type: Boolean,
        default: true,
      },
      openTime: {
        type: String,
        default: "09:00",
      },
      closeTime: {
        type: String,
        default: "18:00",
      },
    },

    thursday: {
      isOpen: {
        type: Boolean,
        default: true,
      },
      openTime: {
        type: String,
        default: "09:00",
      },
      closeTime: {
        type: String,
        default: "18:00",
      },
    },

    friday: {
      isOpen: {
        type: Boolean,
        default: true,
      },
      openTime: {
        type: String,
        default: "09:00",
      },
      closeTime: {
        type: String,
        default: "18:00",
      },
    },

    saturday: {
      isOpen: {
        type: Boolean,
        default: true,
      },
      openTime: {
        type: String,
        default: "09:00",
      },
      closeTime: {
        type: String,
        default: "18:00",
      },
    },

    sunday: {
      isOpen: {
        type: Boolean,
        default: false,
      },
      openTime: {
        type: String,
        default: "09:00",
      },
      closeTime: {
        type: String,
        default: "18:00",
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("WorkingHours", workingHoursSchema);
