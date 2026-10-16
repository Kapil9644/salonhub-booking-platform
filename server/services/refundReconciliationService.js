const PaymentTransaction = require("../models/PaymentTransaction");
const Booking = require("../models/Booking");
const { getRefund } = require("./cashfreeRefundService");

async function reconcileOneRefund(transaction) {
  if (!transaction?.orderId || !transaction?.cashfreeRefundId) {
    return { skipped: true, reason: "Missing order/refund reference" };
  }

  // Fetch the existing refund only. Never create a refund here.
  const refund = await getRefund(
    transaction.orderId,
    transaction.cashfreeRefundId,
  );

  const status = String(refund.refund_status || "").toUpperCase();

  const allowedStatuses = {
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
    PENDING: "PENDING",
    QUEUED: "PENDING",
    CANCELLED: "FAILED",
    USER_DROPPED: "FAILED",
  };

  const mappedStatus = allowedStatuses[status];

  if (!mappedStatus) {
    console.warn("Unknown Cashfree refund status:", status);
    return { skipped: true, reason: "Unknown provider status" };
  }

  // Never overwrite a confirmed successful refund with a later stale status.
  if (transaction.refundStatus === "SUCCESS") {
    return { unchanged: true, status: "SUCCESS" };
  }

  const refundAmount = Number(refund.refund_amount);

  if (
    mappedStatus === "SUCCESS" &&
    (!Number.isFinite(refundAmount) ||
      refundAmount <= 0 ||
      refundAmount > Number(transaction.amount))
  ) {
    throw new Error("Cashfree refund amount failed validation.");
  }

  const update = {
    refundStatus: mappedStatus,
    cashfreeRefundId: String(refund.refund_id || transaction.cashfreeRefundId),
  };

  if (Number.isFinite(refundAmount) && refundAmount >= 0) {
    update.refundAmount = refundAmount;
  }

  if (mappedStatus === "SUCCESS") {
    update.paymentStatus = "REFUNDED";
    update.refundCompletedAt = refund.processed_at
      ? new Date(refund.processed_at)
      : new Date();
  }

  if (mappedStatus === "FAILED") {
    update.refundReason = refund.status_description || transaction.refundReason;
  }

  // Atomic update protects against concurrent reconciliation workers.
  const updated = await PaymentTransaction.findOneAndUpdate(
    {
      _id: transaction._id,
      refundStatus: { $ne: "SUCCESS" },
    },
    { $set: update },
    { new: true },
  );

  if (!updated) {
    return { unchanged: true };
  }

  const booking = await Booking.findOne({
    paymentOrderId: updated.orderId,
  });

  if (booking) {
    // Do not change booking cancellation status here.
    booking.refundStatus = mappedStatus;
    booking.refundAmount = updated.refundAmount;
    booking.cashfreeRefundId = updated.cashfreeRefundId;

    if (mappedStatus === "SUCCESS") {
      booking.paymentStatus = "REFUNDED";
    }

    await booking.save();
  }

  return { updated: true, status: mappedStatus };
}

async function reconcilePendingRefunds() {
  const transactions = await PaymentTransaction.find({
    refundStatus: { $in: ["PENDING", "PROCESSING"] },
    cashfreeRefundId: { $nin: ["", null] },
  })
    .sort({ refundInitiatedAt: 1 })
    .limit(100);

  for (const transaction of transactions) {
    try {
      await reconcileOneRefund(transaction);
    } catch (error) {
      console.error(
        "Refund reconciliation failed:",
        transaction.orderId,
        error.message,
      );
    }
  }
}

module.exports = {
  reconcileOneRefund,
  reconcilePendingRefunds,
};
