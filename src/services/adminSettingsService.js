import api from "./api";

export const getAdminSettings = async () => {
  const response = await api.get("/admin/settings");
  return response.data;
};

export const updateAdminSettings = async (settings) => {
  const response = await api.put("/admin/settings", settings);
  return response.data;
};
