const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  getMySalonOwnerNotifications,
  markSalonOwnerNotificationAsRead,
  markAllSalonOwnerNotificationsAsRead,
} = require("../controllers/salonOwnerNotificationController");

const router = express.Router();

// Salon Owner Notifications
router.get("/", protect, getMySalonOwnerNotifications);
router.patch("/read-all", protect, markAllSalonOwnerNotificationsAsRead);
router.patch("/:id/read", protect, markSalonOwnerNotificationAsRead);

module.exports = router;
