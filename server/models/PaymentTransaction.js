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
