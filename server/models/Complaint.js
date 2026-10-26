const mongoose = require("mongoose");
const crypto = require("crypto");

function generateComplaintId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();

  return `RUP-${date}-${random}`;
}

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      index: true,
      default: generateComplaintId,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.submitterType !== "salon";
      },
      default: null,
      index: true,
    },
    submitterType: {
      type: String,
      enum: ["customer", "salon"],
      default: "customer",
      index: true,
    },

    salonOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    bookingId: {
      type: String,
      ref: "Booking",
      default: null,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
      index: true,
    },
    adminResponse: {
      type: String,
      default: "",
      maxlength: 2000,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Complaint", complaintSchema);
