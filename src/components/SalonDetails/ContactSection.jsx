import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactSection({ salon }) {
  const location = salon?.location || {};

  const address = [
    location.address,
    location.area,
    location.city,
    location.state,
    location.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const hasPhone = Boolean(salon?.phone);
  const hasEmail = Boolean(salon?.email);
  const hasAddress = Boolean(address);

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-7 sm:rounded-3xl sm:p-5">
      <h2 className="text-lg font-bold leading-6 text-slate-900 sm:text-xl">
        Contact & Location
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {hasPhone && (
          <a
            href={`tel:${salon.phone}`}
            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 transition hover:border-purple-300 hover:bg-purple-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <Phone size={17} />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500">Phone</p>
              <p className="truncate text-sm font-semibold text-slate-900">
                +91{salon.phone}
              </p>
            </div>
          </a>
        )}

        {hasEmail && (
          <a
            href={`mailto:${salon.email}`}
            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 transition hover:border-purple-300 hover:bg-purple-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <Mail size={17} />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500">Email</p>
              <p className="truncate text-sm font-semibold text-slate-900">
                {salon.email}
              </p>
            </div>
          </a>
        )}
      </div>

      {hasAddress && (
        <div className="mt-3 flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <MapPin size={17} />
          </span>

          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500">Address</p>
            <p className="mt-0.5 text-sm leading-5 text-slate-700">{address}</p>
          </div>
        </div>
      )}

      {!hasPhone && !hasEmail && !hasAddress && (
        <p className="mt-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-500">
          Contact information is not available.
        </p>
      )}
    </section>
  );
}
