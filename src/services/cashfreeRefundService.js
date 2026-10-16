const crypto = require("crypto");

const API_VERSION = "2023-08-01";

const getBaseUrl = () => {
  const production = process.env.CASHFREE_ENV === "production";
  return production
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
};

const getHeaders = (idempotencyKey) => {
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
    ...(idempotencyKey ? { "x-idempotency-key": idempotencyKey } : {}),
  };
};

async function cashfreeRequest(path, options = {}) {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...options,
    headers: {
      ...getHeaders(options.idempotencyKey),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || data.message_code || "Cashfree refund request failed.",
    );
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

async function createRefund({ cashfreeOrderId, amount, orderId, reason }) {
  if (!cashfreeOrderId) {
    throw new Error("Cashfree order ID is missing.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Refund amount must be greater than zero.");
  }

  // Stable key prevents duplicate refunds when the same cancellation
  // request is retried.
  const idempotencyKey = crypto
    .createHash("sha256")
    .update(`rupiva-refund:${orderId}`)
    .digest("hex");

  const refundId = `RF_${String(orderId)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(-30)}`;

  return cashfreeRequest(
    `/orders/${encodeURIComponent(cashfreeOrderId)}/refunds`,
    {
      method: "POST",
      idempotencyKey,
      body: JSON.stringify({
        refund_amount: Number(amount.toFixed(2)),
        refund_id: refundId,
        refund_note: String(reason || "Booking cancellation").slice(0, 200),
      }),
    },
  );
}

async function getRefund(cashfreeOrderId, refundId) {
  return cashfreeRequest(
    `/orders/${encodeURIComponent(cashfreeOrderId)}/refunds/${encodeURIComponent(refundId)}`,
    { method: "GET" },
  );
}

module.exports = {
  createRefund,
  getRefund,
};
