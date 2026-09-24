const cashfree = require("../config/cashfree");
const User = require("../models/User");
const PaymentTransaction = require("../models/PaymentTransaction");
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
    const { orderId, amount, bookingData } = req.body;
    if (
      !orderId ||
      !amount ||
      !bookingData?.salon?.id ||
      !bookingData?.services?.length ||
      !bookingData?.date ||
      !bookingData?.time
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment details.",
      });
    }

    const orderRequest = {
      order_amount: Number(amount),
      order_currency: "INR",
      order_id: String(orderId),

      customer_details: {
        customer_id: String(customer._id),
        customer_name: customer.fullName,
        customer_phone: String(customer.phone),
        customer_email: customer.email || "customer@rupiva.com",
      },
      order_meta: {
        return_url: `http://localhost:5173/payment-status?order_id={order_id}`,
      },
    };

    const response = await cashfree.PGCreateOrder(orderRequest);

    await PaymentTransaction.create({
      user: req.user.id,
      orderId: String(orderId),
      cashfreeOrderId: response.data.cf_order_id,
      amount: Number(amount),
      currency: "INR",
      paymentMethod: "PAY_NOW",
      paymentStatus: "PENDING",
      bookingData: {
        salon: bookingData.salon,
        services: bookingData.services,
        totalPrice: Number(bookingData.totalPrice),
        totalDuration: Number(bookingData.totalDuration),
        date: bookingData.date,
        time: bookingData.time,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Payment order created successfully.",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Cashfree Create Order Error:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create payment order.",
      error: error.response?.data || error.message,
    });
  }
};

const verifyPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    const orderResponse = await cashfree.PGFetchOrder(orderId);

    const paymentsResponse = await cashfree.PGOrderFetchPayments(orderId);
    const payments = paymentsResponse.data || [];

    const successfulPayment = payments.find(
      (payment) => payment.payment_status === "SUCCESS",
    );

    if (successfulPayment) {
      await PaymentTransaction.findOneAndUpdate(
        {
          orderId: String(orderId),
          user: req.user.id,
        },
        {
          paymentStatus: "PAID",
          cashfreePaymentId: String(successfulPayment.cf_payment_id),
          cashfreePaymentDate: successfulPayment.payment_time,
        },
        {
          new: true,
        },
      );
    }

    if (!successfulPayment && payments.length > 0) {
      const latestPayment = payments[payments.length - 1];

      await PaymentTransaction.findOneAndUpdate(
        {
          orderId: String(orderId),
          user: req.user.id,
        },
        {
          paymentStatus:
            latestPayment.payment_status === "FAILED" ? "FAILED" : "PENDING",
        },
        {
          new: true,
        },
      );
    }

    return res.status(200).json({
      success: true,
      message: "Payment order fetched successfully.",
      data: {
        order: orderResponse.data,
        payments: paymentsResponse.data,
      },
    });
  } catch (error) {
    console.error(
      "Cashfree Verify Payment Error:",
      error.response?.data || error.message,
    );
    verifyPaymentOrder;

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment.",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPaymentOrder,
};
