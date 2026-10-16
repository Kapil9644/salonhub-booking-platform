const crypto = require("crypto");

const API_VERSION = "2023-08-01";

const getBaseUrl = () => {
  return process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
};

const getHeaders = () => {
  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Cashfree credentials are not configured.");
  }

  return {
    "Content-Type": "application/json",
    "x-api-version": API_VERSION,
    "x-client-id": clientId,
    "x-client-secret": clientSecret,
  };
};

const cashfreeRequest = async (path, options = {}) => {
  const { idempotencyKey, ...requestOptions } = options;

  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...requestOptions,
    headers: {
      ...getHeaders(),
      ...(idempotencyKey ? { "x-idempotency-key": idempotencyKey } : {}),
      ...requestOptions.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || data.message_code || "Cashfree API request failed.",
    );
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
};

const createRefund = async ({ cashfreeOrderId, amount, orderId, reason }) => {
  if (!cashfreeOrderId) {
    throw new Error("Cashfree order ID is missing.");
  }

  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    throw new Error("Refund amount must be greater than zero.");
  }

  if (!orderId) {
    throw new Error("Payment order ID is missing.");
  }

  const idempotencyKey = crypto
    .createHash("sha256")
    .update(`rupiva-refund:${orderId}`)
    .digest("hex");

  const refundId = `RF_${String(orderId)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(-30)}`;

  return cashfreeRequest(`/orders/${encodeURIComponent(orderId)}/refunds`, {
    method: "POST",
    idempotencyKey,
    body: JSON.stringify({
      refund_amount: Number(Number(amount).toFixed(2)),
      refund_id: refundId,
      refund_note: String(reason || "Booking cancellation").slice(0, 200),
    }),
  });
};

async function getRefund(orderId, refundId) {
  if (!orderId || !refundId) {
    throw new Error("Order ID and refund ID are required.");
  }

  return cashfreeRequest(
    `/orders/${encodeURIComponent(orderId)}/refunds/${encodeURIComponent(refundId)}`,
    { method: "GET" },
  );
}

module.exports = {
  createRefund,
  getRefund,
};
