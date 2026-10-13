const mongoose = require("mongoose");
const PaymentTransaction = require("../models/PaymentTransaction");
const Booking = require("../models/Booking");

const ALLOWED_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];
const ALLOWED_METHODS = ["PAY_NOW"];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const resolveBookingOrderId = async (search) => {
  const value = String(search || "")
    .trim()
    .replace(/^#/, "")
    .toUpperCase();

  if (!/^[A-F0-9]{6}$/.test(value)) {
    return "";
  }

  const bookings = await Booking.aggregate([
    {
      $match: {
        paymentOrderId: { $type: "string" },
      },
    },
    {
      $addFields: {
        shortBookingId: {
          $toUpper: {
            $substrCP: [{ $toString: "$_id" }, 18, 6],
          },
        },
      },
    },
    {
      $match: {
        shortBookingId: value,
      },
    },
    {
      $limit: 2,
    },
    {
      $project: {
        _id: 1,
        paymentOrderId: 1,
      },
    },
  ]);

  if (bookings.length !== 1) {
    return "";
  }

  return bookings[0].paymentOrderId || "";
};

const buildPaymentFilter = (query) => {
  const filter = {};

  if (query.status && ALLOWED_STATUSES.includes(query.status)) {
    filter.paymentStatus = query.status;
  }

  if (query.method && ALLOWED_METHODS.includes(query.method)) {
    filter.paymentMethod = query.method;
  }

  if (query.from || query.to) {
    filter.createdAt = {};

    if (query.from) {
      const from = new Date(`${query.from}T00:00:00.000Z`);
      if (
        Number.isNaN(from.getTime()) ||
        from.toISOString().slice(0, 10) !== query.from
      ) {
        throw new Error("INVALID_FROM_DATE");
      }
      filter.createdAt.$gte = from;
    }

    if (query.to) {
      const to = new Date(`${query.to}T00:00:00.000Z`);
      if (
        Number.isNaN(to.getTime()) ||
        to.toISOString().slice(0, 10) !== query.to
      ) {
        throw new Error("INVALID_TO_DATE");
      }
      to.setUTCDate(to.getUTCDate() + 1);
      filter.createdAt.$lt = to;
    }

    if (
      filter.createdAt.$gte &&
      filter.createdAt.$lt &&
      filter.createdAt.$gte >= filter.createdAt.$lt
    ) {
      throw new Error("INVALID_DATE_RANGE");
    }
  }

  const search = String(query.search || "")
    .trim()
    .slice(0, 100);

  if (search) {
    const safeSearch = new RegExp(escapeRegex(search), "i");

    const conditions = [
      { orderId: safeSearch },
      { cashfreeOrderId: safeSearch },
      { cashfreePaymentId: safeSearch },
    ];

    if (mongoose.isValidObjectId(search)) {
      conditions.push({
        user: new mongoose.Types.ObjectId(search),
      });
    }

    if (query.bookingOrderId) {
      conditions.push({
        orderId: query.bookingOrderId,
      });
    }

    filter.$and = [...(filter.$and || []), { $or: conditions }];
  }

  return filter;
};

const attachBookingIds = async (transactions) => {
  if (!transactions.length) {
    return transactions;
  }

  const orderIds = transactions
    .map((transaction) => transaction.orderId)
    .filter(Boolean);

  const bookings = await Booking.find({
    paymentOrderId: { $in: orderIds },
  })
    .select("_id paymentOrderId")
    .lean();

  const bookingIdByOrderId = new Map();

  for (const booking of bookings) {
    if (!bookingIdByOrderId.has(booking.paymentOrderId)) {
      bookingIdByOrderId.set(booking.paymentOrderId, String(booking._id));
    }
  }

  return transactions.map((transaction) => ({
    ...transaction,
    bookingId: bookingIdByOrderId.get(transaction.orderId) || null,
  }));
};

// GET /api/admin/payments/summary
const getPaymentSummary = async (req, res) => {
  try {
    const summary = await PaymentTransaction.aggregate([
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          successfulAmount: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "PAID"] }, "$amount", 0],
            },
          },
          successfulCount: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "PAID"] }, 1, 0],
            },
          },
          pendingCount: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "PENDING"] }, 1, 0],
            },
          },
          failedCount: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "FAILED"] }, 1, 0],
            },
          },
          refundedCount: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "REFUNDED"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const data = summary[0] || {
      totalTransactions: 0,
      totalAmount: 0,
      successfulAmount: 0,
      successfulCount: 0,
      pendingCount: 0,
      failedCount: 0,
      refundedCount: 0,
    };

    return res.json({ success: true, summary: data });
  } catch (error) {
    console.error("Admin payment summary error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not load payment summary.",
    });
  }
};

// GET /api/admin/payments
const getAdminPayments = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 20),
    );

    if (
      (req.query.status && !ALLOWED_STATUSES.includes(req.query.status)) ||
      (req.query.method && !ALLOWED_METHODS.includes(req.query.method))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment filter.",
      });
    }

    const bookingOrderId = await resolveBookingOrderId(req.query.search);

    const filter = buildPaymentFilter({
      ...req.query,
      bookingOrderId,
    });

    const [transactions, total] = await Promise.all([
      PaymentTransaction.find(filter)
        .select(
          "user orderId cashfreeOrderId cashfreePaymentId amount currency paymentMethod paymentStatus cashfreePaymentDate createdAt updatedAt bookingData.salon bookingData.date bookingData.time",
        )
        .populate("user", "fullName email phone")
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      PaymentTransaction.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      transactions: await attachBookingIds(transactions),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    if (
      ["INVALID_FROM_DATE", "INVALID_TO_DATE", "INVALID_DATE_RANGE"].includes(
        error.message,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid date range (YYYY-MM-DD).",
      });
    }

    console.error("Admin payments list error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not load payment transactions.",
    });
  }
};

// GET /api/admin/payments/:id
const getAdminPaymentDetails = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID.",
      });
    }

    const transaction = await PaymentTransaction.findById(req.params.id)
      .select("-__v")
      .populate("user", "fullName email phone")
      .lean();

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Payment transaction not found.",
      });
    }

    const booking = await Booking.findOne({
      paymentOrderId: transaction.orderId,
    })
      .select(
        "_id status paymentMethod paymentStatus date time totalPrice createdAt",
      )
      .lean();

    return res.json({
      success: true,
      transaction,
      booking: booking || null,
    });
  } catch (error) {
    console.error("Admin payment details error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not load transaction details.",
    });
  }
};

const exportAdminPayments = async (req, res) => {
  try {
    const filter = buildPaymentFilter(req.query);

    const transactions = await PaymentTransaction.find(filter)
      .select(
        "user orderId cashfreeOrderId cashfreePaymentId amount currency paymentMethod paymentStatus cashfreePaymentDate createdAt updatedAt",
      )
      .populate("user", "fullName email phone")
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    const transactionsWithBookingIds = await attachBookingIds(transactions);

    const escapeCsv = (value) => {
      let text = value == null ? "" : String(value);

      if (/^[\s]*[=+\-@]/.test(text)) {
        text = "'" + text;
      }

      return '"' + text.replace(/"/g, '""') + '"';
    };

    const formatDate = (value) => {
      if (!value) return "";

      const date = new Date(value);

      return Number.isNaN(date.getTime()) ? "" : date.toISOString();
    };

    const headers = [
      "Transaction ID",
      "Booking ID",
      "Order ID",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Amount",
      "Currency",
      "Payment Method",
      "Payment Status",
      "Cashfree Order ID",
      "Cashfree Payment ID",
      "Payment Date",
      "Created At",
      "Updated At",
    ];

    const rows = transactionsWithBookingIds.map((tx) => [
      tx._id,
      tx.bookingId || "",
      tx.orderId,
      tx.user?.fullName,
      tx.user?.email,
      tx.user?.phone,
      tx.amount,
      tx.currency,
      tx.paymentMethod,
      tx.paymentStatus,
      tx.cashfreeOrderId,
      tx.cashfreePaymentId,
      formatDate(tx.cashfreePaymentDate),
      formatDate(tx.createdAt),
      formatDate(tx.updatedAt),
    ]);

    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\r\n");

    const filename = `rupiva-payments-${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    res.setHeader("Cache-Control", "no-store");

    return res.send("\uFEFF" + csv);
  } catch (error) {
    if (
      ["INVALID_FROM_DATE", "INVALID_TO_DATE", "INVALID_DATE_RANGE"].includes(
        error.message,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid date range.",
      });
    }

    console.error("Payment CSV export error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not export payment transactions.",
    });
  }
};

module.exports = {
  getPaymentSummary,
  getAdminPayments,
  getAdminPaymentDetails,
  exportAdminPayments,
};
