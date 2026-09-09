import api from "./api";

export const getSalonReviews = async (salonId) => {
  const response = await api.get(`/reviews/salon/${salonId}`);

  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await api.post("/reviews", reviewData);

  return response.data;
};
