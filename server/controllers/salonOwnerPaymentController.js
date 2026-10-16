const mongoose = require("mongoose");
const Salon = require("../models/Salon");
const PaymentTransaction = require("../models/PaymentTransaction");
const Booking = require("../models/Booking");

const getOwnerSalon = async (userId) => {
  return Salon.findOne({ owner: userId }).select("_id name").lean();
};

const buildPaymentFilter = (salonId, query) => {
  const filter = {
    "bookingData.salon.id": new mongoose.Types.ObjectId(String(salonId)),
  };

  const allowedStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];

  if (allowedStatuses.includes(query.status)) {
    filter.paymentStatus = query.status;
  }

  if (query.from || query.to) {
    const createdAt = {};

    if (query.from && /^\d{4}-\d{2}-\d{2}$/.test(query.from)) {
      const from = new Date(`${query.from}T00:00:00.000Z`);
      if (!Number.isNaN(from.getTime())) createdAt.$gte = from;
    }

    if (query.to && /^\d{4}-\d{2}-\d{2}$/.test(query.to)) {
      const to = new Date(`${query.to}T23:59:59.999Z`);
      if (!Number.isNaN(to.getTime())) createdAt.$lte = to;
    }

    if (Object.keys(createdAt).length) {
      filter.createdAt = createdAt;
    }
  }

  const search = String(query.search || "")
    .trim()
    .slice(0, 100);

  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    filter.$or = [
      { orderId: regex },
      { cashfreeOrderId: regex },
      { cashfreePaymentId: regex },
      { cashfreeRefundId: regex },
      { "bookingData.salon.name": regex },
      { "bookingData.services.name": regex },
    ];
  }

  return filter;
};

const getSalonOwnerPayments = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const salon = await getOwnerSalon(req.user.id);

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon profile not found.",
      });
    }

    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 20),
    );

    const filter = buildPaymentFilter(salon._id, req.query);

    const search = String(req.query.search || "").trim();

    if (search) {
      const bookingCode = search.replace(/^#/, "").toUpperCase();

      // Resolve the displayed short booking ID to a real Booking document.
      if (/^[0-9A-F]{6}$/.test(bookingCode)) {
        const matchingBookings = await Booking.find({
          _id: {
            $exists: true,
          },
          $expr: {
            $eq: [
              {
                $toUpper: {
                  $substrCP: [{ $toString: "$_id" }, 18, 6],
                },
              },
              bookingCode,
            ],
          },
        })
          .select("_id paymentOrderId cashfreeOrderId")
          .lean();

        const bookingOrderIds = matchingBookings
          .map((booking) => booking.paymentOrderId)
          .filter(Boolean);

        const bookingCashfreeOrderIds = matchingBookings
          .map((booking) => booking.cashfreeOrderId)
          .filter(Boolean);

        const bookingPaymentConditions = [];

        if (bookingOrderIds.length) {
          bookingPaymentConditions.push({
            orderId: { $in: bookingOrderIds },
          });
        }

        if (bookingCashfreeOrderIds.length) {
          bookingPaymentConditions.push({
            cashfreeOrderId: { $in: bookingCashfreeOrderIds },
          });
        }

        if (bookingPaymentConditions.length) {
          // Preserve the salon scope and combine it with the booking match.
          delete filter.$or;

          filter.$and = [
            ...(filter.$and || []),
            { $or: bookingPaymentConditions },
          ];
        } else {
          // No linked transaction: return no results for this booking ID.
          filter._id = { $exists: false };
        }
      }
    }

    const [transactions, total, summaryRows] = await Promise.all([
      PaymentTransaction.find(filter)
        .select(
          "user orderId cashfreeOrderId cashfreePaymentId cashfreeRefundId amount currency paymentMethod paymentStatus refundStatus refundAmount refundReason refundInitiatedAt refundCompletedAt cashfreePaymentDate commissionAmount salonNetAmount settlementStatus bookingData createdAt",
        )
        .populate("user", "fullName name email phone")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      PaymentTransaction.countDocuments(filter),

      PaymentTransaction.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            transactionCount: { $sum: 1 },
            successfulCount: {
              $sum: {
                $cond: [{ $eq: ["$paymentStatus", "PAID"] }, 1, 0],
              },
            },
            paidAmount: {
              $sum: {
                $cond: [{ $eq: ["$paymentStatus", "PAID"] }, "$amount", 0],
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
            refundedAmount: {
              $sum: { $ifNull: ["$refundAmount", 0] },
            },
            pendingRefundCount: {
              $sum: {
                $cond: [
                  { $in: ["$refundStatus", ["PENDING", "PROCESSING"]] },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),
    ]);

    // Find the real bookings linked to these payment orders.
    const orderIds = transactions
      .map((transaction) => transaction.orderId)
      .filter(Boolean);

    const cashfreeOrderIds = transactions
      .map((transaction) => transaction.cashfreeOrderId)
      .filter(Boolean);

    const bookingConditions = [];

    if (orderIds.length) {
      bookingConditions.push({
        paymentOrderId: { $in: orderIds },
      });
    }

    if (cashfreeOrderIds.length) {
      bookingConditions.push({
        cashfreeOrderId: { $in: cashfreeOrderIds },
      });
    }

    const relatedBookings = bookingConditions.length
      ? await Booking.find({ $or: bookingConditions })
          .select("_id paymentOrderId cashfreeOrderId")
          .lean()
      : [];

    const bookingByOrderId = new Map();
    const bookingByCashfreeOrderId = new Map();

    for (const booking of relatedBookings) {
      if (booking.paymentOrderId) {
        bookingByOrderId.set(booking.paymentOrderId, booking);
      }

      if (booking.cashfreeOrderId) {
        bookingByCashfreeOrderId.set(booking.cashfreeOrderId, booking);
      }
    }

    const bookingIdByOrderId = new Map();

    for (const booking of relatedBookings) {
      if (booking.paymentOrderId) {
        bookingIdByOrderId.set(
          booking.paymentOrderId,
          `#${String(booking._id).slice(-6).toUpperCase()}`,
        );
      }

      if (booking.cashfreeOrderId) {
        bookingIdByOrderId.set(
          booking.cashfreeOrderId,
          `#${String(booking._id).slice(-6).toUpperCase()}`,
        );
      }
    }

    // Attach a display ID derived from the actual Booking document.
    const transactionsWithBookingIds = transactions.map((transaction) => {
      const booking =
        bookingByOrderId.get(transaction.orderId) ||
        bookingByCashfreeOrderId.get(transaction.cashfreeOrderId);

      return {
        ...transaction,
        bookingId: booking
          ? `#${String(booking._id).slice(-6).toUpperCase()}`
          : null,
      };
    });

    const summary = summaryRows[0] || {
      transactionCount: 0,
      successfulCount: 0,
      paidAmount: 0,
      pendingCount: 0,
      failedCount: 0,
      refundedCount: 0,
      refundedAmount: 0,
      pendingRefundCount: 0,
    };

    return res.json({
      success: true,
      salon: { id: String(salon._id), name: salon.name },
      summary: {
        transactionCount: summary.transactionCount,
        successfulCount: summary.successfulCount,
        paidAmount: summary.paidAmount,
        pendingCount: summary.pendingCount,
        failedCount: summary.failedCount,
        refundedCount: summary.refundedCount,
        refundedAmount: summary.refundedAmount,
        pendingRefundCount: summary.pendingRefundCount,
      },
      data: transactionsWithBookingIds,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Salon owner payments error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to load salon payments.",
    });
  }
};

const exportSalonOwnerPayments = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const salon = await getOwnerSalon(req.user.id);

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon profile not found.",
      });
    }

    const filter = buildPaymentFilter(salon._id, req.query);

    const transactions = await PaymentTransaction.find(filter)
      .select(
        "orderId amount currency paymentMethod paymentStatus refundStatus refundAmount settlementStatus bookingData createdAt cashfreePaymentDate",
      )
      .populate("user", "fullName name email")
      .sort({ createdAt: -1 })
      .limit(10000)
      .lean();

    const csvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = [
      [
        "Booking ID",
        "Order ID",
        "Date",
        "Customer",
        "Email",
        "Salon",
        "Services",
        "Amount",
        "Currency",
        "Method",
        "Payment Status",
        "Refund Status",
        "Refund Amount",
        "Settlement Status",
      ],
      ...transactions.map((transaction) => [
        transaction.bookingData?.bookingId || "",
        transaction.orderId,
        transaction.cashfreePaymentDate || transaction.createdAt,
        transaction.user?.fullName || transaction.user?.name || "",
        transaction.user?.email || "",
        transaction.bookingData?.salon?.name || salon.name || "",
        (transaction.bookingData?.services || [])
          .map((service) => service.name)
          .join(", "),
        transaction.amount,
        transaction.currency,
        transaction.paymentMethod,
        transaction.paymentStatus,
        transaction.refundStatus || "NOT_REQUESTED",
        transaction.refundAmount || 0,
        transaction.settlementStatus,
      ]),
    ];

    const csv =
      "\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="salon-payments.csv"',
    );

    return res.send(csv);
  } catch (error) {
    console.error("Salon owner payment export error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to export salon payments.",
    });
  }
};

module.exports = {
  getSalonOwnerPayments,
  exportSalonOwnerPayments,
};
