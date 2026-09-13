import { useEffect, useRef, useState } from "react";
import { ChevronDown, Scissors } from "lucide-react";

export default function ServicesSection({
  services = [],
  selectedServices = [],
  setSelectedServices,
}) {
  const [isExpanded, setIsExpanded] = useState(services.length <= 1);
  const sectionRef = useRef(null);

  const toggleService = (service) => {
    setSelectedServices((currentServices) => {
      const serviceId = service._id || service.id;

      const alreadySelected = currentServices.some(
        (item) => (item._id || item.id) === serviceId,
      );

      if (alreadySelected) {
        return currentServices.filter(
          (item) => (item._id || item.id) !== serviceId,
        );
      }

      return [...currentServices, service];
    });
  };

  const isServiceSelected = (service) => {
    const serviceId = service._id || service.id;

    return selectedServices.some((item) => (item._id || item.id) === serviceId);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sectionRef.current && !sectionRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isExpanded]);

  useEffect(() => {
    setIsExpanded(services.length <= 1);
  }, [services.length]);

  return (
    <section
      ref={sectionRef}
      id="salon-services"
      className="mt-6 scroll-mt-28 rounded-2xl border border-gray-200 bg-white shadow-sm sm:mt-7 sm:rounded-3xl"
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5 sm:py-5"
        aria-expanded={isExpanded}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <Scissors size={17} strokeWidth={2} />
          </span>

          <span className="min-w-0">
            <span className="block text-lg font-bold leading-6 text-slate-900 sm:text-xl">
              Services
            </span>

            {selectedServices.length > 0 && (
              <span className="mt-0.5 block text-[11px] font-semibold text-purple-600">
                {selectedServices.length}{" "}
                {selectedServices.length === 1 ? "Service" : "Services"}{" "}
                Selected
              </span>
            )}
          </span>
        </span>

        <ChevronDown
          size={20}
          strokeWidth={2}
          className={`shrink-0 text-slate-500 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Services */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          <div className="space-y-2">
            {services.map((service) => {
              const selected = isServiceSelected(service);

              return (
                <div
                  key={service._id || service.id}
                  className={`flex items-center justify-between rounded-2xl border p-5 transition ${
                    selected
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-400"
                  }`}
                >
                  {/* Left */}
                  <div className="min-w-0 pr-4">
                    <h3 className="text-md font-semibold text-slate-900">
                      {service.name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Duration: {service.duration} min
                    </p>
                  </div>

                  {/* Right */}
                  <div className="shrink-0 text-right">
                    <p className="mr-2 text-sm font-bold text-purple-600">
                      ₹{service.price}
                    </p>

                    <button
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`mt-3 rounded-full px-2 py-1.5 text-sm font-semibold transition ${
                        selected
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                      }`}
                    >
                      {selected ? "✓ Selected" : "Select"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
