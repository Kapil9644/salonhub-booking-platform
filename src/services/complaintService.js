import api from "./api";

export const createComplaint = async (complaintData) => {
  const response = await api.post("/complaints", complaintData);
  return response.data;
};

export const getMyComplaints = async () => {
  const response = await api.get("/complaints/my");
  return response.data;
};

export const trackComplaint = async (complaintId) => {
  const response = await api.get(
    `/complaints/track/${encodeURIComponent(complaintId.trim())}`,
  );
  return response.data;
};
