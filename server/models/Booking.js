const mongoose = require("mongoose");

const bookingServiceSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    name: {
      type: String,
      required: true,
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
  },
  {
    _id: false,
  },
);

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    salon: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Salon",
        required: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      location: {
        address: {
          type: String,
          default: "",
        },

        area: {
          type: String,
          default: "",
        },

        city: {
          type: String,
          default: "",
        },

        state: {
          type: String,
          default: "",
        },

        pincode: {
          type: String,
          default: "",
        },
      },
    },

    services: {
      type: [bookingServiceSchema],
      required: true,

      validate: {
        validator: function (services) {
          return services.length > 0;
        },

        message: "At least one service is required.",
      },
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    totalDuration: {
      type: Number,
      required: true,
      min: 1,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Upcoming", "Completed", "Cancelled"],
      default: "Upcoming",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Booking", bookingSchema);
