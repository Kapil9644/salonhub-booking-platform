import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import { verifyPaymentOrder } from "../../services/paymentService";
import { createPaidBooking } from "../../services/bookingService";

export default function PaymentStatus() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    let timeoutId;
    let isActive = true;
    let attempts = 0;
    const maxAttempts = 12;

    const verifyPayment = async () => {
      if (!orderId) {
        setStatus("failed");
        setMessage("Payment order ID is missing.");
        return;
      }

      try {
        const response = await verifyPaymentOrder(orderId);

        if (!isActive) return;

        const payments = response?.data?.payments || [];

        const successfulPayment = payments.find(
          (payment) => payment.payment_status === "SUCCESS",
        );

        if (successfulPayment) {
          try {
            const bookingResponse = await createPaidBooking(orderId);

            if (!bookingResponse?.booking) {
              throw new Error("Booking could not be created.");
            }

            navigate("/booking-confirmation", {
              state: {
                booking: bookingResponse.booking,
                paymentDetails: {
                  method: "PAY_NOW",
                  status: "PAID",
                  amount: bookingResponse.booking.totalPrice,
                  orderId,
                  transactionId: successfulPayment.cf_payment_id,
                  paymentDate: successfulPayment.payment_time,
                },
              },
            });

            return;
          } catch (bookingError) {
            console.error("Paid booking creation error:", bookingError);

            setStatus("failed");
            setMessage(
              bookingError.response?.data?.message ||
                "Payment was successful, but the booking could not be created.",
            );
            return;
          }
        }

        const failedPayment = payments.find((payment) =>
          ["FAILED", "USER_DROPPED", "CANCELLED", "VOID"].includes(
            payment.payment_status,
          ),
        );

        if (failedPayment) {
          setStatus("failed");
          setMessage(`Payment ${failedPayment.payment_status.toLowerCase()}.`);
          return;
        }

        setStatus("pending");
        setMessage("Payment is still being processed.");

        attempts += 1;

        if (attempts < maxAttempts && isActive) {
          timeoutId = setTimeout(verifyPayment, 5000);
        }
      } catch (error) {
        console.error("Payment verification error:", error);

        setStatus("failed");
        setMessage(
          error.response?.data?.message ||
            "Unable to verify the payment right now.",
        );
      }
    };

    verifyPayment();

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [orderId, navigate]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <LoaderCircle
            size={42}
            className="mx-auto animate-spin text-purple-600"
          />

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Verifying Payment
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we confirm your payment.
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-lg">
          <CheckCircle2 size={64} className="mx-auto text-green-500" />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Payment Successful
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your payment has been verified successfully.
          </p>

          <p className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
            Order ID:{" "}
            <span className="font-semibold text-slate-700">{orderId}</span>
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-lg">
          <LoaderCircle size={64} className="mx-auto text-amber-500" />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Payment Processing
          </h1>

          <p className="mt-2 text-sm text-gray-500">{message}</p>

          <p className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
            Order ID:{" "}
            <span className="font-semibold text-slate-700">{orderId}</span>
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex rounded-full bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Check Payment Status Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-lg">
        <CircleAlert size={64} className="mx-auto text-red-500" />

        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Payment Failed
        </h1>

        <p className="mt-2 text-sm text-gray-500">{message}</p>

        <p className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
          Order ID:{" "}
          <span className="font-semibold text-slate-700">
            {orderId || "Unavailable"}
          </span>
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/my-bookings"
            className="inline-flex rounded-full border border-gray-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-gray-50"
          >
            My Bookings
          </Link>

          <Link
            to="/"
            className="inline-flex rounded-full bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
