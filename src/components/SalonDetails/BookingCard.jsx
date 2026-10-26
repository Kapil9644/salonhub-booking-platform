import {
  Calendar,
  CheckCircle2,
  Clock3,
  Scissors,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const formatPrice = (price) => `₹${Number(price || 0).toLocaleString("en-IN")}`;

export default function BookingCard({
  salon,
  selectedServices = [],
  setSelectedServices,
}) {
  const navigate = useNavigate();

  const totalPrice = selectedServices.reduce(
    (total, service) => total + Number(service.price || 0),
    0,
  );

  const totalDuration = selectedServices.reduce(
    (total, service) => total + Number(service.duration || 0),
    0,
  );

  const hasSelectedServices = selectedServices.length > 0;
  const salonId = salon._id || salon.id;

  const removeService = (serviceToRemove) => {
    if (!setSelectedServices) return;

    const removeId = serviceToRemove._id || serviceToRemove.id;

    setSelectedServices((current) =>
      current.filter((service) => (service._id || service.id) !== removeId),
    );
  };

  const clearServices = () => {
    if (setSelectedServices) {
      setSelectedServices([]);
    }
  };

  const handleBooking = () => {
    if (!hasSelectedServices) return;

    navigate(`/booking/${salonId}`, {
      state: {
        salon,
        selectedServices,
        totalPrice,
        totalDuration,
      },
    });
  };

  const scrollToServices = () => {
    document.getElementById("salon-services")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const BookingButton = ({ mobile = false }) => (
    <button
      type="button"
      disabled={!hasSelectedServices}
      onClick={handleBooking}
      className={`flex w-full items-center justify-center gap-2 rounded-xl font-bold transition ${
        mobile ? "min-h-12 px-4 text-sm" : "min-h-12 px-4 text-sm"
      } ${
        hasSelectedServices
          ? "bg-purple-700 text-white shadow-md shadow-purple-200 hover:bg-purple-800 active:scale-[0.99]"
          : "cursor-not-allowed bg-slate-200 text-slate-500"
      }`}
    >
      <Calendar size={18} />
      {mobile ? "Book Now" : "Continue to Booking"}
    </button>
  );

  const EmptyState = ({ mobile = false }) => (
    <div
      className={`rounded-xl border border-dashed border-purple-200 bg-purple-50/70 ${
        mobile ? "p-2.5" : "p-4"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-purple-700">
          <Scissors size={18} />
        </span>

        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800">
            No Service Selected
          </p>
          <p className="mt-0.5 text-xs leading-5 text-slate-500">
            Select a service to see the price and continue.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToServices}
        className="mt-3 w-full rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
      >
        Explore Services
      </button>
    </div>
  );

  const SelectedServicesList = ({ compact = false }) => (
    <div className={compact ? "mt-3 space-y-2" : "mt-4 space-y-2"}>
      {selectedServices.map((service) => (
        <div
          key={service._id || service.id}
          className={`flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-100 bg-white ${
            compact ? "p-2" : "p-3"
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
            <Scissors size={17} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="break-words text-sm font-semibold text-slate-800">
              {service.name}
            </p>

            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
              <Clock3 size={12} />
              {Number(service.duration || 0)} min
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="text-sm font-bold text-purple-700">
              {formatPrice(service.price)}
            </span>

            <button
              type="button"
              onClick={() => removeService(service)}
              aria-label={`Remove ${service.name}`}
              title={`Remove ${service.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            >
              <X size={17} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop appointment summary */}
      <aside className="sticky top-28 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 lg:block">
        <div className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-white p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <Calendar size={22} />
            </span>

            <div className="min-w-0">
              <h2 className="text-xl font-extrabold text-slate-900">
                Your Appointment
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {hasSelectedServices
                  ? `${selectedServices.length} ${
                      selectedServices.length === 1 ? "service" : "services"
                    } selected`
                  : "Choose your services"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {!hasSelectedServices ? (
            <EmptyState />
          ) : (
            <>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-600">
                  Selected Services
                </p>

                <button
                  type="button"
                  onClick={clearServices}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-red-600"
                >
                  <Trash2 size={13} />
                  Clear all
                </button>
              </div>

              <SelectedServicesList />

              <div className="my-4 border-t border-dashed border-slate-200" />

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-slate-500">
                  <Clock3 size={15} />
                  Estimated duration
                </span>

                <span className="font-semibold text-slate-800">
                  {totalDuration} min
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="font-bold text-slate-900">Total Amount</span>
                <span className="text-2xl font-extrabold text-purple-700">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </>
          )}

          <div className="mt-4">
            <BookingButton />
          </div>

          <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
            <ShieldCheck
              size={16}
              className="mt-0.5 shrink-0 text-emerald-600"
            />
            Review your selected services before confirming your booking.
          </div>
        </div>
      </aside>

      {/* Mobile and tablet sticky booking bar */}
      <div className="lg:hidden">
        <div className="h-24" />

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_28px_rgba(15,23,42,0.12)] backdrop-blur-lg sm:px-5">
          <div className="mx-auto w-full max-w-3xl">
            {hasSelectedServices ? (
              <>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={scrollToServices}
                    className="min-w-0 text-left"
                  >
                    <span className="block truncate text-sm font-bold text-slate-800">
                      {selectedServices.length}{" "}
                      {selectedServices.length === 1 ? "service" : "services"}{" "}
                      selected
                    </span>

                    <span className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <Clock3 size={12} />
                      {totalDuration} min total
                    </span>
                  </button>

                  <span className="shrink-0 text-xl font-extrabold text-purple-700">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <BookingButton mobile />
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800">
                    No Service Selected
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Choose a service to get started.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={scrollToServices}
                  className="min-h-11 shrink-0 rounded-xl bg-purple-700 px-4 text-sm font-bold text-white transition hover:bg-purple-800"
                >
                  <span className="flex items-center gap-1.5">
                    <Scissors size={16} />
                    Select Service
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
