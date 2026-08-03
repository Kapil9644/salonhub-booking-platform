export default function ServicesSection({
  services,
  selectedService,
  setSelectedService,
}) {
  return (
    <section className="mt-12 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="mb-8 text-2xl font-bold text-slate-900">Services</h2>

      <div className="space-y-5">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between rounded-2xl border border-gray-200 p-5 transition hover:border-purple-500"
          >
            {/* Left */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {service.name}
              </h3>

              <p className="mt-1 text-gray-500">{service.duration}</p>
            </div>

            {/* Right */}
            <div className="text-right">
              <p className="text-xl font-bold text-purple-600">
                ₹{service.price}
              </p>

              <button
                onClick={() => setSelectedService(service)}
                className={`mt-3 rounded-full px-5 py-2 text-sm font-semibold transition ${
                  selectedService?.id === service.id
                    ? "bg-purple-600 text-white"
                    : "border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                }`}
              >
                {selectedService?.id === service.id ? "Selected" : "Select"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
