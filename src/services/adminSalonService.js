import api from "./api";

export const getPendingSalons = async () => {
  const response = await api.get("/admin/salons/pending");

  return response.data;
};
