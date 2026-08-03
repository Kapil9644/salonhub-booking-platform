import { Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BookingCard({ salon, selectedService }) {
  const navigate = useNavigate();
  return (
    <div className="sticky top-28 rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-slate-900">Book Appointment</h2>

      {/* Price */}
      <div className="mt-6">
        {selectedService ? (
          <>
            <p className="text-sm text-gray-500">Selected Service</p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              {selectedService.name}
            </h3>

            <p className="mt-4 text-4xl font-bold text-purple-600">
              ₹{selectedService.price}
            </p>

            <p className="mt-2 text-gray-500">
              Duration: {selectedService.duration}
            </p>
          </>
        ) : (
          <>
            <p className="text-4xl font-bold text-purple-600">
              {salon.priceLabel}
            </p>

            <p className="mt-1 text-sm text-gray-500">Starting price</p>
          </>
        )}
      </div>

      {/* Rating */}
      <div className="mt-6 flex items-center justify-between rounded-2xl bg-gray-50 p-4">
        <div className="flex items-center gap-2">
          <Star className="fill-yellow-400 text-yellow-400" size={18} />

          <span className="font-semibold">{salon.rating}</span>
        </div>

        <span className="text-sm text-gray-500">{salon.reviews} Reviews</span>
      </div>

      {/* CTA */}
      <button
        disabled={!selectedService}
        onClick={() =>
          navigate(`/booking/${salon.id}`, {
            state: {
              salon,
              selectedService,
            },
          })
        }
        className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 text-lg font-semibold transition ${
          selectedService
            ? "bg-purple-600 text-white hover:bg-purple-700"
            : "cursor-not-allowed bg-gray-300 text-gray-500"
        }`}
      >
        <Calendar size={20} />
        Book Appointment
      </button>
    </div>
  );
}
