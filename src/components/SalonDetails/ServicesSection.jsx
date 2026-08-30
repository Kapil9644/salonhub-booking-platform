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
    <section className="mt-12 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="mb-8 text-2xl font-bold text-slate-900">Services</h2>

      <div className="space-y-5">
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
                <h3 className="text-lg font-semibold text-slate-900">
                  {service.name}
                </h3>

                {service.description && (
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {service.description}
                  </p>
                )}

                <p className="mt-2 text-gray-500">
                  Duration: {service.duration} min
                </p>
              </div>

              {/* Right */}
              <div className="shrink-0 text-right">
                <p className="text-xl font-bold text-purple-600">
                  ₹{service.price}
                </p>

                <button
                  type="button"
                  onClick={() => toggleService(service)}
                  className={`mt-3 rounded-full px-5 py-2 text-sm font-semibold transition ${
                    selected
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                  }`}
                >
                  {selected ? "Selected" : "Select"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
