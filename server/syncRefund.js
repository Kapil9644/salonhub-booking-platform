require("dotenv").config();

const mongoose = require("mongoose");
const { getRefund } = require("./services/cashfreeRefundService");
const PaymentTransaction = require("./models/PaymentTransaction");
const Booking = require("./models/Booking");

const ORDER_ID = "RUPIVA_1792082720060";
const REFUND_ID = "RF_RUPIVA_1792082720060";

async function main() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);

  try {
    // Always verify with Cashfree before changing local status.
    const refund = await getRefund(ORDER_ID, REFUND_ID);

    console.log("Cashfree refund status:", refund.refund_status);

    if (refund.refund_status !== "SUCCESS") {
      console.log("Refund is not successful. Database unchanged.");
      return;
    }

    const transaction = await PaymentTransaction.findOne({
      orderId: ORDER_ID,
    });

    if (!transaction) {
      throw new Error("Payment transaction not found.");
    }

    if (Number(refund.refund_amount) !== Number(transaction.amount)) {
      throw new Error("Refund amount does not match transaction amount.");
    }

    transaction.refundStatus = "SUCCESS";
    transaction.refundAmount = Number(refund.refund_amount);
    transaction.cashfreeRefundId = String(
      refund.refund_id || refund.cf_refund_id || REFUND_ID,
    );
    transaction.refundCompletedAt = refund.processed_at
      ? new Date(refund.processed_at)
      : new Date();
    transaction.refundReason = refund.refund_note || transaction.refundReason;

    transaction.paymentStatus = "REFUNDED";
    await transaction.save();

    const booking = await Booking.findOne({
      paymentOrderId: ORDER_ID,
    });

    if (booking) {
      booking.refundStatus = "SUCCESS";
      booking.refundAmount = Number(refund.refund_amount);
      booking.cashfreeRefundId = transaction.cashfreeRefundId;
      booking.paymentStatus = "REFUNDED";
      await booking.save();

      console.log("Booking synchronized:", String(booking._id));
    } else {
      console.log("Warning: matching booking not found using paymentOrderId.");
    }

    console.log("Refund synchronization complete.");
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("Refund synchronization failed:", error.message);
  process.exitCode = 1;
});
