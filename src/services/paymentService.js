import api from "./api";

export const createPaymentOrder = async (paymentData) => {
  const response = await api.post("/payments/create-order", paymentData);
  return response.data;
};

export const verifyPaymentOrder = async (orderId) => {
  const response = await api.post("/payments/verify-order", {
    orderId,
  });

  return response.data;
};
