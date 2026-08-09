import { useEffect, useState } from "react";
import { salons } from "../../data/salons";
import { timeSlots } from "../../data/timeSlots";
import { updateBooking } from "../../services/bookingService";

export default function EditBookingModal({ booking, onClose, onUpdated }) {
  const initialSalon =
    salons.find((salon) => salon.id === booking.salon.id) || salons[0];

  const initialService =
    initialSalon.services.find(
      (service) => service.id === booking.service.id,
    ) || initialSalon.services[0];

  const formatDateForInput = (date) => {
    const value = new Date(date);

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [selectedSalon, setSelectedSalon] = useState(initialSalon);
  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedDate, setSelectedDate] = useState(
    formatDateForInput(booking.date),
  );
  const [selectedTime, setSelectedTime] = useState(booking.time);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const service =
      selectedSalon.services.find((item) => item.id === selectedService.id) ||
      selectedSalon.services[0];

    setSelectedService(service);
  }, [selectedSalon]);

  const handleSalonChange = (e) => {
    const salonId = Number(e.target.value);

    const salon = salons.find((item) => item.id === salonId);

    if (!salon) return;

    setSelectedSalon(salon);
    setSelectedService(salon.services[0]);
  };

  const handleServiceChange = (e) => {
    const serviceId = Number(e.target.value);

    const service = selectedSalon.services.find(
      (item) => item.id === serviceId,
    );

    if (service) {
      setSelectedService(service);
    }
  };

  const handleSave = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time.");
      return;
    }

    try {
      setSaving(true);

      const bookingData = {
        salon: {
          id: selectedSalon.id,
          name: selectedSalon.name,
        },
        service: {
          id: selectedService.id,
          name: selectedService.name,
          price: selectedService.price,
          duration: selectedService.duration,
        },
        date: new Date(`${selectedDate}T00:00:00`),
        time: selectedTime,
      };

      const data = await updateBooking(booking._id, bookingData);

      alert("Booking updated successfully.");

      onUpdated(data.booking);
      onClose();
    } catch (error) {
      console.error("Update booking error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update booking. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Edit Booking</h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your appointment details.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-full px-3 py-2 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        <div className="mt-7 space-y-6">
          {/* Salon */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Salon
            </label>

            <select
              value={selectedSalon.id}
              onChange={handleSalonChange}
              disabled={saving}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600"
            >
              {salons.map((salon) => (
                <option key={salon.id} value={salon.id}>
                  {salon.name}
                </option>
              ))}
            </select>
          </div>

          {/* Service */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Service
            </label>

            <select
              value={selectedService.id}
              onChange={handleServiceChange}
              disabled={saving}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600"
            >
              {selectedSalon.services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} — ₹{service.price} ({service.duration})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">Date</label>

            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={saving}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600"
            />
          </div>

          {/* Time */}
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

          {/* Updated price */}
          <div className="rounded-2xl bg-purple-50 p-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Updated Total</span>

              <span className="text-xl font-bold text-purple-600">
                ₹{selectedService.price}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Duration: {selectedService.duration}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
