import api from "./api";

export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);

  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get("/bookings/my");

  return response.data;
};

export const updateBooking = async (bookingId, bookingData) => {
  const response = await api.put(`/bookings/${bookingId}`, bookingData);

  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await api.patch(`/bookings/${bookingId}/cancel`);

  return response.data;
};
