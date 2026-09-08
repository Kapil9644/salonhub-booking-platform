export default function ServicesSection({
  services = [],
  selectedServices = [],
  setSelectedServices,
}) {
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

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-7 sm:rounded-3xl sm:p-5">
      <h2 className="mb-5 text-lg font-bold leading-6 text-slate-900 sm:text-xl">
        Services
      </h2>
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
                <p className="text-sm font-bold text-purple-600 mr-2">
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
    </section>
  );
}
