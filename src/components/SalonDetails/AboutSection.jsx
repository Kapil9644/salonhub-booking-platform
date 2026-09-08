import { useState } from "react";

export default function AboutSection({ about }) {
  const hasAbout = about?.trim();

  const words = hasAbout ? about.trim().split(/\s+/) : [];
  const wordLimit = 30;
  const shouldTruncate = words.length > wordLimit;

  const [isExpanded, setIsExpanded] = useState(false);

  const shortAbout = words.slice(0, wordLimit).join(" ");

  const displayedAbout =
    isExpanded || !shouldTruncate ? about : `${shortAbout}...`;

  return (
    <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-5">
      <h2 className="text-lg font-bold leading-6 text-slate-900 sm:text-xl">
        About Salon
      </h2>

      {hasAbout ? (
        <div>
          <p className="mt-2.5 whitespace-pre-line text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
            {displayedAbout}
          </p>

          {shouldTruncate && (
            <button
              type="button"
              onClick={() => setIsExpanded((previous) => !previous)}
              className="mt-2 text-sm font-semibold text-purple-600 transition hover:text-purple-700"
            >
              {isExpanded ? "Read Less ↑" : "Read More →"}
            </button>
          )}
        </div>
      ) : (
        <p className="mt-2.5 text-sm leading-6 text-gray-500">
          This salon has not added an introduction yet.
        </p>
      )}
    </section>
  );
}
