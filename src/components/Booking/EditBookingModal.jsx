import { useEffect, useState } from "react";
import { getBookingDateLimits } from "../../utils/dateUtils";
import { timeSlots } from "../../data/timeSlots";
import {
  getPublicSalonDetails,
  getPublicSalons,
} from "../../services/salonService";
import { updateBooking } from "../../services/bookingService";

export default function EditBookingModal({ booking, onClose, onUpdated }) {
  const { minDate, maxDate } = getBookingDateLimits();
  const [salons, setSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ========================================
  // FORMAT DATE FOR INPUT
  // ========================================

  const formatDateForInput = (date) => {
    if (!date) return "";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "";
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ========================================
  // LOAD REAL SALON + BOOKING DATA
  // ========================================

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setLoading(true);

        // Get real salons from backend
        const salonResponse = await getPublicSalons();

        const salonList = salonResponse.salons || [];

        setSalons(salonList);

        // Find actual booked salon
        const bookedSalonId = booking?.salon?.id;

        const salonFromList = salonList.find(
          (salon) => String(salon._id || salon.id) === String(bookedSalonId),
        );

        if (!salonFromList) {
          throw new Error("Booked salon not found.");
        }

        // Get complete salon details
        const salonId = salonFromList._id || salonFromList.id;

        const detailsResponse = await getPublicSalonDetails(salonId);

        if (!detailsResponse.success || !detailsResponse.salon) {
          throw new Error("Unable to load salon details.");
        }

        const realSalon = detailsResponse.salon;

        setSelectedSalon(realSalon);

        // Match booking services with real salon services
        const bookingServices = booking?.services || [];

        const matchedServices = bookingServices
          .map((bookingService) =>
            (realSalon.services || []).find(
              (service) =>
                String(service._id || service.id) === String(bookingService.id),
            ),
          )
          .filter(Boolean);

        setSelectedServices(matchedServices);

        // Actual booking date
        setSelectedDate(formatDateForInput(booking?.date));

        // Actual booking time
        setSelectedTime(booking?.time || "");
      } catch (error) {
        console.error("Failed to load edit booking data:", error);

        alert(
          error.response?.data?.message ||
            error.message ||
            "Failed to load booking details.",
        );

        onClose();
      } finally {
        setLoading(false);
      }
    };

    if (booking) {
      loadBookingData();
    }
  }, [booking, onClose]);

  // ========================================
  // TOTALS
  // ========================================

  const totalPrice = selectedServices.reduce(
    (total, service) => total + Number(service.price || 0),
    0,
  );

  const totalDuration = selectedServices.reduce(
    (total, service) => total + Number(service.duration || 0),
    0,
  );

  // ========================================
  // CHANGE SALON
  // ========================================

  const handleSalonChange = async (e) => {
    const salonId = e.target.value;

    try {
      setLoading(true);

      const response = await getPublicSalonDetails(salonId);

      if (!response.success || !response.salon) {
        throw new Error("Unable to load selected salon.");
      }

      const newSalon = response.salon;

      setSelectedSalon(newSalon);

      // When salon changes, reset services
      setSelectedServices(
        newSalon.services?.length ? [newSalon.services[0]] : [],
      );
    } catch (error) {
      console.error("Salon change error:", error);

      alert(error.response?.data?.message || "Failed to load salon services.");
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SERVICE SELECT / UNSELECT
  // ========================================

  const handleServiceToggle = (service) => {
    setSelectedServices((currentServices) => {
      const alreadySelected = currentServices.some(
        (item) =>
          String(item._id || item.id) === String(service._id || service.id),
      );

      if (alreadySelected) {
        // Don't allow zero services
        if (currentServices.length === 1) {
          return currentServices;
        }

        return currentServices.filter(
          (item) =>
            String(item._id || item.id) !== String(service._id || service.id),
        );
      }

      return [...currentServices, service];
    });
  };

  // ========================================
  // SAVE
  // ========================================

  const handleSave = async () => {
    if (!selectedSalon) {
      alert("Please select a salon.");
      return;
    }

    if (!selectedServices.length) {
      alert("Please select at least one service.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert("Please select date and time.");
      return;
    }

    try {
      setSaving(true);

      const bookingData = {
        salon: {
          id: selectedSalon._id,
          name: selectedSalon.name,

          location: selectedSalon.location || {},
        },

        services: selectedServices.map((service) => ({
          id: service._id || service.id,
          name: service.name,
          price: Number(service.price),
          duration: Number(service.duration),
        })),

        totalPrice,

        totalDuration,

        date: selectedDate,

        time: selectedTime,
      };

      console.log("Updating booking with:", bookingData);

      const data = await updateBooking(booking._id, bookingData);

      if (!data.success) {
        throw new Error(data.message || "Failed to update booking.");
      }

      alert("Booking updated successfully.");

      onUpdated(data.booking);

      onClose();
    } catch (error) {
      console.error("Update booking error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to update booking. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading || !selectedSalon) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="rounded-3xl bg-white px-8 py-10 text-center shadow-2xl">
          <p className="font-semibold text-gray-700">
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Edit Booking</h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your appointment details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full px-3 py-2 text-xl text-gray-500 hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <div className="mt-7 space-y-6">
          {/* ========================================
              SALON
          ======================================== */}

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Salon
            </label>

            <select
              value={selectedSalon._id}
              onChange={handleSalonChange}
              disabled={saving}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
            >
              {salons.map((salon) => (
                <option key={salon._id} value={salon._id}>
                  {salon.name}
                </option>
              ))}
            </select>
          </div>

          {/* ========================================
              SERVICES
          ======================================== */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="font-medium text-gray-700">Services</label>

              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                {selectedServices.length} Selected
              </span>
            </div>

            <div className="space-y-3">
              {(selectedSalon.services || []).map((service) => {
                const serviceId = service._id || service.id;

                const isSelected = selectedServices.some(
                  (item) => String(item._id || item.id) === String(serviceId),
                );

                return (
                  <button
                    key={serviceId}
                    type="button"
                    onClick={() => handleServiceToggle(service)}
                    disabled={saving}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-purple-400"
                    }`}
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {service.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {service.duration} min
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-purple-600">
                        ₹{service.price}
                      </p>

                      <span
                        className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          isSelected
                            ? "bg-purple-600 text-white"
                            : "border border-purple-600 text-purple-600"
                        }`}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================
              DATE
          ======================================== */}

          <div>
            <label className="mb-2 block font-medium text-gray-700">Date</label>

            <input
              type="date"
              value={selectedDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={saving}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600"
            />
          </div>

          {/* ========================================
              TIME
          ======================================== */}

          <div>
            <label className="mb-3 block font-medium text-gray-700">Time</label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  disabled={saving}
                  className={`rounded-xl border px-4 py-3 font-medium transition ${
                    selectedTime === time
                      ? "border-purple-600 bg-purple-600 text-white"
                      : "border-gray-300 hover:border-purple-600"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* ========================================
              TOTAL
          ======================================== */}

          <div className="rounded-2xl bg-purple-50 p-5">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Services</span>

              <span className="font-semibold">{selectedServices.length}</span>
            </div>

            <div className="mt-3 flex justify-between">
              <span className="text-gray-600">Total Duration</span>

              <span className="font-semibold">{totalDuration} min</span>
            </div>

            <div className="mt-3 flex justify-between border-t border-purple-200 pt-3">
              <span className="font-medium">Updated Total</span>

              <span className="text-2xl font-bold text-purple-600">
                ₹{totalPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              !selectedServices.length ||
              !selectedDate ||
              !selectedTime
            }
            className="rounded-full bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
