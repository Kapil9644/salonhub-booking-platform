import adminApi from "./adminApi";

export const getAllCustomers = async () => {
  const response = await adminApi.get("/admin/users/all");

  return response.data;
};
