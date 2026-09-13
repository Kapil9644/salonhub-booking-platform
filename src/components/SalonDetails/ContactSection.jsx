import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Phone, ChevronDown, MapPinned } from "lucide-react";

export default function ContactSection({ salon }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef(null);

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

  return (
    <section
      ref={sectionRef}
      className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm sm:mt-7 sm:rounded-3xl"
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5 sm:py-5"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <MapPinned size={17} strokeWidth={2} />
          </span>

          <span className="text-lg font-bold leading-6 text-slate-900 sm:text-xl">
            Contact & Location
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

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          <div className="grid gap-3 sm:grid-cols-2">
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
                <p className="mt-0.5 text-sm leading-5 text-slate-700">
                  {address}
                </p>
              </div>
            </div>
          )}

          {!hasPhone && !hasEmail && !hasAddress && (
            <p className="mt-1 rounded-xl bg-gray-50 p-3 text-sm text-gray-500">
              Contact information is not available.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
