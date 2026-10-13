import adminApi from "./adminApi";

export const getAllBookings = async () => {
  const response = await adminApi.get("/admin/bookings/all");
  return response.data;
};

export const updateAdminBookingStatus = async (bookingId, status) => {
  const response = await adminApi.patch(`/admin/bookings/${bookingId}/status`, {
    status,
  });
  return response.data;
};

export const markAdminBookingPaymentReceived = async (bookingId) => {
  const response = await adminApi.patch(
    `/admin/bookings/${bookingId}/payment-received`,
  );
  return response.data;
};
