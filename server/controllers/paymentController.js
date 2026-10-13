const mongoose = require("mongoose");
const cashfree = require("../config/cashfree");
const User = require("../models/User");
const Salon = require("../models/Salon");
const Service = require("../models/Service");
const PaymentTransaction = require("../models/PaymentTransaction");
const AdminSettings = require("../models/AdminSettings");

const isValidDate = (date) => {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
};

const isValidTime = (time) =>
  typeof time === "string" &&
  /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i.test(time.trim());

const createPaymentOrder = async (req, res) => {
  try {
    const customer = await User.findById(req.user.id).select(
      "fullName phone email",
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    const { orderId, bookingData } = req.body;

    if (
      typeof orderId !== "string" ||
      !/^[A-Za-z0-9_-]{10,45}$/.test(orderId) ||
      !mongoose.isValidObjectId(bookingData?.salon?.id) ||
      !Array.isArray(bookingData?.services) ||
      bookingData.services.length === 0 ||
      bookingData.services.some(
        (service) => !mongoose.isValidObjectId(service?.id),
      ) ||
      !isValidDate(bookingData?.date) ||
      !isValidTime(bookingData?.time)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing payment details.",
      });
    }

    // Do not create a second transaction for the same order ID.
    const existingTransaction = await PaymentTransaction.findOne({ orderId });

    if (existingTransaction) {
      if (String(existingTransaction.user) !== String(req.user.id)) {
        return res.status(409).json({
          success: false,
          message: "This order ID is already in use.",
        });
      }

      return res.status(409).json({
        success: false,
        message:
          "This order has already been created. Please continue with the existing order.",
      });
    }

    const salon = await Salon.findById(bookingData.salon.id);

    if (!salon || salon.approvalStatus !== "Approved" || !salon.isListed) {
      return res.status(400).json({
        success: false,
        message: "This salon is currently unavailable for booking.",
      });
    }

    // Reject duplicate service IDs to prevent duplicate-price manipulation.
    const serviceIds = bookingData.services.map((service) =>
      String(service.id),
    );

    if (new Set(serviceIds).size !== serviceIds.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate services are not allowed.",
      });
    }

    const servicesFromDb = await Service.find({
      _id: { $in: serviceIds },
      salon: salon._id,
      isActive: true,
    });

    if (servicesFromDb.length !== serviceIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more selected services are invalid or unavailable.",
      });
    }

    // Preserve the user's selected service order, but use DB values.
    const serviceMap = new Map(
      servicesFromDb.map((service) => [String(service._id), service]),
    );

    const services = serviceIds.map((id) => {
      const service = serviceMap.get(id);

      return {
        id: service._id,
        name: service.name,
        price: Number(service.price),
        duration: Number(service.duration),
      };
    });

    const totalPrice = services.reduce(
      (sum, service) => sum + service.price,
      0,
    );

    const totalDuration = services.reduce(
      (sum, service) => sum + service.duration,
      0,
    );

    if (
      !Number.isFinite(totalPrice) ||
      totalPrice <= 0 ||
      !Number.isFinite(totalDuration) ||
      totalDuration <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "The selected services have invalid pricing or duration.",
      });
    }

    if (!customer.phone) {
      return res.status(400).json({
        success: false,
        message: "A valid customer phone number is required for payment.",
      });
    }

    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      console.error("FRONTEND_URL is not configured.");
      return res.status(500).json({
        success: false,
        message: "Payment service is not configured correctly.",
      });
    }

    const normalizedFrontendUrl = frontendUrl.replace(/\/+$/, "");

    // Get current payment and commission settings.
    const adminSettings = await AdminSettings.findOne()
      .select("allowPayNow platformCommission")
      .lean();

    if (adminSettings?.allowPayNow === false) {
      return res.status(403).json({
        success: false,
        message: "Online payments are currently unavailable.",
      });
    }

    const commissionRate = Number.isFinite(adminSettings?.platformCommission)
      ? adminSettings.platformCommission
      : 10;

    if (
      !Number.isFinite(commissionRate) ||
      commissionRate < 0 ||
      commissionRate > 100
    ) {
      return res.status(500).json({
        success: false,
        message: "Platform commission setting is invalid.",
      });
    }

    // Calculate commission in paise to avoid floating-point money errors.
    const totalPricePaise = Math.round(totalPrice * 100);
    const commissionAmountPaise = Math.round(
      (totalPricePaise * commissionRate) / 100,
    );
    const salonNetAmountPaise = totalPricePaise - commissionAmountPaise;

    const commissionAmount = commissionAmountPaise / 100;
    const salonNetAmount = salonNetAmountPaise / 100;

    const transaction = await PaymentTransaction.create({
      user: req.user.id,
      orderId,
      amount: totalPrice,
      currency: "INR",
      paymentMethod: "PAY_NOW",
      paymentStatus: "PENDING",
      commissionRate,
      commissionAmount,
      salonNetAmount,
      bookingData: {
        salon: {
          id: salon._id,
          name: salon.name,
          location: salon.location || null,
        },
        services,
        totalPrice,
        totalDuration,
        date: bookingData.date,
        time: bookingData.time.trim(),
      },
    });

    try {
      const response = await cashfree.PGCreateOrder({
        order_amount: totalPrice,
        order_currency: "INR",
        order_id: orderId,
        customer_details: {
          customer_id: String(customer._id),
          customer_name: customer.fullName || "Rupiva Customer",
          customer_phone: String(customer.phone),
          customer_email: customer.email || "customer@rupiva.com",
        },
        order_meta: {
          return_url: `${normalizedFrontendUrl}/payment-status?order_id={order_id}`,
        },
      });

      transaction.cashfreeOrderId = String(response.data.cf_order_id || "");
      await transaction.save();

      return res.status(201).json({
        success: true,
        message: "Payment order created successfully.",
        data: response.data,
      });
    } catch (gatewayError) {
      // Keep a record of the failed attempt; don't expose gateway internals.
      console.error(
        "Cashfree Create Order Error:",
        gatewayError.response?.data || gatewayError.message,
      );

      await PaymentTransaction.findOneAndUpdate(
        {
          _id: transaction._id,
          paymentStatus: "PENDING",
          cashfreeOrderId: "",
        },
        { $set: { paymentStatus: "FAILED" } },
      );

      return res.status(502).json({
        success: false,
        message:
          "Could not create the payment order. Please try again with a new order.",
      });
    }
  } catch (error) {
    console.error("Create payment order error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This order ID has already been used. Please start a new payment.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create payment order.",
    });
  }
};

const verifyPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (typeof orderId !== "string" || !orderId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    // Check ownership before calling Cashfree.
    const transaction = await PaymentTransaction.findOne({
      orderId: orderId.trim(),
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Payment transaction not found.",
      });
    }

    const [orderResponse, paymentsResponse] = await Promise.all([
      cashfree.PGFetchOrder(transaction.orderId),
      cashfree.PGOrderFetchPayments(transaction.orderId),
    ]);

    const order = orderResponse.data;
    const payments = Array.isArray(paymentsResponse.data)
      ? paymentsResponse.data
      : [];

    // Validate the amount and currency reported by Cashfree.
    const orderAmountMatches =
      Number(order.order_amount) === Number(transaction.amount);
    const currencyMatches = order.order_currency === transaction.currency;

    if (!orderAmountMatches || !currencyMatches) {
      console.error("Cashfree order amount/currency mismatch.", {
        orderId: transaction.orderId,
      });

      return res.status(409).json({
        success: false,
        message:
          "Payment order details could not be validated. Please contact support.",
      });
    }

    const successfulPayment = payments.find(
      (payment) =>
        payment.payment_status === "SUCCESS" &&
        Number(payment.payment_amount) === Number(transaction.amount) &&
        (payment.payment_currency || order.order_currency) ===
          transaction.currency,
    );

    if (successfulPayment) {
      // Never downgrade a previously confirmed payment.
      const updatedTransaction = await PaymentTransaction.findOneAndUpdate(
        {
          _id: transaction._id,
          paymentStatus: { $ne: "PAID" },
        },
        {
          $set: {
            paymentStatus: "PAID",
            settlementStatus: "PENDING",
            cashfreePaymentId: String(successfulPayment.cf_payment_id),
            cashfreePaymentDate: successfulPayment.payment_time
              ? new Date(successfulPayment.payment_time)
              : new Date(),
          },
        },
        { new: true },
      );

      const finalTransaction =
        updatedTransaction ||
        (await PaymentTransaction.findById(transaction._id));

      return res.status(200).json({
        success: true,
        message: "Payment status verified.",
        data: {
          order,
          paymentStatus: finalTransaction.paymentStatus,
        },
      });
    }

    // Do not downgrade a payment already confirmed as successful.
    if (transaction.paymentStatus !== "PAID" && payments.length > 0) {
      const latestPayment = [...payments].reverse()[0];

      if (latestPayment.payment_status === "FAILED") {
        await PaymentTransaction.findOneAndUpdate(
          {
            _id: transaction._id,
            paymentStatus: { $in: ["PENDING", "FAILED"] },
          },
          { $set: { paymentStatus: "FAILED" } },
        );
      }
    }

    const currentTransaction = await PaymentTransaction.findById(
      transaction._id,
    );

    return res.status(200).json({
      success: true,
      message: "Payment status retrieved.",
      data: {
        order,
        paymentStatus: currentTransaction.paymentStatus,
      },
    });
  } catch (error) {
    console.error(
      "Cashfree Verify Payment Error:",
      error.response?.data || error.message,
    );

    return res.status(502).json({
      success: false,
      message: "Could not verify payment right now. Please try again.",
    });
  }
};

const processCashfreeWebhook = async (req, res) => {
  const signature = req.headers["x-webhook-signature"];
  const timestamp = req.headers["x-webhook-timestamp"];

  if (
    typeof signature !== "string" ||
    typeof timestamp !== "string" ||
    typeof req.rawBody !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid webhook request.",
    });
  }

  let verifiedEvent;

  try {
    verifiedEvent = cashfree.PGVerifyWebhookSignature(
      signature,
      req.rawBody,
      timestamp,
    );
  } catch {
    return res.status(401).json({
      success: false,
      message: "Webhook signature verification failed.",
    });
  }

  try {
    const event = verifiedEvent?.object;
    const eventType = event?.type || verifiedEvent?.type;
    const data = event?.data;

    if (!eventType || !data) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook payload.",
      });
    }

    // Only process payment events in this handler.
    if (
      ![
        "PAYMENT_SUCCESS_WEBHOOK",
        "PAYMENT_FAILED_WEBHOOK",
        "PAYMENT_USER_DROPPED_WEBHOOK",
      ].includes(eventType)
    ) {
      return res.status(200).json({
        success: true,
        message: "Event acknowledged.",
      });
    }

    const orderId = data.order?.order_id;
    const payment = data.payment;

    if (
      typeof orderId !== "string" ||
      !payment ||
      payment.payment_status == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Required payment details are missing.",
      });
    }

    const transaction = await PaymentTransaction.findOne({ orderId });

    // A valid Cashfree event for an unknown order should not be retried forever.
    if (!transaction) {
      console.warn("Cashfree webhook received for unknown order.");
      return res.status(200).json({
        success: true,
        message: "Event acknowledged for reconciliation.",
      });
    }

    // Never downgrade a confirmed payment.
    if (transaction.paymentStatus === "PAID") {
      return res.status(200).json({
        success: true,
        message: "Payment already processed.",
      });
    }

    // Do not trust the webhook payload alone for final payment status.
    // Fetch current status from Cashfree's authenticated API.
    const [orderResponse, paymentsResponse] = await Promise.all([
      cashfree.PGFetchOrder(transaction.orderId),
      cashfree.PGOrderFetchPayments(transaction.orderId),
    ]);

    const order = orderResponse.data;
    const payments = Array.isArray(paymentsResponse.data)
      ? paymentsResponse.data
      : [];

    if (
      Number(order.order_amount) !== Number(transaction.amount) ||
      order.order_currency !== transaction.currency
    ) {
      console.error("Cashfree webhook order mismatch.");
      return res.status(409).json({
        success: false,
        message: "Payment order validation failed.",
      });
    }

    const successfulPayment = payments.find(
      (item) =>
        item.payment_status === "SUCCESS" &&
        String(item.cf_payment_id) === String(payment.cf_payment_id) &&
        Number(item.payment_amount) === Number(transaction.amount) &&
        (item.payment_currency || order.order_currency) ===
          transaction.currency,
    );

    if (successfulPayment) {
      await PaymentTransaction.findOneAndUpdate(
        {
          _id: transaction._id,
          paymentStatus: { $in: ["PENDING", "FAILED"] },
        },
        {
          $set: {
            paymentStatus: "PAID",
            settlementStatus: "PENDING",
            cashfreePaymentId: String(successfulPayment.cf_payment_id),
            cashfreePaymentDate: successfulPayment.payment_time
              ? new Date(successfulPayment.payment_time)
              : new Date(),
          },
        },
      );

      return res.status(200).json({
        success: true,
        message: "Payment event processed.",
      });
    }

    // Only mark FAILED when Cashfree's current payment status confirms it.
    const latestPayment = [...payments]
      .reverse()
      .find(
        (item) => String(item.cf_payment_id) === String(payment.cf_payment_id),
      );

    if (
      latestPayment?.payment_status === "FAILED" &&
      ["PENDING", "FAILED"].includes(transaction.paymentStatus)
    ) {
      await PaymentTransaction.findOneAndUpdate(
        {
          _id: transaction._id,
          paymentStatus: { $in: ["PENDING", "FAILED"] },
        },
        { $set: { paymentStatus: "FAILED" } },
      );
    }

    return res.status(200).json({
      success: true,
      message: "Payment event acknowledged.",
    });
  } catch (error) {
    console.error(
      "Cashfree webhook processing failed:",
      error.response?.status || error.name || "Unknown error",
    );

    // Non-2xx allows Cashfree to retry transient processing failures.
    return res.status(500).json({
      success: false,
      message: "Webhook processing failed. Please retry.",
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPaymentOrder,
  processCashfreeWebhook,
};
