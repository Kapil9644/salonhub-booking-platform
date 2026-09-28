const cron = require("node-cron");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");
const { createNotification } = require("../utils/notificationService");

const parseBookingDateTime = (date, time) => {
  if (!date || !time) return null;

  const dateObject = new Date(date);

  if (Number.isNaN(dateObject.getTime())) {
    return null;
  }

  const datePart = dateObject.toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  const timeMatch = String(time)
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!timeMatch) {
    return null;
  }

  let hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const meridiem = timeMatch[3].toUpperCase();

  if (meridiem === "PM" && hour !== 12) {
    hour += 12;
  }

  if (meridiem === "AM" && hour === 12) {
    hour = 0;
  }

  const [year, month, day] = datePart.split("-").map(Number);

  const utcTime = Date.UTC(year, month - 1, day, hour, minute);

  // IST = UTC + 5 hours 30 minutes
  return new Date(utcTime - 5.5 * 60 * 60 * 1000);
};

const sendBookingReminders = async () => {
  try {
    const bookings = await Booking.find({
      status: "Upcoming",
    });

    const now = new Date();

    for (const booking of bookings) {
      const appointmentDateTime = parseBookingDateTime(
        booking.date,
        booking.time,
      );

      if (!appointmentDateTime) {
        continue;
      }

      const difference = appointmentDateTime.getTime() - now.getTime();

      const twentyFourHours = 24 * 60 * 60 * 1000;
      const twentyFourHoursMinusFiveMinutes = twentyFourHours - 5 * 60 * 1000;

      if (
        difference <= twentyFourHours &&
        difference > twentyFourHoursMinusFiveMinutes
      ) {
        const existingReminder = await Notification.findOne({
          recipient: booking.user,
          type: "BOOKING_REMINDER",
          relatedBooking: booking._id,
        });

        if (existingReminder) {
          continue;
        }

        await createNotification({
          recipient: booking.user,
          type: "BOOKING_REMINDER",
          title: "Booking Reminder",
          message: `Your appointment at ${booking.salon.name} is tomorrow at ${booking.time}.`,
          relatedBooking: booking._id,
        });
      }
    }
  } catch (error) {
    console.error("Booking reminder job error:", error);
  }
};

const startBookingReminderJob = () => {
  cron.schedule("*/5 * * * *", sendBookingReminders);

  console.log("Booking reminder job started.");
};

module.exports = {
  startBookingReminderJob,
  sendBookingReminders,
};
