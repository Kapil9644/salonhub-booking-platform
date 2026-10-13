const mongoose = require("mongoose");

const paymentTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
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

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      trim: true,
    },

    paymentMethod: {
      type: String,
      enum: ["PAY_NOW"],
      default: "PAY_NOW",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },

    // Commission and salon settlement snapshot.
    commissionRate: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100,
    },

    commissionAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    salonNetAmount: {
      type: Number,
      required: true,
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

    bookingData: {
      salon: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        location: {
          type: mongoose.Schema.Types.Mixed,
          default: null,
        },
      },

      services: {
        type: [
          {
            id: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
            },
            name: {
              type: String,
              required: true,
            },
            price: {
              type: Number,
              required: true,
            },
            duration: {
              type: Number,
              required: true,
            },
          },
        ],
        required: true,
      },

      totalPrice: {
        type: Number,
        required: true,
      },

      totalDuration: {
        type: Number,
        required: true,
      },

      date: {
        type: String,
        required: true,
      },

      time: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("PaymentTransaction", paymentTransactionSchema);
