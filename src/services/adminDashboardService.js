import adminApi from "./adminApi";

export const getAdminDashboardStats = async () => {
  const response = await adminApi.get("/admin/dashboard/stats");

  return response.data;
};
