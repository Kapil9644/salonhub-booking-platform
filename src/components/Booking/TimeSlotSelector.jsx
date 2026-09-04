import { useEffect, useState } from "react";
import { getBookedSlots } from "../../services/bookingService";

export default function TimeSlotSelector({
  selectedDate,
  selectedTime,
  setSelectedTime,
  salon,
  selectedServices,
}) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // ========================================
  // LOAD BOOKED SLOTS
  // ========================================
  useEffect(() => {
    const loadBookedSlots = async () => {
      if (!selectedDate || !salon?._id) {
        setBookedSlots([]);
        return;
      }

      try {
        setLoadingSlots(true);

        const response = await getBookedSlots(salon._id, selectedDate);

        setBookedSlots(response.bookedSlots || []);
      } catch (error) {
        console.error("Failed to load booked slots:", error);
        setBookedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadBookedSlots();
  }, [selectedDate, salon?._id]);

  // ========================================
  // CONVERT 24-HOUR TIME TO MINUTES
  // ========================================
  const timeToMinutes = (time) => {
    if (!time) return null;

    const [hours, minutes] = time.split(":").map(Number);

    return hours * 60 + minutes;
  };

  // ========================================
  // CONVERT MINUTES TO AM/PM
  // ========================================
  const formatTime = (totalMinutes) => {
    const hours24 = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const period = hours24 >= 12 ? "PM" : "AM";

    let hours12 = hours24 % 12;

    if (hours12 === 0) {
      hours12 = 12;
    }

    return `${String(hours12).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )} ${period}`;
  };

  // ========================================
  // GET CURRENT INDIA DATE AND TIME
  // ========================================
  const getCurrentIndiaDateTime = () => {
    const now = new Date();

    const indiaDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
    }).format(now);

    const indiaTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);

    return {
      date: indiaDate,
      time: indiaTime,
    };
  };

  // ========================================
  // CONVERT AM/PM TIME TO 24-HOUR FORMAT
  // ========================================
  const convertTimeTo24Hour = (time) => {
    const [timePart, period] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (period === "AM" && hours === 12) {
      hours = 0;
    }

    if (period === "PM" && hours !== 12) {
      hours += 12;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}`;
  };

  // ========================================
  // CHECK WHETHER SLOT HAS ALREADY PASSED
  // ========================================
  const isPastTimeSlot = (time) => {
    if (!selectedDate) return false;

    const { date: currentIndiaDate, time: currentIndiaTime } =
      getCurrentIndiaDateTime();

    // Only apply this restriction when booking today
    if (selectedDate !== currentIndiaDate) {
      return false;
    }

    const slotTime = convertTimeTo24Hour(time);

    return slotTime <= currentIndiaTime;
  };

  // ========================================
  // GET SELECTED DAY
  // ========================================
  const getDayName = (date) => {
    if (!date) return null;

    const bookingDate = new Date(`${date}T12:00:00`);

    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    })
      .format(bookingDate)
      .toLowerCase();
  };
  const totalDuration = (selectedServices || []).reduce(
    (total, service) => total + Number(service.duration || 0),
    0,
  );

  const isTimeSlotOverlappingBooking = (time) => {
    const slotStartMinutes = timeToMinutes(convertTimeTo24Hour(time));

    if (slotStartMinutes === null) {
      return false;
    }

    const slotEndMinutes = slotStartMinutes + totalDuration;

    return bookedSlots.some((booking) => {
      const bookingTime = typeof booking === "string" ? booking : booking.time;

      const bookingDuration =
        typeof booking === "string" ? 0 : Number(booking.duration || 0);

      const bookingStartMinutes = timeToMinutes(
        convertTimeTo24Hour(bookingTime),
      );

      if (bookingStartMinutes === null || bookingDuration <= 0) {
        return bookingTime === time;
      }

      const bookingEndMinutes = bookingStartMinutes + bookingDuration;

      return (
        slotStartMinutes < bookingEndMinutes &&
        slotEndMinutes > bookingStartMinutes
      );
    });
  };

  const dayName = getDayName(selectedDate);
  const dayHours = salon?.workingHours?.[dayName];

  // ========================================
  // GENERATE DYNAMIC TIME SLOTS
  // ========================================
  const generateTimeSlots = () => {
    if (!selectedDate || !dayHours?.isOpen) {
      return [];
    }

    if (!dayHours.openTime || !dayHours.closeTime) {
      return [];
    }

    const openingMinutes = timeToMinutes(dayHours.openTime);
    const closingMinutes = timeToMinutes(dayHours.closeTime);

    if (
      openingMinutes === null ||
      closingMinutes === null ||
      openingMinutes >= closingMinutes
    ) {
      return [];
    }

    const slots = [];

    for (
      let currentTime = openingMinutes;
      currentTime + totalDuration <= closingMinutes;
      currentTime += 30
    ) {
      slots.push(formatTime(currentTime));
    }

    return slots;
  };

  const availableTimeSlots = generateTimeSlots().filter(
    (time) => !isPastTimeSlot(time),
  );
  return (
    <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Select Time</h2>

      {!selectedDate && (
        <p className="mt-3 text-gray-500">Please select a date first.</p>
      )}

      {selectedDate && !dayHours?.isOpen && (
        <p className="mt-3 font-medium text-red-500">
          The salon is closed on the selected date.
        </p>
      )}

      {selectedDate && dayHours?.isOpen && availableTimeSlots.length === 0 && (
        <p className="mt-3 font-medium text-gray-500">
          No time slots are available for this date.
        </p>
      )}

      {selectedDate && dayHours?.isOpen && availableTimeSlots.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {availableTimeSlots.map((time) => {
            const isBooked = isTimeSlotOverlappingBooking(time);
            return (
              <button
                key={time}
                type="button"
                disabled={isBooked || loadingSlots}
                onClick={() => setSelectedTime(time)}
                className={`rounded-xl border px-4 py-3 font-medium transition ${
                  isBooked
                    ? "cursor-not-allowed border-red-200 bg-red-50 text-red-400"
                    : selectedTime === time
                      ? "border-purple-600 bg-purple-600 text-white"
                      : "border-gray-300 hover:border-purple-600"
                }`}
              >
                {isBooked ? "Booked" : time}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
