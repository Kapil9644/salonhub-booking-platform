import api from "./api";

export const getAdminPaymentSummary = async () => {
  const response = await api.get("/admin/payments/summary");
  return response.data;
};

export const getAdminPayments = async (params = {}) => {
  const response = await api.get("/admin/payments", { params });
  return response.data;
};

export const getAdminPaymentDetails = async (id) => {
  const response = await api.get(`/admin/payments/${id}`);
  return response.data;
};

export const exportAdminPaymentsCsv = async (params = {}) => {
  const response = await api.get("/admin/payments/export", {
    params,
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");

  link.href = url;
  link.download = `rupiva-payments-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);
};
