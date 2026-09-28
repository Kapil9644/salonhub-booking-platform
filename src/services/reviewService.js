import api from "./api";

export const getBookingReview = async (bookingId) => {
  const response = await api.get(`/reviews/booking/${bookingId}`);

  return response.data;
};

export const getSalonReviews = async (salonId) => {
  const response = await api.get(`/reviews/salon/${salonId}`);

  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await api.post("/reviews", reviewData);

  return response.data;
};

export const updateReview = async (reviewId, reviewData) => {
  const response = await api.patch(`/reviews/${reviewId}`, reviewData);

  return response.data;
};
