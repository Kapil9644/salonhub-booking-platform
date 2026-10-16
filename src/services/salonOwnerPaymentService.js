import api from "./api";

export const getSalonOwnerPayments = async ({
  page = 1,
  limit = 20,
  search = "",
  status = "ALL",
  from = "",
  to = "",
} = {}) => {
  const params = { page, limit };

  if (search.trim()) params.search = search.trim();
  if (status !== "ALL") params.status = status;
  if (from) params.from = from;
  if (to) params.to = to;

  const response = await api.get("/salon-owner/payments", { params });
  return response.data;
};

export const exportSalonOwnerPayments = async ({
  search = "",
  status = "ALL",
  from = "",
  to = "",
} = {}) => {
  const params = {};

  if (search.trim()) params.search = search.trim();
  if (status !== "ALL") params.status = status;
  if (from) params.from = from;
  if (to) params.to = to;

  const response = await api.get("/salon-owner/payments/export", {
    params,
    responseType: "blob",
  });

  const blobUrl = window.URL.createObjectURL(
    new Blob([response.data], { type: "text/csv;charset=utf-8;" }),
  );

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = "salon-payments.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
};
