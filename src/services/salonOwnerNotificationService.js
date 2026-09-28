import salonOwnerApi from "./salonOwnerApi";

export const getMySalonOwnerNotifications = async () => {
  const response = await salonOwnerApi.get("/salon-owner/notifications");
  return response.data;
};

export const markSalonOwnerNotificationAsRead = async (notificationId) => {
  const response = await salonOwnerApi.patch(
    `/salon-owner/notifications/${notificationId}/read`,
  );
  return response.data;
};

export const markAllSalonOwnerNotificationsAsRead = async () => {
  const response = await salonOwnerApi.patch(
    "/salon-owner/notifications/read-all",
  );
  return response.data;
};
