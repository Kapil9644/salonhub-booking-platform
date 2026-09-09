import { ExternalLink, MapPin } from "lucide-react";

export default function MapSection({ salon }) {
  const location = salon?.location || {};
  const latitude = location.latitude;
  const longitude = location.longitude;

  const hasCoordinates =
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined;

  if (!hasCoordinates) {
    return (
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-7 sm:rounded-3xl sm:p-5">
        <h2 className="text-lg font-bold leading-6 text-slate-900 sm:text-xl">
          Location Map
        </h2>

        <div className="mt-4 flex min-h-[180px] items-center justify-center rounded-xl bg-gray-50 p-5 text-center">
          <div>
            <MapPin className="mx-auto text-gray-400" size={28} />
            <p className="mt-2 text-sm font-medium text-gray-500">
              Map location is not available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-7 sm:rounded-3xl sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold leading-6 text-slate-900 sm:text-xl">
          Location Map
        </h2>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1.5 text-xs font-semibold text-purple-700 transition hover:border-purple-300 hover:bg-purple-100"
        >
          <ExternalLink size={14} />
          Open in Maps
        </a>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
        <iframe
          title={`${salon?.name || "Salon"} location map`}
          src={mapUrl}
          className="h-[220px] w-full border-0 sm:h-[280px] lg:h-[320px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
