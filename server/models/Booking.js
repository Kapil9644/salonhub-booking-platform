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

    paymentMethod: {
      type: String,
      enum: ["PAY_NOW", "PAY_AFTER_SERVICE"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "UNPAID", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },

    // Commission snapshot and salon settlement tracking.
    commissionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    commissionAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    salonNetAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    settlementStatus: {
      type: String,
      enum: ["NOT_ELIGIBLE", "PENDING", "PROCESSING", "PAID", "ON_HOLD"],
      default: "NOT_ELIGIBLE",
    },

    settlementPaidAt: {
      type: Date,
      default: null,
    },

    settlementReference: {
      type: String,
      default: "",
      trim: true,
    },

    paymentOrderId: {
      type: String,
      default: "",
      trim: true,
    },

    refundStatus: {
      type: String,
      enum: ["NOT_REQUESTED", "PENDING", "PROCESSING", "SUCCESS", "FAILED"],
      default: "NOT_REQUESTED",
    },

    refundAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    cashfreeRefundId: {
      type: String,
      default: "",
      trim: true,
    },

    cashfreeOrderId: {
      type: String,
      default: "",
      trim: true,
    },

    cashfreePaymentId: {
      type: String,
      default: "",
      trim: true,
    },

    cashfreePaymentDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["Upcoming", "Completed", "Cancelled"],
      default: "Upcoming",
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index(
  { paymentOrderId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      paymentOrderId: { $gt: "" },
    },
  },
);

module.exports = mongoose.model("Booking", bookingSchema);
